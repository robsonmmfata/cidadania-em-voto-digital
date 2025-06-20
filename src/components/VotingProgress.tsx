
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";

interface VotingProgressProps {
  userVotesCount: number;
  totalElections: number;
  progress: number;
}

export default function VotingProgress({ userVotesCount, totalElections, progress }: VotingProgressProps) {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Circle className="w-5 h-5" />
          Progresso das Votações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {userVotesCount} de {totalElections} votações completadas
          </span>
          <span className="font-semibold text-gray-800">
            {Math.round(progress)}%
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center gap-2 text-sm">
          {progress === 100 ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400" />
          )}
          <span className={progress === 100 ? "text-green-600 font-semibold" : "text-gray-500"}>
            {progress === 100 ? "Todas as votações concluídas!" : "Continue votando para desbloquear o pagamento"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
