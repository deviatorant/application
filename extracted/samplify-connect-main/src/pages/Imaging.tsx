
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Camera, MapPin, ArrowRight } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Types
type ImagingType = 'irm' | 'scanner' | 'radio';

interface ImagingCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  availableServices: ImagingType[];
}

interface TimeSlot {
  id: string;
  time: Date;
  isAvailable: boolean;
}

// Mock data
const centers: ImagingCenter[] = [
  {
    id: 'center-1',
    name: 'Centre d\'Imagerie Médicale Pasteur',
    address: '25 Rue des Médecins, 75001 Paris',
    distance: 2.3,
    rating: 4.6,
    availableServices: ['irm', 'scanner', 'radio']
  },
  {
    id: 'center-2',
    name: 'Imagerie Médicale Saint-Louis',
    address: '42 Avenue des Spécialistes, 75002 Paris',
    distance: 3.5,
    rating: 4.8,
    availableServices: ['irm', 'scanner']
  },
  {
    id: 'center-3',
    name: 'Centre de Radiologie Moderne',
    address: '18 Boulevard de la Santé, 75003 Paris',
    distance: 1.8,
    rating: 4.5,
    availableServices: ['scanner', 'radio']
  }
];

const Imaging: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ImagingType>('irm');
  const [selectedCenter, setSelectedCenter] = useState<ImagingCenter | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Generate mock time slots for a given date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    
    for (let i = 0; i < 16; i++) {
      const slotTime = new Date(date);
      slotTime.setHours(startHour + Math.floor(i/2));
      slotTime.setMinutes((i % 2) * 30);
      
      slots.push({
        id: `slot-${date.toISOString().split('T')[0]}-${i}`,
        time: slotTime,
        isAvailable: Math.random() > 0.3, // 70% available
      });
    }
    
    return slots;
  };
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots(new Date()));
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setTimeSlots(generateTimeSlots(date));
    setSelectedTimeSlot(null);
  };
  
  const imagingTypeLabels = {
    'irm': 'IRM',
    'scanner': 'Scanner',
    'radio': 'Radiographie'
  };
  
  const filteredCenters = centers.filter(center => 
    center.availableServices.includes(selectedType)
  );
  
  const handleBookAppointment = () => {
    // In a real app, this would submit the appointment to the backend
    toast.success("Rendez-vous confirmé", {
      description: `${imagingTypeLabels[selectedType]} programmé le ${format(selectedDate, 'd MMMM', { locale: fr })} à ${format(selectedTimeSlot?.time!, 'HH:mm')}`
    });
    
    // Reset form
    setCurrentStep(1);
    setSelectedCenter(null);
    setSelectedTimeSlot(null);
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-24 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Imagerie Médicale</h1>
        <p className="text-muted-foreground">
          Prenez rendez-vous pour un IRM, Scanner ou Radiographie
        </p>
      </header>
      
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Sélectionnez un type d'examen</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {(['irm', 'scanner', 'radio'] as ImagingType[]).map(type => (
                <div
                  key={type}
                  className={cn(
                    "border rounded-xl p-4 text-center cursor-pointer transition-all",
                    selectedType === type 
                      ? "border-medical-500 bg-medical-50" 
                      : "hover:border-medical-300"
                  )}
                  onClick={() => setSelectedType(type)}
                >
                  <Camera size={28} className="mx-auto mb-2 text-medical-500" />
                  <div className="font-medium">{imagingTypeLabels[type]}</div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => setCurrentStep(2)}
              className="w-full"
            >
              Continuer
            </Button>
          </Card>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="animate-fade-in">
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Centres pour {imagingTypeLabels[selectedType]}
            </h2>
            
            <div className="space-y-4 mb-4">
              {filteredCenters.map(center => (
                <div 
                  key={center.id}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all",
                    selectedCenter?.id === center.id 
                      ? "border-medical-500 bg-medical-50" 
                      : "hover:border-medical-300"
                  )}
                  onClick={() => setSelectedCenter(center)}
                >
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{center.name}</div>
                    <div className="text-yellow-500 font-medium">★ {center.rating}</div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin size={14} className="mr-1" />
                    <span>{center.distance} km</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground truncate">
                    {center.address}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {center.availableServices.map(service => (
                      <span 
                        key={service} 
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          service === selectedType 
                            ? "bg-medical-100 text-medical-700" 
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {imagingTypeLabels[service]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep(1)}
              >
                Retour
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)}
                disabled={!selectedCenter}
              >
                Sélectionner une date
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="animate-fade-in">
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Sélectionner une date</h2>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                const date = addDays(new Date(), dayOffset);
                const isSelected = selectedDate.toDateString() === date.toDateString();
                
                return (
                  <div
                    key={dayOffset}
                    className={cn(
                      "text-center p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? "bg-medical-50 border-medical-500 text-medical-800" 
                        : "hover:border-medical-300"
                    )}
                    onClick={() => handleDateChange(date)}
                  >
                    <div className="text-xs font-medium">
                      {format(date, 'EEE', { locale: fr })}
                    </div>
                    <div className="text-lg font-semibold">
                      {format(date, 'd', { locale: fr })}
                    </div>
                    <div className="text-xs">
                      {format(date, 'MMM', { locale: fr })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <h3 className="font-medium mb-3">Horaires disponibles</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {timeSlots.map(slot => (
                <div
                  key={slot.id}
                  className={cn(
                    "text-center p-2 rounded-lg border transition-all",
                    !slot.isAvailable && "opacity-50 cursor-not-allowed",
                    slot.isAvailable && selectedTimeSlot?.id === slot.id 
                      ? "bg-medical-50 border-medical-500 text-medical-800" 
                      : slot.isAvailable ? "cursor-pointer hover:border-medical-300" : "",
                  )}
                  onClick={() => {
                    if (slot.isAvailable) {
                      setSelectedTimeSlot(slot);
                    }
                  }}
                >
                  {format(slot.time, 'HH:mm')}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep(2)}
              >
                Retour
              </Button>
              <Button 
                onClick={handleBookAppointment}
                disabled={!selectedTimeSlot}
              >
                Confirmer le rendez-vous
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Imaging;
