
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, FileText, User, Hospital, Video, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  nameAr: string;
  nameFr: string;
  icon: React.ReactNode;
  path: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const { language, setLanguage, t } = useLanguage();
  
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);
  
  const navItems: NavItem[] = [
    {
      nameFr: 'Accueil',
      nameAr: 'الرئيسية',
      icon: <Home size={20} />,
      path: '/dashboard'
    },
    {
      nameFr: 'Rendez-vous',
      nameAr: 'المواعيد',
      icon: <Calendar size={20} />,
      path: '/appointments'
    },
    {
      nameFr: 'À domicile',
      nameAr: 'في المنزل',
      icon: <Hospital size={20} />,
      path: '/home-service'
    },
    {
      nameFr: 'Consultation',
      nameAr: 'استشارة',
      icon: <Video size={20} />,
      path: '/telehealth'
    },
    {
      nameFr: 'Résultats',
      nameAr: 'النتائج',
      icon: <FileText size={20} />,
      path: '/results'
    },
    {
      nameFr: 'Profil',
      nameAr: 'الملف الشخصي',
      icon: <User size={20} />,
      path: '/profile'
    }
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setActiveItem(path);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg py-3 px-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">
            {language === 'fr' ? 'SIHATI' : 'صحتي'}
          </h1>
          <button 
            onClick={toggleLanguage}
            className="flex items-center bg-white/20 rounded-full px-3 py-1 text-white text-sm hover:bg-white/30 transition-colors"
          >
            <Globe size={16} className="mr-1" />
            {language === 'fr' ? 'عربي' : 'Français'}
          </button>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg py-1 px-1 z-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-1 py-1 min-w-[40px] transition-colors",
                  activeItem === item.path 
                    ? "text-gradient-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="icon-container">
                  {item.icon}
                </div>
                <span className="text-[9px] mt-0.5 whitespace-nowrap">
                  {language === 'fr' ? item.nameFr : item.nameAr}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Padding pour éviter que le contenu ne soit masqué par les barres fixes */}
      <div className="pt-14 pb-16"></div>
    </>
  );
};

export default Header;
