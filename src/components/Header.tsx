
import { Button } from "@/components/ui/button";
import { Scale, Menu } from "lucide-react";
import { useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  onOpenRegisterModal: () => void;
}

const Header = ({ onOpenRegisterModal }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthSession();
  const navigate = useNavigate();

  // Adicionando log para garantir execução do componente
  console.log("Header renderizou. user: ", user);

  let renderError = false;
  let renderErrorMessage = "";

  try {
    // apenas um teste para garantir que navegação, session, etc, não quebra
    if (typeof navigate !== "function") {
      renderError = true;
      renderErrorMessage = "Problema com useNavigate.";
    }
  } catch (err) {
    renderError = true;
    renderErrorMessage = "Erro ao renderizar Header: " + (err instanceof Error ? err.message : err);
  }

  if (renderError) {
    return (
      <div className="bg-red-600 text-white p-3 text-center">
        Erro ao renderizar Header: {renderErrorMessage}
      </div>
    );
  }

  return (
    <header className="bg-institutional-blue shadow-sm border-b border-institutional-blue sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-white" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">
                Urna Cidadã
              </h1>
              <p className="text-xs text-blue-100">
                Simulação de Votação Popular
              </p>
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#caso" className="text-white hover:text-blue-200 transition-colors">
              O Caso
            </a>
            <a href="#apuracao" className="text-white hover:text-blue-200 transition-colors">
              Apuração
            </a>
            <a href="#como-funciona" className="text-white hover:text-blue-200 transition-colors">
              Como Funciona
            </a>
            {!user ? (
              <>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
                  onClick={() => navigate("/auth")}
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
                  onClick={() => navigate("/auth")}
                >
                  Cadastrar
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
                onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
              >
                Sair
              </Button>
            )}
          </nav>
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-institutional-blue/70 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-institutional-blue bg-institutional-blue py-4 space-y-2">
            <a 
              href="#caso" 
              className="block px-4 py-2 text-white hover:text-blue-200 hover:bg-institutional-blue/70 rounded transition-colors"
            >
              O Caso
            </a>
            <a 
              href="#apuracao" 
              className="block px-4 py-2 text-white hover:text-blue-200 hover:bg-institutional-blue/70 rounded transition-colors"
            >
              Apuração
            </a>
            <a 
              href="#como-funciona" 
              className="block px-4 py-2 text-white hover:text-blue-200 hover:bg-institutional-blue/70 rounded transition-colors"
            >
              Como Funciona
            </a>
            <div className="flex space-x-2 px-4 pt-2">
              <Button
                size="sm"
                className="flex-1 bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenRegisterModal();
                }}
              >
                Entrar
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenRegisterModal();
                }}
              >
                Cadastrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
