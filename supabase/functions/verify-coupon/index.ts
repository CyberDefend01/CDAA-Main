import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    // Parse body
    const { coupon_code } = await req.json();
    if (!coupon_code || typeof coupon_code !== "string") {
      return new Response(JSON.stringify({ error: "Missing coupon_code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Validate coupon
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", coupon_code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (couponError || !coupon) {
      return new Response(JSON.stringify({ error: "Invalid or expired access coupon" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (coupon.max_uses && (coupon.current_uses || 0) >= coupon.max_uses) {
      return new Response(JSON.stringify({ error: "This coupon has reached its usage limit" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return new Response(JSON.stringify({ error: "This coupon has expired" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Find applicable course
    let courseId: string | null = null;
    let courseName = "";

    if (coupon.applicable_courses && coupon.applicable_courses.length > 0) {
      courseId = coupon.applicable_courses[0];
      const { data: courseData } = await supabaseAdmin
        .from("courses")
        .select("title")
        .eq("id", courseId)
        .single();
      courseName = courseData?.title || "your course";
    } else {
      const { data: courses } = await supabaseAdmin
        .from("courses")
        .select("id, title")
        .eq("is_published", true)
        .limit(1);
      if (courses && courses.length > 0) {
        courseId = courses[0].id;
        courseName = courses[0].title;
      }
    }

    if (!courseId) {
      return new Response(JSON.stringify({ error: "No course found for this coupon" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Check existing enrollment
    const { data: existing } = await supabaseAdmin
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ success: true, course_name: courseName, already_enrolled: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Atomic enrollment flow (all using admin client)
    // Insert payment
    const { error: payErr } = await supabaseAdmin.from("payments").insert({
      user_id: userId,
      course_id: courseId,
      amount: 0,
      original_amount: 0,
      discount_amount: 0,
      coupon_id: coupon.id,
      payment_status: "completed",
      payment_gateway: "coupon",
    });
    if (payErr) throw payErr;

    // Record coupon usage
    const { error: usageErr } = await supabaseAdmin.from("coupon_usages").insert({
      coupon_id: coupon.id,
      user_id: userId,
      course_id: courseId,
      discount_applied: 0,
    });
    if (usageErr) throw usageErr;

    // Increment coupon uses (now works because admin bypasses RLS)
    const { error: updateErr } = await supabaseAdmin
      .from("coupons")
      .update({ current_uses: (coupon.current_uses || 0) + 1 })
      .eq("id", coupon.id);
    if (updateErr) throw updateErr;

    // Create enrollment
    const { error: enrollErr } = await supabaseAdmin.from("enrollments").insert({
      user_id: userId,
      course_id: courseId,
      progress: 0,
    });
    if (enrollErr) throw enrollErr;

    return new Response(
      JSON.stringify({ success: true, course_name: courseName, already_enrolled: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("verify-coupon error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to verify coupon" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
