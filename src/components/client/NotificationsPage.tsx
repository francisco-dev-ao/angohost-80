
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, ArrowRight, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  action_text?: string;
  related_type?: string;
  related_id?: string;
}

const NotificationsPage = () => {
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        toast.error('Erro ao carregar notificações');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Real-time notification update:', payload);
          fetchNotifications(); // Refresh data when notifications change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      
      toast.success('Todas as notificações marcadas como lidas');
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Erro ao marcar todas notificações como lidas');
    }
  };

  const handleAction = (notification: Notification) => {
    // Mark as read first
    markAsRead(notification.id);
    
    // If there's an action URL, navigate to it
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <Bell className="text-blue-500" size={24} />;
      case 'service':
        return <Bell className="text-green-500" size={24} />;
      case 'domain':
        return <Bell className="text-purple-500" size={24} />;
      case 'ticket':
        return <Bell className="text-orange-500" size={24} />;
      default:
        return <Bell className="text-gray-500" size={24} />;
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? 'es' : ''} não lida${unreadCount > 1 ? 's' : ''}` 
              : 'Nenhuma notificação não lida'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Marcar Todas como Lidas
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">Carregando notificações...</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? 'opacity-75' : 'border-l-4 border-l-primary'}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(notification.type)}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {notification.title}
                        {!notification.read && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                            Nova
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{notification.message}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => markAsRead(notification.id)}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle size={16} />
                    <span>Marcar como lida</span>
                  </Button>
                )}
                
                {notification.action_url && notification.action_text && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAction(notification)}
                    className="flex items-center gap-1"
                  >
                    <span>{notification.action_text}</span>
                    <ArrowRight size={16} />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Nenhuma notificação encontrada</CardTitle>
            <CardDescription>
              Você não possui notificações no momento.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
