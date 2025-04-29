
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeDatabase, testConnection } from './integrations/mysql/client';
import { initializeSchema } from './utils/initSchema';
import { Toaster, toast } from 'sonner';

// Initialize database connection and schema
const initApp = async () => {
  try {
    // Test database connection with the password
    const connectionTest = await testConnection();
    if (connectionTest.success) {
      console.log('Database connection successful!', connectionTest);
      toast.success(`Conexão com o banco de dados estabelecida! Versão MySQL: ${connectionTest.version}`);
      
      // Initialize schema if needed
      await initializeSchema();
    } else {
      console.error('Database connection failed:', connectionTest.message);
      toast.error(`Falha na conexão com o banco de dados: ${connectionTest.message}`);
    }
  } catch (error: any) {
    console.error('Error initializing application:', error);
    toast.error(`Erro ao inicializar aplicação: ${error.message}`);
  }
  
  // Render the app regardless of initialization success
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Toaster />
      <App />
    </React.StrictMode>,
  );
};

initApp();
