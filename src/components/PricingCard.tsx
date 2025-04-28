
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  period: string;
  features: PricingFeature[];
  popular?: boolean;
  ctaText?: string;
  onAction?: () => void;
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
}) => {
  return (
    <Card className={`flex flex-col ${
      popular 
        ? "border-primary shadow-lg relative before:absolute before:-top-4 before:left-0 before:right-0 before:mx-auto before:w-fit before:content-['Mais_popular'] before:bg-primary before:text-primary-foreground before:py-1 before:px-3 before:rounded-full before:text-xs before:font-medium"
        : ""
    }`}>
      <CardHeader className={popular ? "pt-8" : ""}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2 mt-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`flex items-center justify-center h-5 w-5 rounded-full ${
                feature.included ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {feature.included && <Check className="h-3 w-3" />}
              </span>
              <span className={!feature.included ? "text-muted-foreground" : ""}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant={popular ? "default" : "outline"} 
          className="w-full"
          onClick={onAction}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
