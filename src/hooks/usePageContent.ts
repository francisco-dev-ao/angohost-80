
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PageContent {
  id: string;
  page_slug: string;
  title: string;
  content: Record<string, any>;
}

export const usePageContent = (pageSlug: string) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      if (!pageSlug) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('page_contents')
          .select('*')
          .eq('page_slug', pageSlug)
          .maybeSingle();

        if (error) throw error;
        setContent(data as PageContent);
      } catch (error) {
        console.error(`Error fetching page content for ${pageSlug}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageSlug]);

  return { content, loading };
};
