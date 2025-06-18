
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface VotingOption {
  id: string;
  label: string;
  value: string;
}

interface VotingCardProps {
  id: string;
  title: string;
  description: string;
  options: VotingOption[];
  selectedOption: string;
  onOptionChange: (value: string) => void;
  onVote: () => void;
  hasVoted: boolean;
  isSubmitting: boolean;
  endsAt: string;
  totalVotes?: number;
}

export default function VotingCard({
  id,
  title,
  description,
  options,
  selectedOption,
  onOptionChange,
  onVote,
  hasVoted,
  isSubmitting,
  endsAt,
  totalVotes = 0
}: VotingCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl text-institutional-navy">{title}</CardTitle>
          {hasVoted && (
            <Badge className="bg-green-100 text-green-800">Votado</Badge>
          )}
        </div>
        <p className="text-institutional-navy/70 text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex items-center gap-4 text-xs text-institutional-navy/60 mt-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Termina em: {formatDate(endsAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{totalVotes} votos</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {hasVoted ? (
          <div className="text-center py-4">
            <div className="text-green-600 font-semibold mb-2">
              ✓ Você já votou nesta votação
            </div>
            <p className="text-sm text-institutional-navy/60">
              Obrigado por participar!
            </p>
          </div>
        ) : (
          <>
            <RadioGroup
              value={selectedOption}
              onValueChange={onOptionChange}
              className="mb-6 space-y-3"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-institutional-gray/30 transition-colors">
                  <RadioGroupItem 
                    value={option.id} 
                    id={option.id} 
                    className="text-institutional-blue"
                  />
                  <label 
                    htmlFor={option.id} 
                    className="text-institutional-navy text-sm font-medium cursor-pointer flex-1"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
            
            <Button
              onClick={onVote}
              disabled={!selectedOption || isSubmitting}
              className="w-full bg-institutional-blue hover:bg-institutional-blue/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? "Enviando voto..." : "Votar"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
