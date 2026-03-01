import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AcademyCertCategory {
  id: string;
  title: string;
  alignment: string;
  sort_order: number;
  courses: AcademyCertCourse[];
}

export interface AcademyCertCourse {
  id: string;
  category_id: string;
  title: string;
  duration: string;
  level: string;
  skills: string[];
  tools: string[];
  certification: string;
  sort_order: number;
  linked_course_id: string | null;
}

export interface AcademyDiplomaPhase {
  id: string;
  phase_number: number;
  title: string;
  months: string;
  modules: AcademyDiplomaModule[];
}

export interface AcademyDiplomaModule {
  id: string;
  phase_id: string;
  title: string;
  topics: string[];
  sort_order: number;
}

export interface AcademyDiplomaMeta {
  id: string;
  meta_type: string;
  title: string;
  icon: string | null;
  topics: string[];
  sort_order: number;
}

export function useAcademyCertCategories() {
  return useQuery({
    queryKey: ["academy-cert-categories"],
    queryFn: async () => {
      const { data: categories, error: catErr } = await supabase
        .from("academy_cert_categories")
        .select("*")
        .order("sort_order");
      if (catErr) throw catErr;

      const { data: courses, error: courseErr } = await supabase
        .from("academy_cert_courses")
        .select("*")
        .order("sort_order");
      if (courseErr) throw courseErr;

      return (categories || []).map((cat: any) => ({
        ...cat,
        courses: (courses || []).filter((c: any) => c.category_id === cat.id),
      })) as AcademyCertCategory[];
    },
  });
}

export function useAcademyDiplomaPhases() {
  return useQuery({
    queryKey: ["academy-diploma-phases"],
    queryFn: async () => {
      const { data: phases, error: phaseErr } = await supabase
        .from("academy_diploma_phases")
        .select("*")
        .order("sort_order");
      if (phaseErr) throw phaseErr;

      const { data: modules, error: modErr } = await supabase
        .from("academy_diploma_modules")
        .select("*")
        .order("sort_order");
      if (modErr) throw modErr;

      return (phases || []).map((p: any) => ({
        ...p,
        modules: (modules || []).filter((m: any) => m.phase_id === p.id),
      })) as AcademyDiplomaPhase[];
    },
  });
}

export function useAcademyDiplomaMeta() {
  return useQuery({
    queryKey: ["academy-diploma-meta"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academy_diploma_meta")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data || []) as AcademyDiplomaMeta[];
    },
  });
}
