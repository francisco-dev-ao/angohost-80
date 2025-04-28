import React from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Globe,
  Server,
  ShoppingCart,
  Receipt,
  LifeBuoy,
  Mail,
  CreditCard,
  Settings,
  ShoppingBasket
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
}

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold">AngoHost Admin</h2>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {/* Dashboard Link */}
          <li>
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          </li>
          
          {/* Users Link */}
          <li>
            <NavItem to="/admin/users" icon={Users} label="Usuários" />
          </li>
          
          {/* Products Link */}
          <li>
            <NavItem to="/admin/products" icon={Package} label="Produtos" />
          </li>
          
          {/* Domains Link */}
          <li>
            <NavItem to="/admin/domains" icon={Globe} label="Domínios" />
          </li>
          
          {/* Hosting Link */}
          <li>
            <NavItem to="/admin/hosting" icon={Server} label="Hospedagem" />
          </li>
          
          {/* Orders Link */}
          <li>
            <NavItem to="/admin/orders" icon={ShoppingCart} label="Pedidos" />
          </li>
          
          {/* Invoices Link */}
          <li>
            <NavItem to="/admin/invoices" icon={Receipt} label="Faturas" />
          </li>
          
          {/* Abandoned Carts Link */}
          <li>
            <NavItem to="/admin/abandoned-carts" icon={ShoppingBasket} label="Carrinhos Abandonados" />
          </li>
          
          {/* Tickets Link */}
          <li>
            <NavItem to="/admin/tickets" icon={LifeBuoy} label="Tickets" />
          </li>
          
          {/* Email Templates Link */}
          <li>
            <NavItem to="/admin/email-templates" icon={Mail} label="Templates de Email" />
          </li>
          
          {/* Payment Methods Link */}
          <li>
            <NavItem to="/admin/payment-methods" icon={CreditCard} label="Métodos de Pagamento" />
          </li>
          
          {/* Settings Link */}
          <li>
            <NavItem to="/admin/settings" icon={Settings} label="Configurações" />
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center p-2 rounded-md hover:bg-gray-100 ${
            isActive ? "bg-gray-100 font-medium" : ""
          }`
        }
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </NavLink>
    </li>
  );
}
