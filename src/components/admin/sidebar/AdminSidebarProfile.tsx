
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminSidebarProfileProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any;
  isSuperAdmin: boolean;
}

const AdminSidebarProfile = ({ isOpen, setIsOpen, user, isSuperAdmin }: AdminSidebarProfileProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className={cn("bg-primary text-primary-foreground", 
            isSuperAdmin ? "bg-red-600" : "")}>
            {user?.email?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className={cn("transition-all", !isOpen && "hidden")}>
          <div className="font-medium">
            {isSuperAdmin ? (
              <span className="text-red-600 font-bold">Suporte (Admin)</span>
            ) : (
              user?.user_metadata?.full_name || "Usuário"
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate max-w-[160px]">
            {isSuperAdmin ? (
              <span className="text-red-500">{user?.email}</span>
            ) : (
              user?.email
            )}
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-5 bg-background border shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default AdminSidebarProfile;
