import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Budget {
  id: string;
  user_id: string;
  monthly_budget: number;
  created_at: string;
}

export interface AdditionalIncome {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  budget: number;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category_id: string;
  description: string;
  date: string;
  receipt_url?: string;
}
