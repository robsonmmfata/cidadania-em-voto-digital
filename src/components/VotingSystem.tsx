
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toast } from "@/components/ui/use-toast";
import VotingCard from "./VotingCard";
import PaymentModal from "./PaymentModal";
import VotingProgress from "./VotingProgress";
import { useVotingCompletion } from "@/hooks/useVotingCompletion";

interface Election {
  id: string;
  name: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
}

interface Option {
  id: string;
  label: string;
  value: string;
  display_order: number | null;
  election_id: string;
}

type VoteStatus = Record<string, "not-voted" | "voted" | "submitting" | "error">;

export default function VotingSystem() {
  const { user } = useAuthSession();
  const [elections, setElections] = useState<Election[]>([]);
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({});
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { hasCompletedAllVotes, totalElections, userVotesCount, progress } = useVotingCompletion();

  // Carregar votações em andamento
  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      
      const { data: electionsData, error } = await supabase
        .from("elections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar votações:", error);
        toast({ title: "Erro ao carregar votações", description: error.message });
        setLoading(false);
        return;
      }

      console.log("Eleições encontradas:", electionsData);
      setElections(electionsData || []);

      // Carregar opções das votações
      if (electionsData?.length) {
        const electionIds = electionsData.map(e => e.id);
        const { data: optionData, error: optionError } = await supabase
          .from("election_options")
          .select("*")
          .in("election_id", electionIds);

        if (optionError) {
          console.error("Erro ao carregar opções:", optionError);
          toast({ title: "Erro ao carregar opções de voto", description: optionError.message });
        } else {
          console.log("Opções carregadas:", optionData);
          // Agrupar opções por eleição
          const grouped: Record<string, Option[]> = {};
          optionData?.forEach(opt => {
            if (!grouped[opt.election_id!]) grouped[opt.election_id!] = [];
            grouped[opt.election_id!].push(opt);
          });
          setOptions(grouped);
        }
      }
      setLoading(false);
    };

    fetchElections();
  }, []);

  // Verificar votos do usuário
  useEffect(() => {
    if (!user || !elections.length) return;

    const fetchUserVotes = async () => {
      const { data: myVotes } = await supabase
        .from("votes")
        .select("election_id, option_id")
        .eq("user_id", user.id);

      const voted: Record<string, string> = {};
      myVotes?.forEach(v => {
        if (v.election_id) voted[v.election_id] = v.option_id;
      });
      setUserVotes(voted);
    };

    fetchUserVotes();
  }, [user, elections]);

  // Mostrar modal de pagamento quando completar todas as votações
  useEffect(() => {
    if (hasCompletedAllVotes) {
      setShowPaymentModal(true);
    }
  }, [hasCompletedAllVotes]);

  const handleVote = async (electionId: string) => {
    if (!user) {
      toast({ title: "Faça login para votar" });
      return;
    }

    if (!selectedOptions[electionId]) {
      toast({ title: "Selecione uma opção para votar!" });
      return;
    }

    setVoteStatus(prev => ({ ...prev, [electionId]: "submitting" }));

    try {
      const { error } = await supabase.from("votes").insert({
        user_id: user.id,
        election_id: electionId,
        option_id: selectedOptions[electionId],
      });

      if (error) {
        console.error("Erro ao votar:", error);
        toast({ title: "Erro ao votar", description: error.message });
        setVoteStatus(prev => ({ ...prev, [electionId]: "error" }));
      } else {
        setVoteStatus(prev => ({ ...prev, [electionId]: "voted" }));
        setUserVotes(prev => ({ ...prev, [electionId]: selectedOptions[electionId] }));
        toast({ title: "Voto registrado com sucesso!" });
      }
    } catch (error) {
      console.error("Erro inesperado ao votar:", error);
      toast({ title: "Erro inesperado ao votar" });
      setVoteStatus(prev => ({ ...prev, [electionId]: "error" }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Carregando votações...</div>
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-700 mb-4">
          <h3 className="text-xl font-semibold mb-2">Nenhuma votação ativa</h3>
          <p className="text-gray-500">
            No momento não há votações em andamento. Volte mais tarde para participar!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Votações em Andamento
        </h2>
        <p className="text-gray-600">
          Participe das votações ativas e faça sua voz ser ouvida!
        </p>
      </div>

      <VotingProgress 
        userVotesCount={userVotesCount}
        totalElections={totalElections}
        progress={progress}
      />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {elections.map(election => (
          <VotingCard
            key={election.id}
            id={election.id}
            title={election.name}
            description={election.description || "Sem descrição disponível"}
            options={(options[election.id] || [])
              .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
              .map(opt => ({
                id: opt.id,
                label: opt.label,
                value: opt.value
              }))
            }
            selectedOption={selectedOptions[election.id] || ""}
            onOptionChange={(value) => 
              setSelectedOptions(prev => ({ ...prev, [election.id]: value }))
            }
            onVote={() => handleVote(election.id)}
            hasVoted={!!userVotes[election.id]}
            isSubmitting={voteStatus[election.id] === "submitting"}
            endsAt={election.ends_at}
            totalVotes={Math.floor(Math.random() * 1000) + 100} // Simulado por agora
          />
        ))}
      </div>

      <PaymentModal 
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
      />
    </div>
  );
}
