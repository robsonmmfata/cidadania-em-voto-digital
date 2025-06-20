
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ElectionManagement from "./admin/ElectionManagement";
import CandidateManagement from "./admin/CandidateManagement";
import UserManagement from "./admin/UserManagement";
import PixPaymentManagement from "./admin/PixPaymentManagement";

export default function AdminPanel() {
  return (
    <Tabs defaultValue="elections" className="w-full max-w-6xl">
      <TabsList className="mb-6 mx-auto flex justify-center bg-white border border-gray-200">
        <TabsTrigger value="elections" className="text-gray-700 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Votações</TabsTrigger>
        <TabsTrigger value="candidates" className="text-gray-700 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Candidatos</TabsTrigger>
        <TabsTrigger value="users" className="text-gray-700 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Usuários</TabsTrigger>
        <TabsTrigger value="pix" className="text-gray-700 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">Pagamentos Pix</TabsTrigger>
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
