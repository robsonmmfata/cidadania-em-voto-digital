
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "./useAuthSession";

export function useVotingCompletion() {
  const { user } = useAuthSession();
  const [hasCompletedAllVotes, setHasCompletedAllVotes] = useState(false);
  const [totalElections, setTotalElections] = useState(0);
  const [userVotesCount, setUserVotesCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkVotingCompletion = async () => {
      try {
        // Buscar total de eleições
        const { data: elections, error: electionsError } = await supabase
          .from("elections")
          .select("id");

        if (electionsError) {
          console.error("Erro ao buscar eleições:", electionsError);
          return;
        }

        const totalCount = elections?.length || 0;
        setTotalElections(totalCount);

        // Buscar votos do usuário
        const { data: userVotes, error: votesError } = await supabase
          .from("votes")
          .select("election_id")
          .eq("user_id", user.id);

        if (votesError) {
          console.error("Erro ao buscar votos do usuário:", votesError);
          return;
        }

        const votesCount = userVotes?.length || 0;
        setUserVotesCount(votesCount);

        // Verificar se completou todas as votações (5 no total)
        const completed = totalCount === 5 && votesCount === 5;
        setHasCompletedAllVotes(completed);

      } catch (error) {
        console.error("Erro ao verificar conclusão das votações:", error);
      }
    };

    checkVotingCompletion();

    // Escutar mudanças na tabela de votos
    const votesSubscription = supabase
      .channel('votes-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'votes',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          checkVotingCompletion();
        }
      )
      .subscribe();

    return () => {
      votesSubscription.unsubscribe();
    };
  }, [user]);

  return {
    hasCompletedAllVotes,
    totalElections,
    userVotesCount,
    progress: totalElections > 0 ? (userVotesCount / totalElections) * 100 : 0
  };
}
