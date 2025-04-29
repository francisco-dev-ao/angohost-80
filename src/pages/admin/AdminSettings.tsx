import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BrandLogoUploader } from "@/components/admin/BrandLogoUploader";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      companyName: "AngoHost",
      phone: "+244 123 456 789",
      email: "support@angohost.ao",
      address: "Luanda, Angola",
      currency: "AOA",
      language: "pt",
    },
    security: {
      requireEmailVerification: true,
      forceSSL: true,
      allowUserRegistration: true,
      passwordResetExpiryHours: 24,
      loginAttempts: 5,
    },
    emails: {
      smtpServer: "smtp.example.com",
      smtpPort: "587",
      smtpUser: "noreply@angohost.ao",
      smtpPassword: "••••••••••••",
      senderName: "AngoHost",
      senderEmail: "noreply@angohost.ao",
      enableSMTP: false
    },
    payments: {
      paymentGateways: ["bank", "multicaixa"],
      bankDetails: "Nome do Banco: Banco ABC\nNIB: 12345678901234567890123\nIBAN: AO12345678901234567890123",
      orderExpiryHours: 48,
      invoiceReminderDays: 3,
      autoSuspendDays: 7,
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*')
          .eq('id', 'main-settings')
          .single();
          
        if (error) throw error;
        
        if (data) {
          setSettings(data.settings || settings);
        }
      } catch (error: any) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 'main-settings',
          settings: settings,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast.success("Configurações salvas com sucesso");
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(`Erro ao salvar configurações: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestSMTP = async () => {
    setTestingSmtp(true);
    setSmtpTestResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-smtp', {
        body: {
          smtpSettings: settings.emails
        }
      });
      
      if (error) throw error;
      
      setSmtpTestResult({
        success: data?.success || false,
        message: data?.message || "Resposta inválida do servidor"
      });
      
      if (data?.success) {
        toast.success("Conexão SMTP estabelecida com sucesso!");
      } else {
        toast.error(data?.message || "Falha na conexão SMTP");
      }
    } catch (error: any) {
      console.error('SMTP test error:', error);
      setSmtpTestResult({ 
        success: false, 
        message: `Erro ao testar SMTP: ${error.message}` 
      });
      toast.error(`Erro ao testar SMTP: ${error.message}`);
    } finally {
      setTestingSmtp(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="emails">E-mails</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure as informações básicas da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={settings.general.companyName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            companyName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={settings.general.phone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.general.email}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Textarea
                      id="address"
                      value={settings.general.address}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            address: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moeda</Label>
                      <Select
                        value={settings.general.currency}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              currency: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AOA">Kwanza (AOA)</SelectItem>
                          <SelectItem value="USD">Dólar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma Padrão</Label>
                      <Select
                        value={settings.general.language}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              language: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">Inglês</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <Label>Logo da Empresa</Label>
                    <BrandLogoUploader />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Configure as opções de segurança da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-verification">
                        Verificação de E-mail
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Exigir que os usuários verifiquem o e-mail após o cadastro
                      </p>
                    </div>
                    <Switch
                      id="email-verification"
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            requireEmailVerification: checked,
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="force-ssl">Forçar SSL</Label>
                      <p className="text-sm text-muted-foreground">
                        Redirecionar automaticamente para HTTPS
                      </p>
                    </div>
                    <Switch
                      id="force-ssl"
                      checked={settings.security.forceSSL}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            forceSSL: checked,
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow-registration">
                        Permitir Registro
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que novos usuários se registrem no sistema
                      </p>
                    </div>
                    <Switch
                      id="allow-registration"
                      checked={settings.security.allowUserRegistration}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            allowUserRegistration: checked,
                          },
                        })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-reset-expiry">
                        Validade do Reset de Senha (horas)
                      </Label>
                      <Input
                        id="password-reset-expiry"
                        type="number"
                        value={settings.security.passwordResetExpiryHours}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              passwordResetExpiryHours: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-attempts">
                        Tentativas de Login
                      </Label>
                      <Input
                        id="login-attempts"
                        type="number"
                        value={settings.security.loginAttempts}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              loginAttempts: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="emails">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de E-mail</CardTitle>
                  <CardDescription>
                    Configure as opções de envio de e-mail
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-smtp">
                        Ativar SMTP
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Ativar envio de e-mails via SMTP
                      </p>
                    </div>
                    <Switch
                      id="enable-smtp"
                      checked={settings.emails.enableSMTP}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          emails: {
                            ...settings.emails,
                            enableSMTP: checked,
                          },
                        })
                      }
                    />
                  </div>
                  
                  {settings.emails.enableSMTP && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-server">Servidor SMTP</Label>
                          <Input
                            id="smtp-server"
                            value={settings.emails.smtpServer}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emails: {
                                  ...settings.emails,
                                  smtpServer: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-port">Porta SMTP</Label>
                          <Input
                            id="smtp-port"
                            value={settings.emails.smtpPort}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emails: {
                                  ...settings.emails,
                                  smtpPort: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-user">Usuário SMTP</Label>
                          <Input
                            id="smtp-user"
                            value={settings.emails.smtpUser}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emails: {
                                  ...settings.emails,
                                  smtpUser: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-password">Senha SMTP</Label>
                          <Input
                            id="smtp-password"
                            type="password"
                            value={settings.emails.smtpPassword}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emails: {
                                  ...settings.emails,
                                  smtpPassword: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sender-name">Nome do Remetente</Label>
                          <Input
                            id="sender-name"
                            value={settings.emails.senderName}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emails: {
                                  ...settings.emails,
                                  senderName: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sender-email">E-mail do Remetente</Label>
                          <Input
                            id="sender-email"
                            type="email"
                            value={settings.emails.senderEmail}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                emails: {
                                  ...settings.emails,
                                  senderEmail: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      
                      {smtpTestResult && (
                        <Alert variant={smtpTestResult.success ? "default" : "destructive"} className="mt-4">
                          {smtpTestResult.success ? 
                            <Check className="h-4 w-4" /> : 
                            <AlertCircle className="h-4 w-4" />
                          }
                          <AlertDescription>
                            {smtpTestResult.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {settings.emails.enableSMTP && (
                    <Button 
                      variant="outline" 
                      onClick={handleTestSMTP} 
                      disabled={testingSmtp || loading}
                    >
                      {testingSmtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Testar Configurações
                    </Button>
                  )}
                  <Button onClick={handleSaveSettings} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="payments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Pagamento</CardTitle>
                  <CardDescription>
                    Configure as opções de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Gateways de Pagamento Ativos</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bank-transfer"
                          checked={settings.payments.paymentGateways.includes("bank")}
                          onCheckedChange={(checked) => {
                            const updatedGateways = checked
                              ? [...settings.payments.paymentGateways, "bank"]
                              : settings.payments.paymentGateways.filter(g => g !== "bank");
                            setSettings({
                              ...settings,
                              payments: {
                                ...settings.payments,
                                paymentGateways: updatedGateways,
                              },
                            });
                          }}
                        />
                        <Label htmlFor="bank-transfer">Transferência Bancária</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="multicaixa"
                          checked={settings.payments.paymentGateways.includes("multicaixa")}
                          onCheckedChange={(checked) => {
                            const updatedGateways = checked
                              ? [...settings.payments.paymentGateways, "multicaixa"]
                              : settings.payments.paymentGateways.filter(g => g !== "multicaixa");
                            setSettings({
                              ...settings,
                              payments: {
                                ...settings.payments,
                                paymentGateways: updatedGateways,
                              },
                            });
                          }}
                        />
                        <Label htmlFor="multicaixa">Multicaixa</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bank-details">Detalhes Bancários</Label>
                    <Textarea
                      id="bank-details"
                      value={settings.payments.bankDetails}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payments: {
                            ...settings.payments,
                            bankDetails: e.target.value,
                          },
                        })
                      }
                      rows={4}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order-expiry">
                        Expiração de Pedidos (horas)
                      </Label>
                      <Input
                        id="order-expiry"
                        type="number"
                        value={settings.payments.orderExpiryHours}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            payments: {
                              ...settings.payments,
                              orderExpiryHours: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-reminder">
                        Lembrete de Faturas (dias antes)
                      </Label>
                      <Input
                        id="invoice-reminder"
                        type="number"
                        value={settings.payments.invoiceReminderDays}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            payments: {
                              ...settings.payments,
                              invoiceReminderDays: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auto-suspend">
                        Suspensão Automática (dias após vencimento)
                      </Label>
                      <Input
                        id="auto-suspend"
                        type="number"
                        value={settings.payments.autoSuspendDays}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            payments: {
                              ...settings.payments,
                              autoSuspendDays: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
