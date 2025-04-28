
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlanConfiguration from "./PlanConfiguration";
import DomainSelection from "./DomainSelection";
import PlanSummary from "./PlanSummary";

interface EmailPlanDialogProps {
  selectedPlan: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: { 
    userCount: number; 
    period: string; 
    domainOption: string;
    newDomainName?: string;
    selectedExistingDomain?: string;
    contactProfileId?: string;
  }) => void;
}

const EmailPlanDialog = ({
  selectedPlan,
  isOpen,
  onClose,
  onConfirm,
}: EmailPlanDialogProps) => {
  const [config, setConfig] = useState({
    userCount: 1,
    period: "1",
    domainOption: "new",
    newDomainName: "",
    selectedExistingDomain: "",
    contactProfileId: ""
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onConfirm(config);
  };

  const isFormValid = () => {
    if (config.domainOption === "new") {
      return (
        config.contactProfileId && 
        config.newDomainName && 
        config.newDomainName.trim() !== ""
      );
    } else {
      return !!config.selectedExistingDomain;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedPlan?.title}</DialogTitle>
          <DialogDescription>
            Configure o seu plano de email profissional
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <PlanConfiguration 
            config={config}
            onConfigChange={handleConfigChange}
          />
          
          <DomainSelection
            config={config}
            onConfigChange={handleConfigChange}
          />
          
          <PlanSummary
            selectedPlan={selectedPlan}
            config={config}
          />
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPlanDialog;
