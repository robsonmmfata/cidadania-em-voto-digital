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
import VotingPanel from "@/components/VotingPanel";

const Index = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const totalVotes = 15847;
  const registeredUsers = 18492;

  return (
    <div className="min-h-screen bg-institutional-blue">
      <Header onOpenRegisterModal={() => setShowRegisterModal(true)} />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-institutional-blue text-white">
        <div className="absolute inset-0 bg-institutional-blue"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Scale className="h-16 w-16 text-white/90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in text-white">
              Urna Eletrônica Cidadã Do Povo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
              Simulação de votação popular sobre o julgamento dos réus no STF
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                size="lg"
                className="bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold py-4 px-8 transition-colors"
                onClick={() => setShowRegisterModal(true)}
              >
                <Vote className="mr-2 h-5 w-5" />
                Registrar Meu Voto
              </Button>
              <Button
                size="lg"
                className="bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold py-4 px-8 transition-colors"
              >
                <Users className="mr-2 h-5 w-5" />
                Ver Apuração
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-institutional-blue/90">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center card-institutional bg-institutional-blue/80 border-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">
                  {totalVotes.toLocaleString()}
                </CardTitle>
                <CardDescription className="text-lg text-blue-100">Votos Registrados</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center card-institutional bg-institutional-blue/80 border-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">
                  {registeredUsers.toLocaleString()}
                </CardTitle>
                <CardDescription className="text-lg text-blue-100">Cidadãos Cadastrados</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center card-institutional bg-institutional-blue/80 border-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">
                  8
                </CardTitle>
                <CardDescription className="text-lg text-blue-100">Réus em Julgamento</CardDescription>
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
      <section className="py-16 bg-institutional-blue">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto card-institutional bg-institutional-blue/90 border border-white/10">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2 text-white">Segurança e Transparência</CardTitle>
              <CardDescription className="text-lg text-blue-100">
                Este sistema utiliza tecnologias avançadas de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white">Validação por CPF e Título</h4>
                      <p className="text-sm text-blue-100">
                        Verificação automática dos dados eleitorais
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white">Criptografia de Dados</h4>
                      <p className="text-sm text-blue-100">
                        Informações protegidas com algoritmos avançados
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white">Auditoria Completa</h4>
                      <p className="text-sm text-blue-100">
                        Logs detalhados de todas as operações
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-white">Pagamento Seguro</h4>
                      <p className="text-sm text-blue-100">
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
      <section className="py-20 bg-institutional-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Sua Opinião É Importante
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Participe desta consulta cidadã e contribua para o debate democrático sobre 
            um dos julgamentos mais importantes do país.
          </p>
          <Button
            size="lg"
            className="bg-white/10 hover:bg-institutional-blue/70 font-semibold py-4 px-8 text-white transition-colors"
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
      <VotingPanel />
    </div>
  );
};

export default Index;
