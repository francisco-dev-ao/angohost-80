
import { Json } from "@/integrations/supabase/types";

export interface Domain {
  id: string;
  domain_name: string;
  registration_date: string;
  expiry_date: string;
  status: string;
  is_locked: boolean;
  auto_renew?: boolean;
  whois_privacy?: boolean;
  nameservers?: Json;
  epp_code?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  service_type: string;
  status: string;
  renewal_date: string;
  price_monthly: number;
  price_yearly: number;
  control_panel_url?: string;
  control_panel_username?: string;
  description?: string;
  disk_space?: number;
  bandwidth?: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  auto_renew?: boolean;
  last_renewed_at?: string;
}

export interface PaymentMethod {
  id: string;
  payment_type: string;
  is_default: boolean;
  is_active: boolean;
  card_brand?: string;
  card_last_four?: string;
  card_expiry?: string;
  billing_name?: string;
  billing_address?: string;
  token?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount_amount?: number;
  discount_percent?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  minimum_order_value?: number;
  applies_to?: {
    product_ids?: string[];
    categories?: string[];
  };
  created_at: string;
  max_uses?: number;
  used_count?: number;
  updated_at?: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  content: string;
  status: "open" | "closed" | "in-progress";
  priority: "low" | "medium" | "high" | "urgent";
  department?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  user_id: string;
  assigned_to?: string;
  satisfaction_rating?: number;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  is_staff: boolean;
  created_at: string;
  attachments?: any[];
}

export interface WalletData {
  id?: string;
  user_id?: string;
  balance: number;
  auto_pay: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'deposit' | 'payment' | 'refund';
  description: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  user_id?: string;
}
