
import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DomainValidatorProps {
  onDomainValidated: (domain: string) => void;
}

const DomainValidator = ({ onDomainValidated }: DomainValidatorProps) => {
  const [searchDomain, setSearchDomain] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDomainValid, setIsDomainValid] = useState<boolean | null>(null);

  const validateDomain = async (domain: string) => {
    setIsSearching(true);
    // Simulate API call with timeout
    setTimeout(() => {
      const isValid = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain);
      setIsDomainValid(isValid);
      setIsSearching(false);
      
      if (isValid) {
        onDomainValidated(domain);
        toast.success('Domínio válido!');
      } else {
        toast.error('Domínio inválido. Tente novamente.');
      }
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Digite seu domínio..."
          value={searchDomain}
          onChange={(e) => {
            setSearchDomain(e.target.value);
            if (e.target.value.length > 3) {
              validateDomain(e.target.value);
            }
          }}
          className="pl-10"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent" />
          </div>
        )}
        {!isSearching && isDomainValid !== null && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isDomainValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainValidator;
