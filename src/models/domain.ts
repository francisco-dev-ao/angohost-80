
import { executeQuery } from '@/integrations/mysql/client';

export interface Domain {
  id: string;
  user_id: string;
  domain_name: string;
  registration_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'pending' | 'transferring';
  whois_privacy: boolean;
  is_locked: boolean;
  auto_renew: boolean;
  created_at: string;
  updated_at?: string;
}

export async function getAllDomains() {
  return executeQuery('SELECT * FROM domains ORDER BY created_at DESC');
}

export async function getDomainsByUserId(userId: string) {
  return executeQuery('SELECT * FROM domains WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function getDomainById(id: string) {
  return executeQuery('SELECT * FROM domains WHERE id = ?', [id]);
}

export async function updateDomain(id: string, updates: Partial<Domain>) {
  // Build the SQL update statement dynamically
  const fields = Object.keys(updates).filter(key => key !== 'id');
  if (fields.length === 0) return { data: null, error: 'No fields to update' };
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => (updates as any)[field]);
  values.push(id); // For the WHERE clause
  
  return executeQuery(`UPDATE domains SET ${setClause} WHERE id = ?`, values);
}

export async function createDomain(domainData: Omit<Domain, 'id' | 'created_at'>) {
  const { user_id, domain_name, registration_date, expiry_date, status, whois_privacy, is_locked, auto_renew } = domainData;
  return executeQuery(
    'INSERT INTO domains (user_id, domain_name, registration_date, expiry_date, status, whois_privacy, is_locked, auto_renew, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, domain_name, registration_date, expiry_date, status, whois_privacy, is_locked, auto_renew, new Date().toISOString()]
  );
}

export async function deleteDomain(id: string) {
  return executeQuery('DELETE FROM domains WHERE id = ?', [id]);
}
