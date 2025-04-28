import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [nifLoading, setNifLoading] = useState(false);
  const [nifError, setNifError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nif: "",
    email: "",
    password: "",
    name: "",
    company_name: "",
    phone: "",
    address: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Apenas números e limitar a 9 dígitos
      const cleaned = value.replace(/\D/g, '');
      const limited = cleaned.slice(0, 9);
      setFormData({ ...formData, [name]: limited });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNifBlur = async () => {
    const nif = formData.nif.trim();
    if (!nif) return;

    setNifLoading(true);
    setNifError(null);

    try {
      // Simulando uma chamada de API
      // Em produção, esta seria uma chamada real para a API de NIF
      setTimeout(() => {
        // Simula resultados diferentes baseados no valor do NIF
        if (nif === "123456789") {
          setFormData({
            ...formData,
            name: "Empresa Teste",
            company_name: "Empresa Teste Ltda.",
            address: "Rua Principal, 123, Luanda"
          });
        } else if (nif === "987654321") {
          setFormData({
            ...formData,
            name: "João Silva",
            company_name: "João Silva ME",
            address: "Av. Central, 456, Luanda"
          });
        } else {
          setNifError("NIF ou BI não encontrado. Por favor, verifique se está correto.");
        }
        setNifLoading(false);
      }, 1500);
    } catch (error) {
      setNifError("Erro ao consultar o NIF ou BI. Por favor, tente novamente.");
      setNifLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validação do telefone
    const phoneRegex = /^9\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Número de telefone inválido. Deve ter 9 dígitos e começar com 9.");
      setLoading(false);
      return;
    }

    // Validação do NIF
    if (!formData.nif.trim()) {
      setNifError("O NIF/BI é obrigatório para criar uma conta.");
      setLoading(false);
      return;
    }

    // Simulando envio para API
    setTimeout(() => {
      toast.success("Conta criada com sucesso!");
      setLoading(false);
      // Redirecionar para a página de login após registro
    }, 2000);
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen flex flex-col md:flex-row">
        {/* Lado esquerdo - imagem (visível apenas em desktop) */}
        <div className="hidden md:flex md:w-1/2 bg-primary/10 items-center justify-center p-8">
          <img 
            src="/placeholder.svg" 
            alt="Registration illustration" 
            className="max-w-md w-full"
          />
        </div>
        
        {/* Lado direito - formulário */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
          <div className="max-w-md w-full">
            {/* Logo e cabeçalho */}
            <div className="mb-8">
              <Link to="/" className="block mb-6">
                <img src="/placeholder.svg" alt="Logo" className="h-10" />
              </Link>
              <h2 className="text-2xl font-bold">Criar nova conta</h2>
              <p className="text-muted-foreground mt-2">Por favor, insira seus dados</p>
            </div>
            
            {/* Formulário de registro */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo NIF */}
              <div className="space-y-1">
                <Label htmlFor="nif">NIF ou B.I</Label>
                <div className="relative">
                  <Input
                    id="nif"
                    name="nif"
                    placeholder="NIF ou B.I"
                    value={formData.nif}
                    onChange={handleChange}
                    onBlur={handleNifBlur}
                    required
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Ao informar o NIF, preencheremos alguns campos automaticamente.</p>
                
                {nifLoading && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Consultando seus dados...</span>
                  </div>
                )}
                
                {nifError && (
                  <p className="text-sm text-destructive mt-1">{nifError}</p>
                )}
              </div>
              
              {/* Email e Senha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nome@email.ao"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Insira uma senha"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Nome Fiscal e Telefone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="company_name">Nome Fiscal</Label>
                  <div className="relative">
                    <Input
                      id="company_name"
                      name="company_name"
                      placeholder="Nome Fiscal"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Telefone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10"
                      pattern="9[0-9]{8}"
                      title="O número deve ter 9 dígitos e começar com 9"
                      maxLength={9}
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Endereço */}
              <div className="space-y-1">
                <Label htmlFor="address">Endereço</Label>
                <div className="relative">
                  <Input
                    id="address"
                    name="address"
                    placeholder="Endereço"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              {/* Botões */}
              <div className="space-y-4 pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                      <span>Criando...</span>
                    </>
                  ) : (
                    <span>Criar nova conta</span>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to="/client">Entrar na minha conta</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
