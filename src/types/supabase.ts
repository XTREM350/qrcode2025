export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          role: 'ADMIN' | 'admin' | 'parent' | 'student' | 'educator' | 'driver' | 'cook'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          role: 'ADMIN' | 'admin' | 'parent' | 'student' | 'educator' | 'driver' | 'cook'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          role?: 'ADMIN' | 'admin' | 'parent' | 'student' | 'educator' | 'driver' | 'cook'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          qr_code: string
          balance: number
          parent_id: string
          class: string
          attendance_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          qr_code: string
          balance?: number
          parent_id: string
          class: string
          attendance_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          qr_code?: string
          balance?: number
          parent_id?: string
          class?: string
          attendance_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          student_id: string
          amount: number
          type: 'CANTINE' | 'SORTIE' | 'SCOLARITE' | 'RECHARGE'
          date: string
          details: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          type: 'CANTINE' | 'SORTIE' | 'SCOLARITE' | 'RECHARGE'
          date?: string
          details?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          type?: 'CANTINE' | 'SORTIE' | 'SCOLARITE' | 'RECHARGE'
          date?: string
          details?: string | null
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          student_id: string
          qr_code: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          qr_code: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          qr_code?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
