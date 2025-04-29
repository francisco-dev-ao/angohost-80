
import { Order } from '@/types/admin';
import { Invoice } from '@/hooks/useInvoices';

export interface AdminDashboardStats {
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentInvoices: Invoice[];
  paymentMethodCount: number;
}
