
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminEmailTemplates } from "@/hooks/useAdminEmailTemplates";
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
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Mail, Plus, Edit, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const AdminEmailTemplates = () => {
  const { templates, isLoading, updateTemplate, createTemplate } = useAdminEmailTemplates();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTemplate = (template: any) => {
    setEditingTemplate({...template});
    setDialogOpen(true);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate({
      id: '',
      name: '',
      subject: '',
      content: '',
      variables: []
    });
    setDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate.id) {
      updateTemplate(editingTemplate.id, {
        name: editingTemplate.name,
        subject: editingTemplate.subject,
        content: editingTemplate.content,
        variables: editingTemplate.variables
      });
    } else {
      createTemplate({
        name: editingTemplate.name,
        subject: editingTemplate.subject,
        content: editingTemplate.content,
        variables: editingTemplate.variables
      });
    }
    setDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Templates de Email</h2>
            <p className="text-muted-foreground">
              Gerenciar templates de email para comunicação com clientes
            </p>
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" /> Novo Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Templates</CardTitle>
            <CardDescription>
              Total de {filteredTemplates.length} templates de email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
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
                      <TableHead>Nome</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Variáveis</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center"
                        >
                          Nenhum template encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                              {template.name}
                            </div>
                          </TableCell>
                          <TableCell>{template.subject}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {template.variables.map((variable: string, idx: number) => (
                                <Badge key={idx} variant="secondary">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
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
                                <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicar
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate?.id ? 'Editar Template' : 'Novo Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate?.id
                ? 'Edite os detalhes do template de email.'
                : 'Crie um novo template de email para comunicação com os clientes.'}
            </DialogDescription>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={editingTemplate.subject}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  rows={12}
                  value={editingTemplate.content}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, content: e.target.value })
                  }
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>Variáveis disponíveis</Label>
                <div className="flex flex-wrap gap-2">
                  {editingTemplate.variables?.map((variable: string, idx: number) => (
                    <Badge key={idx} variant="outline">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate?.id ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEmailTemplates;
