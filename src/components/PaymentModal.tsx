
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const { user } = useAuthSession();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado" });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error creating payment:', error);
        toast({ title: "Erro", description: "Erro ao criar pagamento" });
        return;
      }

      // Redirecionar para o Mercado Pago
      window.location.href = data.initPoint;
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({ title: "Erro", description: "Erro ao processar pagamento" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            Parabéns! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Você completou todas as 5 votações!
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Para finalizar sua participação, realize o pagamento de:
            </p>
            <div className="text-3xl font-bold text-green-600 mt-2">
              R$ 2,50
            </div>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-center text-gray-800 flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                <QrCode className="w-5 h-5" />
                Métodos de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-600">
              <p>• PIX (instantâneo)</p>
              <p>• Cartão de crédito</p>
              <p>• Cartão de débito</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Processando..." : "Pagar com Mercado Pago"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Pagar mais tarde
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Pagamento seguro processado pelo Mercado Pago
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
