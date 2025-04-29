
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Domains from './pages/Domains';
import HostingPlans from './pages/HostingPlans';
import EmailPlans from './pages/EmailPlans';
import VpsPlans from './pages/VpsPlans';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import Login from './pages/Login';
import { SidebarProvider } from './components/ui/sidebar';
import AdminIndex from './pages/AdminIndex';
import AdminDomains from './pages/admin/AdminDomains';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminDomainExtensions from './pages/admin/AdminDomainExtensions';
import AdminServicePlans from './pages/admin/AdminServicePlans';
import AdminPageContents from './pages/admin/AdminPageContents';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import ClientDomains from './pages/client/ClientDomains';
import ClientLayout from './pages/client/ClientLayout';

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/hosting" element={<HostingPlans />} />
        <Route path="/email" element={<EmailPlans />} />
        <Route path="/vps" element={<VpsPlans />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

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
      </Routes>
    </SidebarProvider>
  );
}

export default App;
