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
import ClientDomains from './pages/client/ClientDomains';
import ClientInvoices from './pages/client/ClientInvoices';
import ClientOrders from './pages/client/ClientOrders';
import ClientContactProfiles from './pages/client/ClientContactProfiles';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import EnhancedCheckoutPage from './pages/EnhancedCheckout';

function App() {
  return (
    <>
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

        <Route
          path="/client/domains"
          element={
            <ProtectedRoute>
              <ClientDomains />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/invoices"
          element={
            <ProtectedRoute>
              <ClientInvoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/orders"
          element={
            <ProtectedRoute>
              <ClientOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/contact-profiles"
          element={
            <ProtectedRoute>
              <ClientContactProfiles />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
