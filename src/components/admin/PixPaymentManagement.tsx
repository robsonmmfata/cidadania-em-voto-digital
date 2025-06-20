
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, DollarSign, Clock, CheckCircle } from "lucide-react";

interface PixPayment {
  id: string;
  amount: number;
  status: string;
  qr_code: string;
  user_id: string;
  vote_id: string;
  created_at: string;
}

export default function PixPaymentManagement() {
  const [payments, setPayments] = useState<PixPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("pix_payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar pagamentos", description: error.message });
    } else {
      setPayments(data || []);
    }
    
    setLoading(false);
  };

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    const { error } = await supabase
      .from("pix_payments")
      .update({ status: newStatus })
      .eq("id", paymentId);

    if (error) {
      toast({ title: "Erro ao atualizar status", description: error.message });
    } else {
      toast({ title: "Status atualizado com sucesso!" });
      fetchPayments();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>;
      case "failed":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Falhado</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const totalAmount = payments.reduce((sum, payment) => {
    return payment.status === "completed" ? sum + Number(payment.amount) : sum;
  }, 0);

  const completedPayments = payments.filter(p => p.status === "completed").length;
  const pendingPayments = payments.filter(p => p.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Carregando pagamentos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Pagamentos PIX</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">R$ {totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Recebido</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedPayments}</p>
                <p className="text-sm text-gray-600">Concluídos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                <p className="text-sm text-gray-600">Total de Pagamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-gray-600">Nenhum pagamento encontrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700">ID</TableHead>
                  <TableHead className="text-gray-700">Valor</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Data</TableHead>
                  <TableHead className="text-gray-700">Usuário</TableHead>
                  <TableHead className="text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm text-gray-900">
                      {payment.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      R$ {Number(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(payment.created_at).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-700">
                      {payment.user_id?.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {payment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePaymentStatus(payment.id, "completed")}
                              className="text-green-600 hover:text-green-700 border-gray-300"
                            >
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePaymentStatus(payment.id, "failed")}
                              className="text-red-600 hover:text-red-700 border-gray-300"
                            >
                              Falhar
                            </Button>
                          </>
                        )}
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
