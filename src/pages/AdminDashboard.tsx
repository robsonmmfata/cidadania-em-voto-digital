
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import AdminPanel from "@/components/AdminPanel";

export default function AdminDashboard() {
  const { user, loading: userLoading } = useAuthSession();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      toast({ title: "Precisa estar autenticado para acessar o painel administrativo." });
      navigate("/auth");
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && role !== null && role !== "admin") {
      toast({ title: "Acesso negado. Somente administradores." });
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  if (userLoading || roleLoading || !user) {
    return <div className="text-center text-institutional-blue py-12">Carregando sua dashboard...</div>;
  }

  return (
    <section className="min-h-screen bg-institutional-gold flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold text-institutional-blue mb-8">
        Painel do Administrador
      </h2>
      <div className="text-institutional-blue text-lg mb-8">Bem-vindo(a), administrador!</div>
      <div className="w-full flex flex-col items-center">
        <AdminPanel />
      </div>
    </section>
  );
}
