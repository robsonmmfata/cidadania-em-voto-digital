
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "./useAuthSession";

export function useUserProfile() {
  const { user } = useAuthSession();
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!user);

  useEffect(() => {
    if (!user) {
      setFullName(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setFullName(data?.full_name ?? null);
        setLoading(false);
      });
  }, [user]);

  return { fullName, loading };
}
