
import React, { useState, useEffect } from 'react';
import { User, LogOut, Mail, Shield, Globe, Briefcase } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import BarcodeGenerator from '@/components/BarcodeGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import RequestProfessionalActivation from '@/components/RequestProfessionalActivation';
import supabase from '@/lib/supabase/supabase';
import { ProfessionalActivationRequest } from '@/lib/supabase/schema';

const Profile: React.FC = () => {
  const { userData, user, signOut, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [activationRequest, setActivationRequest] = useState<ProfessionalActivationRequest | null>(null);

  useEffect(() => {
    if (user) {
      fetchActivationRequest();
    }
  }, [user]);

  const fetchActivationRequest = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('professional_activation_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching activation request:', error);
        return;
      }
      
      if (data) {
        setActivationRequest(data as ProfessionalActivationRequest);
      }
    } catch (error) {
      console.error('Error in fetching activation request:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: t('errorOccurred'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      });
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      await resetPassword(user.email);
      toast({
        title: t('emailSent'),
        description: t('checkEmailForInstructions'),
      });
      setPasswordDialogOpen(false);
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: t('errorOccurred'),
        description: error.message || t('tryAgainLater'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const renderActivationRequestStatus = () => {
    if (!activationRequest) return null;
    
    let statusColor = 'bg-gray-100 text-gray-800';
    if (activationRequest.status === 'approved') {
      statusColor = 'bg-green-100 text-green-800';
    } else if (activationRequest.status === 'rejected') {
      statusColor = 'bg-red-100 text-red-800';
    } else {
      statusColor = 'bg-yellow-100 text-yellow-800';
    }
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">{t('professionalAccountStatus')}</h3>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {activationRequest.status === 'pending' && t('pending')}
          {activationRequest.status === 'approved' && t('approved')}
          {activationRequest.status === 'rejected' && t('rejected')}
        </div>
        {activationRequest.status === 'approved' && (
          <Button 
            className="mt-3 w-full" 
            onClick={() => navigate('/professional')}
          >
            <Briefcase size={16} className="mr-2" />
            {t('accessProfessionalDashboard')}
          </Button>
        )}
        {activationRequest.status === 'rejected' && activationRequest.admin_notes && (
          <div className="mt-2 text-sm text-red-600">
            <p><strong>{t('rejectionReason')}:</strong> {activationRequest.admin_notes}</p>
          </div>
        )}
      </div>
    );
  };

  const sections = [
    {
      title: t('accountInfo'),
      icon: <User size={20} className="text-medical-500" />,
      items: [
        { 
          label: t('changePassword'), 
          onClick: () => setPasswordDialogOpen(true)
        }
      ]
    },
    {
      title: t('settings'),
      icon: <Shield size={20} className="text-medical-500" />,
      items: [
        { 
          label: t('language'), 
          onClick: changeLanguage,
          rightElement: <Globe size={16} className="text-muted-foreground" />
        }
      ]
    }
  ];

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-24 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">{t('profile')}</h1>
        <p className="text-muted-foreground">
          {t('manageAccountPreferences')}
        </p>
      </header>
      
      <section className="mb-8">
        <Card className="flex items-center p-4 mb-4">
          <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mr-4">
            <User size={30} className="text-medical-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{userData?.first_name || ''} {userData?.last_name || ''}</h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail size={14} className="mr-1" />
              <span>{user?.email || ''}</span>
            </div>
            {userData?.role === 'professional' ? (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t('professionalAccount')}
                </span>
              </div>
            ) : (
              renderActivationRequestStatus()
            )}
          </div>
        </Card>
        
        {userData && (
          <BarcodeGenerator
            sampleId={user?.id || ""}
            patientName={`${userData.first_name || ''} ${userData.last_name || ''}`}
            testType="Patient ID"
            collectionDate={new Date()}
          />
        )}
      </section>
      
      <section className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <div className="flex items-center mb-3">
              {section.icon}
              <h2 className="text-lg font-medium ml-2">
                {section.title}
              </h2>
            </div>
            
            <Card className="divide-y divide-border/50">
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-center justify-between py-3 px-4 hover:bg-medical-50 cursor-pointer"
                  onClick={item.onClick}
                >
                  <span>{item.label}</span>
                  {item.rightElement || null}
                </div>
              ))}
            </Card>
          </div>
        ))}
        
        {!userData?.role && !activationRequest && (
          <RequestProfessionalActivation 
            trigger={
              <Button
                variant="default"
                className="w-full mt-4"
                icon={<Briefcase size={16} />}
              >
                {t('requestProfessionalAccount')}
              </Button>
            }
          />
        )}
        
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
            icon={<LogOut size={16} />}
            onClick={handleSignOut}
          >
            {t('signOut')}
          </Button>
        </div>
      </section>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('resetPassword')}</DialogTitle>
            <DialogDescription>
              {t('resetPasswordDescription').replace('{email}', user?.email || '')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handlePasswordReset}
              disabled={isLoading}
            >
              {isLoading ? t('sending') : t('sendResetEmail')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
