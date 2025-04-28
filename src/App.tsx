
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
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
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
