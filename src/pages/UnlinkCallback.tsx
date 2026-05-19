import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { track } from '@/hooks/useAmplitude';

export default function UnlinkCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        // Attempt client sign out (no-op if not using supabase session)
        if (supabase?.auth?.signOut) {
          try {
            await supabase.auth.signOut();
          } catch (e) {
            // ignore
          }
        }

        // Clear local tokens and user info
        localStorage.removeItem('app_token');
        localStorage.removeItem('app_user');

        track('user_unlinked');

        toast({ title: '연동 해제됨', description: '연동이 해제되었습니다. 다시 로그인해 주세요.' });
      } catch (e) {
        console.error('Error handling unlink callback', e);
      } finally {
        // Redirect back to home / onboarding
        navigate('/', { replace: true });
      }
    })();
  }, [navigate, toast]);

  return null;
}
