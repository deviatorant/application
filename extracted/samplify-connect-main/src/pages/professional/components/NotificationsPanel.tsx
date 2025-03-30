
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Users, 
  FileText,
  Info,
  Check
} from 'lucide-react';
import { format, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Notification } from '@/lib/supabase/schema';

// Sample data for demonstration
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'prof-1',
    title: 'Nouveau rendez-vous',
    content: 'M. Ali a pris rendez-vous pour demain à 14:30',
    type: 'appointment',
    related_id: 'apt-1',
    is_read: false,
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString() // 25 minutes ago
  },
  {
    id: 'notif-2',
    user_id: 'prof-1',
    title: 'Nouveau message',
    content: 'Mme Fatima vous a envoyé un message concernant son traitement',
    type: 'message',
    related_id: 'msg-1',
    is_read: false,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
  },
  {
    id: 'notif-3',
    user_id: 'prof-1',
    title: 'Rappel de rendez-vous',
    content: 'Vous avez un rendez-vous avec M. Karim dans 1 heure',
    type: 'appointment',
    related_id: 'apt-2',
    is_read: true,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
  },
  {
    id: 'notif-4',
    user_id: 'prof-1',
    title: 'Nouvelle facture',
    content: 'Une nouvelle facture a été générée pour Mme Sara',
    type: 'system',
    related_id: 'inv-1',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'notif-5',
    user_id: 'prof-1',
    title: 'Consultation terminée',
    content: 'La consultation avec M. Mohammed a été terminée avec succès',
    type: 'system',
    is_read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  }
];

const NotificationsPanel: React.FC = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    appointments: true,
    messages: true,
    system: true
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const minutesDiff = differenceInMinutes(now, date);
    if (minutesDiff < 60) {
      return `${minutesDiff} ${minutesDiff === 1 ? t('minute') : t('minutes')}`;
    }
    
    const hoursDiff = differenceInHours(now, date);
    if (hoursDiff < 24) {
      return `${hoursDiff} ${hoursDiff === 1 ? t('hour') : t('hours')}`;
    }
    
    const daysDiff = differenceInDays(now, date);
    return `${daysDiff} ${daysDiff === 1 ? t('day') : t('days')}`;
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, is_read: true } : notif
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar size={16} className="text-blue-500" />;
      case 'message':
        return <MessageSquare size={16} className="text-green-500" />;
      case 'system':
      default:
        return <Info size={16} className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('notifications')}</h1>
          <p className="text-muted-foreground">{t('manageNotifications')}</p>
        </div>
        
        <Button variant="outline" onClick={handleMarkAllRead}>
          <Check size={16} className="mr-2" />
          {t('markAllAsRead')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('recentNotifications')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "flex gap-3 p-3 rounded-lg transition-colors",
                        notification.is_read 
                          ? "bg-card" 
                          : "bg-blue-50 hover:bg-blue-100"
                      )}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className={cn(
                            "font-medium",
                            !notification.is_read && "font-semibold"
                          )}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatTimeAgo(notification.created_at)} {t('ago')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.content}
                        </p>
                      </div>
                      
                      {!notification.is_read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 flex-shrink-0"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {t('markRead')}
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <Bell size={40} className="mx-auto mb-4 text-muted-foreground/60" />
                    <p>{t('noNotifications')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('notificationSettings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">{t('deliveryMethods')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={16} />
                      <span>{t('pushNotifications')}</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.push} 
                      onCheckedChange={(value) => setNotificationSettings({
                        ...notificationSettings,
                        push: value
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      <span>{t('emailNotifications')}</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.email} 
                      onCheckedChange={(value) => setNotificationSettings({
                        ...notificationSettings,
                        email: value
                      })}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-3">
                  <h3 className="font-medium">{t('notificationTypes')}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{t('appointments')}</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.appointments} 
                      onCheckedChange={(value) => setNotificationSettings({
                        ...notificationSettings,
                        appointments: value
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      <span>{t('messages')}</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.messages} 
                      onCheckedChange={(value) => setNotificationSettings({
                        ...notificationSettings,
                        messages: value
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info size={16} />
                      <span>{t('systemNotifications')}</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.system} 
                      onCheckedChange={(value) => setNotificationSettings({
                        ...notificationSettings,
                        system: value
                      })}
                    />
                  </div>
                </div>
                
                <Button className="w-full">
                  {t('saveSettings')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
