
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Scale, Users, Vote, Shield, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import CaseOverview from "@/components/CaseOverview";
import VotingResults from "@/components/VotingResults";
import RegisterModal from "@/components/RegisterModal";

const Index = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const totalVotes = 15847;
  const registeredUsers = 18492;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-institutional text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Scale className="h-16 w-16 text-white/90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Urna Eletrônica Cidadã
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
              Simulação de votação popular sobre o julgamento dos réus no STF
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button 
                size="lg" 
                className="bg-white text-institutional-blue hover:bg-white/90 font-semibold py-4 px-8"
                onClick={() => setShowRegisterModal(true)}
              >
                <Vote className="mr-2 h-5 w-5" />
                Registrar Meu Voto
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-institutional-blue font-semibold py-4 px-8"
              >
                <Users className="mr-2 h-5 w-5" />
                Ver Apuração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center card-institutional">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-institutional-blue">
                  {totalVotes.toLocaleString()}
                </CardTitle>
                <CardDescription className="text-lg">Votos Registrados</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center card-institutional">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-institutional-green">
                  {registeredUsers.toLocaleString()}
                </CardTitle>
                <CardDescription className="text-lg">Cidadãos Cadastrados</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center card-institutional">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-institutional-gold">
                  8
                </CardTitle>
                <CardDescription className="text-lg">Réus em Julgamento</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Overview */}
      <CaseOverview />

      {/* Voting Results */}
      <VotingResults />

      {/* Security Notice */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto card-institutional">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-institutional-blue" />
              </div>
              <CardTitle className="text-2xl mb-2">Segurança e Transparência</CardTitle>
              <CardDescription className="text-lg">
                Este sistema utiliza tecnologias avançadas de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-institutional-green rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Validação por CPF e Título</h4>
                      <p className="text-sm text-muted-foreground">
                        Verificação automática dos dados eleitorais
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-institutional-green rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Criptografia de Dados</h4>
                      <p className="text-sm text-muted-foreground">
                        Informações protegidas com algoritmos avançados
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-institutional-green rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Auditoria Completa</h4>
                      <p className="text-sm text-muted-foreground">
                        Logs detalhados de todas as operações
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-institutional-green rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Pagamento Seguro</h4>
                      <p className="text-sm text-muted-foreground">
                        Validação via Pix com confirmação automática
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-institutional-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sua Opinião É Importante
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Participe desta consulta cidadã e contribua para o debate democrático sobre 
            um dos julgamentos mais importantes do país.
          </p>
          <Button 
            size="lg" 
            className="bg-institutional-green hover:bg-institutional-green/90 font-semibold py-4 px-8"
            onClick={() => setShowRegisterModal(true)}
          >
            Começar Meu Cadastro
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <RegisterModal 
        open={showRegisterModal} 
        onOpenChange={setShowRegisterModal} 
      />
    </div>
  );
};

export default Index;
