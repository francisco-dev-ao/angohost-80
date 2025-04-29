import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Auth = ({ type }: { type: 'login' | 'register' | 'forgot-password' }) => {
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from location state, if available
  const returnUrl = location.state?.returnUrl || '/client';
  const hasItemsInCart = items && items.length > 0;

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
  
  // Render the appropriate form based on the type
  const renderForm = () => {
    switch (type) {
      case 'login':
        return <LoginForm returnUrl={hasItemsInCart ? '/enhanced-checkout' : returnUrl} />;
      case 'register':
        return <RegisterForm returnUrl={hasItemsInCart ? '/enhanced-checkout' : returnUrl} />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
      default:
        return <LoginForm returnUrl={hasItemsInCart ? '/enhanced-checkout' : returnUrl} />;
    }
  };
  
  return (
    <AuthLayout>
      {renderForm()}
    </AuthLayout>
  );
};

export default Auth;
