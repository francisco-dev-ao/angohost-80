
import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientSidebar from '@/components/client/ClientSidebar';

const ClientLayout = () => {
  return (
    <div className="flex min-h-screen">
      <ClientSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;
