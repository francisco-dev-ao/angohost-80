
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/types/admin';

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedProducts: Product[] = data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        priceMonthly: p.price_monthly,
        priceYearly: p.price_yearly,
        isActive: p.is_active,
        category: p.category_id,
        features: typeof p.features === 'object' ? p.features : {}, // Ensure features is an object
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        categoryId: p.category_id
      }));
      
      setProducts(formattedProducts);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId);

      if (error) throw error;
      
      toast.success(`Produto ${isActive ? 'ativado' : 'desativado'} com sucesso`);
      fetchProducts(); // Reload products
    } catch (error: any) {
      toast.error('Erro ao atualizar status do produto: ' + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, isLoading, fetchProducts, updateProductStatus };
};
