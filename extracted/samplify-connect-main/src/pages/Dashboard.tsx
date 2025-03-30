
import React, { useState } from 'react';
import { Calendar, Clock, FileText, ArrowRight, Camera, Hospital, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import AppointmentCard from '@/components/Appointment/AppointmentCard';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

// Mock data
const upcomingAppointment = {
  id: "app-123",
  date: new Date(Date.now() + 86400000 * 2), // 2 days from now
  startTime: new Date(Date.now() + 86400000 * 2 + 36000000), // 10:00
  endTime: new Date(Date.now() + 86400000 * 2 + 39600000), // 11:00
  address: "123 Rue Principale, Ville",
  status: "scheduled" as const,
  testType: "Numération Formule Sanguine",
};

const recentResults = [
  {
    id: "res-456",
    testName: "Bilan Lipidique",
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
  },
  {
    id: "res-789", 
    testName: "Hémoglobine A1c",
    date: new Date(Date.now() - 86400000 * 12), // 12 days ago
  }
];

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState("Sarah");
  
  // Get current time to personalize greeting
  const currentHour = new Date().getHours();
  let greeting = "Bonjour";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Bon après-midi";
  } else if (currentHour >= 18) {
    greeting = "Bonsoir";
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-24 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre tableau de bord santé
        </p>
      </header>
      
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Prochain rendez-vous</h2>
          <Link to="/appointments" className="text-medical-500 text-sm font-medium flex items-center hover:text-medical-600">
            Voir tout
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {upcomingAppointment ? (
          <AppointmentCard
            id={upcomingAppointment.id}
            date={upcomingAppointment.date}
            startTime={upcomingAppointment.startTime}
            endTime={upcomingAppointment.endTime}
            address={upcomingAppointment.address}
            status={upcomingAppointment.status}
            testType={upcomingAppointment.testType}
          />
        ) : (
          <Card className="text-center py-8">
            <div className="flex flex-col items-center">
              <Calendar size={40} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun rendez-vous à venir</h3>
              <p className="text-muted-foreground mb-4">Planifiez un nouveau rendez-vous maintenant</p>
              <Button>
                <Link to="/appointments">Prendre rendez-vous</Link>
              </Button>
            </div>
          </Card>
        )}
      </section>
      
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Actions rapides</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Link to="/appointments">
            <Card className="h-full flex flex-col items-center justify-center py-6 text-center">
              <Calendar size={28} className="text-medical-500 mb-3" />
              <h3 className="font-medium">Prélèvement</h3>
              <p className="text-sm text-muted-foreground mt-1">Prendre rendez-vous</p>
            </Card>
          </Link>
          
          <Link to="/imaging">
            <Card className="h-full flex flex-col items-center justify-center py-6 text-center">
              <Camera size={28} className="text-medical-500 mb-3" />
              <h3 className="font-medium">Imagerie</h3>
              <p className="text-sm text-muted-foreground mt-1">IRM, Scanner, Radio</p>
            </Card>
          </Link>
          
          <Link to="/home-service">
            <Card className="h-full flex flex-col items-center justify-center py-6 text-center">
              <Hospital size={28} className="text-medical-500 mb-3" />
              <h3 className="font-medium">À domicile</h3>
              <p className="text-sm text-muted-foreground mt-1">Infirmier à proximité</p>
            </Card>
          </Link>
          
          <Link to="/telehealth">
            <Card className="h-full flex flex-col items-center justify-center py-6 text-center">
              <Video size={28} className="text-medical-500 mb-3" />
              <h3 className="font-medium">Téléconsultation</h3>
              <p className="text-sm text-muted-foreground mt-1">Médecins en ligne</p>
            </Card>
          </Link>
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Résultats récents</h2>
          <Link to="/results" className="text-medical-500 text-sm font-medium flex items-center hover:text-medical-600">
            Voir tout
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {recentResults.length > 0 ? (
          <div className="space-y-3">
            {recentResults.map((result) => (
              <Link key={result.id} to={`/results/${result.id}`}>
                <Card className="flex justify-between items-center hover:bg-medical-50">
                  <div className="flex items-center">
                    <FileText size={20} className="text-medical-500 mr-3" />
                    <span className="font-medium">{result.testName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.date.toLocaleDateString('fr-FR')}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <div className="flex flex-col items-center">
              <FileText size={40} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun résultat pour l'instant</h3>
              <p className="text-muted-foreground">
                Vos résultats d'analyses apparaîtront ici
              </p>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
