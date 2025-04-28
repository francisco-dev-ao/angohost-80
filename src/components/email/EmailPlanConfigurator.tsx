
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmailPlanConfiguratorProps {
  userCount: number;
  handleUserCountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  period: string;
  setPeriod: (period: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const EmailPlanConfigurator = ({
  userCount,
  handleUserCountChange,
  period,
  setPeriod,
  selectedTab,
  setSelectedTab,
}: EmailPlanConfiguratorProps) => {
  return (
    <div className="max-w-md mx-auto mb-12 bg-muted/20 p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-medium mb-4">Configurar Plano</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="userCount">Número de usuários</Label>
          <div className="flex items-center space-x-4 mt-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => userCount > 1 && handleUserCountChange({ target: { value: (userCount - 1).toString() } } as React.ChangeEvent<HTMLInputElement>)}
              disabled={userCount <= 1}
            >-</Button>
            <Input
              id="userCount"
              type="number"
              className="text-center"
              value={userCount}
              onChange={handleUserCountChange}
              min={1}
              max={1000}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => handleUserCountChange({ target: { value: (userCount + 1).toString() } } as React.ChangeEvent<HTMLInputElement>)}
            >+</Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="period">Período de contratação</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period" className="mt-2">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ano</SelectItem>
              <SelectItem value="2">2 anos</SelectItem>
              <SelectItem value="3">3 anos</SelectItem>
              <SelectItem value="4">4 anos</SelectItem>
              <SelectItem value="5">5 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Tipo de plano</Label>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmailPlanConfigurator;
