import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { AuthUser, getCurrentUser } from './auth';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthUser | null>;
  signUp: (email: string, password: string, name: string) => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return;
    } catch (error) {
      console.error('Error refreshing user:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Check if the user is already logged in
        await refreshUser();

        // Subscribe to auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session: Session | null) => {
            console.log('Auth event:', event);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              await refreshUser();
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
            }
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a timeout promise to prevent hanging
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          console.error('Sign in operation timed out');
          reject(new Error('Sign in operation timed out. Please try again.'));
        }, 10000);
      });
      
      // Use Promise.race to apply timeout
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        throw signInError;
      }
      
      if (!data?.user) {
        setError('Login failed. Please check your credentials and try again.');
        return null;
      }
      
      await refreshUser();
      return await getCurrentUser();
    } catch (error) {
      console.error('Error signing in:', error);
      
      // Handle specific auth errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message.includes('timed out')) {
          setError('Login attempt timed out. Please check your connection and try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to sign in. Please try again.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Proceed with signup. If email confirmations are required, session will be null
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        if (error.message.includes('already exists') || error.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          throw error;
        }
        return null;
      }

      if (!data?.user) {
        setError('Failed to create account. Please try again.');
        return null;
      }

      // If email confirmation is required, there will be no session yet
      if (!data.session) {
        setError('Account created. Please check your email to confirm your account and then sign in.');
        return null;
      }

      await refreshUser();
      return await getCurrentUser();
    } catch (error) {
      console.error('Error signing up:', error);
      
      // Handle specific auth errors
      if (error instanceof Error) {
        if (error.message.includes('already exists') || error.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to sign up. Please try again.');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshUser,
    clearError,
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