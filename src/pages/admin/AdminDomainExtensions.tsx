
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminDomainExtensions, DomainExtension } from "@/hooks/useAdminDomainExtensions";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatters";
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

const AdminDomainExtensions = () => {
  const { domainExtensions, isLoading, createDomainExtension, updateDomainExtension, deleteDomainExtension } = useAdminDomainExtensions();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExtension, setCurrentExtension] = useState<DomainExtension | null>(null);
  const [formData, setFormData] = useState({
    extension: "",
    price: 0,
    renewal_price: 0,
    description: "",
    is_popular: false,
    is_active: true
  });

  const filteredExtensions = domainExtensions.filter((ext) =>
    ext.extension.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (extension?: DomainExtension) => {
    if (extension) {
      setCurrentExtension(extension);
      setFormData({
        extension: extension.extension,
        price: extension.price,
        renewal_price: extension.renewal_price || 0,
        description: extension.description || "",
        is_popular: extension.is_popular,
        is_active: extension.is_active
      });
    } else {
      setCurrentExtension(null);
      setFormData({
        extension: "",
        price: 0,
        renewal_price: 0,
        description: "",
        is_popular: false,
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (extension: DomainExtension) => {
    setCurrentExtension(extension);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('price') ? Number(value) : value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentExtension) {
        await updateDomainExtension(currentExtension.id, formData);
      } else {
        await createDomainExtension(formData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save domain extension:", error);
    }
  };

  const handleDelete = async () => {
    if (currentExtension) {
      await deleteDomainExtension(currentExtension.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Extensões de Domínio</h2>
            <p className="text-muted-foreground">
              Gerencie as extensões de domínio e seus preços
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Nova Extensão
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Extensões</CardTitle>
            <CardDescription>
              Total de {filteredExtensions.length} extensões disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Buscar extensões..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Extensão</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Preço de Renovação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Popular</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExtensions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Nenhuma extensão encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExtensions.map((ext) => (
                        <TableRow key={ext.id}>
                          <TableCell className="font-medium">{ext.extension}</TableCell>
                          <TableCell>{ext.description || "-"}</TableCell>
                          <TableCell>{formatPrice(ext.price)}</TableCell>
                          <TableCell>{ext.renewal_price ? formatPrice(ext.renewal_price) : "-"}</TableCell>
                          <TableCell>
                            <Badge variant={ext.is_active ? "default" : "secondary"}>
                              {ext.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={ext.is_popular ? "default" : "outline"}>
                              {ext.is_popular ? "Sim" : "Não"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenDialog(ext)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleOpenDeleteDialog(ext)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentExtension ? "Editar Extensão" : "Nova Extensão"}</DialogTitle>
            <DialogDescription>
              {currentExtension
                ? "Edite os detalhes da extensão de domínio existente."
                : "Adicione uma nova extensão de domínio ao sistema."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="extension">Extensão</Label>
                  <Input
                    id="extension"
                    name="extension"
                    value={formData.extension}
                    onChange={handleInputChange}
                    placeholder=".ao"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (AOA)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="renewal_price">Preço de Renovação (AOA)</Label>
                  <Input
                    id="renewal_price"
                    name="renewal_price"
                    type="number"
                    value={formData.renewal_price}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_popular">Popular</Label>
                    <Switch
                      id="is_popular"
                      name="is_popular"
                      checked={formData.is_popular}
                      onCheckedChange={(checked) => handleSwitchChange("is_popular", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Ativo</Label>
                    <Switch
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrição da extensão de domínio..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a extensão {currentExtension?.extension}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminDomainExtensions;
