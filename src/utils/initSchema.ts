
import { executeQuery } from '@/integrations/mysql/client';

/**
 * Initialize the database schema if tables don't exist
 */
export async function initializeSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check if users table exists
    const { data: tables } = await executeQuery(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'angodb11'"
    );
    
    if (Array.isArray(tables) && tables.length > 0) {
      console.log('Database schema already exists');
      return true;
    }
    
    console.log('Creating database schema...');
    
    // Users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'customer',
        is_active BOOLEAN DEFAULT TRUE,
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);
    
    // Admin Permissions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS admin_permissions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        full_access BOOLEAN DEFAULT FALSE,
        permissions JSON,
        last_updated VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Domains table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS domains (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        domain_name VARCHAR(255) NOT NULL,
        registration_date VARCHAR(50),
        expiry_date VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        whois_privacy BOOLEAN DEFAULT FALSE,
        is_locked BOOLEAN DEFAULT FALSE,
        auto_renew BOOLEAN DEFAULT FALSE,
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        nameservers JSON,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_domain (domain_name)
      )
    `);
    
    // Orders table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        order_number VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        items JSON,
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        payment_status VARCHAR(50),
        billing_address JSON,
        contact_profile_id VARCHAR(36),
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        tax_amount DECIMAL(10, 2) DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Invoices table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        invoice_number VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        due_date VARCHAR(50),
        payment_date VARCHAR(50),
        items JSON,
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        client_details JSON,
        company_details JSON,
        order_id VARCHAR(36),
        download_url VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
      )
    `);
    
    // Tickets table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        priority VARCHAR(50) DEFAULT 'medium',
        assigned_to VARCHAR(36),
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        ticket_number VARCHAR(50),
        department VARCHAR(50),
        closed_at VARCHAR(50),
        satisfaction_rating INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Ticket Messages table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        ticket_id VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        is_staff BOOLEAN DEFAULT FALSE,
        created_at VARCHAR(50),
        attachments JSON,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Client Services table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS client_services (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        service_type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        price_monthly DECIMAL(10, 2) DEFAULT 0,
        price_yearly DECIMAL(10, 2) DEFAULT 0,
        renewal_date VARCHAR(50),
        control_panel_url VARCHAR(255),
        control_panel_username VARCHAR(255),
        auto_renew BOOLEAN DEFAULT FALSE,
        disk_space INT,
        bandwidth INT,
        last_renewed_at VARCHAR(50),
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Payment Methods table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        payment_type VARCHAR(50) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        card_brand VARCHAR(50),
        card_last_four VARCHAR(4),
        card_expiry VARCHAR(7),
        billing_name VARCHAR(255),
        billing_address TEXT,
        token VARCHAR(255),
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Promotions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS promotions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        code VARCHAR(50) UNIQUE,
        description TEXT NOT NULL,
        discount_amount DECIMAL(10, 2),
        discount_percent DECIMAL(5, 2),
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        minimum_order_value DECIMAL(10, 2) DEFAULT 0,
        applies_to JSON,
        max_uses INT,
        used_count INT DEFAULT 0,
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);
    
    // Wallets table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS wallets (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL UNIQUE,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
        auto_pay BOOLEAN DEFAULT FALSE,
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Wallet Transactions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Contact Profiles table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS contact_profiles (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        document VARCHAR(50) NOT NULL,
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // User Notifications table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        type VARCHAR(50) NOT NULL,
        created_at VARCHAR(50),
        related_id VARCHAR(36),
        related_type VARCHAR(50),
        action_url VARCHAR(255),
        action_text VARCHAR(100),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // User Feature Settings table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_feature_settings (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL UNIQUE,
        features_enabled JSON NOT NULL,
        last_updated VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Domain Extensions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS domain_extensions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        extension VARCHAR(20) NOT NULL UNIQUE,
        price_register DECIMAL(10, 2) NOT NULL,
        price_renew DECIMAL(10, 2) NOT NULL,
        price_transfer DECIMAL(10, 2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_premium BOOLEAN DEFAULT FALSE,
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);
    
    // Products table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price_monthly DECIMAL(10, 2),
        price_yearly DECIMAL(10, 2),
        is_active BOOLEAN DEFAULT TRUE,
        category_id VARCHAR(36),
        features JSON,
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);
    
    // Email Templates table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        variables JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);
    
    console.log('Database schema created successfully');
    return true;
  } catch (error) {
    console.error('Error initializing schema:', error);
    return false;
  }
}
