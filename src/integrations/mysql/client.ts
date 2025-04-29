
import mysql from 'mysql2/promise';

// Database connection pool
let pool: mysql.Pool | null = null;

export const getConnection = async () => {
  // Create the connection pool if it doesn't exist
  if (!pool) {
    pool = mysql.createPool({
      host: '194.163.146.215',
      database: 'angodb11',
      // These will be configured later in the admin panel
      user: 'placeholder_username',
      password: 'placeholder_password',
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
