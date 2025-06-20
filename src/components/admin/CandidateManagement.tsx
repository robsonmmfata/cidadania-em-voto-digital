
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Edit, Plus, User } from "lucide-react";

interface Election {
  id: string;
  name: string;
}

interface ElectionOption {
  id: string;
  label: string;
  value: string;
  display_order: number | null;
  election_id: string | null;
  election?: Election;
}

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState<ElectionOption[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<ElectionOption | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    display_order: "",
    election_id: ""
  });

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

  const fetchElections = async () => {
    const { data, error } = await supabase
      .from("elections")
      .select("id, name")
      .order("name");

    if (error) {
      toast({ title: "Erro ao carregar votações", description: error.message });
    } else {
      setElections(data || []);
    }
  };

  const fetchCandidates = async () => {
    const { data, error } = await supabase
      .from("election_options")
      .select(`
        *,
        election:elections(id, name)
      `)
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Erro ao carregar candidatos", description: error.message });
    } else {
      setCandidates(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label || !formData.value || !formData.election_id) {
      toast({ title: "Preencha todos os campos obrigatórios" });
      return;
    }

    const candidateData = {
      label: formData.label,
      value: formData.value,
      display_order: formData.display_order ? parseInt(formData.display_order) : null,
      election_id: formData.election_id
    };

    let error;
    if (editingCandidate) {
      const { error: updateError } = await supabase
        .from("election_options")
        .update(candidateData)
        .eq("id", editingCandidate.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("election_options")
        .insert([candidateData]);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao salvar candidato", description: error.message });
    } else {
      toast({ title: editingCandidate ? "Candidato atualizado!" : "Candidato criado!" });
      setFormData({ label: "", value: "", display_order: "", election_id: "" });
      setShowForm(false);
      setEditingCandidate(null);
      fetchCandidates();
    }
  };

  const handleEdit = (candidate: ElectionOption) => {
    setEditingCandidate(candidate);
    setFormData({
      label: candidate.label,
      value: candidate.value,
      display_order: candidate.display_order?.toString() || "",
      election_id: candidate.election_id || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este candidato?")) return;

    const { error } = await supabase
      .from("election_options")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao excluir candidato", description: error.message });
    } else {
      toast({ title: "Candidato excluído!" });
      fetchCandidates();
    }
  };

  const resetForm = () => {
    setFormData({ label: "", value: "", display_order: "", election_id: "" });
    setShowForm(false);
    setEditingCandidate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Candidatos</h3>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gray-800 hover:bg-gray-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Candidato
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
                <p className="text-sm text-gray-600">Total de Candidatos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{elections.length}</p>
                <p className="text-sm text-gray-600">Votações Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {candidates.filter(c => c.display_order !== null).length}
                </p>
                <p className="text-sm text-gray-600">Com Ordem</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">{editingCandidate ? "Editar Candidato" : "Novo Candidato"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nome do Candidato *</label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Valor (identificador único) *</label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Ex: joao-silva"
                  required
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Votação *</label>
                <Select
                  value={formData.election_id}
                  onValueChange={(value) => setFormData({ ...formData, election_id: value })}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Selecione uma votação" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {elections.map((election) => (
                      <SelectItem key={election.id} value={election.id}>
                        {election.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Ordem de Exibição</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  placeholder="Ex: 1"
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white">
                  {editingCandidate ? "Atualizar" : "Criar"} Candidato
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
          <CardTitle className="text-gray-900">Candidatos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <p className="text-gray-600">Nenhum candidato encontrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700">Nome</TableHead>
                  <TableHead className="text-gray-700">Valor</TableHead>
                  <TableHead className="text-gray-700">Votação</TableHead>
                  <TableHead className="text-gray-700">Ordem</TableHead>
                  <TableHead className="text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium text-gray-900">{candidate.label}</TableCell>
                    <TableCell className="text-gray-700">{candidate.value}</TableCell>
                    <TableCell className="text-gray-700">{candidate.election?.name || "—"}</TableCell>
                    <TableCell className="text-gray-700">{candidate.display_order || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(candidate)}
                          className="border-gray-300 text-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(candidate.id)}
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
