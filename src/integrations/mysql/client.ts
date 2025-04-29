
import mysql from 'mysql2/promise';

// Database connection pool
let pool: mysql.Pool | null = null;

export const getConnection = async () => {
  // Check if we have credentials stored in localStorage
  const storedCredentials = localStorage.getItem('db_credentials');
  let user = 'placeholder_username';
  let password = 'Bayathu60@@'; // Updated password

  // If we have stored credentials, use them
  if (storedCredentials) {
    try {
      const credentials = JSON.parse(storedCredentials);
      if (credentials.username) user = credentials.username;
      if (credentials.password) password = credentials.password;
    } catch (error) {
      console.error('Error parsing stored credentials:', error);
    }
  }
  
  // Create the connection pool if it doesn't exist
  if (!pool) {
    pool = mysql.createPool({
      host: '194.163.146.215',
      database: 'angodb11',
      user,
      password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  
  return pool;
};

export const initializeDatabase = async () => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
};

// Helper to execute query with error handling
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(query, params);
    return { data: rows, error: null };
  } catch (error: any) {
    console.error('Database query error:', error.message);
    return { data: null, error: error.message };
  }
};

// Test connection function that returns detailed status
export const testConnection = async () => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT NOW() as timestamp');
    return { 
      success: true, 
      message: 'Database connection successful',
      timestamp: rows[0]?.timestamp || new Date().toISOString(),
      host: '194.163.146.215',
      database: 'angodb11'
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: `Connection failed: ${error.message}`,
      error: error.message
    };
  }
};
