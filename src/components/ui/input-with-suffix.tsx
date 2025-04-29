
import React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface InputWithSuffixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
}

const InputWithSuffix = React.forwardRef<HTMLInputElement, InputWithSuffixProps>(
  ({ className, suffix, ...props }, ref) => {
    return (
      <div className="relative flex w-full">
        <Input
          className={cn(suffix && "pr-12", className)}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

InputWithSuffix.displayName = "InputWithSuffix";

export { InputWithSuffix };
