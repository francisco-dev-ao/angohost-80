
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageContents, PageContent } from "@/hooks/useAdminPageContents";
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

const AdminPageContents = () => {
  const { pageContents, isLoading, createPageContent, updatePageContent, deletePageContent } = useAdminPageContents();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState({
    page_slug: "",
    title: "",
    contentJson: "",
  });

  const filteredPages = pageContents.filter((page) =>
    page.page_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (page?: PageContent) => {
    if (page) {
      setCurrentPage(page);
      setFormData({
        page_slug: page.page_slug,
        title: page.title,
        contentJson: JSON.stringify(page.content, null, 2),
      });
    } else {
      setCurrentPage(null);
      setFormData({
        page_slug: "",
        title: "",
        contentJson: JSON.stringify({
          hero_title: "",
          hero_description: "",
          features: [],
        }, null, 2),
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (page: PageContent) => {
    setCurrentPage(page);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let contentObject;
      try {
        contentObject = JSON.parse(formData.contentJson);
      } catch (error) {
        alert("Formato JSON inválido! Por favor, corrija o conteúdo JSON.");
        return;
      }

      if (currentPage) {
        await updatePageContent(currentPage.id, {
          page_slug: formData.page_slug,
          title: formData.title,
          content: contentObject,
        });
      } else {
        await createPageContent({
          page_slug: formData.page_slug,
          title: formData.title,
          content: contentObject,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save page content:", error);
    }
  };

  const handleDelete = async () => {
    if (currentPage) {
      await deletePageContent(currentPage.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Conteúdo de Páginas</h2>
            <p className="text-muted-foreground">
              Gerencie o conteúdo das páginas principais do site
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Nova Página
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Páginas</CardTitle>
            <CardDescription>
              Total de {filteredPages.length} páginas disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Buscar páginas..."
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
                      <TableHead>Slug</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Nenhuma página encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">{page.page_slug}</TableCell>
                          <TableCell>{page.title}</TableCell>
                          <TableCell>
                            {format(new Date(page.updated_at), "dd/MM/yyyy HH:mm", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenDialog(page)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleOpenDeleteDialog(page)}
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
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{currentPage ? "Editar Página" : "Nova Página"}</DialogTitle>
            <DialogDescription>
              {currentPage
                ? "Edite o conteúdo da página existente."
                : "Adicione uma nova página ao sistema."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="page_slug">Slug da Página</Label>
                  <Input
                    id="page_slug"
                    name="page_slug"
                    value={formData.page_slug}
                    onChange={handleInputChange}
                    placeholder="pagina-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Identificador único para a página, usado na URL
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Página</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Título da Página"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentJson">Conteúdo (JSON)</Label>
                <Textarea
                  id="contentJson"
                  name="contentJson"
                  value={formData.contentJson}
                  onChange={handleInputChange}
                  placeholder="{ 'key': 'value' }"
                  rows={15}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Estrutura recomendada: {`{ "hero_title": "Título", "hero_description": "Descrição", "features": ["Recurso 1", "Recurso 2"] }`}
                </p>
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
              Tem certeza que deseja excluir a página {currentPage?.title}? Esta ação não pode ser desfeita.
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

export default AdminPageContents;
