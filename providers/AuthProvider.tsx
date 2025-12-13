import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
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
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
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
   * Generates a unique 8-digit barcode value for a new member
   * Format: 8-digit random number as string (range 10000000-99999999)
   */
  const generateBarcodeValue = (): string => {
    return String(Math.floor(10000000 + Math.random() * 90000000));
  };

  /**
   * Generates a unique clan_kod for a new member
   * Format: ZE-{8-digit barcode_value}
   */
  const generateClanKod = (barcodeValue: string): string => {
    return `ZE-${barcodeValue}`;
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchMember(session.user.id);
      } else {
        setMember(null);
      }

      setAuthInitializing(false);
    });

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

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs up a new user with email and password, then creates/updates
   * a member entry in clanovi table (upsert by id).
   * Links by clanovi.id = auth.users.id
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    extraFields: { ime_prezime: string; telefon?: string }
  ) => {
    setLoading(true);
    try {
      console.log('🔴 signUpWithEmail START', { email });

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('🟡 auth.signUp result:', { authData, authError });

      if (authError) {
        return { error: authError };
      }

      // Step 2: Upsert member entry in public.clanovi table
      if (authData.user) {
        // Generate 8-digit barcode value
        const barcodeValue = generateBarcodeValue();
        const clanKod = generateClanKod(barcodeValue);

        console.log('🟡 Generated codes:', { barcodeValue, clanKod });

        const { data: clanData, error: memberError } = await supabase
          .from('clanovi')
          .upsert(
            {
              id: authData.user.id, // if row exists → UPDATE, else INSERT
              clan_kod: clanKod,
              barcode_value: barcodeValue,
              barcode_image_url: null, // Will be generated via Edge Function
              ime_prezime: extraFields.ime_prezime,
              telefon: extraFields.telefon || null,
              email: email,
              status: 'aktivni',
              role: 'clan',
              // napravljeno stays from existing row or DB default
            },
            {
              onConflict: 'id',
            }
          )
          .select()
          .single();

        console.log('🟡 clanovi upsert result:', { clanData, memberError });

        if (memberError) {
          console.error('Error creating/updating member:', memberError);
          const authError = {
            name: 'MemberCreationError',
            message: memberError.message || 'Failed to create member profile',
            status: 400,
            code: memberError.code || 'member_creation_failed',
          } as unknown as AuthError;
          return { error: authError };
        }

        // Step 3: Generate barcode image via Edge Function (non-blocking)
        if (clanData && clanData.id && clanData.barcode_value) {
          try {
            console.log('🟣 Calling generate_member_barcode with:', {
              memberId: clanData.id,
              barcodeValue: clanData.barcode_value,
            });

            const { data: fnData, error: fnError } =
              await supabase.functions.invoke('generate_member_barcode', {
                body: {
                  memberId: clanData.id,
                  barcodeValue: clanData.barcode_value,
                },
              });

            console.log('🟢 Edge function result:', { fnData, fnError });

            if (fnError) {
              console.warn('Barcode function error:', fnError);
            } else if (authData.user) {
              // Refresh member data to get updated barcode_image_url
              await fetchMember(authData.user.id);
            }
          } catch (err) {
            console.warn('Error calling generate_member_barcode:', err);
            // Don't fail signup if barcode generation fails
          }
        } else {
          console.warn('⚠ clanData missing id or barcode_value:', clanData);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
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
