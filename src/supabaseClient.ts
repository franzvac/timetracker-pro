import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types per TypeScript
export interface Client {
  id: number;
  name: string;
  contract: number;
  hours_per_week: number;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: number;
  client_id: number;
  title: string;
  description: string;
  hours: number;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: number;
  client_id: number;
  month: number;
  year: number;
  total_hours: number;
  report_data?: any; // JSONB field
  generated_at: string;
}