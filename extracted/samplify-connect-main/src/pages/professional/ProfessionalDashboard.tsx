
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FilePlus, 
  MessageSquare, 
  Bell, 
  CreditCard,
  BarChart,
  Settings,
  LogOut,
  Plus 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentManager from './components/AppointmentManager';
import PatientsManager from './components/PatientsManager';
import ConsultationManager from './components/ConsultationManager';
import MessagingSystem from './components/MessagingSystem';
import InvoiceManager from './components/InvoiceManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import NotificationsPanel from './components/NotificationsPanel';
import SettingsPanel from './components/SettingsPanel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ProfessionalDashboard = () => {
  const { t } = useLanguage();
  const { signOut, userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(2);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigationItems = [
    { id: 'overview', label: t('overview'), icon: <BarChart size={20} /> },
    { id: 'appointments', label: t('appointments'), icon: <Calendar size={20} /> },
    { id: 'patients', label: t('patients'), icon: <Users size={20} /> },
    { id: 'consultations', label: t('consultations'), icon: <FilePlus size={20} /> },
    { 
      id: 'messages', 
      label: t('messages'), 
      icon: <MessageSquare size={20} />,
      badge: unreadMessages > 0 ? unreadMessages : null
    },
    { 
      id: 'notifications', 
      label: t('notifications'), 
      icon: <Bell size={20} />,
      badge: unreadNotifications > 0 ? unreadNotifications : null
    },
    { id: 'billing', label: t('billing'), icon: <CreditCard size={20} /> },
    { id: 'settings', label: t('settings'), icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">SamplifyCare Pro</h2>
          <div className="mt-2 text-sm text-gray-500">{userData?.first_name} {userData?.last_name}</div>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto py-4 px-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 my-0.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </div>
              {item.badge && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            {t('logout')}
          </Button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white w-full">
        <h2 className="text-xl font-bold text-blue-600">SamplifyCare Pro</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "×" : "≡"}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b z-50">
          <div className="p-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 my-0.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  {item.label}
                </div>
                {item.badge && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
            <Separator className="my-2" />
            <Button 
              variant="outline" 
              className="w-full justify-start mt-2"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('professionalDashboard')}</h1>
                <Button onClick={() => setActiveTab("appointments")}>
                  <Plus size={16} className="mr-2" />
                  {t('newAppointment')}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('todayAppointments')}</CardTitle>
                    <CardDescription>{t('scheduledForToday')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">8</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('totalPatients')}</CardTitle>
                    <CardDescription>{t('activePatients')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">64</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('pendingInvoices')}</CardTitle>
                    <CardDescription>{t('unpaidInvoices')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">12</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('unreadMessages')}</CardTitle>
                    <CardDescription>{t('fromPatients')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{unreadMessages}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('upcomingAppointments')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="flex items-center p-3 border rounded-lg">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <Users size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Patient {idx + 1}</p>
                            <p className="text-sm text-gray-500">14:30 - Consultation générale</p>
                          </div>
                          <Button variant="outline" size="sm">
                            {t('viewDetails')}
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        className="w-full" 
                        onClick={() => setActiveTab("appointments")}
                      >
                        {t('viewAllAppointments')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t('recentMessages')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2].map((_, idx) => (
                        <div key={idx} className="flex items-start p-3 border rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <MessageSquare size={18} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">Patient {idx + 1}</p>
                              <span className="text-xs text-gray-500">10:23</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-1">
                              {idx === 0 ? "Bonjour docteur, j'ai quelques questions concernant mon traitement..." 
                               : "Merci pour la consultation d'hier, je voulais savoir si..."}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        className="w-full" 
                        onClick={() => setActiveTab("messages")}
                      >
                        {t('viewAllMessages')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {activeTab === "appointments" && <AppointmentManager />}
          {activeTab === "patients" && <PatientsManager />}
          {activeTab === "consultations" && <ConsultationManager />}
          {activeTab === "messages" && <MessagingSystem />}
          {activeTab === "notifications" && <NotificationsPanel />}
          {activeTab === "billing" && <InvoiceManager />}
          {activeTab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
