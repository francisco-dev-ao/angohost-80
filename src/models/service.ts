
import { executeQuery } from '@/integrations/mysql/client';

export interface Service {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  service_type: string;
  status: string;
  price_monthly: number;
  price_yearly: number;
  renewal_date: string;
  created_at: string;
  control_panel_url?: string;
  auto_renew: boolean;
}

export async function getAllServices() {
  return executeQuery('SELECT * FROM client_services ORDER BY created_at DESC');
}

export async function getServicesByUserId(userId: string) {
  return executeQuery('SELECT * FROM client_services WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function getServiceById(id: string) {
  return executeQuery('SELECT * FROM client_services WHERE id = ?', [id]);
}

export async function updateService(id: string, updates: Partial<Service>) {
  // Build the SQL update statement dynamically
  const fields = Object.keys(updates).filter(key => key !== 'id');
  if (fields.length === 0) return { data: null, error: 'No fields to update' };
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => (updates as any)[field]);
  values.push(id); // For the WHERE clause
  
  return executeQuery(`UPDATE client_services SET ${setClause} WHERE id = ?`, values);
}

export async function createService(serviceData: Omit<Service, 'id' | 'created_at'>) {
  const { 
    user_id, name, description, service_type, status, 
    price_monthly, price_yearly, renewal_date, control_panel_url, auto_renew 
  } = serviceData;
  
  return executeQuery(
    `INSERT INTO client_services 
    (user_id, name, description, service_type, status, price_monthly, price_yearly, renewal_date, control_panel_url, auto_renew, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id, name, description, service_type, status, 
      price_monthly, price_yearly, renewal_date, control_panel_url, auto_renew, 
      new Date().toISOString()
    ]
  );
}

export async function deleteService(id: string) {
  return executeQuery('DELETE FROM client_services WHERE id = ?', [id]);
}
