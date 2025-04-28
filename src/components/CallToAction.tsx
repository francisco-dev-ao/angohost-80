
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title: string;
  description: string;
  primaryActionText: string;
  primaryActionHref: string;
  secondaryActionText: string;
  secondaryActionHref: string;
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
    <div className="bg-[#345990] text-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8 md:p-12">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
            <p className="mt-3 text-lg text-white/80">{description}</p>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-[#345990]"
            >
              <Link to={primaryActionHref}>{primaryActionText}</Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to={secondaryActionHref}>{secondaryActionText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
