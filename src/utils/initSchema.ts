
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
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
        auto_renew BOOLEAN DEFAULT FALSE,
        created_at VARCHAR(50),
        updated_at VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database schema created successfully');
    return true;
  } catch (error) {
    console.error('Error initializing schema:', error);
    return false;
  }
}
