
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { emailPlans } from "@/config/emailPlans";

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
  setSelectedTab
}: EmailPlanConfiguratorProps) => {
  return (
    <Card className="mb-8 p-6">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="user-count">Número de usuários</Label>
            <div className="flex items-center mt-2">
              <Input
                id="user-count"
                type="number"
                min="1"
                max="1000"
                value={userCount}
                onChange={handleUserCountChange}
                className="w-24"
              />
              <span className="ml-2 text-muted-foreground">
                {userCount === 1 ? "usuário" : "usuários"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Período</Label>
          <div className="grid grid-cols-3 gap-2">
            {["1", "2", "3"].map((value) => (
              <Button
                key={value}
                variant={period === value ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setPeriod(value)}
              >
                {value} {parseInt(value) === 1 ? "ano" : "anos"}
                {value !== "1" && (
                  <Badge className="ml-1 bg-primary-foreground text-primary">
                    {value === "3" ? "-10%" : "-5%"}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Plano</Label>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="w-full">
              {emailPlans.map(plan => (
                <TabsTrigger 
                  key={plan.id} 
                  value={plan.id}
                  className="flex-1"
                >
                  {plan.title}
                  {plan.popular && (
                    <Badge className="ml-2 bg-green-100 text-green-800">Popular</Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

export default EmailPlanConfigurator;
