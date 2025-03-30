
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
          created_at: string
          role: 'patient' | 'professional'
          first_name: string
          last_name: string
          phone_number: string | null
          profile_image_url: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          role: 'patient' | 'professional'
          first_name: string
          last_name: string
          phone_number?: string | null
          profile_image_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          role?: 'patient' | 'professional'
          first_name?: string
          last_name?: string
          phone_number?: string | null
          profile_image_url?: string | null
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string
          date_of_birth: string | null
          blood_type: string | null
          allergies: string[] | null
          medical_history: string | null
          address: string | null
          emergency_contact: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date_of_birth?: string | null
          blood_type?: string | null
          allergies?: string[] | null
          medical_history?: string | null
          address?: string | null
          emergency_contact?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date_of_birth?: string | null
          blood_type?: string | null
          allergies?: string[] | null
          medical_history?: string | null
          address?: string | null
          emergency_contact?: string | null
        }
      }
      professionals: {
        Row: {
          id: string
          user_id: string
          specialty: string
          license_number: string
          practice_address: string | null
          available_hours: Json | null
          years_of_experience: number | null
          education: string | null
          languages: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          specialty: string
          license_number: string
          practice_address?: string | null
          available_hours?: Json | null
          years_of_experience?: number | null
          education?: string | null
          languages?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          specialty?: string
          license_number?: string
          practice_address?: string | null
          available_hours?: Json | null
          years_of_experience?: number | null
          education?: string | null
          languages?: string[] | null
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          professional_id: string
          date: string
          time: string
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          type: 'video' | 'inperson'
          notes: string | null
          symptoms: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          professional_id: string
          date: string
          time: string
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          type: 'video' | 'inperson'
          notes?: string | null
          symptoms?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          professional_id?: string
          date?: string
          time?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          type?: 'video' | 'inperson'
          notes?: string | null
          symptoms?: string | null
          created_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          appointment_id: string
          patient_id: string
          professional_id: string
          diagnosis: string
          notes: string
          prescription: string | null
          followup_required: boolean
          followup_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          patient_id: string
          professional_id: string
          diagnosis: string
          notes: string
          prescription?: string | null
          followup_required: boolean
          followup_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          patient_id?: string
          professional_id?: string
          diagnosis?: string
          notes?: string
          prescription?: string | null
          followup_required?: boolean
          followup_date?: string | null
          created_at?: string
        }
      }
      medical_results: {
        Row: {
          id: string
          patient_id: string
          test_name: string
          collection_date: string
          result_date: string
          lab_name: string
          is_pdf: boolean
          pdf_url: string | null
          results: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          test_name: string
          collection_date: string
          result_date: string
          lab_name: string
          is_pdf: boolean
          pdf_url?: string | null
          results?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          test_name?: string
          collection_date?: string
          result_date?: string
          lab_name?: string
          is_pdf?: boolean
          pdf_url?: string | null
          results?: Json | null
          created_at?: string
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
