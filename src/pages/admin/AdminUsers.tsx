
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, Loader2, UserCog } from "lucide-react";
import { AdminUser } from "@/types/admin";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminUsers = () => {
  const { users, isLoading, updateUserRole } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [role, setRole] = useState<"admin" | "support" | "finance" | "customer">("customer");

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRoleChange = async () => {
    if (selectedUser) {
      await updateUserRole(selectedUser.id, role);
      setDialogOpen(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "support":
        return "bg-blue-100 text-blue-800";
      case "finance":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
            <p className="text-muted-foreground">
              Gerencie todos os usuários da plataforma
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de usuários</CardTitle>
            <CardDescription>
              Total de {filteredUsers.length} usuários encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Data de cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center"
                        >
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.fullName || "---"}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={getRoleBadgeColor(user.role)}
                              variant="outline"
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.createdAt), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Abrir menu</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setRole(user.role);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Alterar função
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar função do usuário</DialogTitle>
            <DialogDescription>
              Defina a nova função para {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={role}
              onValueChange={(value: any) => setRole(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="finance">Financeiro</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleRoleChange}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
