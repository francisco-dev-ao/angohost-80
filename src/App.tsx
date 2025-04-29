
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './components/ui/sidebar';
import { BrowserRouter } from 'react-router-dom';

// Import pages that exist in the read-only files
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Index from './pages/Index';
import Domains from './pages/Domains';
import Checkout from './pages/Checkout';
import EnhancedCheckout from './pages/EnhancedCheckout';
import AdminIndex from './pages/AdminIndex';
import AdminDomains from './pages/admin/AdminDomains';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminDomainExtensions from './pages/admin/AdminDomainExtensions';
import AdminServicePlans from './pages/admin/AdminServicePlans';
import AdminPageContents from './pages/admin/AdminPageContents';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Import or create client pages
import ClientLayout from './pages/client/ClientLayout';
import ClientDomains from './pages/client/ClientDomains';

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/hosting" element={<About />} /> {/* Placeholder until we create HostingPlans */}
        <Route path="/email" element={<About />} /> {/* Placeholder until we create EmailPlans */}
        <Route path="/vps" element={<About />} /> {/* Placeholder until we create VpsPlans */}
        <Route path="/cart" element={<Contact />} /> {/* Placeholder until we create Cart */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Register />} /> {/* Using Register as it has login tab */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/enhanced-checkout" element={<EnhancedCheckout />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminIndex /></AdminProtectedRoute>} />
        <Route path="/admin/domains" element={<AdminProtectedRoute><AdminDomains /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
        <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
        <Route path="/admin/domain-extensions" element={<AdminProtectedRoute><AdminDomainExtensions /></AdminProtectedRoute>} />
        <Route path="/admin/service-plans" element={<AdminProtectedRoute><AdminServicePlans /></AdminProtectedRoute>} />
        <Route path="/admin/page-contents" element={<AdminProtectedRoute><AdminPageContents /></AdminProtectedRoute>} />

        {/* Client Routes */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="domains" element={<ClientDomains />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  );
}

export default App;
