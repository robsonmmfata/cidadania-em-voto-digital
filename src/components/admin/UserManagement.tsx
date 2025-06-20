
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Users, Crown, User } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: "admin" | "user" | null;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Buscar usuários da tabela auth (via RPC ou através dos perfis)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");

    if (profilesError) {
      toast({ title: "Erro ao carregar usuários", description: profilesError.message });
      setLoading(false);
      return;
    }

    // Buscar roles dos usuários
    const { data: userRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*");

    if (rolesError) {
      console.error("Erro ao carregar roles:", rolesError);
    }

    // Combinar dados dos perfis com as roles
    const usersWithRoles = profiles?.map(profile => {
      const userRole = userRoles?.find(role => role.user_id === profile.id);
      return {
        id: profile.id,
        email: `user-${profile.id.slice(0, 8)}@example.com`, // Simulado - não temos acesso direto ao email
        full_name: profile.full_name,
        created_at: profile.created_at || new Date().toISOString(),
        role: userRole?.role || "user" as "admin" | "user"
      };
    }) || [];

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: "admin" | "user") => {
    // Verificar se o usuário já tem uma role
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .single();

    let error;
    if (existingRole) {
      // Atualizar role existente
      const { error: updateError } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      error = updateError;
    } else {
      // Criar nova role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: newRole }]);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao atualizar role", description: error.message });
    } else {
      toast({ title: "Role atualizada com sucesso!" });
      fetchUsers(); // Recarregar a lista
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Usuários</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total de Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === "admin").length}</p>
                <p className="text-sm text-gray-600">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === "user").length}</p>
                <p className="text-sm text-gray-600">Usuários Comuns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-600">Nenhum usuário encontrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700">Nome</TableHead>
                  <TableHead className="text-gray-700">Email</TableHead>
                  <TableHead className="text-gray-700">Role</TableHead>
                  <TableHead className="text-gray-700">Data de Cadastro</TableHead>
                  <TableHead className="text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-gray-900">
                      {user.full_name || "Nome não informado"}
                    </TableCell>
                    <TableCell className="text-gray-700">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="bg-gray-100 text-gray-800">
                        {user.role === "admin" ? "Admin" : "Usuário"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role || "user"}
                        onValueChange={(value: "admin" | "user") => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-white border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
