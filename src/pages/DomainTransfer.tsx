
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const DomainTransfer = () => {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Transferir domínio:', domain);
    // Implementação de transferência de domínio
  };

  return (
    <Layout>
      <div className="container py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#345990]">Transferência de Domínios</h1>
          <p className="text-xl text-gray-600">
            Transfira seus domínios para a AngoHost e aproveite os nossos serviços premium de gestão de domínios
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="border-[#345990]/10">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input 
                    placeholder="Digite o seu domínio (exemplo.ao)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit" className="bg-[#345990] hover:bg-[#345990]/90">
                    Verificar Transferência
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#345990]">Como transferir seu domínio</h2>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-[#345990] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <h3 className="font-medium text-lg">Desbloqueie seu domínio</h3>
                    <p className="text-gray-600">Acesse o painel de controle do seu atual registrador e desbloqueie o domínio para transferência.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-[#345990] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <h3 className="font-medium text-lg">Obtenha o código EPP</h3>
                    <p className="text-gray-600">Solicite o código de autorização (EPP) ao seu atual registrador.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-[#345990] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <h3 className="font-medium text-lg">Inicie a transferência</h3>
                    <p className="text-gray-600">Digite seu domínio acima, forneça o código EPP e conclua o processo de transferência.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-[#345990] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                  <div>
                    <h3 className="font-medium text-lg">Confirme a transferência</h3>
                    <p className="text-gray-600">Confirme a transferência através do email enviado para o contato administrativo do domínio.</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#345990]">Benefícios da transferência</h2>
              <ul className="space-y-4">
                {[
                  "Renovação GRATUITA por 1 ano ao transferir",
                  "Gerenciador de DNS avançado e intuitivo",
                  "Proteção de privacidade WHOIS gratuita",
                  "Redirecionamento de domínio ilimitado",
                  "Suporte técnico especializado 24/7",
                  "Painel de controle fácil de usar"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-[#345990] mr-3 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 bg-[#345990]/5 rounded-lg border border-[#345990]/10">
                <h3 className="font-semibold mb-2 text-[#345990]">Precisa de ajuda?</h3>
                <p className="text-gray-600 mb-4">Nossa equipe está disponível para ajudá-lo em todo o processo de transferência.</p>
                <Button 
                  variant="outline" 
                  className="border-[#345990] text-[#345990] hover:bg-[#345990]/10"
                >
                  Fale com nosso suporte
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto bg-[#345990]/5 p-8 rounded-lg border border-[#345990]/10">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#345990]">Perguntas frequentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg text-[#345990]">Quanto tempo leva para completar a transferência?</h3>
              <p className="text-gray-600">O processo geralmente leva de 5 a 7 dias para ser concluído, dependendo da resposta do registrador atual e do tempo de confirmação.</p>
            </div>
            <div>
              <h3 className="font-medium text-lg text-[#345990]">Vou perder meus emails ou site durante a transferência?</h3>
              <p className="text-gray-600">Não, seus serviços de email e hospedagem continuarão funcionando normalmente durante o processo de transferência de domínio.</p>
            </div>
            <div>
              <h3 className="font-medium text-lg text-[#345990]">Posso transferir qualquer tipo de domínio?</h3>
              <p className="text-gray-600">A maioria dos TLDs (como .ao, .com, .net) pode ser transferida, mas alguns TLDs específicos possuem regras próprias. Consulte nosso suporte para casos específicos.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DomainTransfer;
