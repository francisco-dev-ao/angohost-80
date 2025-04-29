
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UAParser from 'ua-parser-js';

export const useLoginTracker = (userId?: string) => {
  useEffect(() => {
    const trackLogin = async () => {
      if (!userId) return;
      
      try {
        // Analisar o user-agent para obter informações do dispositivo
        const parser = new UAParser(window.navigator.userAgent);
        const browserName = parser.getBrowser().name || 'Desconhecido';
        const osName = parser.getOS().name || 'Desconhecido';
        const deviceInfo = `${browserName} / ${osName}`;
        
        // Obter endereço IP e localização (simulação - em produção, isso viria de um serviço)
        // Na prática real, isso seria determinado pelo servidor
        const ipAddress = '192.168.1.1'; // Simulação
        const location = 'Lisboa, Portugal'; // Simulação
        
        // Registrar a sessão
        const { error } = await supabase
          .from('user_sessions')
          .insert([
            {
              user_id: userId,
              ip_address: ipAddress,
              location: location,
              device_info: deviceInfo
            }
          ]);
          
        if (error) {
          console.error('Erro ao registrar sessão de login:', error);
        }
      } catch (error) {
        console.error('Erro ao processar dados de login:', error);
      }
    };
    
    trackLogin();
  }, [userId]);
};
