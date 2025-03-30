
import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Send, Paperclip, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Message, ProfessionalPatient } from '@/lib/supabase/schema';

// Sample data for demonstration
const mockPatients: ProfessionalPatient[] = Array.from({ length: 5 }, (_, i) => ({
  id: `pat-${i}`,
  professional_id: 'prof-1',
  first_name: `Prénom${i}`,
  last_name: `Nom${i}`,
  email: `patient${i}@example.com`,
  phone: `+212612345${i.toString().padStart(2, '0')}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

const mockMessages: Message[] = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `msg-${i}`,
    professional_id: 'prof-1',
    patient_id: `pat-${i % 5}`,
    sender_type: i % 3 === 0 ? 'professional' : 'patient',
    content: `Ceci est un message ${i} de test. ${i % 3 === 0 ? 'Envoyé par le professionnel.' : 'Envoyé par le patient.'}`,
    is_read: i < 8,
    created_at: new Date(2023, 10, 20, 10 + i, i * 5).toISOString(),
    patient: {
      first_name: `Prénom${i % 5}`,
      last_name: `Nom${i % 5}`
    }
  }))
];

const MessagingSystem: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<ProfessionalPatient[]>(mockPatients);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by patient
  const messagesByPatient = messages.reduce((acc, message) => {
    if (!acc[message.patient_id]) {
      acc[message.patient_id] = [];
    }
    acc[message.patient_id].push(message);
    return acc;
  }, {} as Record<string, Message[]>);
  
  // Sort patients by latest message
  const sortedPatients = patients.map(patient => {
    const patientMessages = messagesByPatient[patient.id] || [];
    const latestMessage = patientMessages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
    const unreadCount = patientMessages.filter(
      msg => !msg.is_read && msg.sender_type === 'patient'
    ).length;
    
    return {
      ...patient,
      latestMessage,
      unreadCount
    };
  }).sort((a, b) => {
    if (!a.latestMessage) return 1;
    if (!b.latestMessage) return -1;
    return new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime();
  });
  
  const filteredPatients = sortedPatients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const currentPatientMessages = selectedPatientId 
    ? messagesByPatient[selectedPatientId]?.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ) 
    : [];

  // Check viewport size on mount and window resize
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    return () => window.removeEventListener('resize', checkViewport);
  }, []);
  
  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentPatientMessages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPatientId) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      professional_id: 'prof-1',
      patient_id: selectedPatientId,
      sender_type: 'professional',
      content: newMessage,
      is_read: true,
      created_at: new Date().toISOString(),
      patient: patients.find(p => p.id === selectedPatientId) ? {
        first_name: patients.find(p => p.id === selectedPatientId)!.first_name,
        last_name: patients.find(p => p.id === selectedPatientId)!.last_name
      } : undefined
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    
    // Mark messages as read
    setMessages(messages.map(msg => 
      msg.patient_id === patientId && msg.sender_type === 'patient' && !msg.is_read
        ? { ...msg, is_read: true }
        : msg
    ));
    
    if (isMobileView) {
      setShowConversation(true);
    }
  };
  
  const handleBackToPatients = () => {
    setShowConversation(false);
  };

  const formattedDate = (dateString: string) => {
    const today = new Date();
    const messageDate = new Date(dateString);
    
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return format(messageDate, 'HH:mm');
    }
    
    return format(messageDate, 'dd/MM/yyyy');
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full">
        {/* Patient list - hidden on mobile when conversation is shown */}
        <div className={cn(
          "w-full md:w-1/3 border-r",
          isMobileView && showConversation ? "hidden" : "block"
        )}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold mb-4">{t('messages')}</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchPatients')}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={cn(
                      "flex items-center p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedPatientId === patient.id && "bg-muted",
                      patient.unreadCount > 0 && "bg-blue-50 hover:bg-blue-100"
                    )}
                    onClick={() => handleSelectPatient(patient.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="font-medium text-primary">
                        {patient.first_name[0]}{patient.last_name[0]}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        {patient.latestMessage && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {formattedDate(patient.latestMessage.created_at)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        {patient.unreadCount > 0 && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                        )}
                        <p className="text-sm text-muted-foreground truncate">
                          {patient.latestMessage?.content || t('noMessages')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {t('noConversationsFound')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Conversation - hidden on mobile when patient list is shown */}
        <div className={cn(
          "w-full md:w-2/3 flex flex-col",
          isMobileView && !showConversation ? "hidden" : "block"
        )}>
          {selectedPatientId ? (
            <>
              <div className="p-4 border-b flex items-center">
                {isMobileView && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-2"
                    onClick={handleBackToPatients}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary">
                    {selectedPatient?.first_name[0]}{selectedPatient?.last_name[0]}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-medium">
                    {selectedPatient?.first_name} {selectedPatient?.last_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedPatient?.email}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentPatientMessages.length > 0 ? (
                  currentPatientMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[75%] p-3 rounded-lg",
                        message.sender_type === 'professional'
                          ? "bg-primary text-primary-foreground ml-auto rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      <p>{message.content}</p>
                      <div className={cn(
                        "text-xs mt-1",
                        message.sender_type === 'professional'
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}>
                        {formattedDate(message.created_at)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t('startConversation')}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder={t('typeMessage')}
                    className="min-h-[80px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="rounded-full h-10 w-10" onClick={handleSendMessage}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {t('selectConversation')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
