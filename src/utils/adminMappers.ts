
import { Order } from "@/types/admin";
import { Invoice } from "@/hooks/useInvoices";
import { Json } from "@/integrations/supabase/types";

interface SupabaseOrder {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: any;
  created_at: string;
  updated_at: string;
}

/**
 * Maps Supabase order data to application Order type
 */
export const mapSupabaseOrderToOrder = (order: SupabaseOrder): Order => ({
  id: order.id,
  userId: order.user_id,
  orderNumber: order.order_number,
  status: order.status as "pending" | "processing" | "completed" | "canceled",
  totalAmount: order.total_amount,
  items: Array.isArray(order.items) ? order.items : [],
  createdAt: order.created_at,
  updatedAt: order.updated_at
});

/**
 * Safely cast Supabase invoice data to application Invoice type
 */
export const castInvoiceData = (invoiceData: any[]): Invoice[] => {
  return (invoiceData || []).map(invoice => ({
    ...invoice,
    items: Array.isArray(invoice.items) ? invoice.items : []
  } as Invoice));
};
