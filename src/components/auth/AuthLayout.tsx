
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
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
      
      {/* Right side - Auth Form */}
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
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
