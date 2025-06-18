
import { useAuthSession } from "@/hooks/useAuthSession";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import VotingSystem from "@/components/VotingSystem";

export default function Dashboard() {
  const { user, loading } = useAuthSession();
  const { fullName, loading: profileLoading } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast({ title: "Faça login para acessar a dashboard de usuário." });
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || profileLoading || !user) {
    return (
      <div className="text-center text-institutional-blue py-12">
        Carregando sua dashboard...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-institutional-gray py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-institutional-blue mb-2">
            Bem-vindo{fullName ? `, ${fullName}` : user.email ? `, ${user.email}` : ""}!
          </h1>
          <p className="text-lg text-institutional-navy/80">
            Sua dashboard de votações
          </p>
        </div>
        
        <VotingSystem />
      </div>
    </section>
  );
}
