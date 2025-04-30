
import mysql from 'mysql2/promise';

// Database connection pool
let pool: mysql.Pool | null = null;

// Reset pool function to force a new connection after credential changes
export const resetPool = () => {
  pool = null;
};

export const getConnection = async () => {
  // Valores padrão para credenciais
  let user = '';
  let password = '';

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
        throw new Error('Não foi possível acessar as credenciais do banco de dados');
      }
    }
    
    // Verificar se temos credenciais válidas
    if (!user || !password) {
      throw new Error('Credenciais de banco de dados não configuradas');
    }
  } catch (error) {
    console.error('Erro ao verificar ambiente ou credenciais:', error);
    throw error;
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
    // Verificar se temos credenciais
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCredentials = localStorage.getItem('db_credentials');
      if (!storedCredentials) {
        return { 
          success: false, 
          message: 'Credenciais de banco de dados não configuradas'
        };
      }
      const credentials = JSON.parse(storedCredentials);
      if (!credentials.username || !credentials.password) {
        return { 
          success: false, 
          message: 'Credenciais de banco de dados incompletas'
        };
      }
    }

    console.log('Testando conexão com o banco de dados...');
    const connection = await getConnection();
    
    // Adicionando timeout para a consulta
    const queryPromise = connection.execute('SELECT NOW() as timestamp, VERSION() as version');
    
    // Definindo um timeout de 5 segundos para a consulta
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao conectar ao banco de dados')), 8000);
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
    
    // Mensagem mais amigável baseada no erro
    let mensagemErro = error.message;
    if (error.message.includes('Access denied')) {
      mensagemErro = 'Acesso negado. Verifique seu nome de usuário e senha.';
    } else if (error.message.includes('ECONNREFUSED')) {
      mensagemErro = 'Não foi possível conectar ao servidor MySQL. Verifique se o servidor está disponível.';
    } else if (error.message.includes('Timeout')) {
      mensagemErro = 'O tempo limite para conexão foi excedido. O servidor pode estar sobrecarregado ou inacessível.';
    } else if (error.message.includes('Credenciais')) {
      mensagemErro = error.message;
    }
    
    return { 
      success: false, 
      message: `Falha na conexão: ${mensagemErro}`,
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
