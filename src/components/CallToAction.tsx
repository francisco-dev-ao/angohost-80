
import React from "react";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title: string;
  description: string;
  primaryActionText: string;
  primaryActionHref: string;
  secondaryActionText?: string;
  secondaryActionHref?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryActionText,
  primaryActionHref,
  secondaryActionText,
  secondaryActionHref,
}) => {
  return (
    <section className="bg-primary text-primary-foreground py-16 px-4 rounded-lg relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "cover",
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-8 text-primary-foreground/80">{description}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white hover:bg-gray-100 text-primary"
          >
            <a href={primaryActionHref}>{primaryActionText}</a>
          </Button>
          
          {secondaryActionText && secondaryActionHref && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <a href={secondaryActionHref}>{secondaryActionText}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
