
import VotingPanel from "@/components/VotingPanel";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const { user, loading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast({ title: "Faça login para acessar a dashboard de usuário." });
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  
  if (loading || !user) return null;

  return (
    <section className="min-h-screen bg-institutional-blue/5 flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold text-institutional-blue mb-8">
        Minha Dashboard
      </h2>
      <VotingPanel />
    </section>
  );
}
