
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminPageContents } from '@/hooks/useAdminPageContents';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminActionMenu from '@/components/admin/AdminActionMenu';
import PageContentDialog from '@/components/admin/page-contents/PageContentDialog';

const AdminPageContents = () => {
  const { pageContents, isLoading, fetchPageContents, createPageContent, updatePageContent, deletePageContent } = useAdminPageContents();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  
  const filteredContents = pageContents.filter(
    content => content.page_slug.toLowerCase().includes(searchTerm.toLowerCase()) || 
               content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateNew = () => {
    setSelectedContent(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (id: string) => {
    const content = pageContents.find(c => c.id === id);
    if (content) {
      setSelectedContent(content);
      setIsDialogOpen(true);
    }
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContent(null);
  };
  
  const handleSave = async (data: any) => {
    try {
      if (selectedContent) {
        await updatePageContent(selectedContent.id, data);
      } else {
        await createPageContent(data);
      }
      setIsDialogOpen(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Conteúdo do Site</h2>
            <p className="text-muted-foreground">
              Gerencie o conteúdo de todas as páginas do site
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchPageContents()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
            </Button>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" /> Novo Conteúdo
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdos</CardTitle>
            <CardDescription>
              Lista de conteúdos de página do site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por slug ou título..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slug</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Carregando conteúdos...
                      </TableCell>
                    </TableRow>
                  ) : filteredContents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Nenhum conteúdo encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContents.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="font-medium">{content.page_slug}</TableCell>
                        <TableCell>{content.title}</TableCell>
                        <TableCell>
                          {format(new Date(content.updated_at), "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <AdminActionMenu
                            id={content.id}
                            name={content.title}
                            type="service"
                            onDelete={deletePageContent}
                            onEdit={() => handleEdit(content.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PageContentDialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        content={selectedContent}
      />
    </AdminLayout>
  );
};

export default AdminPageContents;
