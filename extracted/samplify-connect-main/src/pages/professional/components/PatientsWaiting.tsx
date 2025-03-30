
import React from 'react';
import { User, Clock, Video, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useLanguage } from '@/contexts/LanguageContext';

interface WaitingPatient {
  id: string;
  name: string;
  waitingSince: Date;
  appointmentType: 'video' | 'inperson';
  urgent: boolean;
}

const PatientsWaiting: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Mock data
  const waitingPatients: WaitingPatient[] = [
    {
      id: 'p1',
      name: 'Mohammed Alaoui',
      waitingSince: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      appointmentType: 'video',
      urgent: false
    },
    {
      id: 'p2',
      name: 'Sarah Bennani',
      waitingSince: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      appointmentType: 'inperson',
      urgent: true
    }
  ];
  
  // Function to format waiting time
  const formatWaitingTime = (date: Date): string => {
    const diffInMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes`;
    
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const getTranslation = (key: string): string => {
    if (language === 'fr') {
      switch(key) {
        case 'patientsWaiting': return 'Patients en attente';
        case 'waiting': return 'En attente depuis';
        case 'videoType': return 'Téléconsultation';
        case 'inPersonType': return 'En personne';
        case 'urgent': return 'Urgent';
        case 'call': return 'Appeler';
        case 'consult': return 'Consulter';
        case 'noDoctorsFound': return 'Aucun patient en attente';
        case 'tryModifyingSearch': return 'Les patients apparaîtront ici lorsqu\'ils seront en attente.';
        default: return key;
      }
    } else {
      switch(key) {
        case 'patientsWaiting': return 'المرضى في قائمة الانتظار';
        case 'waiting': return 'في الانتظار منذ';
        case 'videoType': return 'استشارة عن بعد';
        case 'inPersonType': return 'حضوري';
        case 'urgent': return 'عاجل';
        case 'call': return 'اتصال';
        case 'consult': return 'استشارة';
        case 'noDoctorsFound': return 'لا يوجد مرضى في الانتظار';
        case 'tryModifyingSearch': return 'سيظهر المرضى هنا عندما يكونون في قائمة الانتظار.';
        default: return key;
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        {getTranslation('patientsWaiting')}
      </h1>
      
      <div className="space-y-4">
        {waitingPatients.length > 0 ? (
          waitingPatients.map(patient => (
            <Card 
              key={patient.id} 
              className={cn(
                "p-4",
                patient.urgent && "border-l-4 border-l-red-500"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <User size={24} className="text-gray-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock size={14} className="mr-1" />
                      {getTranslation('waiting')}: {formatWaitingTime(patient.waitingSince)}
                      
                      <span className="mx-2">•</span>
                      
                      {patient.appointmentType === 'video' ? (
                        <Video size={14} className="mr-1 text-blue-500" />
                      ) : (
                        <User size={14} className="mr-1 text-green-500" />
                      )}
                      {patient.appointmentType === 'video' ? 
                        getTranslation('videoType') : 
                        getTranslation('inPersonType')}
                      
                      {patient.urgent && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-red-500 font-medium">{getTranslation('urgent')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {patient.appointmentType === 'video' && (
                    <Button size="sm" className="bg-blue-500">
                      <Video size={16} className="mr-1" />
                      {getTranslation('call')}
                    </Button>
                  )}
                  
                  <Button size="sm" variant={patient.appointmentType === 'video' ? "outline" : "primary"}>
                    {patient.appointmentType === 'video' ? (
                      <>
                        <Phone size={16} className="mr-1" />
                        {getTranslation('call')}
                      </>
                    ) : (
                      getTranslation('consult')
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {getTranslation('noDoctorsFound')}
            </h3>
            <p className="text-muted-foreground">
              {getTranslation('tryModifyingSearch')}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientsWaiting;
