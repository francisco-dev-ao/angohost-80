
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LoginSession {
  id: string;
  created_at: string;
  ip_address: string;
  location: string;
  device_info: string;
}

const LoginHistory = () => {
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useSupabaseAuth();

  const fetchLoginHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Obter histórico de login do usuário atual
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error("Erro ao buscar histórico de login:", error);
        return;
      }
      
      setSessions(data || []);
    } catch (error) {
      console.error("Erro ao processar histórico de login:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
    
    // Configurar listener para atualizações em tempo real
    const channel = supabase
      .channel('login-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions',
          filter: user ? `user_id=eq.${user.id}` : undefined
        },
        () => {
          fetchLoginHistory();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Login</CardTitle>
        <CardDescription>
          Revise as atividades recentes de login na sua conta.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            Nenhum histórico de login encontrado.
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-2">Data/Hora</th>
                  <th className="text-left px-4 py-2">IP</th>
                  <th className="text-left px-4 py-2">Localização</th>
                  <th className="text-left px-4 py-2">Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={session.id} className={index % 2 === 1 ? "bg-muted/50" : "border-t"}>
                    <td className="px-4 py-3">{formatDate(session.created_at)}</td>
                    <td className="px-4 py-3">{session.ip_address || "Desconhecido"}</td>
                    <td className="px-4 py-3">{session.location || "Desconhecido"}</td>
                    <td className="px-4 py-3">{session.device_info || "Desconhecido"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Se você não reconhece algum desses logins, altere sua senha imediatamente e entre em contato com o suporte.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginHistory;
