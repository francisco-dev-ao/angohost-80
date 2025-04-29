
import { useState } from 'react';
import { toast } from 'sonner';

interface NifValidationResult {
  name?: string;
  address?: string;
  error?: string;
}

export const useNifValidation = () => {
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<NifValidationResult | null>(null);

  const validateNif = async (nif: string): Promise<NifValidationResult> => {
    if (!nif || nif.trim().length < 5) {
      return { error: 'NIF inválido. Por favor, insira um NIF válido.' };
    }

    setValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch(`https://consulta.edgarsingui.ao/public/consultar-por-nif/${nif}`);
      
      if (!response.ok) {
        throw new Error('Erro na validação do NIF');
      }
      
      const data = await response.json();
      
      if (!data || !data.name) {
        return { error: 'NIF não encontrado ou inválido' };
      }
      
      const result = {
        name: data.name,
        address: data.address || ''
      };
      
      setValidationResult(result);
      return result;
    } catch (error) {
      console.error('Erro ao validar NIF:', error);
      const errorMessage = 'Erro ao validar o NIF. Por favor, tente novamente.';
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setValidating(false);
    }
  };

  return { validateNif, validating, validationResult };
};
