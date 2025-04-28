
"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarContextProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const SidebarProvider = ({ children, defaultExpanded = true }: SidebarProviderProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(defaultExpanded);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [defaultExpanded]);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const value = useMemo(
    () => ({
      expanded,
      setExpanded,
      toggleExpanded,
    }),
    [expanded],
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className, ...props }: SidebarProps) => {
  const { expanded } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <aside
      ref={sidebarRef}
      data-expanded={expanded}
      className={cn(
        "h-screen sticky top-0 left-0 z-30 flex flex-col overflow-y-auto bg-background transition-all duration-300 data-[expanded=true]:translate-x-0 data-[expanded=false]:-translate-x-full md:data-[expanded=false]:translate-x-0 md:data-[expanded=false]:translate-y-0",
        className,
      )}
      {...props}
    />
  );
};

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = ({ className, ...props }: SidebarHeaderProps) => (
  <header
    className={cn("border-b border-border px-4 py-4 flex items-center justify-between", className)}
    {...props}
  />
);

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = ({ className, ...props }: SidebarContentProps) => (
  <nav className={cn("flex-1 overflow-auto p-0", className)} {...props} />
);

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter = ({ className, ...props }: SidebarFooterProps) => (
  <footer className={cn("border-t border-border p-4", className)} {...props} />
);

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = ({ className, ...props }: SidebarTriggerProps) => {
  const { toggleExpanded } = useSidebar();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleExpanded}
      className={cn("", className)}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
};

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroup = ({ className, ...props }: SidebarGroupProps) => (
  <div className={cn("pb-1", className)} {...props} />
);

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const SidebarGroupLabel = ({ className, ...props }: SidebarGroupLabelProps) => (
  <p
    className={cn(
      "mb-2 px-4 pt-4 text-xs font-medium uppercase text-muted-foreground",
      className,
    )}
    {...props}
  />
);

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroupContent = ({ className, ...props }: SidebarGroupContentProps) => (
  <div className={cn("", className)} {...props} />
);

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarMenu = ({ className, ...props }: SidebarMenuProps) => (
  <div role="menu" className={cn("font-normal", className)} {...props} />
);

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarMenuItem = ({ className, ...props }: SidebarMenuItemProps) => (
  <div
    role="menuitem"
    className={cn("relative select-none space-y-1 rounded-md p-1", className)}
    {...props}
  />
);

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild, ...props }, ref) => {
  // If asChild is true, pass the props to the children
  if (asChild) {
    const Comp = "button";
    return <Comp ref={ref} className={className} {...props} />;
  }
  
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm outline-none hover:bg-accent focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
});

SidebarMenuButton.displayName = "SidebarMenuButton";
