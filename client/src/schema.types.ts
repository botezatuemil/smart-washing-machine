export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Detail: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
        }
      }
      Restaurant: {
        Row: {
          created_at: string | null
          id: number
          id_detail: number | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          id_detail?: number | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          id_detail?: number | null
          name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
