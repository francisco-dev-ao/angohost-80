
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const HostingLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
};

export default HostingLoadingSkeleton;
