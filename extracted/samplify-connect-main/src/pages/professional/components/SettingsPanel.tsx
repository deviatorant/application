
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  Lock,
  Globe,
  Save
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const profileSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  specialty: z.string().min(2, { message: 'Specialty is required' }),
  licenseNumber: z.string().min(2, { message: 'License number is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  bio: z.string().optional(),
  languages: z.string().optional()
});

const securitySchema = z.object({
  currentPassword: z.string().min(6, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const timeSlotSchema = z.object({
  monday: z.boolean().default(true),
  tuesday: z.boolean().default(true),
  wednesday: z.boolean().default(true),
  thursday: z.boolean().default(true),
  friday: z.boolean().default(true),
  saturday: z.boolean().default(false),
  sunday: z.boolean().default(false),
  startTime: z.string().default('09:00'),
  endTime: z.string().default('17:00'),
  slotDuration: z.number().default(30),
  breakStart: z.string().default('12:00'),
  breakEnd: z.string().default('13:00')
});

const SettingsPanel: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Mohammed',
      lastName: 'El Mansouri',
      email: 'mohammed@example.com',
      phone: '+212612345678',
      specialty: 'Médecine générale',
      licenseNumber: 'INPE123456',
      address: '123 Rue Principale, Casablanca, Maroc',
      bio: 'Médecin généraliste avec 10 ans d\'expérience.',
      languages: 'Français, Arabe, Anglais'
    }
  });

  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const schedulingForm = useForm<z.infer<typeof timeSlotSchema>>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      breakStart: '12:00',
      breakEnd: '13:00'
    }
  });

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    console.log(data);
    // In a real app, update profile in the database
  };

  const onSecuritySubmit = (data: z.infer<typeof securitySchema>) => {
    console.log(data);
    // In a real app, update password in the database
  };

  const onSchedulingSubmit = (data: z.infer<typeof timeSlotSchema>) => {
    console.log(data);
    // In a real app, update scheduling settings in the database
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <p className="text-muted-foreground">{t('manageSettings')}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full mb-6">
          <TabsTrigger value="profile">{t('profileSettings')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="scheduling">{t('scheduling')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('profileInformation')}</CardTitle>
              <CardDescription>
                {t('updateProfileInformation')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
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
                      control={profileForm.control}
                      name="lastName"
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
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('email')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
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
                    
                    <FormField
                      control={profileForm.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('specialty')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('licenseNumber')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('practiceAddress')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('biography')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          {t('bioDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('languages')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          {t('languagesDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">
                    <Save size={16} className="mr-2" />
                    {t('saveChanges')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('securitySettings')}</CardTitle>
              <CardDescription>
                {t('updatePasswordSettings')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('currentPassword')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('newPassword')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t('passwordRequirements')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('confirmPassword')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">
                    <Lock size={16} className="mr-2" />
                    {t('updatePassword')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduling">
          <Card>
            <CardHeader>
              <CardTitle>{t('schedulingSettings')}</CardTitle>
              <CardDescription>
                {t('configureAvailability')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...schedulingForm}>
                <form onSubmit={schedulingForm.handleSubmit(onSchedulingSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">{t('workingDays')}</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <FormField
                          key={day}
                          control={schedulingForm.control}
                          name={day as any}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t(day)}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('workingHours')}</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={schedulingForm.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('startTime')}</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={schedulingForm.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('endTime')}</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('breakTime')}</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={schedulingForm.control}
                          name="breakStart"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('startTime')}</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={schedulingForm.control}
                          name="breakEnd"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('endTime')}</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <FormField
                    control={schedulingForm.control}
                    name="slotDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('appointmentDuration')} ({t('minutes')})</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))} 
                          />
                        </FormControl>
                        <FormDescription>
                          {t('appointmentDurationDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">
                    <Clock size={16} className="mr-2" />
                    {t('saveSchedule')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t('preferences')}</CardTitle>
              <CardDescription>
                {t('preferencesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">{t('language')}</h3>
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant={language === 'fr' ? 'default' : 'outline'}
                      onClick={() => setLanguage('fr')}
                      className="flex items-center space-x-2"
                    >
                      <Globe size={16} />
                      <span>Français</span>
                    </Button>
                    
                    <Button 
                      variant={language === 'ar' ? 'default' : 'outline'}
                      onClick={() => setLanguage('ar')}
                      className="flex items-center space-x-2"
                    >
                      <Globe size={16} />
                      <span>العربية</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="font-medium">{t('notifications')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('emailNotifications')}</p>
                      <p className="text-sm text-muted-foreground">{t('emailNotificationsDescription')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('appointment')} {t('reminders')}</p>
                      <p className="text-sm text-muted-foreground">{t('appointmentRemindersDescription')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('marketingEmails')}</p>
                      <p className="text-sm text-muted-foreground">{t('marketingEmailsDescription')}</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Button>
                  <Save size={16} className="mr-2" />
                  {t('savePreferences')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
