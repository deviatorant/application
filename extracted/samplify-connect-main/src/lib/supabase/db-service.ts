
import supabase from './supabase';
import type { User, Patient, Professional, Appointment, Consultation, MedicalResult } from './schema';

// User related functions
export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as User;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as User | null;
};

export const createUser = async (user: Omit<User, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select();
  
  if (error) throw error;
  return data[0] as User;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as User;
};

// Patient related functions
export const getPatientByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as Patient | null;
};

export const createPatient = async (patient: Omit<Patient, 'id'>) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
    .select();
  
  if (error) throw error;
  return data[0] as Patient;
};

export const updatePatient = async (id: string, updates: Partial<Patient>) => {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as Patient;
};

// Professional related functions
export const getProfessionalByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as Professional | null;
};

export const createProfessional = async (professional: Omit<Professional, 'id'>) => {
  const { data, error } = await supabase
    .from('professionals')
    .insert([professional])
    .select();
  
  if (error) throw error;
  return data[0] as Professional;
};

export const updateProfessional = async (id: string, updates: Partial<Professional>) => {
  const { data, error } = await supabase
    .from('professionals')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as Professional;
};

// Appointment related functions
export const getAppointmentsByPatientId = async (patientId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      professionals:professional_id (
        id,
        specialty,
        users:user_id (
          first_name,
          last_name,
          profile_image_url
        )
      )
    `)
    .eq('patient_id', patientId)
    .order('date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getAppointmentsByProfessionalId = async (professionalId: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients:patient_id (
        id,
        users:user_id (
          first_name,
          last_name,
          profile_image_url
        )
      )
    `)
    .eq('professional_id', professionalId)
    .order('date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getAppointmentsByProfessionalIdAndDate = async (professionalId: string, date: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients:patient_id (
        id,
        users:user_id (
          first_name,
          last_name,
          profile_image_url
        )
      )
    `)
    .eq('professional_id', professionalId)
    .eq('date', date)
    .order('time', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select();
  
  if (error) throw error;
  return data[0] as Appointment;
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as Appointment;
};

// Consultation related functions
export const getConsultationsByPatientId = async (patientId: string) => {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      professionals:professional_id (
        id,
        specialty,
        users:user_id (
          first_name,
          last_name
        )
      )
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getConsultationsByProfessionalId = async (professionalId: string) => {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      patients:patient_id (
        id,
        users:user_id (
          first_name,
          last_name
        )
      )
    `)
    .eq('professional_id', professionalId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createConsultation = async (consultation: Omit<Consultation, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('consultations')
    .insert([consultation])
    .select();
  
  if (error) throw error;
  return data[0] as Consultation;
};

export const updateConsultation = async (id: string, updates: Partial<Consultation>) => {
  const { data, error } = await supabase
    .from('consultations')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as Consultation;
};

// Medical Results related functions
export const getMedicalResultsByPatientId = async (patientId: string) => {
  const { data, error } = await supabase
    .from('medical_results')
    .select('*')
    .eq('patient_id', patientId)
    .order('result_date', { ascending: false });
  
  if (error) throw error;
  return data as MedicalResult[];
};

export const createMedicalResult = async (result: Omit<MedicalResult, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('medical_results')
    .insert([result])
    .select();
  
  if (error) throw error;
  return data[0] as MedicalResult;
};

export const updateMedicalResult = async (id: string, updates: Partial<MedicalResult>) => {
  const { data, error } = await supabase
    .from('medical_results')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as MedicalResult;
};
