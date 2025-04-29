
import { executeQuery } from '@/integrations/mysql/client';

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  payment_date?: string;
  items: any; // JSON
  created_at: string;
  updated_at?: string;
}

export async function getAllInvoices() {
  return executeQuery('SELECT * FROM invoices ORDER BY created_at DESC');
}

export async function getInvoicesByUserId(userId: string) {
  return executeQuery('SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function getInvoiceById(id: string) {
  return executeQuery('SELECT * FROM invoices WHERE id = ?', [id]);
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  // Build the SQL update statement dynamically
  const fields = Object.keys(updates).filter(key => key !== 'id');
  if (fields.length === 0) return { data: null, error: 'No fields to update' };
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => (updates as any)[field]);
  values.push(id); // For the WHERE clause
  
  return executeQuery(`UPDATE invoices SET ${setClause} WHERE id = ?`, values);
}

export async function createInvoice(invoiceData: Omit<Invoice, 'id' | 'created_at'>) {
  const { user_id, invoice_number, amount, status, due_date, payment_date, items } = invoiceData;
  // Convert items object to JSON string if necessary
  const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);
  
  return executeQuery(
    'INSERT INTO invoices (user_id, invoice_number, amount, status, due_date, payment_date, items, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, invoice_number, amount, status, due_date, payment_date, itemsJson, new Date().toISOString()]
  );
}

export async function deleteInvoice(id: string) {
  return executeQuery('DELETE FROM invoices WHERE id = ?', [id]);
}
