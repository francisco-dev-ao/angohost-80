
-- Create tables for the client area functionality
-- These match the types already defined in your codebase

-- Table for client domains
CREATE TABLE IF NOT EXISTS public.client_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_name TEXT NOT NULL,
  registration_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'pending_transfer', 'pending_registration')),
  is_locked BOOLEAN DEFAULT false,
  auto_renew BOOLEAN DEFAULT true,
  whois_privacy BOOLEAN DEFAULT false,
  nameservers JSONB,
  epp_code TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for client services
CREATE TABLE IF NOT EXISTS public.client_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('cpanel_hosting', 'wordpress_hosting', 'vps', 'dedicated_server', 'email', 'exchange')),
  status TEXT NOT NULL DEFAULT 'active',
  renewal_date DATE NOT NULL,
  price_monthly DECIMAL NOT NULL,
  price_yearly DECIMAL NOT NULL,
  control_panel_url TEXT,
  control_panel_username TEXT,
  description TEXT,
  disk_space INTEGER,
  bandwidth INTEGER,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_renew BOOLEAN DEFAULT true,
  last_renewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for payment methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('credit_card', 'debit_card', 'bank_transfer', 'paypal', 'multicaixa', 'stripe')),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  card_brand TEXT,
  card_last_four TEXT,
  card_expiry TEXT,
  billing_name TEXT,
  billing_address TEXT,
  token TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for promotions
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  description TEXT NOT NULL,
  discount_amount DECIMAL,
  discount_percent DECIMAL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  minimum_order_value DECIMAL DEFAULT 0,
  applies_to JSONB,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for support tickets
CREATE TABLE IF NOT EXISTS public.client_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in-progress', 'closed')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID,
  satisfaction_rating INTEGER
);

-- Table for ticket messages
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.client_tickets(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_staff BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  attachments JSONB
);

-- Table for user wallets
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL NOT NULL DEFAULT 0,
  auto_pay BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for wallet transactions
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'payment', 'refund')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Table for contact profiles
CREATE TABLE IF NOT EXISTS public.contact_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  document TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  due_date DATE NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  items JSONB,
  client_details JSONB,
  company_details JSONB,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  download_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'canceled')),
  total_amount DECIMAL NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  payment_status TEXT,
  payment_method UUID REFERENCES public.payment_methods(id),
  transaction_id TEXT,
  billing_address JSONB,
  client_details JSONB,
  contact_profile_id UUID REFERENCES public.contact_profiles(id),
  notes TEXT,
  discount_amount DECIMAL DEFAULT 0,
  tax_amount DECIMAL DEFAULT 0
);

-- Table for notifications
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  related_id UUID,
  related_type TEXT,
  action_url TEXT,
  action_text TEXT
);

-- Table for user feature settings
CREATE TABLE IF NOT EXISTS public.user_feature_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  features_enabled JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Now let's set up the Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.client_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feature_settings ENABLE ROW LEVEL SECURITY;

-- Set up read policies for each table
-- Users can read their own data, admins can read all data
-- We'll create a function to check if user is admin first

CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = uid AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for client_domains
CREATE POLICY "Allow users to read own domains" ON public.client_domains
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for client_services
CREATE POLICY "Allow users to read own services" ON public.client_services
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for payment_methods
CREATE POLICY "Allow users to read own payment methods" ON public.payment_methods
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for promotions
CREATE POLICY "Allow everyone to read active promotions" ON public.promotions
  FOR SELECT USING (is_active = true OR is_admin(auth.uid()));

-- Create policies for client_tickets
CREATE POLICY "Allow users to read own tickets" ON public.client_tickets
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to OR is_admin(auth.uid()));

-- Create policies for ticket_messages
CREATE POLICY "Allow users to read messages from own tickets" ON public.ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.client_tickets
      WHERE client_tickets.id = ticket_messages.ticket_id
      AND (client_tickets.user_id = auth.uid() OR client_tickets.assigned_to = auth.uid())
    )
    OR is_admin(auth.uid())
  );

-- Create policies for wallets
CREATE POLICY "Allow users to read own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for wallet_transactions
CREATE POLICY "Allow users to read own wallet transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for contact_profiles
CREATE POLICY "Allow users to read own contact profiles" ON public.contact_profiles
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for invoices
CREATE POLICY "Allow users to read own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for orders
CREATE POLICY "Allow users to read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for user_notifications
CREATE POLICY "Allow users to read own notifications" ON public.user_notifications
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Create policies for user_feature_settings
CREATE POLICY "Allow users to read own feature settings" ON public.user_feature_settings
  FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));
