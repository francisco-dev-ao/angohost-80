
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string | number;
  period: string;
  features: PricingFeature[];
  popular?: boolean;
  ctaText?: string;
  onAction?: () => void;
  highlightFeatures?: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  period,
  features,
  popular = false,
  ctaText = "Adicionar ao carrinho",
  onAction,
  highlightFeatures = [],
}) => {
  return (
    <Card className={`flex flex-col h-full ${
      popular 
        ? "border-angohost-primary shadow-lg relative" 
        : ""
    }`}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge className="bg-angohost-primary hover:bg-angohost-primary text-sm px-3 py-1">Mais popular</Badge>
        </div>
      )}
      <CardHeader className={`${popular ? "pt-8" : ""} ${popular ? "bg-angohost-primary/5" : ""}`}>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3 mt-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <span className={`${!feature.included ? "text-muted-foreground" : ""} ${
                highlightFeatures && highlightFeatures.includes(feature.text) 
                  ? "font-medium" 
                  : ""
              }`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button 
          variant={popular ? "default" : "outline"} 
          className={`w-full ${popular ? "bg-angohost-primary hover:bg-angohost-primary/90" : "border-angohost-primary text-angohost-primary hover:bg-angohost-primary hover:text-white"}`}
          onClick={onAction}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
