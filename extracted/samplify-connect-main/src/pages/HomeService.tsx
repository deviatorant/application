
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Clock, User, Ambulance } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

// Types
interface Nurse {
  id: string;
  name: string;
  distance: number;
  rating: number;
  availability: Date[];
  specialties: string[];
  profilePic?: string;
}

const HomeService: React.FC = () => {
  const [address, setAddress] = useState("123 Rue Principale, Ville");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [nurseEta, setNurseEta] = useState<number | null>(null);
  const [nurseLocation, setNurseLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Mock nurses data
  const nurses: Nurse[] = [
    {
      id: "nurse-1",
      name: "Marie Dupont",
      distance: 1.2,
      rating: 4.8,
      availability: [
        new Date(Date.now() + 1800000), // in 30 min
        new Date(Date.now() + 3600000), // in 1 hour
        new Date(Date.now() + 5400000), // in 1.5 hours
      ],
      specialties: ["Prélèvement sanguin", "Soins à domicile"]
    },
    {
      id: "nurse-2",
      name: "Jean Martin",
      distance: 2.4,
      rating: 4.7,
      availability: [
        new Date(Date.now() + 3600000), // in 1 hour
        new Date(Date.now() + 7200000), // in 2 hours
      ],
      specialties: ["Prélèvement sanguin", "Injection"]
    },
    {
      id: "nurse-3",
      name: "Sarah Lemoine",
      distance: 3.1,
      rating: 4.9,
      availability: [
        new Date(Date.now() + 5400000), // in 1.5 hours
        new Date(Date.now() + 9000000), // in 2.5 hours
      ],
      specialties: ["Prélèvement sanguin", "Soins à domicile", "Soins pédiatriques"]
    }
  ];
  
  const confirmBooking = () => {
    setIsBooked(true);
    // In a real app, this would communicate with the backend
    setNurseEta(Math.round(selectedNurse!.distance * 5)); // Estimate 5 minutes per km
    
    // Simulate nurse movement (in a real app this would be real location updates)
    simulateNurseMovement();
  };
  
  const simulateNurseMovement = () => {
    // Simulate the nurse's starting position (in a real app this would be their actual location)
    setNurseLocation({ lat: 48.8566, lng: 2.3522 });
    
    // Update nurse location every 10 seconds (in a real app this would be real-time updates)
    const interval = setInterval(() => {
      setNurseEta((prev) => {
        if (prev && prev > 1) {
          // Update nurse location (simulated)
          setNurseLocation(prev => {
            if (prev) {
              return {
                lat: prev.lat + (Math.random() * 0.0005),
                lng: prev.lng + (Math.random() * 0.0005)
              };
            }
            return prev;
          });
          return prev - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 10000);
  };
  
  const resetBooking = () => {
    setIsBooked(false);
    setSelectedNurse(null);
    setSelectedTime(null);
    setCurrentStep(1);
    setNurseEta(null);
    setNurseLocation(null);
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-24 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Service à domicile</h1>
        <p className="text-muted-foreground">
          Prélèvement sanguin à votre domicile
        </p>
      </header>
      
      {isBooked ? (
        <div className="animate-fade-in">
          <Card className="mb-6">
            <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-center">
              Votre rendez-vous est confirmé
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-1">
                {selectedNurse?.name} arrivera {nurseEta === 0 ? "très bientôt" : `dans environ ${nurseEta} minutes`}
              </h3>
              <p className="text-muted-foreground">
                Prélèvement sanguin à domicile
              </p>
            </div>
            
            <div className="border rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <User className="text-gray-500 mr-2" size={18} />
                  <span>{selectedNurse?.name}</span>
                </div>
                <div className="text-yellow-500 font-medium flex items-center">
                  ★ {selectedNurse?.rating}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center">
                  <Clock className="text-gray-500 mr-2" size={18} />
                  <span>{selectedTime && format(selectedTime, 'HH:mm')}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-gray-500 mr-2" size={18} />
                  <span>{selectedNurse?.distance} km</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="text-gray-500 mr-2" size={18} />
                <span className="text-sm">{address}</span>
              </div>
            </div>
            
            {nurseEta !== null && nurseEta > 0 && (
              <div className="mb-6">
                <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="text-center text-gray-500">
                    Carte en temps réel
                    {nurseLocation && <div className="text-xs">Position approx: {nurseLocation.lat.toFixed(4)}, {nurseLocation.lng.toFixed(4)}</div>}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ETA: {nurseEta} min</span>
                  <span>{selectedNurse?.distance} km</span>
                </div>
              </div>
            )}
            
            <Button variant="outline" onClick={resetBooking} className="w-full">
              Annuler
            </Button>
          </Card>
        </div>
      ) : (
        <>
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <Card className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Votre adresse</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Adresse de prélèvement</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <Button onClick={() => setCurrentStep(2)} className="w-full">
                  Trouver un infirmier
                </Button>
              </Card>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <Card className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Infirmiers disponibles</h2>
                <div className="space-y-4">
                  {nurses.map(nurse => (
                    <div 
                      key={nurse.id}
                      className={cn(
                        "border rounded-xl p-4 cursor-pointer transition-all",
                        selectedNurse?.id === nurse.id ? "border-medical-500 bg-medical-50" : "hover:border-medical-300"
                      )}
                      onClick={() => setSelectedNurse(nurse)}
                    >
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{nurse.name}</div>
                        <div className="text-yellow-500 font-medium">★ {nurse.rating}</div>
                      </div>
                      
                      <div className="flex text-sm text-muted-foreground mb-3">
                        <div className="flex items-center mr-4">
                          <MapPin size={14} className="mr-1" />
                          <span>{nurse.distance} km</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{Math.round(nurse.distance * 5)} min</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {nurse.specialties.map(specialty => (
                          <span 
                            key={specialty} 
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentStep(1)}
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedNurse}
                  >
                    Continuer
                  </Button>
                </div>
              </Card>
            </div>
          )}
          
          {currentStep === 3 && selectedNurse && (
            <div className="animate-fade-in">
              <Card className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Choisir un horaire</h2>
                <div className="space-y-3 mb-6">
                  {selectedNurse.availability.map((time, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "border rounded-lg p-3 cursor-pointer transition-all flex justify-between items-center",
                        selectedTime?.getTime() === time.getTime() 
                          ? "border-medical-500 bg-medical-50" 
                          : "hover:border-medical-300"
                      )}
                      onClick={() => setSelectedTime(time)}
                    >
                      <div className="flex items-center">
                        <Clock size={16} className="text-medical-500 mr-2" />
                        <span>{format(time, 'HH:mm')}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(time, "d MMMM", { locale: fr })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentStep(2)}
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={confirmBooking}
                    disabled={!selectedTime}
                  >
                    Confirmer
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeService;
