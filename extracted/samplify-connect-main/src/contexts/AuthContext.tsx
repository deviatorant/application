
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import supabase from '@/lib/supabase/supabase';
import { getUserById, getPatientByUserId, getProfessionalByUserId } from '@/lib/supabase/db-service';
import type { User as AppUser, Patient, Professional } from '@/lib/supabase/schema';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userData: AppUser | null;
  patientData: Patient | null;
  professionalData: Professional | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at'>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<AppUser>) => Promise<void>;
  requestProfessionalActivation: (specialtyInfo: string, licenseInfo: string, contactEmail: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [professionalData, setProfessionalData] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await loadUserData(currentSession.user.id);
      } else {
        setUserData(null);
        setPatientData(null);
        setProfessionalData(null);
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        loadUserData(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      console.log("Loading user data for:", userId);
      let user;
      
      try {
        user = await getUserById(userId);
        console.log("User data loaded:", user);
      } catch (error: any) {
        console.error('Error loading user data:', error);
        
        if (error.message?.includes('no rows') || error.details?.includes('0 rows')) {
          console.log("User not found in database, creating user record");
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            const { email, user_metadata } = authUser;
            const role = user_metadata?.role || 'patient';
            const first_name = user_metadata?.first_name || '';
            const last_name = user_metadata?.last_name || '';
            
            try {
              await supabase.rpc('create_user_profile', {
                user_id: userId,
                user_email: email || '',
                user_first_name: first_name,
                user_last_name: last_name,
                user_role: role
              });
              
              console.log("Created user profile via RPC");
              
              if (role === 'patient') {
                await supabase.rpc('create_patient_profile', {
                  user_id: userId
                });
                console.log("Created patient profile via RPC");
              } 
              else if (role === 'professional') {
                await supabase.rpc('create_professional_profile', {
                  user_id: userId,
                  prof_specialty: '',
                  prof_license_number: ''
                });
                console.log("Created professional profile via RPC");
              }
              
              user = await getUserById(userId);
              console.log("User data loaded after creation:", user);
            } catch (createError) {
              console.error('Error creating user profile:', createError);
              user = {
                id: userId,
                email: email || '',
                first_name: first_name,
                last_name: last_name,
                role: role as 'patient' | 'professional',
                created_at: new Date().toISOString()
              };
            }
          } else {
            throw new Error('Authentication user not found');
          }
        } else {
          throw error;
        }
      }
      
      setUserData(user);
      
      if (user.role === 'patient') {
        try {
          const patient = await getPatientByUserId(userId);
          console.log("Patient data loaded:", patient);
          setPatientData(patient || {
            id: '',
            user_id: userId
          } as Patient);
          setProfessionalData(null);
        } catch (error) {
          console.error('Error loading patient data:', error);
          setPatientData({
            id: '',
            user_id: userId
          } as Patient);
        }
      } else if (user.role === 'professional') {
        try {
          const professional = await getProfessionalByUserId(userId);
          console.log("Professional data loaded:", professional);
          setProfessionalData(professional || {
            id: '',
            user_id: userId,
            specialty: '',
            license_number: ''
          } as Professional);
          setPatientData(null);
        } catch (error) {
          console.error('Error loading professional data:', error);
          setProfessionalData({
            id: '',
            user_id: userId,
            specialty: '',
            license_number: ''
          } as Professional);
        }
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      toast({
        title: "Problème de chargement du profil",
        description: "Certaines fonctionnalités peuvent être limitées. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      setIsLoading(true);
      await loadUserData(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Signing in with:", email);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Sign in error:", error.message);
        if (error.message === 'Invalid login credentials') {
          throw new Error('Identifiants invalides');
        } else if (error.status === 429) {
          throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
        } else {
          throw new Error('Erreur de connexion: ' + error.message);
        }
      }
    } catch (error: any) {
      if (error.status === 429) {
        throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at'>) => {
    console.log("Signing up with:", email, userData);
    
    const siteUrl = window.location.origin;
    const redirectTo = `${siteUrl}/login`;
    
    console.log("Signup redirect URL:", redirectTo);
    
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role
          },
          emailRedirectTo: redirectTo
        }
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        if (error.status === 429) {
          throw new Error('Trop de tentatives d\'inscription. Veuillez réessayer plus tard.');
        } else if (error.message.includes('already registered')) {
          throw new Error('Cet email est déjà utilisé');
        } else {
          throw new Error('Erreur d\'inscription: ' + error.message);
        }
      }
    } catch (error: any) {
      if (error.status === 429) {
        throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    console.log("Signing out");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (error.status === 429) {
          throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
        }
        throw error;
      }
    } catch (error: any) {
      if (error.status === 429) {
        throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const siteUrl = window.location.origin;
    const redirectTo = `${siteUrl}/login`;
    
    console.log("Reset password for:", email, "Redirect to:", redirectTo);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });
      
      if (error) {
        console.error("Reset password error:", error.message);
        if (error.status === 429) {
          throw new Error('Trop de tentatives de réinitialisation. Veuillez réessayer plus tard.');
        }
        throw new Error('Erreur lors de la réinitialisation du mot de passe: ' + error.message);
      }
    } catch (error: any) {
      if (error.status === 429) {
        throw new Error('Trop de tentatives de réinitialisation. Veuillez réessayer plus tard.');
      }
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<AppUser>) => {
    if (!user || !userData) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      // Update in auth metadata if first/last name changed
      if (updates.first_name || updates.last_name) {
        await supabase.auth.updateUser({
          data: {
            first_name: updates.first_name || userData.first_name,
            last_name: updates.last_name || userData.last_name
          }
        });
      }

      // Update in users table
      const updatedUser = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updatedUser.error) {
        throw updatedUser.error;
      }

      // Refresh user data to see changes
      await refreshUserData();

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
        variant: "default",
      });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const requestProfessionalActivation = async (specialtyInfo: string, licenseInfo: string, contactEmail: string) => {
    if (!user || !userData) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      // Store the request in a supabase table
      const { error } = await supabase
        .from('professional_activation_requests')
        .insert({
          user_id: user.id,
          specialty_info: specialtyInfo,
          license_info: licenseInfo,
          contact_email: contactEmail,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'activation de compte professionnel a été envoyée. Nous vous contacterons bientôt.",
        variant: "default",
      });

    } catch (error: any) {
      console.error('Error requesting professional activation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userData,
        patientData,
        professionalData,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUserData,
        resetPassword,
        updateUserProfile,
        requestProfessionalActivation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
