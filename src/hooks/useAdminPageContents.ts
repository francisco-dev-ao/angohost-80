
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PageContent {
  id: string;
  page_slug: string;
  title: string;
  content: Record<string, any>;
  updated_at: string;
  updated_by?: string;
  created_at: string;
}

export const useAdminPageContents = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPageContents = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('page_slug');

      if (error) throw error;
      
      setPageContents(data as PageContent[] || []);
    } catch (error: any) {
      console.error('Error fetching page contents:', error);
      toast.error('Erro ao carregar conteúdos de páginas');
    } finally {
      setIsLoading(false);
    }
  };

  const getPageContent = async (pageSlug: string): Promise<PageContent | null> => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_slug', pageSlug)
        .maybeSingle();

      if (error) throw error;
      
      return data as PageContent;
    } catch (error: any) {
      console.error(`Error fetching page content for ${pageSlug}:`, error);
      return null;
    }
  };

  const createPageContent = async (pageContent: Omit<PageContent, 'id' | 'created_at' | 'updated_at' | 'updated_by'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('page_contents')
        .insert([{
          ...pageContent,
          updated_by: userData.user?.id
        }])
        .select();

      if (error) throw error;
      
      toast.success('Conteúdo de página criado com sucesso');
      return data[0] as PageContent;
    } catch (error: any) {
      console.error('Error creating page content:', error);
      toast.error(`Erro ao criar conteúdo de página: ${error.message}`);
      throw error;
    }
  };

  const updatePageContent = async (id: string, pageContent: Partial<Omit<PageContent, 'id' | 'created_at' | 'updated_at' | 'updated_by'>>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('page_contents')
        .update({
          ...pageContent,
          updated_by: userData.user?.id
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Conteúdo de página atualizado com sucesso');
      fetchPageContents();
    } catch (error: any) {
      console.error('Error updating page content:', error);
      toast.error(`Erro ao atualizar conteúdo de página: ${error.message}`);
      throw error;
    }
  };

  const deletePageContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('page_contents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Conteúdo de página removido com sucesso');
      fetchPageContents();
    } catch (error: any) {
      console.error('Error deleting page content:', error);
      toast.error(`Erro ao remover conteúdo de página: ${error.message}`);
      throw error;
    }
  };

  useEffect(() => {
    fetchPageContents();
  }, []);

  return {
    pageContents,
    isLoading,
    fetchPageContents,
    getPageContent,
    createPageContent,
    updatePageContent,
    deletePageContent
  };
};
