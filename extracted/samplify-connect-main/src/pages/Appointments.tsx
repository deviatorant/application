import React, { useState } from 'react';
import { addDays, format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus, Filter, User, MapPin, Camera, Star } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import AppointmentCard from '@/components/Appointment/AppointmentCard';
import TimeSlotPicker from '@/components/Appointment/TimeSlotPicker';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Types
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
type AppointmentType = 'standard' | 'imaging';
type ImagingType = 'irm' | 'scanner' | 'radio';

interface Appointment {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  address: string;
  nurseName?: string;
  status: AppointmentStatus;
  testType: string;
  type?: AppointmentType;
  imagingType?: ImagingType;
  centerName?: string;
}

interface ImagingCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  availableServices: ImagingType[];
}

// Mock data
const generateMockTimeSlots = (baseDate: Date) => {
  const slots = [];
  const startHour = 8; // 8 AM
  
  for (let i = 0; i < 16; i++) {
    const startTime = new Date(baseDate);
    startTime.setHours(startHour + Math.floor(i/2));
    startTime.setMinutes((i % 2) * 30);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30);
    
    slots.push({
      id: `slot-${baseDate.toISOString().split('T')[0]}-${i}`,
      startTime,
      endTime,
      isAvailable: Math.random() > 0.3, // 70% available
    });
  }
  
  return slots;
};

const imagingTypeLabels: Record<ImagingType, string> = {
  'irm': 'IRM',
  'scanner': 'Scanner',
  'radio': 'Radiographie'
};

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

const mockAppointments: Appointment[] = [
  {
    id: "app-123",
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    startTime: new Date(Date.now() + 86400000 * 2 + 36000000), // 10:00
    endTime: new Date(Date.now() + 86400000 * 2 + 39600000), // 11:00
    address: "123 Rue Principale, Ville",
    nurseName: "Marie Dupont",
    status: "scheduled",
    testType: "Numération Formule Sanguine",
    type: "standard"
  },
  {
    id: "app-456",
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    startTime: new Date(Date.now() - 86400000 * 5 + 39600000), // 11:00
    endTime: new Date(Date.now() - 86400000 * 5 + 43200000), // 12:00
    address: "123 Rue Principale, Ville",
    nurseName: "Jean Martin",
    status: "completed",
    testType: "Bilan Lipidique",
    type: "standard"
  },
  {
    id: "app-789",
    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    startTime: new Date(Date.now() + 86400000 * 3 + 39600000), // 11:00
    endTime: new Date(Date.now() + 86400000 * 3 + 43200000), // 12:00
    address: "25 Rue des Médecins, 75001 Paris",
    status: "scheduled",
    testType: "IRM",
    type: "imaging",
    imagingType: "irm",
    centerName: "Centre d'Imagerie Médicale Pasteur"
  },
];

