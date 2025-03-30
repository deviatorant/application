
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Video, Star, Clock, MapPin, User, ArrowRight, PhoneCall } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import VideoCall from '@/components/VideoCall/VideoCall';

// Types
type Specialty = 'general' | 'cardiology' | 'dermatology' | 'pediatrics' | 'psychology';

interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  rating: number;
  distance: number;
  price: number;
  available: boolean;
  nextAvailable: Date;
  imageUrl?: string;
}

interface TimeSlot {
  id: string;
  time: Date;
  isAvailable: boolean;
}

// Mock data
const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sophie Moreau',
    specialty: 'general',
    rating: 4.9,
    distance: 2.5,
    price: 25,
    available: true,
    nextAvailable: new Date(Date.now() + 3600000), // in 1 hour
  },
  {
    id: 'doc-2',
    name: 'Dr. Pierre Lambert',
    specialty: 'cardiology',
    rating: 4.8,
    distance: 3.2,
    price: 45,
    available: false,
    nextAvailable: new Date(Date.now() + 86400000), // tomorrow
  },
  {
    id: 'doc-3',
    name: 'Dr. Anne Dubois',
    specialty: 'dermatology',
    rating: 4.7,
    distance: 1.8,
    price: 35,
    available: true,
    nextAvailable: new Date(Date.now() + 7200000), // in 2 hours
  },
  {
    id: 'doc-4',
    name: 'Dr. François Martin',
    specialty: 'pediatrics',
    rating: 4.9,
    distance: 4.1,
    price: 40,
    available: true,
    nextAvailable: new Date(Date.now() + 5400000), // in 1.5 hours
  },
  {
    id: 'doc-5',
    name: 'Dr. Julie Blanc',
    specialty: 'psychology',
    rating: 4.8,
    distance: 2.7,
    price: 50,
    available: false,
    nextAvailable: new Date(Date.now() + 172800000), // in 2 days
  }
];

