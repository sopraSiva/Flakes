import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://172.205.248.111:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          code: string;
          name: string;
          area: string | null;
          status: string;
          postcode: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          area?: string | null;
          status?: string;
          postcode?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          area?: string | null;
          status?: string;
          postcode?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          date_created: string;
          title: string;
          body: string;
          list_of_stores: any;
          user_id: string;
        };
        Insert: {
          id?: string;
          date_created?: string;
          title: string;
          body: string;
          list_of_stores?: any;
          user_id: string;
        };
        Update: {
          id?: string;
          date_created?: string;
          title?: string;
          body?: string;
          list_of_stores?: any;
          user_id?: string;
        };
      };
    };
  };
};