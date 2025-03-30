import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, AlertCircle, Info, User, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const loginSchema = z.object({
  email: z.string().email('Entrez une adresse email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Entrez une adresse email valide'),
});

const registerSchema = z.object({
  email: z.string().email('Entrez une adresse email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.enum(['patient', 'professional'], {
    required_error: "Veuillez sélectionner un rôle",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login: React.FC = () => {
  const { signIn, resetPassword, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [showSupabaseInfo, setShowSupabaseInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [rateLimited, setRateLimited] = useState(false);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'patient',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setRateLimited(false);
    try {
      await signIn(data.email, data.password);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Trop de tentatives')) {
        setRateLimited(true);
      }
      toast({
        title: "Erreur de connexion",
        description: error.message || "Erreur de connexion. Vérifiez vos identifiants.",
        variant: 'destructive',
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setRateLimited(false);
    try {
      await resetPassword(data.email);
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte email pour les instructions de réinitialisation du mot de passe. Cliquez sur le lien et vous serez redirigé vers cette application.",
        duration: 6000,
      });
      setResetDialogOpen(false);
      resetForm.reset();
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.message.includes('Trop de tentatives')) {
        setRateLimited(true);
      }
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer.",
        variant: 'destructive',
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setRateLimited(false);
    try {
      await signUp(data.email, data.password, {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
      });
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Veuillez vérifier votre boîte e-mail pour confirmer votre adresse avant de vous connecter.",
        duration: 8000,
      });
      setActiveTab("login");
      registerForm.reset();
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.message.includes('Trop de tentatives')) {
        setRateLimited(true);
      }
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Erreur lors de l'inscription. Veuillez réessayer.",
        variant: 'destructive',
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleSupabaseInfo = () => {
    setShowSupabaseInfo(!showSupabaseInfo);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-gradient-to-b from-medical-50 to-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-medical-900 mb-1">SIHATI</h1>
          <p className="text-medical-600">Services de Santé Numériques</p>
        </div>

        {rateLimited && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limitation de taux</AlertTitle>
            <AlertDescription>
              Vous avez effectué trop de requêtes en peu de temps. Veuillez patienter quelques minutes avant de réessayer.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center gap-2 mx-auto mb-4"
          onClick={toggleSupabaseInfo}
        >
          <Info size={16} />
          Informations de Connexion
        </Button>

        {showSupabaseInfo && (
          <Card className="mb-6 border-medical-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Informations Supabase</CardTitle>
              <CardDescription>Détails pour se connecter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">ID de projet Supabase:</p>
                <code className="bg-slate-100 p-1 rounded text-xs block mt-1 overflow-auto">kbpajbqktyojbkgdzjwu</code>
              </div>
              <Alert variant="default" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-xs font-medium">Comptes pré-créés</AlertTitle>
                <AlertDescription className="text-xs">
                  <p className="mb-1">Pour vous connecter avec un compte existant:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Email: <code>patient@test.com</code> / Mot de passe: <code>testpassword</code></li>
                    <li>Email: <code>doctor@test.com</code> / Mot de passe: <code>testpassword</code></li>
                  </ul>
                </AlertDescription>
              </Alert>
              <p className="text-xs text-muted-foreground">Si vous avez oublié votre mot de passe, utilisez l'option "Mot de passe oublié" ci-dessous.</p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              placeholder="votre@email.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm text-medical-600 hover:text-medical-800"
                    onClick={() => setResetDialogOpen(true)}
                  >
                    Mot de passe oublié?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-medical-600 hover:bg-medical-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              placeholder="Prénom"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              placeholder="Nom"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              placeholder="votre@email.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Type de compte</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50">
                              <RadioGroupItem value="patient" id="patient" />
                              <label htmlFor="patient" className="flex items-center gap-2 cursor-pointer">
                                <User className="h-5 w-5 text-medical-600" />
                                <div>
                                  <p className="font-medium">Patient</p>
                                  <p className="text-sm text-muted-foreground">Compte pour les patients</p>
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50">
                              <RadioGroupItem value="professional" id="professional" />
                              <label htmlFor="professional" className="flex items-center gap-2 cursor-pointer">
                                <Stethoscope className="h-5 w-5 text-medical-600" />
                                <div>
                                  <p className="font-medium">Professionnel de santé</p>
                                  <p className="text-sm text-muted-foreground">Compte pour les médecins et spécialistes</p>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-medical-600 hover:bg-medical-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Vous avez déjà un compte?{" "}
                  <button 
                    type="button" 
                    className="text-medical-600 hover:underline" 
                    onClick={() => setActiveTab("login")}
                  >
                    Se connecter
                  </button>
                </p>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre adresse email pour recevoir les instructions de réinitialisation.
            </DialogDescription>
          </DialogHeader>
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setResetDialogOpen(false)}
                  disabled={isLoading}
                  type="button"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer les instructions"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
