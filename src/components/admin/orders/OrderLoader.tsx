
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const OrderLoader = () => {
  return (
    <div className="p-8 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default OrderLoader;
