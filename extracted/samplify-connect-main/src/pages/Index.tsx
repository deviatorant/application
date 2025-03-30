
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { userData, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect them to the appropriate dashboard
    if (userData && !isLoading) {
      console.log("User data loaded, redirecting based on role:", userData.role);
      if (userData.role === 'professional') {
        navigate('/professional');
      } else if (userData.role === 'patient') {
        navigate('/dashboard');
      }
    }
  }, [userData, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Chargement de votre profil...</p>
      </div>
    );
  }

  // If we reach here, the user is not logged in
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bienvenue sur SIHATI</CardTitle>
          <CardDescription>
            Votre plateforme de santé connectée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Connectez-vous pour accéder à vos rendez-vous, consultations et résultats médicaux.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-2 rounded-lg border p-3">
              <h3 className="font-medium">Pour les patients</h3>
              <p className="text-sm text-gray-500">Prenez rendez-vous et suivez vos résultats</p>
            </div>
            <div className="flex flex-col space-y-2 rounded-lg border p-3">
              <h3 className="font-medium">Pour les professionnels</h3>
              <p className="text-sm text-gray-500">Gérez votre agenda et vos patients</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={() => navigate('/login')} className="w-full">
            Se connecter / S'inscrire
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
