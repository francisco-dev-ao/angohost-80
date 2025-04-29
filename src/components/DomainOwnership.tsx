
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNifValidation } from '@/hooks/useNifValidation';
import { Loader2 } from 'lucide-react';

interface DomainOwnershipProps {
  domain: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (domain: string, data: any) => void;
}

const DomainOwnership = ({ domain, isOpen, onClose, onSubmit }: DomainOwnershipProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    phone: '',
    address: '',
    nif: ''
  });
  const { validateNif, validating } = useNifValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNifValidation = async () => {
    if (!formData.nif) {
      toast.error('Por favor, insira o NIF para validação');
      return;
    }

    const result = await validateNif(formData.nif);
    
    if (result.name) {
      setFormData(prev => ({
        ...prev,
        name: result.name,
        address: result.address || prev.address,
        document: prev.nif // Set the document field to the NIF value
      }));
      toast.success('NIF validado com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.document || !formData.phone || !formData.address) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    onSubmit(domain, formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dados de Titularidade do Domínio</DialogTitle>
          <DialogDescription>
            Preencha os dados do responsável pelo domínio {domain ? domain : ""}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="nif">NIF</Label>
              <div className="flex gap-2">
                <Input
                  id="nif"
                  name="nif"
                  value={formData.nif}
                  onChange={handleChange}
                  placeholder="Insira o NIF"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleNifValidation}
                  disabled={validating || !formData.nif}
                >
                  {validating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Validar'
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome completo"
              readOnly={!!formData.name && !!formData.nif}
              className={formData.name && formData.nif ? "bg-muted" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nome@exemplo.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document">Documento</Label>
              <Input
                id="document"
                name="document"
                value={formData.document}
                onChange={handleChange}
                placeholder="Documento (BI, Passaporte)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+244 XXX XXX XXX"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Endereço completo"
              readOnly={!!formData.address && !!formData.nif}
              className={formData.address && formData.nif ? "bg-muted" : ""}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DomainOwnership;
