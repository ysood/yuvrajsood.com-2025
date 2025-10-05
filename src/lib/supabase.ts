import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TourApplication = {
  id?: string;
  created_at?: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  country: string;
  willing_to_travel: string;
  discipline: string;
  experience: string;
  instagram: string;
  equipment: string;
  turnaround: string;
  artists: string;
  consent: boolean;
};
