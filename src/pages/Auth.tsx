import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: redirectUrl
        }
      });
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message });
        setLoading(false);
        return;
      }
      toast({ title: "Cadastro realizado", description: "Verifique seu e-mail." });
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Erro ao entrar", description: error.message });
        setLoading(false);
        return;
      }
      toast({ title: "Bem-vindo!" });
      // Redirecionamento condicional: role pode precisar de tempo para carregar, aguarde via useEffect abaixo
      // Não navega imediatamente aqui!
    }
    setLoading(false);
  }

  // cores padronizadas e modernas para todos os inputs
  const inputClass =
    "mb-3 bg-white border border-gray-300 placeholder:text-gray-500 focus:border-institutional-blue focus:ring-institutional-blue";

  // classes azul institucional p/ botão principal
  const buttonClass =
    "w-full mb-3 bg-institutional-blue text-white hover:bg-institutional-blue/90 transition-colors";

  // Adiciona efeito para redirecionar após login, assim que papel for carregado
  // Se for admin, manda para /admin
  // Se for user, manda para /dashboard
  // Obs: navega apenas se usuário logado e role carregada (não null)
  useEffect(() => {
    if (loading || roleLoading) return;
    if (role === "admin") {
      navigate("/admin");
    } else if (role) {
      navigate("/dashboard");
    }
    // else permanece na tela de auth
  }, [role, roleLoading, loading, navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-institutional-blue">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm" onSubmit={handleAuth}>
        <h1 className="text-2xl font-bold mb-4 text-center text-institutional-blue">
          {isSignUp ? "Cadastrar" : "Entrar"}
        </h1>
        {isSignUp && (
          <Input
            placeholder="Nome Completo"
            className={inputClass}
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        )}
        <Input
          placeholder="E-mail"
          className={inputClass}
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          placeholder="Senha"
          className={`mb-4 bg-white border border-gray-300 placeholder:text-gray-500 focus:border-institutional-blue focus:ring-institutional-blue`}
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          className={buttonClass}
          type="submit"
          disabled={loading}
        >
          {isSignUp ? "Cadastrar" : "Entrar"}
        </Button>
        <button
          type="button"
          className="text-institutional-blue underline text-sm w-full"
          onClick={() => setIsSignUp(s => !s)}
          disabled={loading}
        >
          {isSignUp ? "Já tem conta? Entrar" : "Ainda não tem conta? Cadastre-se"}
        </button>
      </form>
    </section>
  );
}
