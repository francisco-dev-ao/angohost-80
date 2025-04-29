
import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "../ui/sidebar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import AdminSidebarProfile from "./sidebar/AdminSidebarProfile";
import AdminSidebarMenuItems from "./sidebar/AdminSidebarMenuItems";
import AdminSidebarLogout from "./sidebar/AdminSidebarLogout";

const AdminSidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const { user, isAdmin } = useSupabaseAuth();
  
  // Check if user is super admin (support@angohost.ao)
  const isSuperAdmin = user?.email === 'support@angohost.ao';

  return (
    <div
      className={cn(
        "border-r bg-card transition-all duration-300 h-screen sticky top-0",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-full flex flex-col">
        <AdminSidebarProfile 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          user={user} 
          isSuperAdmin={isSuperAdmin} 
        />
        <Separator />
        <ScrollArea className="flex-1 px-3 py-4">
          <AdminSidebarMenuItems isOpen={isOpen} isSuperAdmin={isSuperAdmin} />
        </ScrollArea>
        <AdminSidebarLogout isOpen={isOpen} />
      </div>
    </div>
  );
};

export default AdminSidebar;
