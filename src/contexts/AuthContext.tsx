import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Database['public']['Tables']['profiles']['Row'] | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Recupera il profilo dalla tabella profiles
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Errore fetch profilo:', error.message);
        setProfile(null);
        return;
      }
      setProfile(data);
    } catch (err: any) {
      console.error('Errore fetch profilo:', err?.message || err);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { name }
        }
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Errore di registrazione",
          description: error.message
        });
        console.error('Errore signUp:', error.message);
      } else {
        toast({
          title: "Registrazione completata",
          description: "Controlla la tua email per confermare l'account."
        });
      }
      return { error };
    } catch (error: any) {
      const err = error?.message || 'Errore durante la registrazione';
      toast({
        variant: "destructive",
        title: "Errore",
        description: err
      });
      console.error('Errore signUp:', err);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Errore di accesso",
          description: error.message
        });
        console.error('Errore signIn:', error.message);
      } else if (data?.user) {
        await fetchUserProfile(data.user.id);
      }
      return { error };
    } catch (error: any) {
      const err = error?.message || 'Errore durante l\'accesso';
      toast({
        variant: "destructive",
        title: "Errore",
        description: err
      });
      console.error('Errore signIn:', err);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Errore",
          description: error.message
        });
        console.error('Errore signOut:', error.message);
      } else {
        setProfile(null);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: error?.message || 'Errore durante il logout'
      });
      console.error('Errore signOut:', error?.message || error);
    }
  };

  const value = {
    user,
    session,
    profile,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
