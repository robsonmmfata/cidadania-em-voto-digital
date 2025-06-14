
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toast } from "@/components/ui/use-toast";

interface Option {
  id: string;
  label: string;
  value: string;
  display_order: number | null;
}

interface Election {
  id: string;
  name: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
}

type VoteStatus = "not-voted" | "voted" | "submitting" | "error";

const VotingPanel = () => {
  const { user, loading: authLoading } = useAuthSession();
  const [elections, setElections] = useState<Election[]>([]);
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [voteStatus, setVoteStatus] = useState<Record<string, VoteStatus>>({});
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load open elections and options
  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      // Só votações em andamento
      const nowISO = new Date().toISOString();
      const { data: electionsData, error } = await supabase
        .from("elections")
        .select("*")
        .gte("starts_at", "1970-01-01T00:00:00.000Z")
        .lte("starts_at", nowISO)
        .gte("ends_at", nowISO)
        .order("ends_at", { ascending: true });
      if (error) {
        setLoading(false);
        toast({ title: "Erro ao carregar julgamentos", description: error.message });
        return;
      }
      setElections(electionsData || []);
      // Carrega as opções relacionadas
      if (electionsData?.length) {
        const electionIds = electionsData.map(e => e.id);
        const { data: optionData, error: optionError } = await supabase
          .from("election_options")
          .select("*")
          .in("election_id", electionIds);
        if (optionError) {
          toast({ title: "Erro ao carregar opções de voto", description: optionError.message });
          setLoading(false);
          return;
        }
        // Organiza as opções por eleição
        const grouped: Record<string, Option[]> = {};
        optionData?.forEach(opt => {
          if (!grouped[opt.election_id!]) grouped[opt.election_id!] = [];
          grouped[opt.election_id!].push(opt);
        });
        setOptions(grouped);
      }
      setLoading(false);
    };
    fetchElections();
  }, []);

  // Descobre em quais elections o usuário já votou
  useEffect(() => {
    if (!user) return;
    const fetchUserVotes = async () => {
      const { data: myVotes } = await supabase
        .from("votes")
        .select("election_id, option_id")
        .eq("user_id", user.id);
      // Preenche os status de voto do usuário em cada election
      const voted: Record<string, string> = {};
      myVotes?.forEach(v => { if (v.election_id) voted[v.election_id] = v.option_id; });
      setUserVotes(voted);
    };
    fetchUserVotes();
  }, [user, elections.length]);

  const handleVote = async (electionId: string) => {
    if (!user) {
      toast({ title: "Faça login antes de votar." });
      return;
    }
    if (!selected[electionId]) {
      toast({ title: "Selecione uma opção para votar!" });
      return;
    }
    setVoteStatus(prev => ({ ...prev, [electionId]: "submitting" }));
    // Insere na tabela votes (a RLS já garante um voto por user/eleição)
    const { error } = await supabase.from("votes").insert({
      user_id: user.id,
      election_id: electionId,
      option_id: selected[electionId],
    });
    if (error) {
      toast({ title: "Erro ao votar", description: error.message });
      setVoteStatus(prev => ({ ...prev, [electionId]: "error" }));
    } else {
      setVoteStatus(prev => ({ ...prev, [electionId]: "voted" }));
      setUserVotes(prev => ({ ...prev, [electionId]: selected[electionId] }));
      toast({ title: "Voto registrado!" });
    }
  };

  if (authLoading || loading) {
    return <div className="text-center text-institutional-blue py-12">Carregando votações...</div>;
  }

  if (!elections.length) {
    return <div className="text-center text-institutional-blue py-12">Nenhum julgamento aberto para votação no momento.</div>;
  }

  return (
    <section className="container mx-auto px-4 py-10 max-w-2xl">
      <h2 className="text-2xl font-bold text-institutional-blue mb-8 text-center">
        Julgamentos em andamento: Vote!
      </h2>
      <div className="space-y-8">
        {elections.map(election => (
          <Card key={election.id} className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-institutional-navy">{election.name}</CardTitle>
              <div className="text-sm text-institutional-navy/60">{election.description}</div>
            </CardHeader>
            <CardContent>
              {userVotes[election.id] ? (
                <div className="text-green-600 font-semibold py-2">Você já votou nesta votação.</div>
              ) : (
                <>
                  <RadioGroup
                    value={selected[election.id] || ""}
                    onValueChange={val => setSelected(prev => ({ ...prev, [election.id]: val }))}
                    className="mb-4"
                  >
                    {(options[election.id] || [])
                      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                      .map(option => (
                      <div key={option.id} className="flex items-center space-x-3 py-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <label htmlFor={option.id} className="text-institutional-navy text-sm">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    onClick={() => handleVote(election.id)}
                    className="bg-institutional-blue text-white hover:bg-institutional-blue/90 w-full"
                    disabled={voteStatus[election.id] === "submitting"}
                  >
                    {voteStatus[election.id] === "submitting" ? "Enviando..." : "Votar"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default VotingPanel;
