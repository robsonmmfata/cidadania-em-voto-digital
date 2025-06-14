
import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmVoteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  optionLabel?: string;
  electionName?: string;
  loading?: boolean;
};

const ConfirmVoteModal: React.FC<ConfirmVoteModalProps> = ({
  open,
  onClose,
  onConfirm,
  optionLabel,
  electionName,
  loading = false,
}) => (
  <Dialog open={open} onOpenChange={val => !val && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmação de voto</DialogTitle>
      </DialogHeader>
      <div className="py-2 text-institutional-navy">
        Tem certeza que deseja registrar o voto
        {optionLabel ? (
          <span>
            {" "}
            <strong className="text-institutional-blue">{optionLabel}</strong>
          </span>
        ) : null}
        {electionName ? (
          <span>
            {" "}
            para <strong className="text-institutional-navy">{electionName}</strong>?
          </span>
        ) : (
          "?"
        )}
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={loading} className="bg-institutional-blue text-white hover:bg-institutional-blue/90">
          {loading ? "Enviando..." : "Confirmar Voto"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmVoteModal;
