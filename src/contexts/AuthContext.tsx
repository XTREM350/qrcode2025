import { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      // Utilisez .maybeSingle() pour gérer le cas où aucune ligne n'est retournée
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error || !data) {
        throw error || new Error('Profil utilisateur non trouvé');
      }

      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Aucun utilisateur trouvé');

      await fetchUserProfile(data.user);
      toast.success('Connexion réussie');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Échec de la connexion. Veuillez vérifier vos identifiants.');
      setIsLoading(false);
      return false;
    }
  };



  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setIsLoading(true);

      // 1. Inscription Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            // Assurez-vous que le rôle est bien passé ici
            role: userData.role || 'parent',
            organization: userData.organization
          }
        }
      });

      if (authError || !authData.user) throw authError || new Error('Échec auth');

      // 2. Appel de la fonction PostgreSQL
      const { error: dbError } = await supabase.rpc('create_user_profile', {
        p_user_id: authData.user.id,
        p_email: email,
        p_name: userData.name || '',
        p_phone: userData.phone || '',
        // Utilisez le rôle de userData ou 'parent' par défaut
        p_role: userData.role || 'parent',
        p_organization: userData.organization || '',
        p_avatar_url: userData.avatar_url || null
      });

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut({ scope: 'local' });
      window.location.href = '/login';
      localStorage.clear()

      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Échec de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success('Instructions de réinitialisation envoyées par email');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Échec de l\'envoi des instructions de réinitialisation');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
