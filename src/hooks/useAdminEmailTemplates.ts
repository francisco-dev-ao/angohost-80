
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EmailTemplate } from '@/types/admin';

export const useAdminEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setTemplates(data as EmailTemplate[]);
    } catch (error: any) {
      toast.error('Erro ao carregar templates de e-mail: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplate = async (templateId: string, updates: Partial<EmailTemplate>) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', templateId);

      if (error) throw error;
      
      toast.success('Template atualizado com sucesso');
      fetchTemplates(); // Reload templates
    } catch (error: any) {
      toast.error('Erro ao atualizar template: ' + error.message);
    }
  };

  const createTemplate = async (template: Omit<EmailTemplate, 'id'>) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert([template]);

      if (error) throw error;
      
      toast.success('Template criado com sucesso');
      fetchTemplates(); // Reload templates
    } catch (error: any) {
      toast.error('Erro ao criar template: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, isLoading, fetchTemplates, updateTemplate, createTemplate };
};
