
import { executeQuery } from '@/integrations/mysql/client';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export async function getAllUsers() {
  return executeQuery('SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
}

export async function getUserById(id: string) {
  return executeQuery('SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = ?', [id]);
}

export async function updateUser(id: string, updates: Partial<User>) {
  // Build the SQL update statement dynamically
  const fields = Object.keys(updates).filter(key => key !== 'id');
  if (fields.length === 0) return { data: null, error: 'No fields to update' };
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => (updates as any)[field]);
  values.push(id); // For the WHERE clause
  
  return executeQuery(`UPDATE users SET ${setClause} WHERE id = ?`, values);
}

export async function createUser(userData: Omit<User, 'id' | 'created_at'>) {
  const { email, full_name, role, is_active } = userData;
  return executeQuery(
    'INSERT INTO users (email, full_name, role, is_active, created_at) VALUES (?, ?, ?, ?, ?)',
    [email, full_name, role, is_active, new Date().toISOString()]
  );
}

export async function deleteUser(id: string) {
  return executeQuery('DELETE FROM users WHERE id = ?', [id]);
}
