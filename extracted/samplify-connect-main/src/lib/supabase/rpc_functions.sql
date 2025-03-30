
-- Function to create a user profile (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_role TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role, created_at)
  VALUES (user_id, user_email, user_first_name, user_last_name, user_role, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate patient profile function to change return type
DROP FUNCTION IF EXISTS public.create_patient_profile(UUID);

-- Function to create a patient profile (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_patient_profile(
  user_id UUID
)
RETURNS UUID AS $$
DECLARE
  patient_id UUID;
BEGIN
  INSERT INTO public.patients (user_id)
  VALUES (user_id)
  RETURNING id INTO patient_id;
  
  RETURN patient_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate professional profile function to change return type
DROP FUNCTION IF EXISTS public.create_professional_profile(UUID, TEXT, TEXT);

-- Function to create a professional profile (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_professional_profile(
  user_id UUID,
  prof_specialty TEXT,
  prof_license_number TEXT
)
RETURNS UUID AS $$
DECLARE
  professional_id UUID;
BEGIN
  INSERT INTO public.professionals (user_id, specialty, license_number)
  VALUES (user_id, prof_specialty, prof_license_number)
  RETURNING id INTO professional_id;
  
  RETURN professional_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user profile with patient or professional data
CREATE OR REPLACE FUNCTION public.get_user_profile(
  user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  user_data JSONB;
  user_role TEXT;
  profile_data JSONB;
BEGIN
  -- Get user data
  SELECT json_build_object(
    'id', u.id,
    'email', u.email,
    'first_name', u.first_name,
    'last_name', u.last_name,
    'role', u.role,
    'created_at', u.created_at
  )::JSONB INTO user_data
  FROM public.users u
  WHERE u.id = user_id;
  
  IF user_data IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get role
  user_role := user_data->>'role';
  
  -- Get profile data based on role
  IF user_role = 'patient' THEN
    SELECT json_build_object(
      'id', p.id,
      'user_id', p.user_id,
      'date_of_birth', p.date_of_birth,
      'blood_type', p.blood_type,
      'allergies', p.allergies,
      'medical_history', p.medical_history,
      'address', p.address,
      'emergency_contact', p.emergency_contact
    )::JSONB INTO profile_data
    FROM public.patients p
    WHERE p.user_id = user_id;
    
    user_data := user_data || jsonb_build_object('patient_data', profile_data);
    
  ELSIF user_role = 'professional' THEN
    SELECT json_build_object(
      'id', p.id,
      'user_id', p.user_id,
      'specialty', p.specialty,
      'license_number', p.license_number,
      'practice_address', p.practice_address,
      'available_hours', p.available_hours,
      'years_of_experience', p.years_of_experience,
      'education', p.education,
      'languages', p.languages
    )::JSONB INTO profile_data
    FROM public.professionals p
    WHERE p.user_id = user_id;
    
    user_data := user_data || jsonb_build_object('professional_data', profile_data);
  END IF;
  
  RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
