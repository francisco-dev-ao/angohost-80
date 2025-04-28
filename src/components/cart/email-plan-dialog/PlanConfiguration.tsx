
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlanConfigurationProps {
  config: {
    userCount: number;
    period: string;
  };
  onConfigChange: (key: string, value: any) => void;
}

const PlanConfiguration = ({ config, onConfigChange }: PlanConfigurationProps) => {
  const handleUserCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      onConfigChange('userCount', value);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="users" className="text-right">
          Usuários
        </Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => config.userCount > 1 && onConfigChange('userCount', config.userCount - 1)}
            disabled={config.userCount <= 1}
          >-</Button>
          <Input
            id="users"
            type="number"
            className="text-center"
            value={config.userCount}
            onChange={handleUserCountChange}
            min={1}
            max={1000}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => onConfigChange('userCount', config.userCount + 1)}
          >+</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="period" className="text-right">
          Período
        </Label>
        <Select
          value={config.period}
          onValueChange={(value) => onConfigChange('period', value)}
        >
          <SelectTrigger id="period" className="col-span-3">
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
    </>
  );
};

export default PlanConfiguration;
