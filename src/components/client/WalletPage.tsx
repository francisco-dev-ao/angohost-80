
import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from '@/utils/formatters';
import { toast } from 'sonner';
import { Wallet, Plus, CreditCard, ArrowDownUp, Clock, CheckCheck } from 'lucide-react';

interface WalletTransaction {
  id: string;
  amount: number;
  type: 'deposit' | 'payment' | 'refund';
  description: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
}

const WalletPage = () => {
  const { user } = useSupabaseAuth();
  const [balance, setBalance] = useState(0);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [depositAmount, setDepositAmount] = useState(5000);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('balance');

  useEffect(() => {
    if (!user) return;
    
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance, auto_pay')
        .eq('user_id', user.id)
        .single();
        
      if (walletError && walletError.code !== 'PGRST116') {
        throw walletError;
      }
      
      if (walletData) {
        setBalance(walletData.balance || 0);
        setAutoPayEnabled(walletData.auto_pay || false);
      } else {
        // Create wallet if it doesn't exist
        const { error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 0,
            auto_pay: false
          });
          
        if (createError) throw createError;
      }
      
      // Fetch transactions
      const { data: transactionsData, error: txError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (txError) throw txError;
      
      setTransactions(transactionsData || []);
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      toast.error('Erro ao carregar dados da carteira');
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (depositAmount < 1000) {
      toast.error('O valor mínimo de depósito é de AOA 1.000,00');
      return;
    }
    
    try {
      // In a real implementation, this would redirect to a payment gateway
      toast.success('Redirecionando para o gateway de pagamento...');
      
      // Simulating a successful deposit for demo purposes
      setTimeout(async () => {
        const { error } = await supabase.rpc('add_to_wallet', {
          p_user_id: user.id,
          p_amount: depositAmount
        });
        
        if (error) throw error;
        
        toast.success(`Depósito de ${formatPrice(depositAmount)} processado com sucesso!`);
        fetchWalletData();
      }, 2000);
    } catch (error: any) {
      console.error('Error processing deposit:', error);
      toast.error('Erro ao processar depósito');
    }
  };

  const handleAutoPayToggle = async () => {
    if (!user) return;
    
    try {
      const newValue = !autoPayEnabled;
      
      const { error } = await supabase
        .from('wallets')
        .update({ auto_pay: newValue })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setAutoPayEnabled(newValue);
      toast.success(`Pagamento automático ${newValue ? 'ativado' : 'desativado'}`);
    } catch (error: any) {
      console.error('Error updating auto-pay setting:', error);
      toast.error('Erro ao atualizar configuração de pagamento automático');
    }
  };

  const getTransactionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCheck className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'failed':
        return <span className="text-red-500">✗</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Minha Carteira</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="balance">Saldo e Depósitos</TabsTrigger>
          <TabsTrigger value="transactions">Histórico de Transações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="balance" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Saldo da Carteira
                </CardTitle>
                <CardDescription>
                  Use seu saldo para pagar por serviços automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">
                  {loading ? '...' : formatPrice(balance)}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-pay"
                    checked={autoPayEnabled}
                    onCheckedChange={handleAutoPayToggle}
                  />
                  <Label htmlFor="auto-pay">Pagamento automático de faturas</Label>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                {autoPayEnabled ? (
                  'Suas faturas serão pagas automaticamente quando houver saldo disponível'
                ) : (
                  'Ative para pagar suas faturas automaticamente'
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Saldo
                </CardTitle>
                <CardDescription>
                  Faça um depósito na sua carteira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDepositSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount">Valor do depósito (AOA)</Label>
                    <div className="flex items-center">
                      <span className="bg-muted px-3 py-2 border border-r-0 border-input rounded-l-md">
                        AOA
                      </span>
                      <Input
                        id="deposit-amount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        min={1000}
                        step={1000}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Método de pagamento</Label>
                    <select
                      id="payment-method"
                      className="w-full border border-input bg-background px-3 py-2 rounded-md"
                      defaultValue="bank_transfer"
                    >
                      <option value="bank_transfer">Transferência Bancária</option>
                      <option value="credit_card">Cartão de Crédito</option>
                    </select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Adicionar Saldo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowDownUp className="mr-2 h-5 w-5" />
                Histórico de Transações
              </CardTitle>
              <CardDescription>
                Últimos movimentos na sua carteira
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando transações...</div>
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {tx.description}
                          {getTransactionStatusIcon(tx.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(tx.created_at).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : tx.type === 'refund' ? 'text-blue-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}
                        {formatPrice(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Nenhuma transação encontrada.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletPage;
