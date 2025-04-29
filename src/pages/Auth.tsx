
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || '/client';
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  const { signIn, signUp, resetPassword, user } = useSupabaseAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      toast.success('Você já está logado');
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoggingIn(true);
    try {
      await signIn(email, password);
      toast.success('Login realizado com sucesso');
      navigate(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (email: string, password: string, fullName: string) => {
    setIsRegistering(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Cadastro realizado com sucesso');
      setTab('login');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        toast.error('Este e-mail já está cadastrado. Faça login ou recupere sua senha.');
      } else {
        toast.error('Erro ao realizar cadastro');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsResettingPassword(true);
    try {
      await resetPassword(email);
      toast.success('Enviamos um e-mail com instruções para redefinir sua senha');
      setTab('login');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Erro ao solicitar redefinição de senha');
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Definição de títulos e subtítulos
  const getTitleAndSubtitle = () => {
    switch (tab) {
      case 'login':
        return {
          title: "Acesse a sua conta",
          subtitle: "Bem-vindo de volta! Por favor, insira seus detalhes."
        };
      case 'register':
        return {
          title: "Criar nova conta",
          subtitle: "Por favor, insira seus dados para criar uma conta."
        };
      case 'resetPassword':
        return {
          title: "Recuperar senha",
          subtitle: "Informe seu e-mail e enviaremos instruções para redefinir sua senha."
        };
      default:
        return {
          title: "Acesse a sua conta",
          subtitle: "Bem-vindo de volta! Por favor, insira seus detalhes."
        };
    }
  };

  const { title, subtitle } = getTitleAndSubtitle();

  return (
    <AuthLayout 
      title={title}
      subtitle={subtitle}
    >
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="login" className="text-gray-700">Entrar</TabsTrigger>
          <TabsTrigger value="register" className="text-gray-700">Criar Conta</TabsTrigger>
          <TabsTrigger value="resetPassword" className="text-gray-700">Recuperar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSubmit={handleLogin} isLoading={isLoggingIn} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm onSubmit={handleRegister} isLoading={isRegistering} />
        </TabsContent>

        <TabsContent value="resetPassword">
          <ForgotPasswordForm onSubmit={handleResetPassword} isLoading={isResettingPassword} />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
