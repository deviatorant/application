
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Video, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useLanguage } from '@/contexts/LanguageContext';

type AppointmentType = 'video' | 'inperson';

interface Appointment {
  id: string;
  patientName: string;
  time: Date;
  type: AppointmentType;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

const AppointmentManager: React.FC = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Mock data
  const generateAppointments = (date: Date): Appointment[] => {
    const appointments: Appointment[] = [];
    const baseDate = new Date(date);
    
    for (let i = 9; i < 17; i++) {
      if (Math.random() > 0.3) {
        baseDate.setHours(i);
        baseDate.setMinutes(0);
        
        appointments.push({
          id: `appt-${i}-0`,
          patientName: `Patient ${i}`,
          time: new Date(baseDate),
          type: Math.random() > 0.5 ? 'video' : 'inperson',
          status: i < 12 ? 'completed' : i === 12 ? 'pending' : 'confirmed'
        });
      }
      
      if (Math.random() > 0.5) {
        baseDate.setHours(i);
        baseDate.setMinutes(30);
        
        appointments.push({
          id: `appt-${i}-30`,
          patientName: `Patient ${i}-30`,
          time: new Date(baseDate),
          type: Math.random() > 0.5 ? 'video' : 'inperson',
          status: i < 12 ? 'completed' : 'confirmed'
        });
      }
    }
    
    return appointments.sort((a, b) => a.time.getTime() - b.time.getTime());
  };
  
  const [appointments, setAppointments] = useState<Appointment[]>(generateAppointments(new Date()));
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setAppointments(generateAppointments(date));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          {t('manageSchedule')}
        </h1>
        <Button>
          <Plus size={16} className="mr-1" />
          {t('bookAppointment')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card className="p-4">
            <div className="flex items-center mb-4">
              <Calendar size={18} className="mr-2 text-blue-500" />
              <h2 className="font-semibold">{t('selectDate')}</h2>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                const date = addDays(new Date(), dayOffset);
                const isSelected = selectedDate.toDateString() === date.toDateString();
                
                return (
                  <div
                    key={dayOffset}
                    className={cn(
                      "text-center p-2 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? "bg-blue-50 border-blue-500 text-blue-800" 
                        : "hover:border-blue-300"
                    )}
                    onClick={() => handleDateChange(date)}
                  >
                    <div className="text-xs font-medium">
                      {format(date, 'EEE', { locale: fr })}
                    </div>
                    <div className="text-base font-semibold">
                      {format(date, 'd', { locale: fr })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('availableHours')}
              </h3>
              
              <div className="grid grid-cols-4 gap-2">
                {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map(time => (
                  <div
                    key={time}
                    className={cn(
                      "text-center py-1 text-sm border rounded-md",
                      appointments.some(a => format(a.time, 'HH:mm') === time)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "cursor-pointer hover:border-blue-400"
                    )}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-4">
            <div className="flex items-center mb-4">
              <Clock size={18} className="mr-2 text-blue-500" />
              <h2 className="font-semibold">
                {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
              </h2>
            </div>
            
            <div className="space-y-3">
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div 
                    key={appointment.id} 
                    className={cn(
                      "p-3 border rounded-lg",
                      appointment.status === 'completed' ? "bg-gray-50" : "",
                      appointment.status === 'pending' ? "border-orange-300 bg-orange-50" : ""
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                          appointment.type === 'video' ? "bg-blue-100" : "bg-green-100"
                        )}>
                          {appointment.type === 'video' ? (
                            <Video size={18} className="text-blue-600" />
                          ) : (
                            <User size={18} className="text-green-600" />
                          )}
                        </div>
                        
                        <div>
                          <p className={cn(
                            "font-medium",
                            appointment.status === 'completed' ? "text-gray-500" : ""
                          )}>
                            {appointment.patientName}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock size={14} className="mr-1" />
                            {format(appointment.time, 'HH:mm')}
                            <span className="mx-2">•</span>
                            {appointment.type === 'video' ? t('videoType') : t('inPersonType')}
                          </div>
                        </div>
                      </div>
                      
                      {appointment.status !== 'completed' && (
                        <Button 
                          size="sm"
                          className={appointment.status === 'pending' ? "bg-orange-500" : ""}
                        >
                          {appointment.status === 'pending' 
                            ? t('call') 
                            : t('consult')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t('noDoctorsFound')}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManager;
