
import { executeQuery } from '@/integrations/mysql/client';

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_at: string;
  updated_at?: string;
}

export async function getAllTickets() {
  return executeQuery('SELECT * FROM tickets ORDER BY created_at DESC');
}

export async function getTicketsByUserId(userId: string) {
  return executeQuery('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function getTicketById(id: string) {
  return executeQuery('SELECT * FROM tickets WHERE id = ?', [id]);
}

export async function updateTicketStatus(id: string, status: Ticket['status']) {
  // Convert hyphenated status to underscore format for database
  const dbStatus = status === 'in-progress' ? 'in_progress' : status;
  
  return executeQuery(
    'UPDATE tickets SET status = ? WHERE id = ?',
    [dbStatus, id]
  );
}

export async function assignTicket(id: string, assignedTo: string) {
  return executeQuery(
    'UPDATE tickets SET assigned_to = ? WHERE id = ?',
    [assignedTo, id]
  );
}

export async function createTicket(ticketData: Omit<Ticket, 'id' | 'created_at'>) {
  const { user_id, subject, description, status, priority, assigned_to } = ticketData;
  // Convert hyphenated status to underscore format for database
  const dbStatus = status === 'in-progress' ? 'in_progress' : status;
  
  return executeQuery(
    'INSERT INTO tickets (user_id, subject, description, status, priority, assigned_to, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, subject, description, dbStatus, priority, assigned_to, new Date().toISOString()]
  );
}

export async function deleteTicket(id: string) {
  return executeQuery('DELETE FROM tickets WHERE id = ?', [id]);
}
