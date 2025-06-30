import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  needsEmailVerification: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  setNeedsEmailVerification: (needs: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  needsEmailVerification: false,

  clearError: () => set({ error: null }),
  setNeedsEmailVerification: (needs: boolean) => set({ needsEmailVerification: needs }),

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before logging in. Check your inbox for a verification link.');
        }
        throw error;
      }

      if (data.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          set({ needsEmailVerification: true, isLoading: false });
          throw new Error('Please verify your email address before logging in. Check your inbox for a verification link.');
        }

        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }

        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: profileData?.name || data.user.user_metadata?.full_name || 'User',
            avatar: profileData?.avatar_url || data.user.user_metadata?.avatar_url,
            bio: profileData?.bio,
            location: profileData?.location,
            followersCount: profileData?.followers_count || 0,
            followingCount: profileData?.following_count || 0,
            tipsCount: profileData?.tips_count || 0,
            savedTipsCount: profileData?.saved_tips_count || 0,
          },
          isLoading: false,
          needsEmailVerification: false,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
      
      // The actual user data will be handled by the callback route
      // and getCurrentUser will be called after redirect
      
    } catch (error: any) {
      console.error('Google login error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  register: async (email, password, name) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        }
        throw error;
      }

      if (data.user) {
        // Set user data but mark as needing verification
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name,
            followersCount: 0,
            followingCount: 0,
            tipsCount: 0,
            savedTipsCount: 0,
          },
          needsEmailVerification: true,
          isLoading: false,
        });

        // Note: Profile will be created automatically via the trigger when email is verified
        // or we can create it here but the user won't be able to use it until verified
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false, needsEmailVerification: false });
    } catch (error: any) {
      console.error('Logout error:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  getCurrentUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await supabase.auth.getUser();
      
      if (data.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          set({ 
            user: {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.full_name || 'User',
              followersCount: 0,
              followingCount: 0,
              tipsCount: 0,
              savedTipsCount: 0,
            },
            needsEmailVerification: true, 
            isLoading: false 
          });
          return;
        }

        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // If profile doesn't exist (e.g., after Google login), create one
        if (profileError && profileError.code === 'PGRST116') {
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                name: data.user.user_metadata?.full_name || 'User',
                email: data.user.email || '',
                avatar_url: data.user.user_metadata?.avatar_url || null,
                bio: null,
                location: null,
                followers_count: 0,
                following_count: 0,
                tips_count: 0,
                saved_tips_count: 0,
              },
            ]);

          if (createProfileError) {
            console.error('Profile creation error:', createProfileError);
          }
          
          // Fetch the newly created profile
          const { data: newProfileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          set({
            user: {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.full_name || 'User',
              avatar: data.user.user_metadata?.avatar_url || null,
              bio: null,
              location: null,
              followersCount: 0,
              followingCount: 0,
              tipsCount: 0,
              savedTipsCount: 0,
            },
            needsEmailVerification: false,
            isLoading: false,
          });
          return;
        }

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }

        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: profileData?.name || data.user.user_metadata?.full_name || 'User',
            avatar: profileData?.avatar_url || data.user.user_metadata?.avatar_url,
            bio: profileData?.bio,
            location: profileData?.location,
            followersCount: profileData?.followers_count || 0,
            followingCount: profileData?.following_count || 0,
            tipsCount: profileData?.tips_count || 0,
            savedTipsCount: profileData?.saved_tips_count || 0,
          },
          needsEmailVerification: false,
          isLoading: false,
        });
      } else {
        set({ user: null, needsEmailVerification: false, isLoading: false });
      }
    } catch (error: any) {
      console.error('Get current user error:', error);
      set({ user: null, needsEmailVerification: false, error: error.message, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const user = get().user;
      if (!user) throw new Error('Not authenticated');

      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          bio: data.bio,
          location: data.location,
          avatar_url: data.avatar,
        })
        .eq('id', user.id);

      if (error) throw error;

      set({
        user: { ...user, ...data },
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));