
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import HomeService from "./pages/HomeService";
import Telehealth from "./pages/Telehealth";
import Login from "./pages/Login";
import Index from "./pages/Index";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import AppointmentManager from "./pages/professional/components/AppointmentManager";
import PatientsManager from "./pages/professional/components/PatientsManager";
import ConsultationManager from "./pages/professional/components/ConsultationManager";
import MessagingSystem from "./pages/professional/components/MessagingSystem";
import InvoiceManager from "./pages/professional/components/InvoiceManager";
import NotificationsPanel from "./pages/professional/components/NotificationsPanel";
import SettingsPanel from "./pages/professional/components/SettingsPanel";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode, 
  requiredRole: 'patient' | 'professional' 
}) => {
  const { userData, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userData.role !== requiredRole) {
    if (userData.role === 'professional') {
      return <Navigate to="/professional" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

// AppRoutes component to use the hooks
const AppRoutes = () => {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {userData?.role !== 'professional' && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Patient Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="patient"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute requiredRole="patient"><Appointments /></ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute requiredRole="patient"><Results /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          userData?.role === 'professional' 
            ? <Navigate to="/professional/settings" replace />
            : <Profile />
        } />
        <Route path="/home-service" element={
          <ProtectedRoute requiredRole="patient"><HomeService /></ProtectedRoute>
        } />
        <Route path="/telehealth" element={
          <ProtectedRoute requiredRole="patient"><Telehealth /></ProtectedRoute>
        } />
        
        {/* Professional Routes */}
        <Route path="/professional" element={
          <ProtectedRoute requiredRole="professional">
            <ProfessionalDashboard />
          </ProtectedRoute>
        } />
        <Route path="/professional/appointments" element={
          <ProtectedRoute requiredRole="professional">
            <AppointmentManager />
          </ProtectedRoute>
        } />
        <Route path="/professional/patients" element={
          <ProtectedRoute requiredRole="professional">
            <PatientsManager />
          </ProtectedRoute>
        } />
        <Route path="/professional/consultations" element={
          <ProtectedRoute requiredRole="professional">
            <ConsultationManager />
          </ProtectedRoute>
        } />
        <Route path="/professional/messages" element={
          <ProtectedRoute requiredRole="professional">
            <MessagingSystem />
          </ProtectedRoute>
        } />
        <Route path="/professional/billing" element={
          <ProtectedRoute requiredRole="professional">
            <InvoiceManager />
          </ProtectedRoute>
        } />
        <Route path="/professional/notifications" element={
          <ProtectedRoute requiredRole="professional">
            <NotificationsPanel />
          </ProtectedRoute>
        } />
        <Route path="/professional/settings" element={
          <ProtectedRoute requiredRole="professional">
            <SettingsPanel />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

// Main App function
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider delayDuration={300}>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
