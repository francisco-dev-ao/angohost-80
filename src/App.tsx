import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { OwnershipProvider } from "./contexts/OwnershipContext";
import Index from "./pages/Index";
import CpanelHosting from "./pages/CpanelHosting";
import WordPressHosting from "./pages/WordPressHosting";
import VpsHosting from "./pages/VpsHosting";
import DedicatedServers from "./pages/DedicatedServers";
import ProfessionalEmail from "./pages/ProfessionalEmail";
import ExchangeOnline from "./pages/ExchangeOnline";
import ClientArea from "./pages/ClientArea";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Domains from "./pages/Domains";
import Register from "./pages/Register";
import AdminIndex from "./pages/AdminIndex";
import AdminStats from "./pages/admin/AdminStats";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminDomains from "./pages/admin/AdminDomains";
import AdminHosting from "./pages/admin/AdminHosting";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminEmailTemplates from "./pages/admin/AdminEmailTemplates";
import AdminSettings from "./pages/admin/AdminSettings";
import ProfilePage from "./components/client/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <OwnershipProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products/cpanel" element={<CpanelHosting />} />
              <Route path="/products/wordpress" element={<WordPressHosting />} />
              <Route path="/products/vps" element={<VpsHosting />} />
              <Route path="/products/dedicated" element={<DedicatedServers />} />
              <Route path="/products/email" element={<ProfessionalEmail />} />
              <Route path="/products/exchange" element={<ExchangeOnline />} />
              <Route path="/domains" element={<Domains />} />
              <Route path="/client" element={<ClientArea />} />
              <Route path="/client/profile" element={<ClientArea />} />
              <Route path="/client/domains" element={<ClientArea />} />
              <Route path="/client/services" element={<ClientArea />} />
              <Route path="/client/invoices" element={<ClientArea />} />
              <Route path="/client/payment-methods" element={<ClientArea />} />
              <Route path="/client/support" element={<ClientArea />} />
              <Route path="/client/notifications" element={<ClientArea />} />
              <Route path="/client/promotions" element={<ClientArea />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/client/orders" element={<ClientArea />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminIndex />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/domains" element={<AdminDomains />} />
              <Route path="/admin/hosting" element={<AdminHosting />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/invoices" element={<AdminInvoices />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route path="/admin/email-templates" element={<AdminEmailTemplates />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OwnershipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
