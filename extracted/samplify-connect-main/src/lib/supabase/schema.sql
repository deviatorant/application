
-- Create professional activation requests table
CREATE TABLE IF NOT EXISTS public.professional_activation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  specialty_info TEXT,
  license_info TEXT,
  contact_email TEXT,
  practice_address TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies to professional activation requests
ALTER TABLE public.professional_activation_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own requests
CREATE POLICY "Users can view their own activation requests" 
ON public.professional_activation_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to create their own requests
CREATE POLICY "Users can create their own activation requests" 
ON public.professional_activation_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow admins to see all requests
CREATE POLICY "Admins can see all activation requests" 
ON public.professional_activation_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update all requests
CREATE POLICY "Admins can update all activation requests" 
ON public.professional_activation_requests 
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  medical_history TEXT,
  allergies TEXT[],
  blood_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on patients table
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Professionals can see their patients
CREATE POLICY "Professionals can view their patients" 
ON public.patients 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can create patients
CREATE POLICY "Professionals can create patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can update their patients
CREATE POLICY "Professionals can update their patients" 
ON public.patients 
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL, -- Duration in minutes
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
  type TEXT NOT NULL DEFAULT 'inperson', -- inperson, video
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Professionals can see their appointments
CREATE POLICY "Professionals can view their appointments" 
ON public.appointments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can create appointments
CREATE POLICY "Professionals can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can update their appointments
CREATE POLICY "Professionals can update their appointments" 
ON public.appointments 
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id),
  date DATE NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  prescription TEXT,
  notes TEXT,
  followup_needed BOOLEAN DEFAULT false,
  followup_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on consultations table
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Professionals can see their consultations
CREATE POLICY "Professionals can view their consultations" 
ON public.consultations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can create consultations
CREATE POLICY "Professionals can create consultations" 
ON public.consultations 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can update their consultations
CREATE POLICY "Professionals can update their consultations" 
ON public.consultations 
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  consultation_id UUID REFERENCES public.consultations(id),
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid, paid, cancelled
  issued_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on invoices table
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Professionals can see their invoices
CREATE POLICY "Professionals can view their invoices" 
ON public.invoices 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can create invoices
CREATE POLICY "Professionals can create invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can update their invoices
CREATE POLICY "Professionals can update their invoices" 
ON public.invoices 
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  sender_type TEXT NOT NULL, -- professional, patient
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Professionals can see their messages
CREATE POLICY "Professionals can view their messages" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can create messages
CREATE POLICY "Professionals can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Professionals can update their messages (mark as read)
CREATE POLICY "Professionals can update their messages" 
ON public.messages 
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.professionals 
    WHERE id = professional_id AND user_id = auth.uid()
  )
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- appointment, message, system
  related_id UUID, -- ID of related item (appointment, message, etc.)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can see their notifications
CREATE POLICY "Users can view their notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their notifications (mark as read)
CREATE POLICY "Users can update their notifications" 
ON public.notifications 
FOR UPDATE
USING (auth.uid() = user_id);
