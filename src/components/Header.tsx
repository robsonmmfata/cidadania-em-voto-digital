
import { Button } from "@/components/ui/button";
import { Scale, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-institutional-blue" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-institutional-navy">
                Urna Cidadã
              </h1>
              <p className="text-xs text-muted-foreground">
                Simulação de Votação Popular
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#caso" className="text-muted-foreground hover:text-institutional-blue transition-colors">
              O Caso
            </a>
            <a href="#apuracao" className="text-muted-foreground hover:text-institutional-blue transition-colors">
              Apuração
            </a>
            <a href="#como-funciona" className="text-muted-foreground hover:text-institutional-blue transition-colors">
              Como Funciona
            </a>
            <Button variant="outline" size="sm">
              Entrar
            </Button>
            <Button size="sm" className="btn-institutional">
              Cadastrar
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4 space-y-2">
            <a 
              href="#caso" 
              className="block px-4 py-2 text-muted-foreground hover:text-institutional-blue hover:bg-slate-50 rounded transition-colors"
            >
              O Caso
            </a>
            <a 
              href="#apuracao" 
              className="block px-4 py-2 text-muted-foreground hover:text-institutional-blue hover:bg-slate-50 rounded transition-colors"
            >
              Apuração
            </a>
            <a 
              href="#como-funciona" 
              className="block px-4 py-2 text-muted-foreground hover:text-institutional-blue hover:bg-slate-50 rounded transition-colors"
            >
              Como Funciona
            </a>
            <div className="flex space-x-2 px-4 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                Entrar
              </Button>
              <Button size="sm" className="btn-institutional flex-1">
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
