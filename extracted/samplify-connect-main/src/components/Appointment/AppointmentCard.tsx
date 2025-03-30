
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, MapPin, User, Camera } from 'lucide-react';
import { AppointmentStatus } from '@/pages/Appointments';
import { cn } from '@/lib/utils';
import Card from '../common/Card';
import Button from '../common/Button';

interface AppointmentCardProps {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  address: string;
  nurseName?: string;
  status: AppointmentStatus;
  testType: string;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  type?: 'standard' | 'imaging';
  imagingType?: 'irm' | 'scanner' | 'radio';
  centerName?: string;
}

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Planifié',
  completed: 'Terminé',
  cancelled: 'Annulé'
};

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  date,
  startTime,
  endTime,
  address,
  nurseName,
  status,
  testType,
  onCancel,
  onReschedule,
  type = 'standard',
  imagingType,
  centerName
}) => {
  const isPast = new Date() > endTime;
  const isImagery = type === 'imaging';
  
  return (
    <Card
      className={cn(
        "transition-all",
        status === 'cancelled' && "opacity-75"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {isImagery ? 
            <Camera size={16} className="text-medical-600 mr-2" /> :
            <User size={16} className="text-medical-600 mr-2" />
          }
          <h3 className="font-medium">{testType}</h3>
        </div>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full font-medium",
          statusColors[status]
        )}>
          {statusLabels[status]}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="flex items-start">
          <Calendar size={14} className="mr-2 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {format(date, 'EEEE d MMMM', { locale: fr })}
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock size={14} className="mr-2 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-start">
          <MapPin size={14} className="mr-2 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {isImagery ? centerName : "SIHATI Lab"}
            </div>
            <div className="text-xs text-muted-foreground">
              {address}
            </div>
          </div>
        </div>
      </div>
      
      {!isPast && status === 'scheduled' && onCancel && onReschedule && (
        <div className="flex justify-end gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onCancel(id)}
          >
            Annuler
          </Button>
          <Button 
            size="sm" 
            onClick={() => onReschedule(id)}
          >
            Reprogrammer
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard;
