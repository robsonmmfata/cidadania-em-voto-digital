
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Edit, Plus } from "lucide-react";

interface Election {
  id: string;
  name: string;
}

interface Candidate {
  id: string;
  label: string;
  value: string;
  display_order: number | null;
  election_id: string;
  election?: { name: string };
}

export default function CandidateManagement() {
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    election_id: "",
    display_order: ""
  });

  useEffect(() => {
    fetchElections();
    fetchCandidates();
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
        elections!inner(name)
      `)
      .order("display_order");

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
      election_id: formData.election_id,
      display_order: formData.display_order ? parseInt(formData.display_order) : null
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
      setFormData({ label: "", value: "", election_id: "", display_order: "" });
      setShowForm(false);
      setEditingCandidate(null);
      fetchCandidates();
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      label: candidate.label,
      value: candidate.value,
      election_id: candidate.election_id,
      display_order: candidate.display_order?.toString() || ""
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
    setFormData({ label: "", value: "", election_id: "", display_order: "" });
    setShowForm(false);
    setEditingCandidate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-institutional-navy">Gerenciamento de Candidatos</h3>
        <Button onClick={() => setShowForm(true)} className="bg-institutional-blue hover:bg-institutional-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Candidato
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCandidate ? "Editar Candidato" : "Novo Candidato"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Votação *</label>
                <Select value={formData.election_id} onValueChange={(value) => setFormData({ ...formData, election_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma votação" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election.id} value={election.id}>
                        {election.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome do Candidato *</label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ex: Luiz Inácio Lula da Silva"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Valor/ID *</label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Ex: lula"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ordem de Exibição</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  placeholder="1, 2, 3..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-institutional-blue hover:bg-institutional-blue/90">
                  {editingCandidate ? "Atualizar" : "Criar"} Candidato
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Candidatos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <p className="text-muted-foreground">Nenhum candidato encontrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Votação</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.elections?.name}</TableCell>
                    <TableCell className="font-medium">{candidate.label}</TableCell>
                    <TableCell>{candidate.value}</TableCell>
                    <TableCell>{candidate.display_order || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(candidate)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(candidate.id)}
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
