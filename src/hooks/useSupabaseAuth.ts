
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLoginTracker } from './useLoginTracker';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  
  // Integra o rastreador de login
  useLoginTracker(user?.id);

  // Verifica se um usuário é administrador
  const checkAdminStatus = async (userId: string) => {
    try {
      // Métodos para verificar se é admin:
      // 1. Verificar se o e-mail é support@angohost.ao (super admin)
      if (user?.email === 'support@angohost.ao') {
        setIsAdmin(true);
        return true;
      }
      
      // 2. Verificar meta dados do usuário
      if (user?.user_metadata?.role === 'admin') {
        setIsAdmin(true);
        return true;
      }
      
      // 3. Verificar a tabela profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!error && profile?.role === 'admin') {
        setIsAdmin(true);
        return true;
      }
      
      // 4. Verificar no campo admin_permissions
      const { data: permissions, error: permError } = await supabase
        .from('admin_permissions')
        .select('full_access')
        .eq('user_id', userId)
        .single();
      
      if (!permError && permissions?.full_access === true) {
        setIsAdmin(true);
        return true;
      }
      
      setIsAdmin(false);
      return false;
    } catch (error) {
      console.error('Erro ao verificar status de administrador:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        setUser(session.user);
        
        // Verificar status de administrador
        await checkAdminStatus(session.user.id);
        
        // Automatically activate all features when a user logs in
        await activateAllFeaturesForUser(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && session.user) {
        setUser(session.user);
        
        // Verificar status de administrador
        await checkAdminStatus(session.user.id);
        
        // Automatically activate all features for existing sessions
        await activateAllFeaturesForUser(session.user.id);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to activate all features for a user
  const activateAllFeaturesForUser = async (userId: string) => {
    try {
      // Check if user has feature settings
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_feature_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // If the user doesn't have settings yet or there was an error finding them
      if (checkError || !existingSettings) {
        // Create default settings with all features enabled
        await supabase
          .from('user_feature_settings')
          .upsert({
            user_id: userId,
            features_enabled: {
              dashboard: true,
              domains: true,
              services: true,
              invoices: true,
              tickets: true,
              wallet: true,
              notifications: true,
              promotions: true,
              orders: true,
              contact_profiles: true,
              payment_methods: true,
              admin_access: true  // For admin users
            },
            last_updated: new Date().toISOString()
          });
      }
      
      // Also ensure profile is active
      await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', userId);
        
    } catch (error) {
      console.error("Error activating features:", error);
    }
  };

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
      
      if (data.user) {
        // Verificar status de administrador após login
        await checkAdminStatus(data.user.id);
      }
      
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
            role: 'customer', // Default role
            is_active: true   // Always set to active by default
          });

        if (profileError) {
          throw profileError;
        }
        
        // Activate all features for new user
        await activateAllFeaturesForUser(authData.user.id);
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
      
      setIsAdmin(false);
      toast.success('Sessão encerrada com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao encerrar sessão');
      throw error;
    }
  };

  return {
    user,
    loading,
    isAdmin,
    signIn: handleSignIn,
    signUp: handleSignUp,
    resetPassword: handleResetPassword,
    signOut: handleSignOut,
    checkAdminStatus
  };
};
