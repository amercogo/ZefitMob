import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

// Type for the member (clan) row from the database
type Clan = Database['public']['Tables']['clanovi']['Row'];

// Auth context type
interface AuthContextType {
  session: Session | null;
  user: User | null;
  member: Clan | null; // Member data from clanovi table
  loading: boolean;
  authInitializing: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    extraFields: { ime_prezime: string; telefon?: string }
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshMember: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Clan | null>(null);
  const [loading, setLoading] = useState(false);
  const [authInitializing, setAuthInitializing] = useState(true);

  /**
   * Generates a unique clan_kod for a new member
   * Format: CLAN-{first 8 chars of UUID}
   */
  const generateClanKod = (userId: string): string => {
    const shortId = userId.replace(/-/g, '').substring(0, 8).toUpperCase();
    return `CLAN-${shortId}`;
  };

  /**
   * Fetches the member data from the clanovi table for the current user.
   * Links by clanovi.id = auth.users.id
   */
  const fetchMember = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('clanovi')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching member:', error);
        setMember(null);
        return;
      }

      setMember(data);
    } catch (error) {
      console.error('Unexpected error fetching member:', error);
      setMember(null);
    }
  };

  /**
   * Refreshes the member data - useful when member data is updated elsewhere
   */
  const refreshMember = async () => {
    if (user?.id) {
      await fetchMember(user.id);
    }
  };

  /**
   * Initializes auth state by checking for existing session
   */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMember(session.user.id);
      }
      setAuthInitializing(false);
    });

    // Subscribe to auth state changes
    // This listener fires when:
    // - User signs in/out
    // - Session is refreshed
    // - Token expires
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch member data when user signs in or session is restored
        await fetchMember(session.user.id);
      } else {
        // Clear member data when user signs out
        setMember(null);
      }

      setAuthInitializing(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Signs in a user with email and password
   */
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Session and user are automatically updated via onAuthStateChange
      // Member data will be fetched automatically in the listener
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs up a new user with email and password, then creates a member entry in clanovi table
   * Links by clanovi.id = auth.users.id
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    extraFields: { ime_prezime: string; telefon?: string }
  ) => {
    setLoading(true);
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return { error: authError };
      }

      // Step 2: Create member entry in public.clanovi table
      // Link by clanovi.id = auth.users.id
      if (authData.user) {
        const clanKod = generateClanKod(authData.user.id);
        
        const { error: memberError } = await supabase.from('clanovi').insert({
          id: authData.user.id, // Link by UUID: clanovi.id = auth.users.id
          clan_kod: clanKod,
          ime_prezime: extraFields.ime_prezime,
          telefon: extraFields.telefon || null,
          email: email,
          status: 'aktivni', // Default status
          role: 'clan', // Default role for mobile app users
          // napravljeno will be set by database default (now())
        });

        if (memberError) {
          console.error('Error creating member:', memberError);
          // If member creation fails, we should ideally rollback the auth user
          // For now, we log the error - the user exists but member data is missing
          return { error: { ...memberError, message: 'Failed to create member profile' } as AuthError };
        }
      }

      // Session and member data will be updated via onAuthStateChange
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Session, user, and member data are cleared via onAuthStateChange
    } catch (error) {
      console.error('Unexpected error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    member,
    loading,
    authInitializing,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshMember,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Throws error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

