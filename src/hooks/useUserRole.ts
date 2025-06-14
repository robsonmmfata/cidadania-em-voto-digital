
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "./useAuthSession";

// Checa papel do usuário no Supabase
export function useUserRole() {
  const { user } = useAuthSession();
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(!!user);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        console.log("[useUserRole] user_id:", user.id, "data:", data, "error:", error);
        if (error || !data) {
          setRole("user");
        } else {
          setRole(data.role);
        }
        setLoading(false);
      });
  }, [user]);

  return { role, loading };
}
