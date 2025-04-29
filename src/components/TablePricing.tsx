
import React, { useState } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PricingFeature {
  name: string;
  tooltip?: string;
  starter: boolean | string;
  business: boolean | string;
  professional: boolean | string;
}

const TablePricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  // Hosting Plans Features
  const hostingFeatures: PricingFeature[] = [
    { name: "Número de Sites", starter: "1", business: "10", professional: "Ilimitado" },
    { name: "Espaço SSD", starter: "10GB", business: "50GB", professional: "100GB" },
    { name: "Tráfego Mensal", starter: "50GB", business: "200GB", professional: "Ilimitado" },
    { name: "Contas de Email", starter: "5", business: "20", professional: "100" },
    { name: "Certificado SSL", starter: true, business: true, professional: true },
    { name: "Backup Diário", starter: false, business: true, professional: true },
    { name: "CDN Cloudflare", starter: false, business: true, professional: true },
    { name: "Migração Gratuita", tooltip: "Migramos seu site gratuitamente", starter: false, business: true, professional: true },
    { name: "Painel cPanel", starter: true, business: true, professional: true },
    { name: "WordPress Otimizado", starter: false, business: true, professional: true },
    { name: "Banco de Dados", starter: "1", business: "10", professional: "Ilimitado" },
  ];

  // Email Plans Features
  const emailFeatures: PricingFeature[] = [
    { name: "Espaço por Conta", starter: "5GB", business: "15GB", professional: "50GB" },
    { name: "Número de Contas", starter: "5", business: "15", professional: "Ilimitado" },
    { name: "Anti-spam/Antivírus", starter: true, business: true, professional: true },
    { name: "Webmail", starter: true, business: true, professional: true },
    { name: "Acesso Mobile", starter: false, business: true, professional: true },
    { name: "Encaminhamento", starter: true, business: true, professional: true },
    { name: "Auto-resposta", starter: true, business: true, professional: true },
    { name: "Microsoft 365", starter: false, business: false, professional: true },
  ];

  // VPS Plans Features
  const vpsFeatures: PricingFeature[] = [
    { name: "CPU Cores", starter: "1 vCPU", business: "2 vCPU", professional: "4 vCPU" },
    { name: "Memória RAM", starter: "2GB", business: "4GB", professional: "8GB" },
    { name: "Espaço SSD", starter: "20GB", business: "40GB", professional: "80GB" },
    { name: "Tráfego", starter: "1TB", business: "2TB", professional: "5TB" },
    { name: "IP Dedicado", starter: "1", business: "1", professional: "2" },
    { name: "Root Access", starter: true, business: true, professional: true },
    { name: "Painel de Controle", starter: false, business: true, professional: true },
    { name: "Monitoramento 24/7", starter: true, business: true, professional: true },
    { name: "Backups Diários", starter: false, business: true, professional: true },
  ];

  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-400 mx-auto" />
      );
    }
    return <span className="font-medium">{value}</span>;
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-lg">
      <Tabs defaultValue="hosting" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="hosting">Hospedagem</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="vps">VPS</TabsTrigger>
          </TabsList>
          
          <div className="bg-gray-100 p-1 rounded-full">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "monthly" 
                  ? "bg-white shadow-sm text-gray-800" 
                  : "text-gray-600"
              }`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Mensal
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "annual" 
                  ? "bg-white shadow-sm text-gray-800" 
                  : "text-gray-600"
              }`}
              onClick={() => setBillingPeriod("annual")}
            >
              Anual <span className="text-green-600 text-xs font-bold">-20%</span>
            </button>
          </div>
        </div>

        <TabsContent value="hosting" className="mt-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-500">Plano</th>
                  <th className="text-center py-4 px-4">
                    <div className="text-lg font-bold text-gray-800">Iniciante</div>
                    <div className="text-2xl font-bold mt-1">
                      {billingPeriod === "monthly" ? "AOA 990" : "AOA 9.490"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 bg-blue-50 rounded-t-lg relative">
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-full">POPULAR</span>
                    <div className="text-lg font-bold text-gray-800">Business</div>
                    <div className="text-2xl font-bold mt-1 text-blue-600">
                      {billingPeriod === "monthly" ? "AOA 1.990" : "AOA 19.100"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="text-lg font-bold text-gray-800">Profissional</div>
                    <div className="text-2xl font-bold mt-1">
                      {billingPeriod === "monthly" ? "AOA 3.490" : "AOA 33.500"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {hostingFeatures.map((feature, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-sm">
                      <TooltipProvider>
                        <div className="flex items-center">
                          {feature.name}
                          {feature.tooltip && (
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-[200px]">{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {renderValue(feature.starter)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm bg-blue-50">
                      {renderValue(feature.business)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {renderValue(feature.professional)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild className="w-full">
                      <Link to="/products/cpanel">Escolher</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center bg-blue-50 rounded-b-lg">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="/products/cpanel">Escolher</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild className="w-full">
                      <Link to="/products/cpanel">Escolher</Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="mt-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-500">Plano</th>
                  <th className="text-center py-4 px-4">
                    <div className="text-lg font-bold text-gray-800">Básico</div>
                    <div className="text-2xl font-bold mt-1">
                      {billingPeriod === "monthly" ? "AOA 690" : "AOA 6.620"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 bg-blue-50 rounded-t-lg relative">
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-full">POPULAR</span>
                    <div className="text-lg font-bold text-gray-800">Business</div>
                    <div className="text-2xl font-bold mt-1 text-blue-600">
                      {billingPeriod === "monthly" ? "AOA 1.490" : "AOA 14.300"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="text-lg font-bold text-gray-800">Enterprise</div>
                    <div className="text-2xl font-bold mt-1">
                      {billingPeriod === "monthly" ? "AOA 2.990" : "AOA 28.700"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {emailFeatures.map((feature, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-sm">
                      <TooltipProvider>
                        <div className="flex items-center">
                          {feature.name}
                          {feature.tooltip && (
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-[200px]">{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {renderValue(feature.starter)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm bg-blue-50">
                      {renderValue(feature.business)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {renderValue(feature.professional)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild className="w-full">
                      <Link to="/products/email">Escolher</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center bg-blue-50 rounded-b-lg">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="/products/email">Escolher</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild className="w-full">
                      <Link to="/products/email">Escolher</Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="vps" className="mt-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-500">Plano</th>
                  <th className="text-center py-4 px-4">
                    <div className="text-lg font-bold text-gray-800">VPS Básico</div>
                    <div className="text-2xl font-bold mt-1">
                      {billingPeriod === "monthly" ? "AOA 4.990" : "AOA 47.900"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 bg-blue-50 rounded-t-lg relative">
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-full">POPULAR</span>
                    <div className="text-lg font-bold text-gray-800">VPS Plus</div>
                    <div className="text-2xl font-bold mt-1 text-blue-600">
                      {billingPeriod === "monthly" ? "AOA 8.990" : "AOA 86.300"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="text-lg font-bold text-gray-800">VPS Pro</div>
                    <div className="text-2xl font-bold mt-1">
                      {billingPeriod === "monthly" ? "AOA 14.990" : "AOA 143.900"}
                      <span className="text-sm text-gray-500 font-normal">/mês</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {vpsFeatures.map((feature, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-sm">
                      <TooltipProvider>
                        <div className="flex items-center">
                          {feature.name}
                          {feature.tooltip && (
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-[200px]">{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {renderValue(feature.starter)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm bg-blue-50">
                      {renderValue(feature.business)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {renderValue(feature.professional)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild className="w-full">
                      <Link to="/vps-hosting">Escolher</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center bg-blue-50 rounded-b-lg">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="/vps-hosting">Escolher</Link>
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button asChild className="w-full">
                      <Link to="/vps-hosting">Escolher</Link>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TablePricing;
