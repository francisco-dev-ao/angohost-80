
import React from 'react';
import { useClientDomains } from '@/hooks/useClientDomains';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Globe, Lock, Shield, CheckCircle, XCircle } from 'lucide-react';

const DomainsPage = () => {
  const { domains, loading, toggleAutoRenew, toggleWhoisPrivacy, toggleLock } = useClientDomains();

  if (loading) {
    return <div className="py-8 text-center">Carregando domínios...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativo
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Pendente
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Expirado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status || 'Desconhecido'}
          </span>
        );
    }
  };

  const isExpirationSoon = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const differenceInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return differenceInDays <= 30;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Domínios</h1>
        <Button onClick={() => window.location.href = '/domains'}>Registrar novo domínio</Button>
      </div>

      {domains.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Nenhum domínio encontrado</CardTitle>
            <CardDescription>
              Você ainda não possui domínios registrados.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.href = '/domains'}>Registrar um domínio</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Domínios Registrados</CardTitle>
            <CardDescription>
              Gerencie seus domínios, renovações e configurações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Lista de domínios registrados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Domínio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiração</TableHead>
                  <TableHead>Proteção Whois</TableHead>
                  <TableHead>Bloqueio</TableHead>
                  <TableHead>Auto Renovar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span>{domain.domain_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(domain.status)}</TableCell>
                    <TableCell>
                      <div>
                        {format(new Date(domain.expiry_date), 'dd/MM/yyyy', { locale: ptBR })}
                        {isExpirationSoon(domain.expiry_date) && (
                          <p className="text-xs text-orange-600 font-medium">Expira em breve</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={domain.whois_privacy || false} 
                          onCheckedChange={() => toggleWhoisPrivacy(domain.id, !!domain.whois_privacy)}
                          aria-label="Proteção WHOIS"
                        />
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={domain.is_locked || false} 
                          onCheckedChange={() => toggleLock(domain.id, !!domain.is_locked)}
                          aria-label="Bloqueio de transferência"
                        />
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={domain.auto_renew || false} 
                          onCheckedChange={() => toggleAutoRenew(domain.id, !!domain.auto_renew)}
                          aria-label="Renovação automática"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainsPage;
