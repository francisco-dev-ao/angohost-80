
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeDatabase } from './integrations/mysql/client';
import { initializeSchema } from './utils/initSchema';

// Initialize database connection and schema
const initApp = async () => {
  try {
    await initializeDatabase();
    await initializeSchema();
  } catch (error) {
    console.error('Error initializing application:', error);
  }
  
  // Render the app regardless of initialization success
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

initApp();
