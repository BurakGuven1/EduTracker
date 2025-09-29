import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthUser extends User {
  profile?: any;
  isParentLogin?: boolean;
  connectedStudents?: any[];
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check current session once
    const initializeAuth = async () => {
      try {
        // Check for temporary parent login first
        const tempParent = localStorage.getItem('tempParentUser');
        if (tempParent) {
          const parentUser = JSON.parse(tempParent);
          if (mounted) {
            setUser(parentUser);
            setLoading(false);
          }
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.id);
        
        if (mounted) {
          if (session?.user) {
            // Get profile data for the user
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            setUser({
              ...session.user,
              profile
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes - but don't cause loops
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Check for temporary parent login first - don't override it
        const tempParent = localStorage.getItem('tempParentUser');
        if (tempParent) {
          const parentUser = JSON.parse(tempParent);
          if (mounted) {
            setUser(parentUser);
            setLoading(false);
          }
          return;
        }
        
        // Clear temp parent on sign out
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('tempParentUser');
        }
        
        if (mounted) {
          if (session?.user) {
            // Get profile data for the user
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            setUser({
              ...session.user,
              profile
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  // Function to set temporary parent user
  const setParentUser = (parentUser: any) => {
    // Update localStorage as well
    if (parentUser.isParentLogin) {
      localStorage.setItem('tempParentUser', JSON.stringify(parentUser));
    }
    setUser(parentUser);
  };

  // Function to clear user (for logout)
  const clearUser = () => {
    localStorage.removeItem('tempParentUser');
    setUser(null);
  };
  return { user, loading, setParentUser, clearUser };
};