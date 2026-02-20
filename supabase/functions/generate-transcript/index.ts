import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify the caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { request_id } = await req.json();
    if (!request_id) {
      return new Response(JSON.stringify({ error: "request_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the transcript request
    const { data: request, error: reqError } = await supabase
      .from("transcript_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (reqError || !request) {
      return new Response(JSON.stringify({ error: "Request not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get student profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", request.student_id)
      .single();

    // Get student enrollments with course details
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`*, course:courses(*)`)
      .eq("user_id", request.student_id);

    // Get quiz attempts
    const { data: quizAttempts } = await supabase
      .from("quiz_attempts")
      .select(`*, quiz:quizzes(title, course_id)`)
      .eq("student_id", request.student_id)
      .not("completed_at", "is", null);

    // Get certificates
    const { data: certificates } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", request.student_id)
      .is("revoked_at", null);

    // Build transcript data
    const studentName = profile?.full_name || "Student";
    const transcriptId = `TX-${request.id.slice(0, 12).toUpperCase()}`;
    const issueDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Calculate overall stats
    const totalCourses = enrollments?.length || 0;
    const completedCourses = enrollments?.filter((e: any) => e.completed_at).length || 0;
    const avgProgress = totalCourses > 0
      ? Math.round((enrollments || []).reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / totalCourses)
      : 0;

    // Build course results
    const courseResults = (enrollments || []).map((enrollment: any) => {
      const course = enrollment.course;
      const courseQuizzes = (quizAttempts || []).filter(
        (qa: any) => qa.quiz?.course_id === course?.id
      );
      const bestScore = courseQuizzes.length > 0
        ? Math.max(...courseQuizzes.map((qa: any) => qa.score || 0))
        : null;

      let level = "Beginner";
      if (bestScore !== null) {
        if (bestScore >= 85) level = "Expert";
        else if (bestScore >= 75) level = "Advanced";
        else if (bestScore >= 60) level = "Intermediate";
      }

      return {
        code: course?.slug?.toUpperCase().slice(0, 6) || "N/A",
        title: course?.title || "Unknown Course",
        level: course?.level || "beginner",
        score: bestScore !== null ? `${Math.round(bestScore)}%` : "N/A",
        skillLevel: level,
        progress: enrollment.progress || 0,
        completed: !!enrollment.completed_at,
      };
    });

    // Build HTML transcript matching the sample design
    const html = generateTranscriptHTML({
      studentName,
      transcriptId,
      issueDate,
      totalCourses,
      completedCourses,
      avgProgress,
      courseResults,
      certificates: certificates || [],
      profileAvatar: profile?.avatar_url,
      country: profile?.country,
    });

    // Return the HTML for the admin to print/save as PDF
    return new Response(JSON.stringify({ 
      success: true, 
      html,
      transcript_id: transcriptId,
      student_name: studentName,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating transcript:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateTranscriptHTML(data: {
  studentName: string;
  transcriptId: string;
  issueDate: string;
  totalCourses: number;
  completedCourses: number;
  avgProgress: number;
  courseResults: any[];
  certificates: any[];
  profileAvatar?: string | null;
  country?: string | null;
}) {
  const courseRows = data.courseResults
    .map(
      (c: any, i: number) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px 16px; font-size: 14px; color: #64748b;">${i + 1}</td>
      <td style="padding: 12px 16px;">
        <div style="font-size: 14px; font-weight: 600; color: #1e293b;">${c.title}</div>
      </td>
      <td style="padding: 12px 16px;">
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${
          c.skillLevel === "Expert"
            ? "#dcfce7; color: #16a34a"
            : c.skillLevel === "Advanced"
            ? "#dbeafe; color: #2563eb"
            : c.skillLevel === "Intermediate"
            ? "#fef3c7; color: #d97706"
            : "#fee2e2; color: #dc2626"
        };">${c.skillLevel}</span>
      </td>
      <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #1e293b;">${c.score}</td>
      <td style="padding: 12px 16px; font-size: 14px; color: #64748b;">${c.completed ? "✅ Completed" : `${c.progress}%`}</td>
    </tr>`
    )
    .join("");

  // Calculate grade
  const completionRate = data.totalCourses > 0 ? (data.completedCourses / data.totalCourses) * 100 : 0;
  let grade = "C";
  let gradeLabel = "Satisfactory";
  if (data.avgProgress >= 90) { grade = "A"; gradeLabel = "First Division with Distinction"; }
  else if (data.avgProgress >= 80) { grade = "B+"; gradeLabel = "Second Division with Merit"; }
  else if (data.avgProgress >= 70) { grade = "B"; gradeLabel = "Second Division"; }
  else if (data.avgProgress >= 60) { grade = "C+"; gradeLabel = "Third Division"; }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Training Transcript - ${data.studentName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #1e293b; }
  .page { max-width: 900px; margin: 0 auto; padding: 0; }

  .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center; }
  .header-left h1 { font-size: 22px; font-weight: 800; line-height: 1.2; }
  .header-left p { font-size: 12px; opacity: 0.8; margin-top: 8px; }
  .header-right { text-align: right; }
  .header-right h2 { font-size: 24px; font-weight: 800; letter-spacing: 1px; }
  .header-right p { font-size: 12px; opacity: 0.8; margin-top: 4px; }

  .student-info { padding: 30px 40px; display: flex; gap: 30px; align-items: center; border-bottom: 3px solid #06b6d4; }
  .avatar { width: 80px; height: 80px; border-radius: 50%; background: #e2e8f0; object-fit: cover; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 40px; flex: 1; }
  .info-item label { font-size: 12px; font-weight: 700; color: #1e293b; }
  .info-item span { font-size: 13px; color: #475569; margin-left: 8px; }

  .section { padding: 30px 40px; }
  .section-title { font-size: 18px; font-weight: 800; padding: 12px 20px; background: linear-gradient(135deg, #1e3a5f, #2563eb); color: white; border-radius: 8px; margin-bottom: 20px; }

  .skills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
  .skill-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
  .skill-card .label { font-size: 11px; font-weight: 700; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.5px; }
  .skill-card .value { font-size: 32px; font-weight: 800; color: #1e293b; margin: 8px 0; }
  .skill-card .desc { font-size: 11px; color: #64748b; }
  .skill-bar { height: 4px; background: #e2e8f0; border-radius: 2px; margin-top: 8px; }
  .skill-bar-fill { height: 4px; background: #06b6d4; border-radius: 2px; }

  table { width: 100%; border-collapse: collapse; }
  thead th { background: #1e293b; color: white; padding: 12px 16px; font-size: 12px; text-align: left; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

  .performance { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px; }
  .perf-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
  .perf-card .perf-label { font-size: 11px; font-weight: 700; color: white; background: #1e3a5f; padding: 8px; border-radius: 8px 8px 0 0; margin: -20px -20px 16px -20px; text-transform: uppercase; }
  .perf-card .perf-value { font-size: 36px; font-weight: 800; color: #1e293b; }
  .perf-card .perf-desc { font-size: 11px; color: #64748b; margin-top: 4px; }

  .grade-badge { display: inline-block; padding: 4px 16px; background: #2563eb; color: white; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 8px; }

  .footer { padding: 30px 40px; border-top: 2px dashed #e2e8f0; display: flex; justify-content: space-around; text-align: center; }
  .footer .sig { }
  .footer .sig .line { width: 180px; border-top: 1px solid #1e293b; margin: 8px auto; }
  .footer .sig .name { font-size: 13px; font-weight: 700; }
  .footer .sig .role { font-size: 11px; color: #64748b; }

  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { max-width: 100%; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-left">
      <h1>INTERNATIONAL<br>CYBERSECURITY AND<br>DIGITAL FORENSICS<br>ACADEMY</h1>
      <p>DIRECTORATE OF STUDENTS EVALUATION DIVISION</p>
    </div>
    <div class="header-right">
      <h2>TRAINING TRANSCRIPT</h2>
      <p>Issued: ${data.issueDate}</p>
      <p>Transcript ID: ${data.transcriptId}</p>
    </div>
  </div>

  <div class="student-info">
    ${data.profileAvatar ? `<img src="${data.profileAvatar}" class="avatar" alt="Student" />` : `<div class="avatar"></div>`}
    <div class="info-grid">
      <div class="info-item"><label>Full Name:</label><span>${data.studentName}</span></div>
      <div class="info-item"><label>Department:</label><span>Cyber Security</span></div>
      <div class="info-item"><label>Program:</label><span>Cybersecurity Training</span></div>
      <div class="info-item"><label>Country:</label><span>${data.country || "N/A"}</span></div>
      <div class="info-item"><label>Total Courses:</label><span>${data.totalCourses}</span></div>
      <div class="info-item"><label>Certificates:</label><span>${data.certificates.length}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">SKILLS SUMMARY</div>
    <div class="skills-grid">
      <div class="skill-card">
        <div class="label">Average Progress</div>
        <div class="value">${data.avgProgress}%</div>
        <div class="desc">Overall skill proficiency</div>
        <div class="skill-bar"><div class="skill-bar-fill" style="width: ${data.avgProgress}%"></div></div>
      </div>
      <div class="skill-card">
        <div class="label">Completion Rate</div>
        <div class="value">${Math.round((data.completedCourses / Math.max(data.totalCourses, 1)) * 100)}%</div>
        <div class="desc">Courses completed</div>
        <div class="skill-bar"><div class="skill-bar-fill" style="width: ${Math.round((data.completedCourses / Math.max(data.totalCourses, 1)) * 100)}%"></div></div>
      </div>
      <div class="skill-card">
        <div class="label">Courses Completed</div>
        <div class="value">${data.completedCourses}/${data.totalCourses}</div>
        <div class="desc">Courses successfully completed</div>
        <div class="skill-bar"><div class="skill-bar-fill" style="width: ${Math.round((data.completedCourses / Math.max(data.totalCourses, 1)) * 100)}%"></div></div>
      </div>
      <div class="skill-card">
        <div class="label">Certificates</div>
        <div class="value">${data.certificates.length}</div>
        <div class="desc">Certificates earned</div>
        <div class="skill-bar"><div class="skill-bar-fill" style="width: ${Math.min(data.certificates.length * 25, 100)}%"></div></div>
      </div>
    </div>
  </div>

  <div class="section" style="padding-top: 0;">
    <div class="section-title">SKILLS BREAKDOWN</div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Course Title</th>
          <th>Level</th>
          <th>Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${courseRows || '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #64748b;">No courses enrolled</td></tr>'}
      </tbody>
    </table>
  </div>

  <div class="section" style="padding-top: 0;">
    <div class="section-title">OVERALL PERFORMANCE</div>
    <div class="performance">
      <div class="perf-card">
        <div class="perf-label">Average Score</div>
        <div class="perf-value">${data.avgProgress}%</div>
        <div class="perf-desc">Cumulative Average</div>
      </div>
      <div class="perf-card">
        <div class="perf-label">Units Summary</div>
        <div style="text-align: left; padding: 0 10px; font-size: 13px; color: #475569;">
          <p>Total Courses: <strong>${data.totalCourses}</strong></p>
          <p>Completed: <strong>${data.completedCourses}</strong></p>
          <p>In Progress: <strong>${data.totalCourses - data.completedCourses}</strong></p>
        </div>
      </div>
      <div class="perf-card">
        <div class="perf-label">Training Grade</div>
        <div class="perf-value">${grade}</div>
        <div class="perf-desc">Overall Training Grade</div>
        <span class="grade-badge">${gradeLabel}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="sig">
      <div class="line"></div>
      <div class="name">Registrar</div>
      <div class="role">Academic Records</div>
    </div>
    <div class="sig">
      <div class="line"></div>
      <div class="name">Director of Evaluation</div>
      <div class="role">Assessment Division</div>
    </div>
    <div class="sig" style="text-align: center;">
      <p style="font-size: 12px; font-weight: 700;">Date Issued</p>
      <p style="font-size: 13px; color: #475569;">${data.issueDate}</p>
      <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Official Transcript</p>
    </div>
  </div>
</div>
</body>
</html>`;
}
