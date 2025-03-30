
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
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
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, FileText, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { ProfessionalConsultation } from '@/lib/supabase/schema';

// Sample data for demonstration
const mockConsultations: ProfessionalConsultation[] = Array.from({ length: 8 }, (_, i) => ({
  id: `cons-${i}`,
  professional_id: 'prof-1',
  patient_id: `pat-${i % 5}`,
  date: new Date(2023, 10, 1 + i).toISOString(),
  diagnosis: `Diagnostic ${i}`,
  treatment: `Traitement ${i}`,
  prescription: i % 2 === 0 ? `Prescription ${i}` : undefined,
  notes: `Notes pour la consultation ${i}`,
  followup_needed: i % 3 === 0,
  followup_date: i % 3 === 0 ? new Date(2023, 11, 1 + i).toISOString() : undefined,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  patient: {
    first_name: `Prénom${i % 5}`,
    last_name: `Nom${i % 5}`
  }
}));

const consultationSchema = z.object({
  patient_id: z.string().min(1, { message: 'Le patient est requis' }),
  date: z.date({ required_error: 'La date est requise' }),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  followup_needed: z.boolean().default(false),
  followup_date: z.date().optional()
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

const ConsultationManager: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [consultations, setConsultations] = useState<ProfessionalConsultation[]>(mockConsultations);
  const [isAddConsultationOpen, setIsAddConsultationOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ProfessionalConsultation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patient_id: '',
      date: new Date(),
      diagnosis: '',
      treatment: '',
      prescription: '',
      notes: '',
      followup_needed: false
    }
  });

  const filteredConsultations = consultations.filter(consultation => 
    consultation.patient?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.patient?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddConsultation = (data: ConsultationFormValues) => {
    // In a real app, you would call an API to save the new consultation
    const newConsultation: ProfessionalConsultation = {
      id: `cons-${consultations.length + 1}`,
      professional_id: 'prof-1',
      patient_id: data.patient_id,
      date: data.date.toISOString(),
      diagnosis: data.diagnosis,
      treatment: data.treatment,
      prescription: data.prescription,
      notes: data.notes,
      followup_needed: data.followup_needed,
      followup_date: data.followup_date?.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        first_name: 'Nouveau',
        last_name: 'Patient'
      }
    };
    
    setConsultations([...consultations, newConsultation]);
    setIsAddConsultationOpen(false);
    form.reset();
  };

  const handleViewDetails = (consultation: ProfessionalConsultation) => {
    setSelectedConsultation(consultation);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('consultations')}</h1>
          <p className="text-muted-foreground">{t('manageConsultations')}</p>
        </div>
        
        <Button onClick={() => setIsAddConsultationOpen(true)}>
          <FileText size={16} className="mr-2" />
          {t('newConsultation')}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder={t('searchConsultation')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            icon={<Search size={18} />}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            {t('listView')}
          </Button>
          <Button 
            variant={viewMode === 'card' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('card')}
          >
            {t('cardView')}
          </Button>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('consultationsList')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b py-3 px-4 font-medium text-sm bg-muted/50">
                <div className="col-span-3">{t('patient')}</div>
                <div className="col-span-2">{t('date')}</div>
                <div className="col-span-3">{t('diagnosis')}</div>
                <div className="col-span-2">{t('followup')}</div>
                <div className="col-span-2 text-right">{t('actions')}</div>
              </div>
              
              <div className="divide-y">
                {filteredConsultations.length > 0 ? (
                  filteredConsultations.map((consultation) => (
                    <div key={consultation.id} className="grid grid-cols-12 py-3 px-4 items-center text-sm">
                      <div className="col-span-3 font-medium">
                        {consultation.patient?.first_name} {consultation.patient?.last_name}
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        {consultation.date && format(new Date(consultation.date), 'dd/MM/yyyy')}
                      </div>
                      <div className="col-span-3 truncate">
                        {consultation.diagnosis || '-'}
                      </div>
                      <div className="col-span-2">
                        {consultation.followup_needed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {consultation.followup_date ? format(new Date(consultation.followup_date), 'dd/MM/yyyy') : t('required')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                      <div className="col-span-2 text-right">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewDetails(consultation)}
                        >
                          {t('viewDetails')}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    {t('noConsultations')}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConsultations.length > 0 ? (
            filteredConsultations.map((consultation) => (
              <Card key={consultation.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      {consultation.patient?.first_name} {consultation.patient?.last_name}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {consultation.date && format(new Date(consultation.date), 'dd/MM/yyyy')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {consultation.diagnosis && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">{t('diagnosis')}</h4>
                        <p className="text-sm truncate">{consultation.diagnosis}</p>
                      </div>
                    )}
                    
                    {consultation.treatment && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground">{t('treatment')}</h4>
                        <p className="text-sm truncate">{consultation.treatment}</p>
                      </div>
                    )}
                    
                    {consultation.followup_needed && (
                      <div className="pt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t('followupOn')} {consultation.followup_date ? format(new Date(consultation.followup_date), 'dd/MM/yyyy') : ''}
                        </span>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleViewDetails(consultation)}
                    >
                      {t('viewDetails')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-muted-foreground">
              {t('noConsultations')}
            </div>
          )}
        </div>
      )}
      
      {/* Add Consultation Dialog */}
      <Dialog open={isAddConsultationOpen} onOpenChange={setIsAddConsultationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('addConsultation')}</DialogTitle>
            <DialogDescription>
              {t('enterConsultationDetails')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddConsultation)} className="space-y-4">
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patient')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('selectPatient')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('consultationDate')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>{t('selectDate')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('diagnosis')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('treatment')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('prescription')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('notes')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddConsultationOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">{t('saveConsultation')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Consultation Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('consultationDetails')}</DialogTitle>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('patient')}</h3>
                  <p>{selectedConsultation.patient?.first_name} {selectedConsultation.patient?.last_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('consultationDate')}</h3>
                  <p>{selectedConsultation.date ? format(new Date(selectedConsultation.date), 'PPP', { locale: fr }) : '-'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('diagnosis')}</h3>
                <p>{selectedConsultation.diagnosis || '-'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('treatment')}</h3>
                <p>{selectedConsultation.treatment || '-'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('prescription')}</h3>
                <p>{selectedConsultation.prescription || '-'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('notes')}</h3>
                <p>{selectedConsultation.notes || '-'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('followup')}</h3>
                {selectedConsultation.followup_needed ? (
                  <p>
                    {t('scheduledFor')} {selectedConsultation.followup_date ? 
                      format(new Date(selectedConsultation.followup_date), 'PPP', { locale: fr }) : t('notSpecified')}
                  </p>
                ) : (
                  <p>{t('noFollowupRequired')}</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline">
                  {t('printConsultation')}
                </Button>
                <Button>
                  {t('editConsultation')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationManager;
