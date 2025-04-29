
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Auth = ({ type }: { type: 'login' | 'register' | 'forgot-password' }) => {
  const { user, loading, signIn, signUp, resetPassword } = useSupabaseAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from location state, if available
  const returnUrl = location.state?.returnUrl || '/client';
  const hasItemsInCart = items && items.length > 0;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If user is already logged in
    if (user) {
      // Check if there are items in the cart - prioritize redirecting to checkout
      if (hasItemsInCart) {
        toast.success('Você está logado e tem itens no seu carrinho.');
        navigate('/enhanced-checkout');
      } else {
        // Otherwise redirect to the return URL or client area
        navigate(returnUrl);
      }
    }
  }, [user, navigate, returnUrl, hasItemsInCart]);
  
  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Login realizado com sucesso');
      if (hasItemsInCart) {
        navigate('/enhanced-checkout');
      } else {
        navigate(returnUrl);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(`Erro ao realizar login: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegister = async (email: string, password: string, fullName: string) => {
    setIsSubmitting(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Cadastro realizado com sucesso');
      if (hasItemsInCart) {
        navigate('/enhanced-checkout');
      } else {
        navigate(returnUrl);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(`Erro ao realizar cadastro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleForgotPassword = async (email: string) => {
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      toast.success('Instruções de redefinição de senha enviadas para seu email');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(`Erro ao enviar instruções: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the appropriate form based on the type
  const renderForm = () => {
    switch (type) {
      case 'login':
        return <LoginForm onSubmit={handleLogin} isLoading={isSubmitting} returnUrl={hasItemsInCart ? '/enhanced-checkout' : returnUrl} />;
      case 'register':
        return <RegisterForm onSubmit={handleRegister} isLoading={isSubmitting} returnUrl={hasItemsInCart ? '/enhanced-checkout' : returnUrl} />;
      case 'forgot-password':
        return <ForgotPasswordForm onSubmit={handleForgotPassword} isLoading={isSubmitting} />;
      default:
        return <LoginForm onSubmit={handleLogin} isLoading={isSubmitting} returnUrl={hasItemsInCart ? '/enhanced-checkout' : returnUrl} />;
    }
  };
  
  const title = type === 'login' 
    ? 'Entre na sua conta' 
    : type === 'register' 
      ? 'Criar uma conta'
      : 'Recuperar senha';
      
  const subtitle = type === 'login'
    ? 'Faça login para continuar'
    : type === 'register'
      ? 'Preencha seus dados para criar uma conta'
      : 'Enviaremos instruções para redefinir sua senha';
  
  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {renderForm()}
    </AuthLayout>
  );
};

export default Auth;
