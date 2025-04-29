
import { executeQuery } from '@/integrations/mysql/client';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'canceled';
  items: any; // JSON
  created_at: string;
  updated_at?: string;
}

export async function getAllOrders() {
  return executeQuery('SELECT * FROM orders ORDER BY created_at DESC');
}

export async function getOrdersByUserId(userId: string) {
  return executeQuery('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function getOrderById(id: string) {
  return executeQuery('SELECT * FROM orders WHERE id = ?', [id]);
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  return executeQuery(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );
}

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at'>) {
  const { user_id, order_number, total_amount, status, items } = orderData;
  // Convert items object to JSON string if necessary
  const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);
  
  return executeQuery(
    'INSERT INTO orders (user_id, order_number, total_amount, status, items, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, order_number, total_amount, status, itemsJson, new Date().toISOString()]
  );
}

export async function deleteOrder(id: string) {
  return executeQuery('DELETE FROM orders WHERE id = ?', [id]);
}
