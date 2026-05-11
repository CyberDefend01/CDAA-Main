import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const TAB_AWAY_TIMEOUT = 10 * 60 * 1000; // 10 minutes away from tab
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp';

const DASHBOARD_PREFIXES = ['/student', '/instructor', '/admin'];

const isDashboardRoute = (pathname: string) =>
  DASHBOARD_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export const useSessionTimeout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tabAwayRef = useRef<NodeJS.Timeout | null>(null);
  const isSigningOut = useRef(false);

  const handleSignOut = useCallback(async (reason: string) => {
    if (isSigningOut.current) return;
    isSigningOut.current = true;

    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      await supabase.auth.signOut();
      toast.info(reason);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/', { replace: true });
    } finally {
      isSigningOut.current = false;
    }
  }, [navigate]);

  const resetTimer = useCallback(() => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSignOut('Session expired due to inactivity. Please sign in again.');
    }, INACTIVITY_TIMEOUT);
  }, [handleSignOut]);

  const checkStoredActivity = useCallback(() => {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10);
      if (elapsed > INACTIVITY_TIMEOUT) {
        handleSignOut('Session expired due to inactivity. Please sign in again.');
        return false;
      }
    }
    return true;
  }, [handleSignOut]);

  // Tab visibility — sign out if user leaves tab for too long
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        tabAwayRef.current = setTimeout(() => {
          handleSignOut('Session ended — you were away for too long. Please sign in again.');
        }, TAB_AWAY_TIMEOUT);
      } else {
        if (tabAwayRef.current) {
          clearTimeout(tabAwayRef.current);
          tabAwayRef.current = null;
        }
        checkStoredActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (tabAwayRef.current) clearTimeout(tabAwayRef.current);
    };
  }, [handleSignOut, checkStoredActivity]);

  // Inactivity tracking
  useEffect(() => {
    const isValid = checkStoredActivity();
    if (!isValid) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    let lastUpdate = 0;
    const throttledReset = () => {
      const now = Date.now();
      if (now - lastUpdate > 30000) {
        lastUpdate = now;
        resetTimer();
      }
    };

    resetTimer();

    events.forEach((event) => {
      document.addEventListener(event, throttledReset, { passive: true });
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        document.removeEventListener(event, throttledReset);
      });
    };
  }, [resetTimer, checkStoredActivity]);

  return { resetTimer };
};
