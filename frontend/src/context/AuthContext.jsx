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
  const [profile, setProfile] = useState(null);

  // Function to save or update profile in database
  const saveProfileToDb = async (userData) => {
    try {
      const profileData = {
        id: userData.id,
        nama_lengkap: userData.name || userData.user_metadata?.full_name || '',
        email: userData.email || userData.user_metadata?.email || '',
        url_avatar: userData.user_metadata?.avatar_url || null,
        penyedia_auth: 'google',
      };

      // Try to insert first
      const { data: insertedData, error: insertError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (insertError && !insertError.message.includes('duplicate')) {
        console.error('Error inserting profile:', insertError);
        // If not duplicate error, try update
        const { data: updatedData, error: updateError } = await supabase
          .from('profiles')
          .update({
            nama_lengkap: profileData.nama_lengkap,
            url_avatar: profileData.url_avatar,
            tanggal_diperbarui: new Date().toISOString(),
          })
          .eq('id', userData.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          setProfile(updatedData);
          return updatedData;
        }
      } else if (insertedData) {
        setProfile(insertedData);
        return insertedData;
      } else {
        // Fetch existing profile
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .single();
        
        if (existingProfile) {
          setProfile(existingProfile);
          return existingProfile;
        }
      }
    } catch (error) {
      console.error('Error saving profile to DB:', error);
    }
    return null;
  };

  // Function to update user profile
  const updateUserProfile = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching updated profile:', error);
      return null;
    }
    
    setProfile(data);
    return data;
  };

  useEffect(() => {
    // Check Supabase auth session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Fetch or create profile
          await saveProfileToDb(session.user);
        } else {
          // Fallback to localStorage for backward compatibility
          const storedUser = localStorage.getItem('intervu_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
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
          // Save profile when user signs in
          await saveProfileToDb(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
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
          redirectTo: `${window.location.origin}/auth/callback`,
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

  const signOut = async () => {
    try {
      // Try to sign out from Supabase first
      await supabase.auth.signOut();
      // Also clear localStorage for backward compatibility
      localStorage.removeItem('intervu_user');
      setUser(null);
      setProfile(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: just clear localStorage and redirect
      localStorage.removeItem('intervu_user');
      setUser(null);
      setProfile(null);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    refreshProfile: () => saveProfileToDb(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
