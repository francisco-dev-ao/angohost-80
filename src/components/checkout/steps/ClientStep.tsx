
import React from "react";
import { User, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { OwnershipProfile } from "@/contexts/OwnershipContext";

interface ClientStepProps {
  profiles: any[];
  isLoadingProfiles: boolean;
  contactProfile: string | null;
  handleProfileChange: (profileId: string) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>>;
  createNewProfile: () => void;
  nextStep: () => void;
  completedSteps: Record<string, boolean>;
}

const ClientStep = ({
  profiles,
  isLoadingProfiles,
  contactProfile,
  handleProfileChange,
  formData,
  setFormData,
  createNewProfile,
  nextStep,
  completedSteps
}: ClientStepProps) => {
  
  if (isLoadingProfiles) {
    return <div className="text-center py-4">Carregando perfis de contato...</div>;
  }
  
  return (
    <>
      <CardTitle className="mb-4">Dados do Cliente</CardTitle>
      
      {profiles.length > 0 ? (
        <div className="space-y-4">
          <RadioGroup 
            value={contactProfile || undefined}
            onValueChange={handleProfileChange}
          >
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div 
                  key={profile.id} 
                  className={`flex items-center justify-between border rounded-md p-4 ${
                    contactProfile === profile.id ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={profile.id} id={`profile-${profile.id}`} />
                    <Label htmlFor={`profile-${profile.id}`} className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{profile.name}</span>
                    </Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profile.document}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
          <Button 
            type="button" 
            variant="outline"
            onClick={createNewProfile}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar novo perfil de contato
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="mb-4">Por favor, preencha seus dados para continuar:</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
          </div>
          <Button 
            type="button" 
            variant="link"
            onClick={createNewProfile}
            className="px-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ou crie um perfil de contato para utilizar futuramente
          </Button>
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button 
          type="button" 
          onClick={nextStep} 
          disabled={!completedSteps.client && profiles.length > 0 && !contactProfile}
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default ClientStep;
