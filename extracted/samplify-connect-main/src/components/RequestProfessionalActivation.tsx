
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase/supabase';

const requestSchema = z.object({
  specialtyInfo: z.string().min(5, {
    message: 'Veuillez fournir des détails sur votre spécialité'
  }),
  licenseInfo: z.string().min(5, {
    message: 'Veuillez fournir votre numéro INPE ou de licence'
  }),
  contactEmail: z.string().email({
    message: 'Veuillez fournir un email valide'
  }),
  practiceAddress: z.string().min(10, {
    message: 'Veuillez fournir l\'adresse de votre cabinet'
  })
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestProfessionalActivationProps {
  trigger: React.ReactNode;
}

const RequestProfessionalActivation: React.FC<RequestProfessionalActivationProps> = ({ trigger }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      specialtyInfo: '',
      licenseInfo: '',
      contactEmail: user?.email || '',
      practiceAddress: ''
    }
  });

  const onSubmit = async (data: RequestFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.from('professional_activation_requests').insert({
        user_id: user.id,
        specialty_info: data.specialtyInfo,
        license_info: data.licenseInfo,
        contact_email: data.contactEmail,
        practice_address: data.practiceAddress,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: t('requestSubmitted'),
        description: t('professionalActivationRequestSubmitted'),
      });
      
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Failed to submit request:', error);
      toast({
        title: t('errorOccurred'),
        description: error.message || t('tryAgainLater'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('professionalActivationRequest')}</DialogTitle>
          <DialogDescription>
            {t('completeFormForProfessionalAccount')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="specialtyInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('medicalSpecialty')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('specialtyPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="licenseInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inpeOrLicenseNumber')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('professionalIdentificationNumber')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="practiceAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('practiceAddress')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('fullPracticeAddress')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contactEmail')}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('sending') : t('submitRequest')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestProfessionalActivation;
