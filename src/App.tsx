
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import AdminIndex from "./pages/AdminIndex";
import ClientIndex from "./pages/ClientIndex";
import { AuthProvider } from "./hooks/mysql/useAuth";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/*" element={<AdminIndex />} />
          <Route path="/client/*" element={<ClientIndex />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
