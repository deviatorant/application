
export type User = {
  id: string;
  email: string;
  created_at: string;
  role: 'patient' | 'professional' | 'admin';
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_image_url?: string;
}

export type Patient = {
  id: string;
  user_id: string;
  date_of_birth?: string;
  blood_type?: string;
  allergies?: string[];
  medical_history?: string;
  address?: string;
  emergency_contact?: string;
}

export type Professional = {
  id: string;
  user_id: string;
  specialty: string;
  license_number: string;
  practice_address?: string;
  available_hours?: AvailableHours;
  years_of_experience?: number;
  education?: string;
  languages?: string[];
}

export type AvailableHours = {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export type TimeSlot = {
  start: string; // format: "08:00"
  end: string;   // format: "08:30"
}

export type Appointment = {
  id: string;
  patient_id: string;
  professional_id: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  type: 'video' | 'inperson';
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type Consultation = {
  id: string;
  professional_id: string;
  patient_id: string;
  appointment_id?: string;
  date: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  followup_needed: boolean;
  followup_date?: string;
  created_at: string;
  updated_at: string;
}

export type MedicalResult = {
  id: string;
  patient_id: string;
  test_name: string;
  collection_date: string;
  result_date: string;
  lab_name: string;
  is_pdf: boolean;
  pdf_url?: string;
  results?: TestResultItem[];
  created_at: string;
}

export type TestResultItem = {
  name: string;
  value: string;
  unit: string;
  reference_range: string;
  is_abnormal: boolean;
}

export type ProfessionalPatient = {
  id: string;
  professional_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  medical_history?: string;
  allergies?: string[];
  blood_type?: string;
  created_at: string;
  updated_at: string;
}

export type ProfessionalAppointment = {
  id: string;
  professional_id: string;
  patient_id: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  type: 'inperson' | 'video';
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    first_name: string;
    last_name: string;
  }
}

export type ProfessionalConsultation = {
  id: string;
  professional_id: string;
  patient_id: string;
  appointment_id?: string;
  date: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  followup_needed: boolean;
  followup_date?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    first_name: string;
    last_name: string;
  }
}

export type Invoice = {
  id: string;
  professional_id: string;
  patient_id: string;
  consultation_id?: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'unpaid' | 'paid' | 'cancelled';
  issued_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    first_name: string;
    last_name: string;
  }
}

export type Message = {
  id: string;
  professional_id: string;
  patient_id: string;
  sender_type: 'professional' | 'patient';
  content: string;
  is_read: boolean;
  attachment_url?: string;
  created_at: string;
  patient?: {
    first_name: string;
    last_name: string;
  }
}

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'appointment' | 'message' | 'system';
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export type ProfessionalActivationRequest = {
  id: string;
  user_id: string;
  specialty_info: string;
  license_info: string;
  contact_email: string;
  practice_address: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