const Appointments: React.FC = () => {
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [timeSlots, setTimeSlots] = useState(generateMockTimeSlots(selectedDate));
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedTestType, setSelectedTestType] = useState("Numération Formule Sanguine");
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("standard");
  const [selectedImagingType, setSelectedImagingType] = useState<ImagingType>("irm");
  const [selectedCenter, setSelectedCenter] = useState<ImagingCenter | null>(null);
  
  const testTypes = [
    "Numération Formule Sanguine",
    "Bilan Métabolique de Base",
    "Bilan Métabolique Complet",
    "Bilan Lipidique",
    "Bilan Thyroïdien",
    "Hémoglobine A1c",
    "Vitamine D",
    "Test COVID-19"
  ];
  
  const handleDateChange = (date: Date) => {
    const newDate = startOfDay(date);
    setSelectedDate(newDate);
    setTimeSlots(generateMockTimeSlots(newDate));
  };
  
  const handleBooking = () => {
    setIsBooking(true);
  };
  
  const handleSelectTimeSlots = (selectedSlots: any[]) => {
    // Mock creating a new appointment
    if (selectedSlots.length > 0) {
      const firstSlot = selectedSlots[0];
      
      let newAppointment: Appointment;
      
      if (appointmentType === "standard") {
        newAppointment = {
          id: `app-new-${Date.now()}`,
          date: selectedDate,
          startTime: firstSlot.startTime,
          endTime: firstSlot.endTime,
          address: "123 Rue Principale, Ville",
          nurseName: "Infirmier Disponible",
          status: "scheduled",
          testType: selectedTestType,
          type: "standard"
        };
      } else {
        // Imagerie
        if (!selectedCenter) return;
        
        newAppointment = {
          id: `app-new-${Date.now()}`,
          date: selectedDate,
          startTime: firstSlot.startTime,
          endTime: firstSlot.endTime,
          address: selectedCenter.address,
          status: "scheduled",
          testType: imagingTypeLabels[selectedImagingType],
          type: "imaging",
          imagingType: selectedImagingType,
          centerName: selectedCenter.name
        };
      }
      
      setAppointments([newAppointment, ...appointments]);
      setIsBooking(false);
      
      toast.success("Rendez-vous confirmé", {
        description: `${appointmentType === "standard" ? selectedTestType : imagingTypeLabels[selectedImagingType]} programmé le ${format(selectedDate, 'd MMMM', { locale: fr })} à ${format(firstSlot.startTime, 'HH:mm')}`
      });
    }
  };
  
  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? {...app, status: "cancelled" as AppointmentStatus} : app
    ));
  };

  const filteredCenters = centers.filter(center => 
    center.availableServices.includes(selectedImagingType)
  );

  const upcomingAppointments = appointments.filter(
    app => app.status === "scheduled"
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === "completed" || app.status === "cancelled"
  );

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-24 animate-fade-in">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Rendez-vous</h1>
        {!isBooking && (
          <Button 
            onClick={handleBooking}
            icon={<Plus size={16} />}
          >
            Nouveau
          </Button>
        )}
      </header>
      
      {isBooking ? (
        <div className="animate-slide-up">
          <Card className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Prendre un nouveau rendez-vous</h2>
            
            {/* Type de rendez-vous */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Type de rendez-vous</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div
                  className={cn(
                    "border rounded-xl p-4 text-center cursor-pointer transition-all",
                    appointmentType === 'standard' 
                      ? "border-medical-500 bg-medical-50" 
                      : "hover:border-medical-300"
                  )}
                  onClick={() => setAppointmentType('standard')}
                >
                  <User size={24} className="mx-auto mb-2 text-medical-500" />
                  <div className="font-medium">Standard</div>
                  <div className="text-xs text-muted-foreground">Prise de sang, tests</div>
                </div>
                
                <div
                  className={cn(
                    "border rounded-xl p-4 text-center cursor-pointer transition-all",
                    appointmentType === 'imaging' 
                      ? "border-medical-500 bg-medical-50" 
                      : "hover:border-medical-300"
                  )}
                  onClick={() => setAppointmentType('imaging')}
                >
                  <Camera size={24} className="mx-auto mb-2 text-medical-500" />
                  <div className="font-medium">Imagerie</div>
                  <div className="text-xs text-muted-foreground">IRM, Scanner, Radio</div>
                </div>
              </div>
            </div>
            
            {appointmentType === "standard" ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type de test</label>
                <select 
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
                  value={selectedTestType}
                  onChange={(e) => setSelectedTestType(e.target.value)}
                >
                  {testTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                {/* Type d'imagerie */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Type d'examen</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {(['irm', 'scanner', 'radio'] as ImagingType[]).map(type => (
                      <div
                        key={type}
                        className={cn(
                          "border rounded-xl p-3 text-center cursor-pointer transition-all",
                          selectedImagingType === type 
                            ? "border-medical-500 bg-medical-50" 
                            : "hover:border-medical-300"
                        )}
                        onClick={() => {
                          setSelectedImagingType(type);
                          setSelectedCenter(null);
                        }}
                      >
                        <Camera size={20} className="mx-auto mb-1 text-medical-500" />
                        <div className="font-medium text-sm">{imagingTypeLabels[type]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Centres d'imagerie */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Centre d'imagerie</label>
                  <div className="space-y-2 mb-4">
                    {filteredCenters.map(center => (
                      <div 
                        key={center.id}
                        className={cn(
                          "border rounded-xl p-3 cursor-pointer transition-all",
                          selectedCenter?.id === center.id 
                            ? "border-medical-500 bg-medical-50" 
                            : "hover:border-medical-300"
                        )}
                        onClick={() => setSelectedCenter(center)}
                      >
                        <div className="flex justify-between mb-1">
                          <div className="font-medium text-sm">{center.name}</div>
                          <div className="text-yellow-500 font-medium text-sm">★ {center.rating}</div>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground mb-1">
                          <MapPin size={12} className="mr-1" />
                          <span>{center.distance} km</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground truncate">
                          {center.address}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Sélectionner une date</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map(dayOffset => {
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
            </div>
            
            <TimeSlotPicker
              date={selectedDate}
              timeSlots={timeSlots}
              maxSelections={appointmentType === "standard" ? 3 : 1}
              onSelectTimeSlots={handleSelectTimeSlots}
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                onClick={() => setIsBooking(false)}
              >
                Annuler
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-medium mb-4">Rendez-vous à venir</h2>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    date={appointment.date}
                    startTime={appointment.startTime}
                    endTime={appointment.endTime}
                    address={appointment.address}
                    nurseName={appointment.nurseName}
                    status={appointment.status}
                    testType={appointment.testType}
                    onCancel={handleCancelAppointment}
                    onReschedule={(id) => {
                      // Handle rescheduling
                      console.log('Reprogrammer:', id);
                      setIsBooking(true);
                    }}
                    type={appointment.type}
                    imagingType={appointment.imagingType}
                    centerName={appointment.centerName}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <div className="flex flex-col items-center">
                  <CalendarIcon size={40} className="text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun rendez-vous à venir</h3>
                  <p className="text-muted-foreground mb-4">Planifiez un nouveau rendez-vous maintenant</p>
                  <Button onClick={handleBooking}>
                    Prendre rendez-vous
                  </Button>
                </div>
              </Card>
            )}
          </section>
          
          {pastAppointments.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Rendez-vous passés</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  icon={<Filter size={16} />}
                >
                  Filtrer
                </Button>
              </div>
              
              <div className="space-y-4">
                {pastAppointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    date={appointment.date}
                    startTime={appointment.startTime}
                    endTime={appointment.endTime}
                    address={appointment.address}
                    nurseName={appointment.nurseName}
                    status={appointment.status}
                    testType={appointment.testType}
                    type={appointment.type}
                    imagingType={appointment.imagingType}
                    centerName={appointment.centerName}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Appointments;
