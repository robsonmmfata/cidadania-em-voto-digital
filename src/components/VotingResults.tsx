
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, BarChart3 } from "lucide-react";

const VotingResults = () => {
  const votingData = [
    { 
      name: "João Silva Santos", 
      favor: 78, 
      contra: 22, 
      totalVotes: 2341,
      trend: "up"
    },
    { 
      name: "Maria Oliveira Costa", 
      favor: 65, 
      contra: 35, 
      totalVotes: 2298,
      trend: "down"
    },
    { 
      name: "Carlos Pereira Lima",
      favor: 82, 
      contra: 18, 
      totalVotes: 2187,
      trend: "up"  
    },
    { 
      name: "Ana Souza Mendes", 
      favor: 71, 
      contra: 29, 
      totalVotes: 2156,
      trend: "up"
    },
    { 
      name: "Pedro Costa Alves", 
      favor: 89, 
      contra: 11, 
      totalVotes: 2321,
      trend: "up"
    },
    { 
      name: "Lucia Santos Rocha", 
      favor: 59, 
      contra: 41, 
      totalVotes: 2089,
      trend: "down"
    },
    { 
      name: "Roberto Lima Silva", 
      favor: 74, 
      contra: 26, 
      totalVotes: 2234,
      trend: "up"
    },
    { 
      name: "Carmen Alves Costa", 
      favor: 68, 
      contra: 32, 
      totalVotes: 2198,
      trend: "down"
    }
  ];

  return (
    <section id="apuracao" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-institutional-navy">
              Apuração em Tempo Real
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Acompanhe os resultados da consulta popular sobre cada réu em julgamento.
              Os dados são atualizados automaticamente a cada novo voto registrado.
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="card-institutional text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-institutional-blue">
                  17,824
                </CardTitle>
                <CardDescription>Total de Votos</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="card-institutional text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-institutional-green">
                  73.2%
                </CardTitle>
                <CardDescription>Média Condenação</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="card-institutional text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-institutional-gold">
                  26.8%
                </CardTitle>
                <CardDescription>Média Absolvição</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="card-institutional text-center">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-slate-600">
                  8/8
                </CardTitle>
                <CardDescription>Réus Avaliados</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Individual Results */}
          <div className="space-y-4">
            {votingData.map((defendant, index) => (
              <Card key={index} className="card-institutional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-600">
                          {defendant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{defendant.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {defendant.totalVotes.toLocaleString()} votos
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {defendant.trend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-red-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-green-500" />
                      )}
                      <Badge 
                        variant={defendant.favor > 50 ? "destructive" : "secondary"}
                      >
                        {defendant.favor > 50 ? "Condenação" : "Absolvição"} em maioria
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Favor da condenação */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-red-600">
                          A favor da condenação
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {defendant.favor}%
                        </span>
                      </div>
                      <Progress value={defendant.favor} className="h-3" />
                    </div>
                    
                    {/* Contra a condenação */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-green-600">
                          Contra a condenação
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {defendant.contra}%
                        </span>
                      </div>
                      <Progress 
                        value={defendant.contra} 
                        className="h-3"
                      />
                    </div>
                    
                    {/* Vote counts */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">
                          {Math.round((defendant.favor / 100) * defendant.totalVotes).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Votos pela condenação</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">
                          {Math.round((defendant.contra / 100) * defendant.totalVotes).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Votos pela absolvição</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart View Toggle */}
          <div className="text-center mt-8">
            <div className="inline-flex rounded-lg border bg-white p-1">
              <button className="px-4 py-2 text-sm font-medium bg-institutional-blue text-white rounded-md">
                Lista Detalhada
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-institutional-blue">
                <BarChart3 className="h-4 w-4 mr-2 inline" />
                Gráfico Comparativo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VotingResults;
