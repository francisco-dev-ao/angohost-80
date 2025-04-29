
import mysql from 'mysql2/promise';

// Database connection pool
let pool: mysql.Pool | null = null;

export const getConnection = async () => {
  // Valores padrão para credenciais
  let user = 'placeholder_username';
  let password = 'Bayathu60@@'; // Senha padrão

  try {
    // Só tentar acessar localStorage em ambiente de navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedCredentials = localStorage.getItem('db_credentials');
        
        // Se temos credenciais armazenadas, usá-las
        if (storedCredentials) {
          const credentials = JSON.parse(storedCredentials);
          if (credentials.username) user = credentials.username;
          if (credentials.password) password = credentials.password;
        }
      } catch (storageError) {
        console.error('Erro ao acessar localStorage:', storageError);
      }
    }
  } catch (error) {
    console.error('Erro ao verificar ambiente:', error);
  }
  
  try {
    // Criar o pool de conexão se ele não existir
    if (!pool) {
      console.log('Tentando criar pool de conexão com o banco de dados...');
      console.log('Host: 194.163.146.215, Port: 3306, Database: angodb11, User:', user);
      
      pool = mysql.createPool({
        host: '194.163.146.215',
        port: 3306,
        database: 'angodb11',
        user,
        password,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000 // Timeout de 10 segundos para conexão
      });
      
      console.log('Pool de conexão com o banco de dados criado com sucesso!');
    }
    
    return pool;
  } catch (err) {
    console.error('Erro crítico ao criar pool de conexão:', err);
    throw err;
  }
};

// Helper para executar consulta com tratamento de erro
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(query, params);
    return { data: rows, error: null };
  } catch (error: any) {
    console.error('Erro na consulta ao banco de dados:', error.message);
    return { data: null, error: error.message };
  }
};

// Função para testar conexão que retorna status detalhado
export const testConnection = async () => {
  try {
    console.log('Testando conexão com o banco de dados...');
    const connection = await getConnection();
    
    // Adicionando timeout para a consulta
    const queryPromise = connection.execute('SELECT NOW() as timestamp, VERSION() as version');
    
    // Definindo um timeout de 5 segundos para a consulta
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao conectar ao banco de dados')), 5000);
    });
    
    // Executando a consulta com timeout
    const [rows] = await Promise.race([queryPromise, timeoutPromise]) as any;
    
    console.log('Conexão bem sucedida! Versão do MySQL:', rows[0]?.version);
    
    return { 
      success: true, 
      message: 'Conexão com banco de dados realizada com sucesso',
      timestamp: rows[0]?.timestamp || new Date().toISOString(),
      version: rows[0]?.version || 'Desconhecida',
      host: '194.163.146.215',
      port: 3306,
      database: 'angodb11'
    };
  } catch (error: any) {
    console.error('Falha ao testar conexão:', error.message);
    return { 
      success: false, 
      message: `Falha na conexão: ${error.message}`,
      error: error.message
    };
  }
};

// Função para inicializar o banco de dados com tratamento de timeout
export const initializeDatabase = async () => {
  try {
    const connection = await getConnection();
    const queryPromise = connection.execute('SELECT 1');
    
    // Definindo um timeout de 5 segundos para a consulta
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao inicializar banco de dados')), 5000);
    });
    
    await Promise.race([queryPromise, timeoutPromise]);
    console.log('Banco de dados inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Falha ao conectar ao banco de dados:', error);
    return false;
  }
};
