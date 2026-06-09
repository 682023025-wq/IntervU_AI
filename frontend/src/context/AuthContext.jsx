import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check Supabase auth session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          // Fallback to localStorage for backward compatibility
          const storedUser = localStorage.getItem('intervu_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem('intervu_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithName = async (name) => {
    try {
      const userData = {
        id: Date.now().toString(),
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@local.dev`,
      };
      
      localStorage.setItem('intervu_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error signing in with name:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Try to sign out from Supabase first
      await supabase.auth.signOut();
      // Also clear localStorage for backward compatibility
      localStorage.removeItem('intervu_user');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: just clear localStorage and redirect
      localStorage.removeItem('intervu_user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithName,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
