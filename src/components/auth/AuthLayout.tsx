
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
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent z-10" />
        <img
          src="/lovable-uploads/f86d31c2-f867-4f8f-ad54-c5019ec784cc.png"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/70 to-transparent z-20">
          <div className="text-white max-w-lg mx-8">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Sua Parceria de Confiança
            </h2>
            <p className="text-xl leading-relaxed font-light">
              Hospedagem de qualidade e suporte técnico 24/7 para o seu negócio online.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto bg-white border-gray-200 shadow-lg">
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/e1925a90-87a8-4d79-be99-15c0a6db92a1.png"
                alt="AngoHost Logo"
                className="h-12"
              />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
