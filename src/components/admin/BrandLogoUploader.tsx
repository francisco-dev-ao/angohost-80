
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const BrandLogoUploader = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `brand/logo.${fileExt}`;
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // In a real implementation, you would upload to Supabase Storage
      // const { error } = await supabase.storage
      //   .from('brand-assets')
      //   .upload(filePath, file, { upsert: true });
      
      // if (error) throw error;
      
      // Simulate successful upload
      setTimeout(() => {
        toast.success('Logo carregado com sucesso');
        setUploading(false);
      }, 1500);
      
    } catch (error: any) {
      toast.error(`Erro ao fazer upload do logo: ${error.message}`);
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setPreviewUrl(null);
    toast.success('Logo removido com sucesso');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-40 h-40 border rounded-md flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Logo preview" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            <Upload className="h-10 w-10 mx-auto mb-2" />
            <p>Logo da empresa</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => document.getElementById('logo-upload')?.click()} 
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="animate-spin mr-2">◌</span>
              Carregando...
            </>
          ) : previewUrl ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Alterar Logo
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </>
          )}
        </Button>
        
        {previewUrl && (
          <Button 
            variant="outline" 
            onClick={removeLogo}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </Button>
        )}
      </div>
      
      <input
        type="file"
        id="logo-upload"
        accept="image/*"
        onChange={uploadLogo}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </div>
  );
};
