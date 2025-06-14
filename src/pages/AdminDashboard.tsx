
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

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
    if (!roleLoading && role !== "admin") {
      toast({ title: "Acesso negado. Somente administradores." });
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  if (userLoading || roleLoading || !user) return null;

  // Aqui você pode adicionar cards/info de gestão
  return (
    <section className="min-h-screen bg-institutional-blue/5 flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold text-institutional-blue mb-8">
        Admin Dashboard
      </h2>
      <div className="text-institutional-blue text-lg mb-6">Bem-vindo(a), administrador!</div>
      <div>
        {/* Espaço para admins criarem/manterem julgamentos etc */}
        <div className="text-institutional-blue/80 mb-4">
          (Em breve: painel de criação e gestão de julgamentos)
        </div>
      </div>
    </section>
  );
}
