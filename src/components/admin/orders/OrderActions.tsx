
import React, { useState } from "react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { Order } from "@/types/admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2, MoreVertical, Trash } from "lucide-react";

interface OrderActionsProps {
  order: Order;
  onActionComplete?: () => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order, onActionComplete }) => {
  const { approveOrder, processOrder, cancelOrder, deleteOrder } = useAdminOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "process" | "cancel" | null>(null);
  
  const handleActionConfirm = async () => {
    if (!actionType) return;
    
    setIsProcessing(true);
    try {
      if (actionType === "approve") {
        await approveOrder(order.id);
      } else if (actionType === "process") {
        await processOrder(order.id);
      } else if (actionType === "cancel") {
        await cancelOrder(order.id);
      }
      onActionComplete?.();
    } finally {
      setIsProcessing(false);
      setIsStatusDialogOpen(false);
      setActionType(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    try {
      await deleteOrder(order.id);
      onActionComplete?.();
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getActionText = () => {
    switch (actionType) {
      case "approve": return "aprovar";
      case "process": return "processar";
      case "cancel": return "cancelar";
      default: return "";
    }
  };
  
  const getActionColor = () => {
    switch (actionType) {
      case "approve": return "bg-green-600 hover:bg-green-700";
      case "process": return "bg-blue-600 hover:bg-blue-700";
      case "cancel": return "bg-red-600 hover:bg-red-700";
      default: return "";
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case "approve":
        return "Isso marcará o pedido como concluído.";
      case "process":
        return "Isso marcará o pedido como em processamento.";
      case "cancel":
        return "Isso marcará o pedido como cancelado e não poderá ser revertido facilmente.";
      default:
        return "";
    }
  };

  // Handle disabled state based on current order status
  const isApproveDisabled = order.status === "completed" || order.status === "canceled";
  const isProcessDisabled = order.status === "processing" || order.status === "canceled";
  const isCancelDisabled = order.status === "canceled";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações do Pedido</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isApproveDisabled}
            onClick={() => {
              setActionType("approve");
              setIsStatusDialogOpen(true);
            }}
          >
            <Check className="mr-2 h-4 w-4 text-green-600" />
            Aprovar Pedido
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isProcessDisabled}
            onClick={() => {
              setActionType("process");
              setIsStatusDialogOpen(true);
            }}
          >
            <Check className="mr-2 h-4 w-4 text-blue-600" />
            Processar Pedido
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isCancelDisabled}
            onClick={() => {
              setActionType("cancel");
              setIsStatusDialogOpen(true);
            }}
          >
            <Check className="mr-2 h-4 w-4 text-red-600" />
            Cancelar Pedido
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir Pedido
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {getActionText()} o pedido #{order.orderNumber}?
              {getActionDescription() && (
                <p className="mt-2">{getActionDescription()}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isProcessing}
              onClick={(e) => {
                e.preventDefault();
                handleActionConfirm();
              }}
              className={getActionColor()}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getActionText().charAt(0).toUpperCase() + getActionText().slice(1)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pedido</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pedido #{order.orderNumber}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isProcessing}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderActions;
