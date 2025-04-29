import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.ComponentProps<typeof Sheet> {
  children: React.ReactNode
  title: string
  description?: string
}

const Sidebar = ({ children, title, description, ...props }: SidebarProps) => {
  return (
    <Sheet {...props}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          Open
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-3/4 md:w-2/5 lg:w-1/3">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export { Sidebar }
