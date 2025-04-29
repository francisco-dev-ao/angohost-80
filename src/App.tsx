
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Domains from './pages/Domains';
import DomainTransfer from './pages/DomainTransfer';
import WordPressHosting from './pages/WordPressHosting';
import VpsHosting from './pages/VpsHosting';
import CpanelHosting from './pages/CpanelHosting';
import DedicatedServers from './pages/DedicatedServers';
import ProfessionalEmail from './pages/ProfessionalEmail';
import ExchangeOnline from './pages/ExchangeOnline';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { Toaster } from "sonner";
import { CartProvider } from './contexts/CartContext';
import EnhancedCheckoutPage from './pages/EnhancedCheckout';
import ClientArea from './pages/ClientArea';
import { SidebarProvider } from './components/ui/sidebar';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/domain-transfer" element={<DomainTransfer />} />
          <Route path="/wordpress-hosting" element={<WordPressHosting />} />
          <Route path="/vps-hosting" element={<VpsHosting />} />
          <Route path="/cpanel-hosting" element={<CpanelHosting />} />
          <Route path="/dedicated-servers" element={<DedicatedServers />} />
          <Route path="/professional-email" element={<ProfessionalEmail />} />
          <Route path="/exchange-online" element={<ExchangeOnline />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/enhanced-checkout" element={<EnhancedCheckoutPage />} />
          
          {/* Client area routes with sidebar provider */}
          <Route path="/client/*" element={
            <SidebarProvider>
              <ClientArea />
            </SidebarProvider>
          } />
        </Routes>
        <Toaster position="top-center" />
      </CartProvider>
    </Router>
  );
}

export default App;
