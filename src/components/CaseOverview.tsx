
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, AlertTriangle } from "lucide-react";

const CaseOverview = () => {
  const defendants = [
    { name: "João Silva Santos", status: "Réu Principal", accusations: ["Corrupção", "Lavagem de Dinheiro"] },
    { name: "Maria Oliveira Costa", status: "Corré", accusations: ["Formação de Quadrilha", "Evasão de Divisas"] },
    { name: "Carlos Pereira Lima", status: "Réu", accusations: ["Corrupção Passiva", "Peculato"] },
    { name: "Ana Souza Mendes", status: "Corré", accusations: ["Lavagem de Dinheiro"] },
    { name: "Pedro Costa Alves", status: "Réu", accusations: ["Corrupção Ativa", "Formação de Quadrilha"] },
    { name: "Lucia Santos Rocha", status: "Corré", accusations: ["Peculato", "Prevaricação"] },
    { name: "Roberto Lima Silva", status: "Réu", accusations: ["Corrupção", "Evasão de Divisas"] },
    { name: "Carmen Alves Costa", status: "Corré", accusations: ["Lavagem de Dinheiro", "Formação de Quadrilha"] }
  ];

  return (
    <section id="caso" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-institutional-navy">
              O Caso em Julgamento
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Operação que investiga esquema de corrupção envolvendo recursos públicos, 
              formação de organização criminosa e lavagem de dinheiro.
            </p>
          </div>

          {/* Case Summary */}
          <Card className="mb-8 card-institutional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    <FileText className="mr-3 h-6 w-6 text-institutional-blue" />
                    Resumo do Caso
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Operação Justiça Transparente - Processo nº 2024.STF.001234
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-sm bg-institutional-blue text-white">
                  <AlertTriangle className="mr-1 h-4 w-4 text-institutional-green" />
                  Alto Impacto
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-institutional-navy">Principais Acusações:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Corrupção ativa e passiva</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Lavagem de dinheiro</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Formação de organização criminosa</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>Peculato e evasão de divisas</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-institutional-navy">Cronologia:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-institutional-blue mr-2 mt-1" />
                      <div>
                        <p className="font-medium">2019-2023</p>
                        <p className="text-sm text-muted-foreground">Período investigado</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-institutional-blue mr-2 mt-1" />
                      <div>
                        <p className="font-medium">Março 2024</p>
                        <p className="text-sm text-muted-foreground">Início do julgamento</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-institutional-green mr-2 mt-1" />
                      <div>
                        <p className="font-medium">Dezembro 2024</p>
                        <p className="text-sm text-muted-foreground">Consulta popular ativa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Defendants Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-institutional-navy text-center">
              Réus em Julgamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {defendants.map((defendant, index) => (
                <Card key={index} className="card-institutional hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-institutional-blue/20 to-institutional-green/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-600">
                        {defendant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <CardTitle className="text-center text-lg">
                      {defendant.name}
                    </CardTitle>
                    <Badge 
                      variant={defendant.status === "Réu Principal" ? "destructive" : "secondary"}
                      className={`mx-auto ${defendant.status === "Réu Principal" ? "bg-institutional-blue text-white" : ""}`}
                    >
                      {defendant.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {defendant.accusations.map((accusation, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                          {accusation}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-institutional">
                <FileText className="mr-2 h-5 w-5" />
                Ler Detalhes Completos
              </Button>
              <Button size="lg" variant="outline">
                Ver Depoimentos dos Réus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseOverview;

