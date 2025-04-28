
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [tab, setTab] = useState('login');
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || '/client';
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerFullName, setRegisterFullName] = useState(''); // Added full name state
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { signIn, signUp, user } = useSupabaseAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      toast.success('Você já está logado');
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      await signIn(loginEmail, loginPassword);
      toast.success('Login realizado com sucesso');
      navigate(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsRegistering(true);
    
    try {
      await signUp(registerEmail, registerPassword, registerFullName); // Added the full name parameter
      toast.success('Cadastro realizado com sucesso');
      navigate(returnUrl);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1A1F2C]">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1F2C]/80 to-transparent z-10" />
        <img
          src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right side - Login/Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center mb-8">
              <img
                src="https://deve.angohost.ao/assets/logo-white-70d3266b.png"
                alt="AngoHost Logo"
                className="h-8"
              />
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="text-white">Entrar</TabsTrigger>
                <TabsTrigger value="register" className="text-white">Registrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="nome@exemplo.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Senha</Label>
                    <div className="relative">
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-white/10 border-white/10 text-white placeholder:text-white/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-white" 
                    type="submit" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Added full name field */}
                  <div className="space-y-2">
                    <Label htmlFor="register-fullname" className="text-white">Nome Completo</Label>
                    <Input 
                      id="register-fullname" 
                      type="text" 
                      placeholder="Seu nome completo"
                      value={registerFullName}
                      onChange={(e) => setRegisterFullName(e.target.value)}
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="nome@exemplo.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white">Senha</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-white">Confirmar Senha</Label>
                    <Input 
                      id="register-confirm-password" 
                      type="password" 
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-white" 
                    type="submit" 
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Registrando...' : 'Registrar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
