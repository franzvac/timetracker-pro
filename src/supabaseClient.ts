import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://asgqqhirsavfamomrzxm.supabase.co'
const supabaseAnonKey ='sb_publishable_8bsQQhw9192LjYVq-zV-XQ_6Vg8TjLL'

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
