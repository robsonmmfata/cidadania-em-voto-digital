import VotingPanel from "@/components/VotingPanel";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ConfirmVoteModal from "@/components/ConfirmVoteModal";

export default function Dashboard() {
  const { user, loading } = useAuthSession();
  const { fullName, loading: profileLoading } = useUserProfile();
  const [elections, setElections] = useState<any[]>([]);
  const [options, setOptions] = useState<Record<string, any[]>>({});
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [voteStatus, setVoteStatus] = useState<Record<string, string>>({});
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [confirmVoteElection, setConfirmVoteElection] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast({ title: "Faça login para acessar a dashboard de usuário." });
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Carregar até 10 votações em andamento e suas opções
  useEffect(() => {
    const fetchElections = async () => {
      setDataLoading(true);
      const nowISO = new Date().toISOString();
      const { data: electionsData, error } = await supabase
        .from("elections")
        .select("*")
        .gte("starts_at", "1970-01-01T00:00:00.000Z")
        .lte("starts_at", nowISO)
        .gte("ends_at", nowISO)
        .order("ends_at", { ascending: true })
        .limit(10);
      if (error) {
        setDataLoading(false);
        toast({ title: "Erro ao carregar julgamentos", description: error.message });
        return;
      }
      setElections(electionsData || []);
      if (electionsData?.length) {
        const electionIds = electionsData.map(e => e.id);
        const { data: optionData, error: optionError } = await supabase
          .from("election_options")
          .select("*")
          .in("election_id", electionIds);
        if (optionError) {
          toast({ title: "Erro ao carregar opções de voto", description: optionError.message });
          setDataLoading(false);
          return;
        }
        const grouped: Record<string, any[]> = {};
        optionData?.forEach(opt => {
          if (!grouped[opt.election_id!]) grouped[opt.election_id!] = [];
          grouped[opt.election_id!].push(opt);
        });
        setOptions(grouped);
      }
      setDataLoading(false);
    };
    fetchElections();
  }, []);

  // Descobre em quais votações o usuário já votou
  useEffect(() => {
    if (!user) return;
    const fetchUserVotes = async () => {
      const { data: myVotes } = await supabase
        .from("votes")
        .select("election_id, option_id")
        .eq("user_id", user.id);

      const voted: Record<string, string> = {};
      myVotes?.forEach((v: any) => {
        if (v.election_id) voted[v.election_id] = v.option_id;
      });
      setUserVotes(voted);
    };
    fetchUserVotes();
  }, [user, elections.length]);

  // Handler de voto simplificado (agora chamado após confirmação)
  const handleVote = async (electionId: string) => {
    if (!user) {
      toast({ title: "Faça login antes de votar." });
      return;
    }
    if (!selected[electionId]) {
      toast({ title: "Selecione uma opção para votar!" });
      return;
    }
    setVoteStatus((prev) => ({ ...prev, [electionId]: "submitting" }));
    const { error } = await supabase.from("votes").insert({
      user_id: user.id,
      election_id: electionId,
      option_id: selected[electionId],
    });
    if (error) {
      toast({ title: "Erro ao votar", description: error.message });
      setVoteStatus((prev) => ({ ...prev, [electionId]: "error" }));
    } else {
      setVoteStatus((prev) => ({ ...prev, [electionId]: "voted" }));
      setUserVotes((prev) => ({ ...prev, [electionId]: selected[electionId] }));
      toast({ title: "Voto registrado!" });
    }
    setConfirmVoteElection(null);
  };

  if (loading || profileLoading || dataLoading || !user) {
    return <div className="text-center text-institutional-blue py-12">Carregando sua dashboard...</div>;
  }

  return (
    <section className="min-h-screen bg-institutional-gray flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold text-institutional-blue mb-2">Bem-vindo{fullName ? `, ${fullName}` : user.email ? `, ${user.email}` : ""}!</h2>
      <div className="text-lg text-institutional-navy/80 mb-8">Aqui estão suas votações em andamento. Você pode votar em até 10 julgamentos abertos:</div>
      <div className="w-full max-w-2xl space-y-8">
        {elections.length === 0 && (
          <div className="text-institutional-blue py-12 text-center">Nenhum julgamento aberto para votação no momento.</div>
        )}
        {elections.map(election => (
          <Card key={election.id} className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-institutional-navy">{election.name}</CardTitle>
              {election.description && (
                <div className="text-sm text-institutional-navy/60">{election.description}</div>
              )}
            </CardHeader>
            <CardContent>
              {userVotes[election.id] ? (
                <div className="text-green-600 font-semibold py-2">
                  Você já votou nesta votação.
                </div>
              ) : (
                <>
                  <RadioGroup
                    value={selected[election.id] || ""}
                    onValueChange={val =>
                      setSelected(prev => ({ ...prev, [election.id]: val }))
                    }
                    className="mb-4"
                  >
                    {(options[election.id] || [])
                      .sort(
                        (a, b) =>
                          (a.display_order ?? 0) - (b.display_order ?? 0)
                      )
                      .map(option => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 py-2"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <label
                            htmlFor={option.id}
                            className="text-institutional-navy text-sm"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                  </RadioGroup>
                  <Button
                    onClick={() => setConfirmVoteElection(election.id)}
                    className="bg-institutional-blue text-white hover:bg-institutional-blue/90 w-full"
                    disabled={voteStatus[election.id] === "submitting"}
                  >
                    {voteStatus[election.id] === "submitting"
                      ? "Enviando..."
                      : "Votar"}
                  </Button>
                  <ConfirmVoteModal
                    open={confirmVoteElection === election.id}
                    onClose={() => setConfirmVoteElection(null)}
                    onConfirm={() => handleVote(election.id)}
                    optionLabel={
                      selected[election.id]
                        ? options[election.id]?.find(
                            (o) => o.id === selected[election.id]
                          )?.label
                        : undefined
                    }
                    electionName={election.name}
                    loading={voteStatus[election.id] === "submitting"}
                  />
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
