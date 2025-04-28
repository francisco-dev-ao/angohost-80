
import React, { useState } from "react";
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
import { toast } from "sonner";
import { BrandLogoUploader } from "@/components/admin/BrandLogoUploader";

const AdminSettings = () => {
  // Sample settings state
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
    },
    payments: {
      paymentGateways: ["bank", "multicaixa"],
      bankDetails: "Nome do Banco: Banco ABC\nNIB: 12345678901234567890123\nIBAN: AO12345678901234567890123",
      orderExpiryHours: 48,
      invoiceReminderDays: 3,
      autoSuspendDays: 7,
    }
  });

  const handleSaveSettings = () => {
    toast.success("Configurações salvas com sucesso");
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
                <Button onClick={handleSaveSettings}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
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
                <Button onClick={handleSaveSettings}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de E-mail</CardTitle>
                <CardDescription>
                  Configure as opções de envio de e-mail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Testar Configurações</Button>
                <Button onClick={handleSaveSettings}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
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
                <Button onClick={handleSaveSettings}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
