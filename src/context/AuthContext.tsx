
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string, username: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  updateUserMetadata: (metadata: Record<string, any>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Avoid initializing auth more than once
    if (authInitialized) return;
    
    const initializeAuth = async () => {
      // First check for existing session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Initial session check:", sessionData.session ? "Session found" : "No session");
      setSession(sessionData.session);
      setUser(sessionData.session?.user ?? null);
      
      // Then set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          // Only update if the session actually changed
          if (event !== 'INITIAL_SESSION') {
            console.log("Auth state change event:", event);
            setSession(newSession);
            setUser(newSession?.user ?? null);
          }
        }
      );
      
      setIsLoading(false);
      setAuthInitialized(true);
      
      return () => subscription.unsubscribe();
    };
    
    initializeAuth();
  }, [authInitialized]);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      return { data: data.session, error };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.session) {
        // Only navigate if there's a successful login and a session
        navigate('/');
      }
      
      return { data: data.session, error };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // Only navigate after successful sign out
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserMetadata = async (metadata: Record<string, any>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (error) throw error;
      
      // Update local user state with new metadata
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...metadata
          }
        });
      }
      
      return;
    } catch (error) {
      console.error("Error updating user metadata:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserMetadata,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