const Telehealth: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | ''>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isNearbyOnly, setIsNearbyOnly] = useState(false);
  const [appointmentType, setAppointmentType] = useState<'video' | 'inperson'>('video');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  
  const specialtyLabels: Record<Specialty, {fr: string, ar: string}> = {
    general: {fr: 'Médecine générale', ar: 'طب عام'},
    cardiology: {fr: 'Cardiologie', ar: 'أمراض القلب'},
    dermatology: {fr: 'Dermatologie', ar: 'أمراض الجلد'},
    pediatrics: {fr: 'Pédiatrie', ar: 'طب الأطفال'},
    psychology: {fr: 'Psychologie', ar: 'علم النفس'}
  };
  
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
  
  const filteredDoctors = doctors.filter(doctor => {
    // Filter by search query
    if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by specialty
    if (selectedSpecialty && doctor.specialty !== selectedSpecialty) {
      return false;
    }
    
    // Filter by nearby only
    if (isNearbyOnly && doctor.distance > 5) {
      return false;
    }
    
    return true;
  });

  // Translation helper function to replace t()
  const getTranslation = (frText: string, arText: string): string => {
    return language === 'fr' ? frText : arText;
  };
  
  const handleBookAppointment = () => {
    // In a real app, this would submit the appointment to the backend
    toast.success(
      getTranslation("Consultation réservée", "تم حجز الاستشارة"), 
      {
        description: getTranslation(
          `Rendez-vous ${appointmentType === 'video' ? 'en visioconférence' : 'en personne'} avec ${selectedDoctor?.name} le ${format(selectedDate, 'd MMMM', { locale: fr })} à ${format(selectedTimeSlot?.time!, 'HH:mm')}`,
          `موعد ${appointmentType === 'video' ? 'عبر الفيديو' : 'شخصي'} مع ${selectedDoctor?.name} يوم ${format(selectedDate, 'd MMMM', { locale: fr })} الساعة ${format(selectedTimeSlot?.time!, 'HH:mm')}`
        )
      }
    );
    
    // Reset form
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
    setShowAppointmentForm(false);
  };

  const handleStartVideoCall = () => {
    if (selectedDoctor && selectedDoctor.available) {
      setIsInVideoCall(true);
    } else {
      toast.error(
        getTranslation("Médecin non disponible", "الطبيب غير متاح"), 
        {
          description: getTranslation(
            "Ce médecin n'est pas disponible pour une consultation immédiate",
            "هذا الطبيب غير متاح للاستشارة الفورية"
          )
        }
      );
    }
  };

  if (isInVideoCall && selectedDoctor) {
    return <VideoCall doctorName={selectedDoctor.name} onClose={() => setIsInVideoCall(false)} />;
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-24 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          {getTranslation("Téléconsultation", "الاستشارة عن بعد")}
        </h1>
        <p className="text-muted-foreground">
          {getTranslation(
            "Consultez un médecin en ligne ou prenez rendez-vous en personne",
            "استشر طبيبًا عبر الإنترنت أو حدد موعدًا شخصيًا"
          )}
        </p>
      </header>
      
      {!showAppointmentForm ? (
        <div className="animate-fade-in">
          <Card className="mb-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder={getTranslation(
                  "Rechercher un médecin ou une spécialité...",
                  "البحث عن طبيب أو تخصص..."
                )}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className={cn(
                  "text-sm px-3 py-1 rounded-full border transition-all",
                  selectedSpecialty === '' ? "bg-medical-100 border-medical-200 text-medical-800" : "hover:bg-gray-50"
                )}
                onClick={() => setSelectedSpecialty('')}
              >
                {getTranslation("Tous", "الكل")}
              </button>
              
              {(Object.keys(specialtyLabels) as Specialty[]).map(specialty => (
                <button
                  key={specialty}
                  className={cn(
                    "text-sm px-3 py-1 rounded-full border transition-all",
                    selectedSpecialty === specialty ? "bg-medical-100 border-medical-200 text-medical-800" : "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {language === 'fr' ? specialtyLabels[specialty].fr : specialtyLabels[specialty].ar}
                </button>
              ))}
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="nearbyOnly"
                checked={isNearbyOnly}
                onChange={() => setIsNearbyOnly(!isNearbyOnly)}
                className="mr-2"
              />
              <label htmlFor="nearbyOnly" className="text-sm">
                {getTranslation(
                  "Afficher uniquement les médecins à proximité (<5km)",
                  "عرض الأطباء القريبين فقط (<5 كم)"
                )}
              </label>
            </div>
          </Card>
          
          <h2 className="text-lg font-medium mb-3">
            {getTranslation("Médecins disponibles", "الأطباء المتاحون")}
          </h2>
          
          {filteredDoctors.length > 0 ? (
            <div className="space-y-4 mb-6">
              {filteredDoctors.map(doctor => (
                <Card 
                  key={doctor.id} 
                  className="animate-scale-in"
                  isHoverable
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {language === 'fr' ? specialtyLabels[doctor.specialty].fr : specialtyLabels[doctor.specialty].ar}
                      </div>
                      <div className="flex items-center mt-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full overflow-hidden">
                      <User size={28} className="text-gray-600 m-auto mt-1.5" />
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin size={14} className="mr-1" />
                    <span>{doctor.distance} km</span>
                    <span className="mx-2">•</span>
                    <span>{getTranslation("Prix", "السعر")}: {doctor.price}€</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-medical-500" />
                      <span className="text-sm">
                        {doctor.available 
                          ? getTranslation("Disponible aujourd'hui", "متاح اليوم")
                          : getTranslation(`Prochain RDV: ${format(doctor.nextAvailable, 'd MMM', { locale: fr })}`, 
                              `الموعد القادم: ${format(doctor.nextAvailable, 'd MMM', { locale: fr })}`)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {doctor.available && (
                        <Button 
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            handleStartVideoCall();
                          }}
                        >
                          <PhoneCall size={14} className="mr-1" />
                          {getTranslation("Appeler", "اتصال")}
                        </Button>
                      )}
                      
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowAppointmentForm(true);
                        }}
                      >
                        {getTranslation("Consulter", "استشارة")}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8 mb-6">
              <div className="flex flex-col items-center">
                <User size={40} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {getTranslation("Aucun médecin trouvé", "لم يتم العثور على أي طبيب")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {getTranslation(
                    "Essayez de modifier vos critères de recherche",
                    "حاول تعديل معايير البحث الخاصة بك"
                  )}
                </p>
              </div>
            </Card>
          )}
        </div>
      ) : selectedDoctor && (
        <div className="animate-fade-in">
          <Card className="mb-6">
            <div className="flex items-center mb-6">
              <button 
                className="text-medical-500 mr-2"
                onClick={() => setShowAppointmentForm(false)}
              >
                <ArrowRight size={16} className="rotate-180" />
              </button>
              <h2 className="text-lg font-semibold">
                {getTranslation("Prendre rendez-vous", "حجز موعد")}
              </h2>
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-lg">{selectedDoctor.name}</h3>
                <div className="text-sm text-muted-foreground">
                  {language === 'fr' ? specialtyLabels[selectedDoctor.specialty].fr : specialtyLabels[selectedDoctor.specialty].ar}
                </div>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{selectedDoctor.rating}</span>
                </div>
              </div>
              <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-full overflow-hidden">
                <User size={32} className="text-gray-600 m-auto mt-2" />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">
                {getTranslation("Type de consultation", "نوع الاستشارة")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "border rounded-xl p-4 text-center cursor-pointer transition-all",
                    appointmentType === 'video' 
                      ? "border-medical-500 bg-medical-50" 
                      : "hover:border-medical-300"
                  )}
                  onClick={() => setAppointmentType('video')}
                >
                  <Video size={24} className="mx-auto mb-2 text-medical-500" />
                  <div className="font-medium">
                    {getTranslation("Vidéo", "فيديو")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getTranslation("Consultation en ligne", "استشارة عبر الإنترنت")}
                  </div>
                </div>
                
                <div
                  className={cn(
                    "border rounded-xl p-4 text-center cursor-pointer transition-all",
                    appointmentType === 'inperson' 
                      ? "border-medical-500 bg-medical-50" 
                      : "hover:border-medical-300"
                  )}
                  onClick={() => setAppointmentType('inperson')}
                >
                  <User size={24} className="mx-auto mb-2 text-medical-500" />
                  <div className="font-medium">
                    {getTranslation("En personne", "شخصي")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getTranslation("À", "على بعد")} {selectedDoctor.distance} km
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">
                {getTranslation("Sélectionner une date", "اختر تاريخًا")}
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                  const date = addDays(new Date(), dayOffset);
                  const isSelected = selectedDate.toDateString() === date.toDateString();
                  
                  return (
                    <div
                      key={dayOffset}
                      className={cn(
                        "text-center p-2 rounded-lg border cursor-pointer transition-all",
                        isSelected 
                          ? "bg-medical-50 border-medical-500 text-medical-800" 
                          : "hover:border-medical-300"
                      )}
                      onClick={() => handleDateChange(date)}
                    >
                      <div className="text-xs font-medium">
                        {format(date, 'EEE', { locale: fr })}
                      </div>
                      <div className="text-base font-semibold">
                        {format(date, 'd', { locale: fr })}
                      </div>
                      <div className="text-xs">
                        {format(date, 'MMM', { locale: fr })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <h3 className="font-medium mb-2">
                {getTranslation("Horaires disponibles", "الأوقات المتاحة")}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <div
                    key={slot.id}
                    className={cn(
                      "text-center py-2 rounded-lg border transition-all",
                      !slot.isAvailable && "opacity-50 cursor-not-allowed",
                      slot.isAvailable && selectedTimeSlot?.id === slot.id 
                        ? "bg-medical-50 border-medical-500 text-medical-800" 
                        : slot.isAvailable ? "cursor-pointer hover:border-medical-300" : ""
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
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <span>{getTranslation("Prix de la consultation", "سعر الاستشارة")}</span>
                <span className="font-semibold">{selectedDoctor.price}€</span>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleBookAppointment}
                disabled={!selectedTimeSlot}
              >
                {getTranslation("Confirmer le rendez-vous", "تأكيد الموعد")}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Telehealth;
