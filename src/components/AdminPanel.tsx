
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ElectionManagement from "./admin/ElectionManagement";
import CandidateManagement from "./admin/CandidateManagement";
import UserManagement from "./admin/UserManagement";
import PixPaymentManagement from "./admin/PixPaymentManagement";

export default function AdminPanel() {
  return (
    <Tabs defaultValue="elections" className="w-full max-w-6xl">
      <TabsList className="mb-6 mx-auto flex justify-center bg-institutional-blue/10">
        <TabsTrigger value="elections">Votações</TabsTrigger>
        <TabsTrigger value="candidates">Candidatos</TabsTrigger>
        <TabsTrigger value="users">Usuários</TabsTrigger>
        <TabsTrigger value="pix">Pagamentos Pix</TabsTrigger>
      </TabsList>

      <TabsContent value="elections">
        <ElectionManagement />
      </TabsContent>

      <TabsContent value="candidates">
        <CandidateManagement />
      </TabsContent>

      <TabsContent value="users">
        <UserManagement />
      </TabsContent>

      <TabsContent value="pix">
        <PixPaymentManagement />
      </TabsContent>
    </Tabs>
  );
}
