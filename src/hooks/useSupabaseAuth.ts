
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Login realizado com sucesso!');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar login');
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // If successful, create or update the profile record
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: fullName,
            email: email,
            role: 'customer' // Default role
          });

        if (profileError) {
          throw profileError;
        }
      }

      toast.success('Cadastro realizado com sucesso!');
      return authData;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar cadastro');
      throw error;
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao solicitar redefinição de senha');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Sessão encerrada com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao encerrar sessão');
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    resetPassword: handleResetPassword,
    signOut: handleSignOut,
  };
};
