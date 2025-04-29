
import { useState } from "react";
import { MoreVertical, Trash2, Edit, Eye, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

interface AdminActionMenuProps {
  id: string;
  name?: string;
  type: 'order' | 'invoice' | 'service' | 'user';
  onDelete?: (id: string) => Promise<void>;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function AdminActionMenu({ id, name, type, onDelete, onView, onEdit }: AdminActionMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(id);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removido com sucesso`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Erro ao remover ${type}`);
    }
  };
  
  const itemName = name || `este ${type}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onView && (
            <DropdownMenuItem onClick={() => onView(id)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Visualizar</span>
            </DropdownMenuItem>
          )}
          
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>
          )}
          
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setConfirmOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remover</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá remover permanentemente {itemName} 
              do nosso banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
