
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminHosting } from "@/hooks/useAdminHosting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HostingHeader from "@/components/admin/hosting/HostingHeader";
import HostingSearchBar from "@/components/admin/hosting/HostingSearchBar";
import HostingLoadingSkeleton from "@/components/admin/hosting/HostingLoadingSkeleton";
import HostingServicesTable from "@/components/admin/hosting/HostingServicesTable";

const AdminHosting = () => {
  const { services, isLoading } = useAdminHosting();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.domain && service.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      service.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.userEmail && service.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <HostingHeader totalServices={filteredServices.length} />

        <Card>
          <CardHeader>
            <CardTitle>Serviços de Hospedagem</CardTitle>
            <CardDescription>
              Total de {filteredServices.length} serviços de hospedagem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HostingSearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />

            {isLoading ? (
              <HostingLoadingSkeleton />
            ) : (
              <HostingServicesTable services={filteredServices} />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHosting;
