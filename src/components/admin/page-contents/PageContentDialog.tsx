
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface PageContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  content: any | null;
}

const PageContentDialog = ({ isOpen, onClose, onSave, content }: PageContentDialogProps) => {
  const [formData, setFormData] = useState({
    page_slug: '',
    title: '',
    content: {} as Record<string, any>
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  // List of editable sections
  const sections = [
    { id: 'hero', name: 'Hero Principal' },
    { id: 'about', name: 'Sobre Nós' },
    { id: 'services', name: 'Serviços' },
    { id: 'testimonials', name: 'Depoimentos' },
    { id: 'features', name: 'Características' },
    { id: 'footer', name: 'Rodapé' },
    { id: 'contact', name: 'Contato' },
    { id: 'banner', name: 'Banner' },
  ];

  useEffect(() => {
    if (content) {
      setFormData({
        page_slug: content.page_slug || '',
        title: content.title || '',
        content: content.content || {},
      });
    } else {
      // Reset form for new content
      setFormData({
        page_slug: '',
        title: '',
        content: {},
      });
    }
  }, [content, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionContentChange = (sectionId: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [sectionId]: {
          ...(prev.content[sectionId] || {}),
          [key]: value
        }
      }
    }));
  };

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    const testimonials = [...(formData.content.testimonials?.items || [])];
    if (!testimonials[index]) {
      testimonials[index] = { quote: '', author: { name: '', role: '', company: '' } };
    }
    
    if (field === 'quote') {
      testimonials[index].quote = value;
    } else if (field.startsWith('author.')) {
      const authorField = field.split('.')[1];
      testimonials[index].author = {
        ...testimonials[index].author,
        [authorField]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        testimonials: {
          ...prev.content.testimonials,
          items: testimonials
        }
      }
    }));
  };

  const handleSave = async () => {
    if (!formData.page_slug || !formData.title) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setIsSaving(true);
      await onSave(formData);
      toast.success('Conteúdo salvo com sucesso');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Erro ao salvar conteúdo');
    } finally {
      setIsSaving(false);
    }
  };

  const isEditing = !!content;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Conteúdo de Página</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="sections">Seções</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page_slug">Slug da Página</Label>
                <Input
                  id="page_slug"
                  name="page_slug"
                  value={formData.page_slug}
                  onChange={handleChange}
                  placeholder="home"
                />
                <p className="text-xs text-muted-foreground">
                  Identificador único para esta página (ex: home, about, contact)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Conteúdo da Página Inicial"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sections" className="space-y-4">
            <div className="space-y-6">
              {sections.map(section => {
                const sectionContent = formData.content[section.id] || {};
                return (
                  <div key={section.id} className="border rounded-md p-4 space-y-3">
                    <h3 className="font-semibold text-lg">{section.name}</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${section.id}-title`}>Título</Label>
                      <Input
                        id={`${section.id}-title`}
                        value={sectionContent.title || ''}
                        onChange={(e) => handleSectionContentChange(section.id, 'title', e.target.value)}
                        placeholder={`Título para ${section.name}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${section.id}-subtitle`}>Subtítulo</Label>
                      <Input
                        id={`${section.id}-subtitle`}
                        value={sectionContent.subtitle || ''}
                        onChange={(e) => handleSectionContentChange(section.id, 'subtitle', e.target.value)}
                        placeholder={`Subtítulo para ${section.name}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${section.id}-description`}>Descrição</Label>
                      <Textarea
                        id={`${section.id}-description`}
                        value={sectionContent.description || ''}
                        onChange={(e) => handleSectionContentChange(section.id, 'description', e.target.value)}
                        placeholder={`Descrição para ${section.name}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="testimonials" className="space-y-4">
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Depoimentos de Clientes</h3>
              
              {[0, 1, 2].map((index) => {
                const testimonial = (formData.content.testimonials?.items || [])[index] || {};
                return (
                  <div key={index} className="border rounded-md p-4 space-y-3">
                    <h4 className="font-medium">Depoimento {index + 1}</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-${index}-quote`}>Depoimento</Label>
                      <Textarea
                        id={`testimonial-${index}-quote`}
                        value={testimonial.quote || ''}
                        onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                        placeholder="O que o cliente disse"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-${index}-author-name`}>Nome do Cliente</Label>
                      <Input
                        id={`testimonial-${index}-author-name`}
                        value={testimonial.author?.name || ''}
                        onChange={(e) => handleTestimonialChange(index, 'author.name', e.target.value)}
                        placeholder="Nome do cliente"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-${index}-author-role`}>Cargo</Label>
                      <Input
                        id={`testimonial-${index}-author-role`}
                        value={testimonial.author?.role || ''}
                        onChange={(e) => handleTestimonialChange(index, 'author.role', e.target.value)}
                        placeholder="Cargo do cliente"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`testimonial-${index}-author-company`}>Empresa</Label>
                      <Input
                        id={`testimonial-${index}-author-company`}
                        value={testimonial.author?.company || ''}
                        onChange={(e) => handleTestimonialChange(index, 'author.company', e.target.value)}
                        placeholder="Empresa do cliente"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PageContentDialog;
