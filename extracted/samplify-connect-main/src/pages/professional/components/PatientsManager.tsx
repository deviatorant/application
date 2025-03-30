
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Search, UserPlus, Phone, Mail, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfessionalPatient } from '@/lib/supabase/schema';

// Sample data for demonstration
const mockPatients: ProfessionalPatient[] = Array.from({ length: 10 }, (_, i) => ({
  id: `pat-${i}`,
  professional_id: 'prof-1',
  first_name: `Prénom${i}`,
  last_name: `Nom${i}`,
  date_of_birth: new Date(1980 + i, 0, 1).toISOString(),
  gender: i % 2 === 0 ? 'Masculin' : 'Féminin',
  email: `patient${i}@example.com`,
  phone: `+212612345${i.toString().padStart(2, '0')}`,
  address: `Adresse du patient ${i}, Casablanca, Maroc`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

const patientSchema = z.object({
  first_name: z.string().min(2, { message: 'Le prénom est requis' }),
  last_name: z.string().min(2, { message: 'Le nom est requis' }),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().email({ message: 'Email invalide' }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  medical_history: z.string().optional(),
  blood_type: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const PatientsManager: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<ProfessionalPatient[]>(mockPatients);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ProfessionalPatient | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      medical_history: '',
      blood_type: '',
    }
  });

  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone?.includes(searchQuery)
  );

  const handleAddPatient = (data: PatientFormValues) => {
    // In a real app, you would call an API to save the new patient
    const newPatient: ProfessionalPatient = {
      id: `pat-${patients.length + 1}`,
      professional_id: 'prof-1',
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setPatients([...patients, newPatient]);
    setIsAddPatientOpen(false);
    form.reset();
  };

  const handleViewDetails = (patient: ProfessionalPatient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('patients')}</h1>
          <p className="text-muted-foreground">{t('managePatients')}</p>
        </div>
        
        <Button onClick={() => setIsAddPatientOpen(true)}>
          <UserPlus size={16} className="mr-2" />
          {t('addPatient')}
        </Button>
      </div>
      
      <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
        <Input
          placeholder={t('searchPatient')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          icon={<Search size={18} />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('patientsList')}</CardTitle>
          <CardDescription>
            {filteredPatients.length} {t('patientsFound')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b py-3 px-4 font-medium text-sm bg-muted/50">
              <div className="col-span-5">{t('name')}</div>
              <div className="col-span-3">{t('contactInfo')}</div>
              <div className="col-span-2">{t('lastVisit')}</div>
              <div className="col-span-2 text-right">{t('actions')}</div>
            </div>
            
            <div className="divide-y">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-12 py-3 px-4 items-center text-sm">
                    <div className="col-span-5">
                      <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                      <div className="text-muted-foreground text-xs">
                        {patient.date_of_birth && new Date(patient.date_of_birth).toLocaleDateString()}
                        {patient.gender && ` • ${patient.gender}`}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center text-xs">
                        <Phone size={14} className="mr-1 text-muted-foreground" /> 
                        <span>{patient.phone || '-'}</span>
                      </div>
                      <div className="flex items-center text-xs mt-1">
                        <Mail size={14} className="mr-1 text-muted-foreground" /> 
                        <span>{patient.email || '-'}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>3 jours</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewDetails(patient)}
                      >
                        {t('viewDetails')}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  {t('noPatients')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('addNewPatient')}</DialogTitle>
            <DialogDescription>
              {t('enterPatientDetails')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPatient)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('firstName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('lastName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dateOfBirth')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('gender')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectGender')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculin">{t('male')}</SelectItem>
                          <SelectItem value="Féminin">{t('female')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medical_history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('medicalHistory')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">{t('addPatient')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('patientDetails')}</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('fullName')}</h3>
                  <p>{selectedPatient.first_name} {selectedPatient.last_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('dateOfBirth')}</h3>
                  <p>{selectedPatient.date_of_birth ? new Date(selectedPatient.date_of_birth).toLocaleDateString() : '-'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('gender')}</h3>
                  <p>{selectedPatient.gender || '-'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('contactInfo')}</h3>
                  <p>{selectedPatient.phone || '-'}</p>
                  <p className="text-sm">{selectedPatient.email || '-'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('address')}</h3>
                <p>{selectedPatient.address || '-'}</p>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" size="sm">
                  {t('editDetails')}
                </Button>
                
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    {t('scheduleAppointment')}
                  </Button>
                  <Button size="sm">
                    {t('startConsultation')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsManager;
