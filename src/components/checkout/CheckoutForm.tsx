
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from '@/contexts/CartContext';
import { useSaveOrder } from '@/hooks/useSaveOrder';
import { useContactProfiles } from '@/hooks/useContactProfiles';
import { toast } from 'sonner';
import { Check, CreditCard, PlusCircle, User, Banknote, FileInvoice } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from "@/components/ui/switch";

interface CheckoutFormProps {
  onComplete?: (orderId: string) => void;
}

const CheckoutForm = ({ onComplete }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  const { saveCartAsOrder, isSaving } = useSaveOrder();
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedContactProfile, setSelectedContactProfile] = useState<string | null>(null);
  const [skipPayment, setSkipPayment] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, phone, address')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setFormData({
            name: data.full_name || user.user_metadata?.full_name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        } else {
          setFormData({
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: '',
            address: '',
          });
        }
        setProfileLoaded(true);
      };
      
      fetchUserProfile();
      fetchPaymentMethods();
    }
  }, [user]);

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setSelectedContactProfile(profiles[0].id);
    }
  }, [profiles]);

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      let defaultMethods = [
        { 
          id: 'bank_transfer_option', 
          name: 'Transferência Bancária', 
          is_active: true,
          payment_type: 'bank_transfer',
          description: 'Pague por transferência bancária e envie o comprovante'
        }
      ];
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      
      const allMethods = [...defaultMethods, ...(data || [])];
      setPaymentMethods(allMethods);
      
      const defaultMethod = allMethods.find(m => m.payment_type === 'bank_transfer');
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      } else if (allMethods.length > 0) {
        setSelectedPaymentMethod(allMethods[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erro ao carregar métodos de pagamento');
      
      const bankTransfer = { 
        id: 'bank_transfer_option', 
        name: 'Transferência Bancária', 
        is_active: true,
        payment_type: 'bank_transfer',
        description: 'Pague por transferência bancária e envie o comprovante'
      };
      setPaymentMethods([bankTransfer]);
      setSelectedPaymentMethod('bank_transfer_option');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/register');
      return;
    }
    
    if (!skipPayment && !selectedPaymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }
    
    if (hasDomains() && !selectedContactProfile) {
      toast.error('Selecione um perfil de contato para titularidade dos domínios');
      return;
    }
    
    try {
      const orderData = {
        paymentMethodId: skipPayment ? null : selectedPaymentMethod,
        contactProfileId: selectedContactProfile,
        skipPayment: skipPayment,
        clientDetails: selectedContactProfile 
          ? profiles.find(p => p.id === selectedContactProfile) 
          : { name: formData.name, email: formData.email, phone: formData.phone, address: formData.address }
      };
      
      const order = await saveCartAsOrder(orderData);
      if (order) {
        onComplete?.(order.id);
        
        if (skipPayment) {
          toast.success('Pedido criado com sucesso! Uma fatura foi gerada na sua área de cliente.');
        } else {
          toast.success('Pedido criado com sucesso! Aguardando pagamento.');
        }
        navigate(`/client/orders?order=${order.id}`);
      }
    } catch (error: any) {
      toast.error('Erro ao processar o pedido: ' + error.message);
    }
  };

  const hasDomains = () => {
    return items.some(item => item.type === 'domain');
  };

  const createNewProfile = () => {
    navigate('/client/contact-profiles?returnTo=/checkout');
  };

  const needsFormInput = !formData.phone || !formData.address;

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carrinho vazio</CardTitle>
          <CardDescription>Não há itens para finalizar a compra</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/domains')}>Voltar para loja</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {hasDomains() && (
          <Card>
            <CardHeader>
              <CardTitle>Perfil de Contato</CardTitle>
              <CardDescription>
                Selecione um perfil de contato para titularidade dos domínios
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProfiles ? (
                <div className="text-center py-4">Carregando perfis de contato...</div>
              ) : profiles.length > 0 ? (
                <RadioGroup 
                  value={selectedContactProfile || undefined}
                  onValueChange={setSelectedContactProfile}
                >
                  <div className="space-y-4">
                    {profiles.map((profile) => (
                      <div 
                        key={profile.id} 
                        className={`flex items-center justify-between border rounded-md p-4 ${
                          selectedContactProfile === profile.id ? 'border-primary' : 'border-gray-200'
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
              ) : (
                <div className="text-center py-4 space-y-4">
                  <p>Você não possui perfis de contato cadastrados</p>
                </div>
              )}
              <div className="mt-4">
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
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
            <CardDescription>Informações para faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  disabled={true}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled={true}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  disabled={profileLoaded}
                  className={profileLoaded ? "bg-muted" : ""}
                />
                {profileLoaded && formData.phone && (
                  <p className="text-xs text-muted-foreground">
                    Para alterar, contate o suporte
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  disabled={profileLoaded}
                  className={profileLoaded ? "bg-muted" : ""}
                />
                {profileLoaded && formData.address && (
                  <p className="text-xs text-muted-foreground">
                    Para alterar, contate o suporte
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opções de Pagamento</CardTitle>
            <CardDescription>Selecione como deseja prosseguir com o pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6 border p-4 rounded-md">
              <Switch 
                id="skip-payment" 
                checked={skipPayment}
                onCheckedChange={setSkipPayment}
              />
              <Label htmlFor="skip-payment" className="flex items-center cursor-pointer">
                <FileInvoice className="h-4 w-4 mr-2" />
                Gerar apenas fatura (sem pagamento imediato)
              </Label>
            </div>
            
            {!skipPayment && (
              <>
                {loading ? (
                  <div className="text-center py-4">Carregando métodos de pagamento...</div>
                ) : paymentMethods.length > 0 ? (
                  <RadioGroup 
                    value={selectedPaymentMethod || undefined}
                    onValueChange={setSelectedPaymentMethod}
                  >
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id} 
                          className={`flex items-center justify-between border rounded-md p-4 ${
                            selectedPaymentMethod === method.id ? 'border-primary' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                            <Label htmlFor={`payment-${method.id}`} className="flex items-center space-x-2">
                              {method.payment_type === 'bank_transfer' ? (
                                <Banknote className="h-4 w-4" />
                              ) : (
                                <CreditCard className="h-4 w-4" />
                              )}
                              <span>
                                {method.name || 'Método de Pagamento'} 
                                {method.payment_type === 'bank_transfer' && (
                                  <span className="ml-2 text-sm text-muted-foreground">(Padrão)</span>
                                )}
                              </span>
                            </Label>
                          </div>
                          {method.description && (
                            <div className="hidden md:block text-sm text-muted-foreground">
                              {method.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description && (
                        <p className="md:hidden text-sm text-muted-foreground">
                          {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description}
                        </p>
                      )}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4 space-y-4">
                    <p>Nenhum método de pagamento disponível</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => navigate('/cart')}>
              Voltar para o carrinho
            </Button>
            <Button type="submit" disabled={isSaving || (!skipPayment && paymentMethods.length === 0)}>
              {isSaving ? 'Processando...' : 'Finalizar compra'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default CheckoutForm;
