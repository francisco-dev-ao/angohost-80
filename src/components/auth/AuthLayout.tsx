
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto bg-white border-gray-200 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex justify-center mb-4">
              <img
                src="https://deve.angohost.ao/assets/logo-white-70d3266b.png"
                alt="AngoHost Logo"
                className="h-8"
              />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <p className="text-gray-500">{subtitle}</p>
            </div>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 to-transparent z-10" />
        <img
          src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white max-w-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Sua Parceria de Confiança</h2>
            <p className="text-lg">Hospedagem de qualidade e suporte técnico 24/7 para o seu negócio online.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
