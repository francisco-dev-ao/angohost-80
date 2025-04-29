
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { testConnection } from './integrations/mysql/client';
import { initializeSchema } from './utils/initSchema';
import { Toaster, toast } from 'sonner';

// Renderizar a aplicação primeiro para evitar tela em branco
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster />
    <App />
  </React.StrictMode>,
);

// Inicializar conexão com o banco de dados em segundo plano
const initDbConnection = async () => {
  try {
    console.log('Testando conexão com o banco de dados...');
    const connectionTest = await testConnection();
    if (connectionTest.success) {
      console.log('Conexão com o banco de dados bem sucedida!', connectionTest);
      toast.success(`Conexão com o banco de dados estabelecida! Versão MySQL: ${connectionTest.version}`);
      
      // Inicializar schema se necessário
      await initializeSchema();
    } else {
      console.error('Falha na conexão com o banco de dados:', connectionTest.message);
      toast.error(`Falha na conexão com o banco de dados: ${connectionTest.message}`);
    }
  } catch (error: any) {
    console.error('Erro ao inicializar aplicação:', error);
    toast.error(`Erro ao conectar ao banco de dados: ${error.message}`);
  }
};

// Iniciar tentativa de conexão com o banco de dados após um pequeno delay
setTimeout(() => {
  initDbConnection();
}, 1000);
