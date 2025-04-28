
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Copy, AlertCircle, CheckCircle, Calendar } from "lucide-react";

interface Promotion {
  id: string;
  code: string;
  description: string;
  discount_amount?: number;
  discount_percent?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  minimum_order_value?: number;
  applies_to?: {
    product_ids?: string[];
    categories?: string[];
  };
  created_at: string;
}

const PromotionsPage = () => {
  const { user } = useSupabaseAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch active promotions
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Filter promotions that are currently valid (within date range)
        const now = new Date();
        const validPromotions = data?.filter(promo => {
          const startDateValid = !promo.start_date || new Date(promo.start_date) <= now;
          const endDateValid = !promo.end_date || new Date(promo.end_date) >= now;
          return startDateValid && endDateValid;
        }) || [];
        
        setPromotions(validPromotions);
      } catch (error: any) {
        console.error('Error fetching promotions:', error);
        toast.error('Erro ao carregar promoções');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotions();
  }, [user]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código promocional copiado!');
  };

  const checkPromoCode = async () => {
    if (!promoCode.trim() || !user) {
      toast.error('Digite um código promocional válido');
      return;
    }
    
    try {
      // First check if the promotion exists
      const { data: promoData, error: promoError } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', promoCode.trim())
        .eq('is_active', true)
        .single();
        
      if (promoError || !promoData) {
        toast.error('Código promocional não encontrado ou inválido');
        return;
      }
      
      // Check if the user can use this promotion (custom function in Supabase)
      const { data: canUseData, error: canUseError } = await supabase
        .rpc('can_use_promotion', { 
          _user_id: user.id, 
          _promotion_id: promoData.id 
        });
        
      if (canUseError) {
        throw canUseError;
      }
      
      if (canUseData) {
        toast.success('Código promocional válido! Você pode usar este cupom.');
      } else {
        toast.error('Este código não pode ser usado (já utilizado ou expirado)');
      }
    } catch (error: any) {
      console.error('Error checking promo code:', error);
      toast.error('Erro ao verificar código promocional');
    }
  };

  const formatDiscount = (promotion: Promotion) => {
    if (promotion.discount_percent) {
      return `${promotion.discount_percent}% de desconto`;
    }
    
    if (promotion.discount_amount) {
      return `${new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(promotion.discount_amount)} de desconto`;
    }
    
    return 'Desconto especial';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Promoções</h1>
      
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardHeader>
          <CardTitle>Verificar Código Promocional</CardTitle>
          <CardDescription>
            Digite um código promocional para verificar sua validade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Digite o código promocional" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button onClick={checkPromoCode}>Verificar</Button>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="text-center py-8">Carregando promoções...</div>
      ) : promotions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Promoções Ativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>{formatDiscount(promotion)}</span>
                    {promotion.code && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(promotion.code)}
                        className="flex items-center gap-1"
                      >
                        <span>{promotion.code}</span>
                        <Copy size={16} />
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {promotion.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {promotion.end_date && (
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <Calendar size={16} />
                        <span>
                          Válido até {format(new Date(promotion.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    )}
                    
                    {promotion.minimum_order_value && (
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <AlertCircle size={16} />
                        <span>
                          Pedido mínimo de {new Intl.NumberFormat('pt-AO', {
                            style: 'currency',
                            currency: 'AOA'
                          }).format(promotion.minimum_order_value)}
                        </span>
                      </div>
                    )}
                    
                    {promotion.applies_to?.product_ids && promotion.applies_to.product_ids.length > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <CheckCircle size={16} />
                        <span>
                          Válido para produtos específicos
                        </span>
                      </div>
                    )}
                    
                    {promotion.applies_to?.categories && promotion.applies_to.categories.length > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <CheckCircle size={16} />
                        <span>
                          Válido para categorias específicas
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    onClick={() => navigate("/")}
                    className="w-full"
                  >
                    Comprar com Esta Promoção
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Nenhuma promoção disponível</CardTitle>
            <CardDescription>
              No momento não há promoções disponíveis para você.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => navigate("/")}>
              Ver Nossos Produtos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromotionsPage;
