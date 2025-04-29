
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Session {
  id: string;
  user_id: string;
  created_at: string;
  ip_address: string;
  location: string;
  device_info: string;
}

interface UserSessionsProps {
  userId: string;
}

const UserSessions = ({ userId }: UserSessionsProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSessions(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar sessões:', error.message);
      toast.error('Não foi possível carregar o histórico de sessões');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Sessão removida com sucesso');
    } catch (error: any) {
      console.error('Erro ao remover sessão:', error.message);
      toast.error('Erro ao remover sessão');
    }
  };
  
  const clearAllSessions = async () => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      
      setSessions([]);
      toast.success('Todas as sessões foram removidas');
    } catch (error: any) {
      console.error('Erro ao limpar sessões:', error.message);
      toast.error('Erro ao limpar sessões');
    }
  };

  useEffect(() => {
    fetchSessions();
    
    // Configurar listener para atualizações em tempo real
    const channel = supabase
      .channel(`user-sessions-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          fetchSessions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {sessions.length} sessões encontradas
        </h3>
        {sessions.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={clearAllSessions}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar todas
          </Button>
        )}
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Nenhuma sessão encontrada para este usuário.
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-3 py-2">Data/Hora</th>
                <th className="text-left px-3 py-2">IP</th>
                <th className="text-left px-3 py-2">Localização</th>
                <th className="text-left px-3 py-2">Dispositivo</th>
                <th className="text-right px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-t">
                  <td className="px-3 py-2">
                    {format(new Date(session.created_at), "dd/MM/yyyy, HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-3 py-2">{session.ip_address || "Desconhecido"}</td>
                  <td className="px-3 py-2">{session.location || "Desconhecido"}</td>
                  <td className="px-3 py-2">{session.device_info || "Desconhecido"}</td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSession(session.id)}
                      title="Remover sessão"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserSessions;
