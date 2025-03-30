
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define the languages we support
export type Language = 'fr' | 'ar';

// Define translations for each language
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // General
    dashboard: 'Tableau de bord',
    appointments: 'Rendez-vous',
    results: 'Résultats',
    profile: 'Profil',
    homeService: 'Service à domicile',
    telehealth: 'Télésanté',
    loading: 'Chargement...',
    
    // Login page
    signIn: 'Se connecter',
    createAccount: 'Créer un compte',
    enterCredentials: 'Entrez vos identifiants pour vous connecter',
    fillDetails: 'Remplissez vos informations pour créer un compte',
    login: 'Connexion',
    register: 'S\'inscrire',
    email: 'Email',
    password: 'Mot de passe',
    signingIn: 'Connexion en cours...',
    firstName: 'Prénom',
    lastName: 'Nom',
    accountType: 'Type de compte',
    patient: 'Patient',
    professional: 'Professionnel',
    specialty: 'Spécialité',
    enterSpecialty: 'Entrez votre spécialité',
    licenseNumber: 'Numéro de licence',
    enterLicense: 'Entrez votre numéro de licence',
    creatingAccount: 'Création du compte...',
    noAccount: 'Vous n\'avez pas de compte?',
    alreadyAccount: 'Vous avez déjà un compte?',
    signUpNow: 'Inscrivez-vous maintenant',
    signInNow: 'Connectez-vous maintenant',
    loggedIn: 'Connecté',
    welcomeBack: 'Bienvenue de retour!',
    errorOccurred: 'Une erreur est survenue',
    checkCredentials: 'Veuillez vérifier vos identifiants',
    profFieldsRequired: 'Les champs de spécialité et de licence sont requis',
    accountCreated: 'Compte créé',
    welcomeToApp: 'Bienvenue dans notre application!',
    tryAgainLater: 'Veuillez réessayer plus tard',
    
    // Professional dashboard
    manageSchedule: 'Gérer l\'emploi du temps',
    bookAppointment: 'Réserver un rendez-vous',
    selectDate: 'Sélectionner une date',
    availableHours: 'Heures disponibles',
    call: 'Appeler',
    consult: 'Consulter',
    noDoctorsFound: 'Aucun médecin trouvé',
    
    // Consultation history
    consultationHistory: 'Historique des consultations',
    searchDoctor: 'Rechercher un médecin',
    date: 'Date',
    patientName: 'Nom du patient',
    type: 'Type',
    diagnosis: 'Diagnostic',
    actions: 'Actions',
    showing: 'Affichage',
    of: 'sur',
    videoType: 'Téléconsultation',
    inPersonType: 'En personne',
    urgent: 'Urgent',
    
    // Patients waiting
    patientsWaiting: 'Patients en attente',
    waiting: 'En attente depuis',
    
    // Telehealth
    available: 'Disponible',
    reviews: 'Avis',
    experience: 'Expérience',
    
    // Profile page
    accountInfo: 'Informations de Compte',
    personalInfo: 'Informations Personnelles',
    changePassword: 'Changer le Mot de Passe',
    settings: 'Paramètres',
    language: 'Langue',
    signOut: 'Se Déconnecter',
    resetPassword: 'Réinitialiser le mot de passe',
    resetPasswordDescription: 'Un email sera envoyé à {email} avec les instructions pour réinitialiser votre mot de passe.',
    cancel: 'Annuler',
    sending: 'Envoi en cours...',
    sendResetEmail: 'Envoyer l\'email de réinitialisation',
    emailSent: 'Email envoyé',
    checkEmailForInstructions: 'Vérifiez votre boîte email pour les instructions de réinitialisation du mot de passe.',
    manageAccountPreferences: 'Gérez votre compte et vos préférences',
    comingSoon: 'Bientôt disponible',
    featureUnderDevelopment: 'Cette fonctionnalité est en cours de développement'
  },
  ar: {
    // General
    dashboard: 'لوحة التحكم',
    appointments: 'المواعيد',
    results: 'النتائج',
    profile: 'الملف الشخصي',
    homeService: 'الخدمة المنزلية',
    telehealth: 'الرعاية الصحية عن بعد',
    loading: 'جاري التحميل...',
    
    // Login page
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    enterCredentials: 'أدخل بيانات الاعتماد الخاصة بك لتسجيل الدخول',
    fillDetails: 'املأ التفاصيل الخاصة بك لإنشاء حساب',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signingIn: 'جاري تسجيل الدخول...',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    accountType: 'نوع الحساب',
    patient: 'مريض',
    professional: 'محترف',
    specialty: 'التخصص',
    enterSpecialty: 'أدخل تخصصك',
    licenseNumber: 'رقم الترخيص',
    enterLicense: 'أدخل رقم الترخيص الخاص بك',
    creatingAccount: 'جاري إنشاء الحساب...',
    noAccount: 'ليس لديك حساب؟',
    alreadyAccount: 'هل لديك حساب بالفعل؟',
    signUpNow: 'سجل الآن',
    signInNow: 'سجل دخول الآن',
    loggedIn: 'تم تسجيل الدخول',
    welcomeBack: 'مرحبًا بعودتك!',
    errorOccurred: 'حدث خطأ',
    checkCredentials: 'يرجى التحقق من بيانات الاعتماد الخاصة بك',
    profFieldsRequired: 'حقول التخصص والترخيص مطلوبة',
    accountCreated: 'تم إنشاء الحساب',
    welcomeToApp: 'مرحبًا بك في تطبيقنا!',
    tryAgainLater: 'يرجى المحاولة مرة أخرى لاحقًا',
    
    // Professional dashboard
    manageSchedule: 'إدارة الجدول',
    bookAppointment: 'حجز موعد',
    selectDate: 'اختر تاريخًا',
    availableHours: 'الساعات المتاحة',
    call: 'اتصال',
    consult: 'استشارة',
    noDoctorsFound: 'لم يتم العثور على أطباء',
    
    // Consultation history
    consultationHistory: 'سجل الاستشارات',
    searchDoctor: 'البحث عن طبيب',
    date: 'التاريخ',
    patientName: 'اسم المريض',
    type: 'النوع',
    diagnosis: 'التشخيص',
    actions: 'الإجراءات',
    showing: 'عرض',
    of: 'من',
    videoType: 'استشارة عن بعد',
    inPersonType: 'حضوري',
    urgent: 'عاجل',
    
    // Patients waiting
    patientsWaiting: 'المرضى في قائمة الانتظار',
    waiting: 'في الانتظار منذ',
    
    // Telehealth
    available: 'متاح',
    reviews: 'التقييمات',
    experience: 'الخبرة',
    
    // Profile page
    accountInfo: 'معلومات الحساب',
    personalInfo: 'المعلومات الشخصية',
    changePassword: 'تغيير كلمة المرور',
    settings: 'الإعدادات',
    language: 'اللغة',
    signOut: 'تسجيل الخروج',
    resetPassword: 'إعادة تعيين كلمة المرور',
    resetPasswordDescription: 'سيتم إرسال بريد إلكتروني إلى {email} مع تعليمات إعادة تعيين كلمة المرور الخاصة بك.',
    cancel: 'إلغاء',
    sending: 'جاري الإرسال...',
    sendResetEmail: 'إرسال بريد إعادة تعيين كلمة المرور',
    emailSent: 'تم إرسال البريد الإلكتروني',
    checkEmailForInstructions: 'تحقق من بريدك الإلكتروني للحصول على تعليمات إعادة تعيين كلمة المرور.',
    manageAccountPreferences: 'إدارة حسابك وتفضيلاتك',
    comingSoon: 'قريبًا',
    featureUnderDevelopment: 'هذه الميزة قيد التطوير'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userRole: 'patient' | 'professional' | null;
  isAuthenticated: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key,
  userRole: null,
  isAuthenticated: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const { userData } = useAuth();

  // Set the appropriate dir attribute on the document for RTL/LTR text direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Fix for RTL UI issues by adding a class to the body
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t,
        userRole: userData?.role || null,
        isAuthenticated: !!userData
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
