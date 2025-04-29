
import { useState, useEffect, createContext, useContext } from 'react';
import { executeQuery } from '@/integrations/mysql/client';
import { toast } from 'sonner';

// Define user type for our auth system
export interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and provides auth context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a session in localStorage
        const storedSession = localStorage.getItem('auth_session');
        
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          const { userId, expiry } = sessionData;
          
          // Check if session is expired
          if (new Date(expiry) < new Date()) {
            localStorage.removeItem('auth_session');
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
            return;
          }
          
          // Fetch user data
          const { data, error } = await executeQuery(
            'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = ?',
            [userId]
          );
          
          if (error || !data || !Array.isArray(data) || data.length === 0) {
            localStorage.removeItem('auth_session');
            setUser(null);
            setIsAdmin(false);
          } else {
            setUser(data[0] as User);
            setIsAdmin((data[0] as User).role === 'admin');
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, this would hash the password and compare it securely
      const { data, error } = await executeQuery(
        'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE email = ? AND password = ?',
        [email, password]
      );
      
      if (error || !data || !Array.isArray(data) || data.length === 0) {
        toast.error('Credenciais inválidas');
        return { success: false };
      }
      
      const userData = data[0] as User;
      
      // Save session in localStorage
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7); // 7 day session
      
      localStorage.setItem('auth_session', JSON.stringify({
        userId: userData.id,
        expiry: expiry.toISOString()
      }));
      
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      toast.success('Login realizado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Erro ao fazer login');
      return { success: false };
    }
  };

  // Sign up with email, password and name
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUser && Array.isArray(existingUser) && existingUser.length > 0) {
        toast.error('Este e-mail já está cadastrado');
        return { success: false };
      }
      
      // Create user
      const { data, error } = await executeQuery(
        'INSERT INTO users (email, password, full_name, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [email, password, fullName, 'customer', true, new Date().toISOString()]
      );
      
      if (error) {
        toast.error('Erro ao criar conta');
        return { success: false };
      }
      
      // Get the user ID - in MySQL/MariaDB we can use lastInsertId
      const userId = (data as any).insertId;
      
      // Log user in
      const { data: userData } = await executeQuery(
        'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = ?',
        [userId]
      );
      
      if (userData && Array.isArray(userData) && userData.length > 0) {
        setUser(userData[0] as User);
        
        // Save session
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        
        localStorage.setItem('auth_session', JSON.stringify({
          userId: (userData[0] as User).id,
          expiry: expiry.toISOString()
        }));
        
        toast.success('Conta criada com sucesso');
        return { success: true };
      } else {
        toast.error('Erro ao criar conta');
        return { success: false };
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Erro ao criar conta');
      return { success: false };
    }
  };

  // Sign out
  const signOut = async () => {
    localStorage.removeItem('auth_session');
    setUser(null);
    setIsAdmin(false);
    toast.success('Logout realizado com sucesso');
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      toast.error('Você precisa estar logado para atualizar o perfil');
      return false;
    }
    
    try {
      // Build the query dynamically based on what fields are being updated
      let queryFields: string[] = [];
      let queryParams: any[] = [];
      
      if (updates.full_name !== undefined) {
        queryFields.push('full_name = ?');
        queryParams.push(updates.full_name);
      }
      
      if (updates.email !== undefined) {
        queryFields.push('email = ?');
        queryParams.push(updates.email);
      }
      
      // Add more fields as needed
      
      if (queryFields.length === 0) {
        return true; // Nothing to update
      }
      
      // Add the user ID at the end for the WHERE clause
      queryParams.push(user.id);
      
      const { error } = await executeQuery(
        `UPDATE users SET ${queryFields.join(', ')} WHERE id = ?`,
        queryParams
      );
      
      if (error) {
        toast.error('Erro ao atualizar perfil');
        return false;
      }
      
      // Update local user state
      setUser({ ...user, ...updates });
      toast.success('Perfil atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
      return false;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      // In a real app, you would send an email with a reset link
      // For this demo, we'll just simulate the process
      
      // Check if the email exists
      const { data, error } = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (error || !data || !Array.isArray(data) || data.length === 0) {
        // Don't reveal if the email exists for security reasons
        toast.success('Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha');
        return true;
      }
      
      // In a real app, you would generate a token and send an email
      toast.success('Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha');
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Erro ao redefinir senha');
      return false;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Carregando...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
