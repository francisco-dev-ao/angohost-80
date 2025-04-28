
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title: string;
  description: string;
  primaryActionText: string;
  primaryActionHref: string;
  primaryActionIcon?: React.ReactNode;
  secondaryActionText: string;
  secondaryActionHref: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryActionText,
  primaryActionHref,
  primaryActionIcon,
  secondaryActionText,
  secondaryActionHref,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#345990] to-[#264473] text-white rounded-xl shadow-xl overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
      
      <div className="p-8 md:p-12 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
            <p className="mt-3 text-lg text-white/90">{description}</p>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-[#345990] font-medium shadow-md hover:shadow-lg transition-all"
            >
              <Link to={primaryActionHref}>
                {primaryActionText}
                {primaryActionIcon}
              </Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-medium transition-all"
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
