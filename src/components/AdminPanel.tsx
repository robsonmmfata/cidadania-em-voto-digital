
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminPanel() {
  return (
    <Tabs defaultValue="elections" className="w-full max-w-3xl">
      <TabsList className="mb-6 mx-auto flex justify-center bg-institutional-blue/10">
        <TabsTrigger value="elections">Votações</TabsTrigger>
        <TabsTrigger value="candidates">Candidatos</TabsTrigger>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="pix">Pagamentos Pix</TabsTrigger>
      </TabsList>
      <TabsContent value="elections">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Votações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-institutional-blue/90 mb-2">
              Criar, editar e remover votações.
            </div>
            <div className="text-sm text-muted-foreground">
              (Funcionalidade em desenvolvimento. Em breve, um formulário e lista de votações aparecerão aqui.)
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="candidates">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Candidatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-institutional-blue/90 mb-2">
              Cadastrar, editar e remover candidatos (opções de votação).
            </div>
            <div className="text-sm text-muted-foreground">
              (Funcionalidade em desenvolvimento. Em breve, painel para candidatos aparecerá aqui.)
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-institutional-blue/90 mb-2">
              Lista e administração de usuários registrados.
            </div>
            <div className="text-sm text-muted-foreground">
              (Funcionalidade em desenvolvimento. Em breve, painel de usuários aparecerá aqui.)
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pix">
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos Pix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-institutional-blue/90 mb-2">
              Pagamentos realizados pelos usuários que votaram.
            </div>
            <div className="text-sm text-muted-foreground">
              (Funcionalidade em desenvolvimento. Em breve, painel de pagamentos aparecerá aqui.)
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
