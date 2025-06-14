import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { User, CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterModal = ({ open, onOpenChange }: RegisterModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    birthDate: "",
    voterTitle: "",
    acceptTerms: false,
    acceptResponsibility: false
  });
  
  const [validationStatus, setValidationStatus] = useState({
    cpf: null,
    voterTitle: null
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCPF = () => {
    // Simulação de validação de CPF
    setTimeout(() => {
      setValidationStatus(prev => ({
        ...prev,
        cpf: formData.cpf.length === 11 ? 'valid' : 'invalid'
      }));
    }, 1000);
  };

  const validateVoterTitle = () => {
    // Simulação de validação de título de eleitor
    setTimeout(() => {
      setValidationStatus(prev => ({
        ...prev,
        voterTitle: formData.voterTitle.length >= 12 ? 'valid' : 'invalid'
      }));
    }, 1000);
  };

  const canProceedToStep2 = () => {
    return formData.fullName && 
           formData.cpf && 
           formData.birthDate && 
           formData.voterTitle &&
           validationStatus.cpf === 'valid' &&
           validationStatus.voterTitle === 'valid';
  };

  const canProceedToStep3 = () => {
    return formData.acceptTerms && formData.acceptResponsibility;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-institutional-blue text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-white">
            <User className="mr-2 h-6 w-6 text-white" />
            Cadastro para Votação
          </DialogTitle>
          <DialogDescription className="text-blue-100">
            Passo {step} de 3 - Complete seu cadastro para participar da consulta popular
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                num <= step 
                  ? 'bg-white text-institutional-blue' 
                  : 'bg-blue-200 text-blue-500'
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  num < step ? 'bg-white' : 'bg-blue-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Data */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-white">Nome Completo</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Digite seu nome completo"
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-blue-100"
              />
            </div>

            <div>
              <Label htmlFor="cpf" className="text-white">CPF</Label>
              <div className="relative">
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  onBlur={validateCPF}
                  placeholder="000.000.000-00"
                  className="mt-1 pr-10 bg-white/5 border-white/20 text-white placeholder:text-blue-100"
                  maxLength={11}
                />
                {validationStatus.cpf && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validationStatus.cpf === 'valid' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {validationStatus.cpf === 'invalid' && (
                <p className="text-sm text-red-300 mt-1">CPF inválido</p>
              )}
            </div>

            <div>
              <Label htmlFor="birthDate" className="text-white">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-blue-100"
              />
            </div>

            <div>
              <Label htmlFor="voterTitle" className="text-white">Número do Título de Eleitor</Label>
              <div className="relative">
                <Input
                  id="voterTitle"
                  value={formData.voterTitle}
                  onChange={(e) => handleInputChange('voterTitle', e.target.value)}
                  onBlur={validateVoterTitle}
                  placeholder="000000000000"
                  className="mt-1 pr-10 bg-white/5 border-white/20 text-white placeholder:text-blue-100"
                  maxLength={12}
                />
                {validationStatus.voterTitle && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validationStatus.voterTitle === 'valid' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {validationStatus.voterTitle === 'invalid' && (
                <p className="text-sm text-red-300 mt-1">Título de eleitor inválido</p>
              )}
            </div>

            <Button 
              className="w-full bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
              onClick={() => setStep(2)}
              disabled={!canProceedToStep2()}
            >
              Continuar
            </Button>
          </div>
        )}

        {/* Step 2: Terms and Responsibility */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-institutional-blue/60 p-4 rounded-lg border border-white/10">
              <h4 className="font-semibold text-white mb-2 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Importante: Leia antes de prosseguir
              </h4>
              <p className="text-sm text-blue-100">
                Esta é uma simulação cidadã sem valor jurídico oficial. Sua participação 
                é voluntária e representa apenas sua opinião pessoal sobre o caso em julgamento.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                />
                <div>
                  <Label htmlFor="acceptTerms" className="text-sm text-white">
                    Aceito os termos de uso e política de privacidade
                  </Label>
                  <p className="text-xs text-blue-100 mt-1">
                    Ao aceitar, você concorda com o tratamento de seus dados conforme nossa política.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptResponsibility"
                  checked={formData.acceptResponsibility}
                  onCheckedChange={(checked) => handleInputChange('acceptResponsibility', checked)}
                />
                <div>
                  <Label htmlFor="acceptResponsibility" className="text-sm text-white">
                    Assumo responsabilidade pelo meu voto
                  </Label>
                  <p className="text-xs text-blue-100 mt-1">
                    Declaro que votarei de forma consciente e responsável, baseado na análise dos materiais fornecidos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={() => setStep(1)}
                className="flex-1 border-white text-white bg-transparent hover:bg-institutional-blue/70 hover:text-white transition-colors"
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
                onClick={() => setStep(3)}
                disabled={!canProceedToStep3()}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Success and Next Steps */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Cadastro Realizado com Sucesso!
              </h3>
              <p className="text-blue-100">
                Agora você pode prosseguir para a leitura obrigatória dos materiais do caso.
              </p>
            </div>

            <div className="bg-institutional-blue/60 p-4 rounded-lg border border-white/10">
              <h4 className="font-semibold mb-2 text-white">Próximos Passos:</h4>
              <ol className="text-sm text-left space-y-1 text-blue-100">
                <li>1. Leitura obrigatória dos materiais do caso</li>
                <li>2. Votação individual em cada réu</li>
                <li>3. Pagamento da taxa de validação (R$ 2,75)</li>
                <li>4. Confirmação e registro do voto</li>
              </ol>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-white text-white hover:bg-institutional-blue/70 hover:text-white transition-colors"
              >
                Fechar
              </Button>
              <Button 
                className="flex-1 bg-white/10 hover:bg-institutional-blue/70 text-white font-semibold transition-colors"
                onClick={() => {
                  onOpenChange(false);
                  // Aqui redirecionaria para a página de leitura
                }}
              >
                Começar Leitura
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
