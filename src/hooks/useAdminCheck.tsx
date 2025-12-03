import { useState, useEffect } from "react";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { projectId, publicAnonKey } from "../utils/supabase/info.tsx";

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user || !session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-181e480f`;
        const response = await fetch(`${API_BASE}/admin/check`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, session]);

  return { isAdmin, loading };
}
