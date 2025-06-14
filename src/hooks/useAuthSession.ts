
import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type AuthSession = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthSessionContext = createContext<AuthSession>({
  session: null,
  user: null,
  loading: true,
});

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthSessionContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export const useAuthSession = () => useContext(AuthSessionContext);
