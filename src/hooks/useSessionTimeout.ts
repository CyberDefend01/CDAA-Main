import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp';

export const useSessionTimeout = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSigningOut = useRef(false);

  const handleSignOut = useCallback(async () => {
    if (isSigningOut.current) return;
    isSigningOut.current = true;

    try {
      // Clear the last activity timestamp
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      toast.info('Session expired due to inactivity. Please sign in again.');
      
      // Navigate to home page (not dashboard) for security
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/', { replace: true });
    } finally {
      isSigningOut.current = false;
    }
  }, [navigate]);

  const resetTimer = useCallback(() => {
    // Update last activity timestamp
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      handleSignOut();
    }, INACTIVITY_TIMEOUT);
  }, [handleSignOut]);

  const checkStoredActivity = useCallback(() => {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10);
      if (elapsed > INACTIVITY_TIMEOUT) {
        // Session expired while tab was closed
        handleSignOut();
        return false;
      }
    }
    return true;
  }, [handleSignOut]);

  useEffect(() => {
    // Check if session should be valid on mount
    const isValid = checkStoredActivity();
    if (!isValid) return;

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'focus',
    ];

    // Throttle activity updates to avoid excessive localStorage writes
    let lastUpdate = 0;
    const throttledReset = () => {
      const now = Date.now();
      if (now - lastUpdate > 30000) { // Update at most every 30 seconds
        lastUpdate = now;
        resetTimer();
      }
    };

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, throttledReset, { passive: true });
    });

    // Handle visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if session expired while away
        checkStoredActivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, throttledReset);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetTimer, checkStoredActivity]);

  return { resetTimer };
};
