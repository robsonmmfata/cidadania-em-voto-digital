
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

interface Election {
  id: string;
  name: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  created_at: string | null;
}

export default function ElectionManagement() {
  const [elections, setElections] = useState<Election[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    starts_at: "",
    ends_at: ""
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    const { data, error } = await supabase
      .from("elections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar votações", description: error.message });
    } else {
      setElections(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.starts_at || !formData.ends_at) {
      toast({ title: "Preencha todos os campos obrigatórios" });
      return;
    }

    const electionData = {
      name: formData.name,
      description: formData.description || null,
      starts_at: formData.starts_at,
      ends_at: formData.ends_at
    };

    let error;
    if (editingElection) {
      const { error: updateError } = await supabase
        .from("elections")
        .update(electionData)
        .eq("id", editingElection.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("elections")
        .insert([electionData]);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao salvar votação", description: error.message });
    } else {
      toast({ title: editingElection ? "Votação atualizada!" : "Votação criada!" });
      setFormData({ name: "", description: "", starts_at: "", ends_at: "" });
      setShowForm(false);
      setEditingElection(null);
      fetchElections();
    }
  };

  const handleEdit = (election: Election) => {
    setEditingElection(election);
    setFormData({
      name: election.name,
      description: election.description || "",
      starts_at: election.starts_at.slice(0, 16),
      ends_at: election.ends_at.slice(0, 16)
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta votação?")) return;

    const { error } = await supabase
      .from("elections")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao excluir votação", description: error.message });
    } else {
      toast({ title: "Votação excluída!" });
      fetchElections();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", starts_at: "", ends_at: "" });
    setShowForm(false);
    setEditingElection(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Votações</h3>
        <Button onClick={() => setShowForm(true)} className="bg-gray-800 hover:bg-gray-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nova Votação
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">{editingElection ? "Editar Votação" : "Nova Votação"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nome da Votação *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Presidente do Brasil 2024"
                  required
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da votação..."
                  rows={3}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Data/Hora de Início *</label>
                  <Input
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Data/Hora de Fim *</label>
                  <Input
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                    required
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white">
                  {editingElection ? "Atualizar" : "Criar"} Votação
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="border-gray-300 text-gray-700">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Votações Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {elections.length === 0 ? (
            <p className="text-gray-600">Nenhuma votação encontrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700">Nome</TableHead>
                  <TableHead className="text-gray-700">Descrição</TableHead>
                  <TableHead className="text-gray-700">Início</TableHead>
                  <TableHead className="text-gray-700">Fim</TableHead>
                  <TableHead className="text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elections.map((election) => (
                  <TableRow key={election.id}>
                    <TableCell className="font-medium text-gray-900">{election.name}</TableCell>
                    <TableCell className="text-gray-700">{election.description || "—"}</TableCell>
                    <TableCell className="text-gray-700">{new Date(election.starts_at).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-gray-700">{new Date(election.ends_at).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(election)}
                          className="border-gray-300 text-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(election.id)}
                          className="border-gray-300 text-gray-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
