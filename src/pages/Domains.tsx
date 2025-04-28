
import React from 'react';
import Layout from '@/components/Layout';
import DomainSearch from '@/components/DomainSearch';

const Domains = () => {
  return (
    <Layout>
      <div className="container py-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Pesquisa de Domínios</h1>
          <p className="text-xl text-muted-foreground">
            Encontre o domínio perfeito para o seu negócio em Angola
          </p>
        </div>
        <DomainSearch />
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Como funciona o registro de domínio?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">1</div>
              <h3 className="font-medium mb-2">Pesquise domínios</h3>
              <p className="text-muted-foreground text-sm">Pesquise o nome que deseja para verificar a disponibilidade.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">2</div>
              <h3 className="font-medium mb-2">Adicione ao carrinho</h3>
              <p className="text-muted-foreground text-sm">Adicione o(s) domínio(s) disponível(is) ao seu carrinho.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">3</div>
              <h3 className="font-medium mb-2">Finalize a compra</h3>
              <p className="text-muted-foreground text-sm">Forneça os dados de titularidade e finalize a compra.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Domains;
