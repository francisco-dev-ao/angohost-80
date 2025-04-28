
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
      </div>
    </Layout>
  );
};

export default Domains;
