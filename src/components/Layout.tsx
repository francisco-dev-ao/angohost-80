import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSupabaseAuth();
  
  // Função para determinar para onde o cliente deve ser direcionado
  const getClientAreaLink = () => {
    if (!user) return "/register";
    
    // Verificar se o usuário é admin (você pode ajustar a lógica conforme necessário)
    const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com');
    
    return isAdmin ? '/admin' : '/client';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl text-[#345990]">
              <img 
                src="/ANGOHOST-01.png" 
                alt="AngoHost Logo" 
                className="h-16" // Alterado de h-10 para h-16
              />
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#345990]" />
            ) : (
              <Menu className="h-6 w-6 text-[#345990]" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#345990] hover:bg-[#345990]/10">Hospedagem</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/cpanel-hosting"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">Hospedagem cPanel</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Hospedagem compartilhada com painel cPanel
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/wordpress-hosting"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">WordPress Hosting</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Hospedagem otimizada para WordPress
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/vps-hosting"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">VPS</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Servidores privados virtuais
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/dedicated-servers"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">Servidores Dedicados</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Servidores físicos exclusivos
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#345990] hover:bg-[#345990]/10">Domínios</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/domains"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">Registro de Domínios</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Registre seu domínio .ao e outras extensões
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/domain-transfer"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">Transferência de Domínios</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Transfira seu domínio para a nossa empresa
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#345990] hover:bg-[#345990]/10">Email</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/professional-email"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">Email Profissional</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Solução de email profissional para empresas
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/exchange-online"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#345990]/10 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-[#345990]">Microsoft 365</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Microsoft Exchange Online e Microsoft 365
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact" className="px-4 py-2 text-sm font-medium text-[#345990] hover:bg-[#345990]/10 rounded-md block">
                    Contacto
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-4 ml-4">
              <Link to="/cart">
                <Button variant="outline" size="icon" className="text-[#345990] border-[#345990] hover:bg-[#345990]/10">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={getClientAreaLink()}>
                <Button variant="default" className="bg-[#345990] hover:bg-[#345990]/90">Área do Cliente</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container py-3 space-y-3">
              <div className="py-2 border-b">
                <div className="font-medium mb-1 text-[#345990]">Hospedagem</div>
                <ul className="pl-3 space-y-1">
                  <li><Link to="/cpanel-hosting" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Hospedagem cPanel</Link></li>
                  <li><Link to="/wordpress-hosting" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>WordPress Hosting</Link></li>
                  <li><Link to="/vps-hosting" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>VPS</Link></li>
                  <li><Link to="/dedicated-servers" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Servidores Dedicados</Link></li>
                </ul>
              </div>
              
              <div className="py-2 border-b">
                <div className="font-medium mb-1 text-[#345990]">Domínios</div>
                <ul className="pl-3 space-y-1">
                  <li><Link to="/domains" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Registro de Domínios</Link></li>
                  <li><Link to="/domain-transfer" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Transferência de Domínios</Link></li>
                </ul>
              </div>
              
              <div className="py-2 border-b">
                <div className="font-medium mb-1 text-[#345990]">Email</div>
                <ul className="pl-3 space-y-1">
                  <li><Link to="/professional-email" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Email Profissional</Link></li>
                  <li><Link to="/exchange-online" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Microsoft 365</Link></li>
                </ul>
              </div>
              
              <div className="py-2">
                <Link to="/contact" className="block py-1 text-[#345990] font-medium" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
              </div>

              <div className="pt-4 flex flex-col space-y-2">
                <Link to={getClientAreaLink()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full bg-[#345990] hover:bg-[#345990]/90">Área do Cliente</Button>
                </Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-[#345990] text-[#345990]">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Carrinho
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t">
  <div className="container py-12">
    {/* Cliente logos */}
    {/* REMOVIDO: Bloco de clientes que confiam em nós */}
    {/* 
    <div className="mb-12">
      <h4 className="text-xl font-semibold text-center mb-8 text-[#345990]">Clientes que confiam em nós</h4>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="h-12 w-28 bg-white rounded-md shadow-sm flex items-center justify-center">
            <div className="text-gray-400 text-xs">Logo Cliente {item}</div>
          </div>
        ))}
      </div>
    </div>
    */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <img 
          src="/ANGOHOST-01.png" 
          alt="AngoHost Logo" 
          className="h-10 mb-4"
        />
        <p className="text-sm text-gray-600 mb-4">
          Soluções em hospedagem web confiáveis e de alta performance para o seu negócio online.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-[#345990]" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" className="text-[#345990]" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a href="#" className="text-[#345990]" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
      </div>
      
      <div>
        <h5 className="font-medium text-lg mb-4 text-[#345990]">Hospedagem</h5>
        <ul className="space-y-2">
          <li><Link to="/cpanel-hosting" className="text-sm text-gray-600 hover:text-[#345990]">Hospedagem cPanel</Link></li>
          <li><Link to="/wordpress-hosting" className="text-sm text-gray-600 hover:text-[#345990]">WordPress Hosting</Link></li>
          <li><Link to="/vps-hosting" className="text-sm text-gray-600 hover:text-[#345990]">Servidores VPS</Link></li>
          <li><Link to="/dedicated-servers" className="text-sm text-gray-600 hover:text-[#345990]">Servidores Dedicados</Link></li>
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-lg mb-4 text-[#345990]">Domínios e Email</h5>
        <ul className="space-y-2">
          <li><Link to="/domains" className="text-sm text-gray-600 hover:text-[#345990]">Registro de Domínios</Link></li>
          <li><Link to="/domain-transfer" className="text-sm text-gray-600 hover:text-[#345990]">Transferência de Domínios</Link></li>
          <li><Link to="/professional-email" className="text-sm text-gray-600 hover:text-[#345990]">Email Profissional</Link></li>
          <li><Link to="/exchange-online" className="text-sm text-gray-600 hover:text-[#345990]">Microsoft 365</Link></li>
        </ul>
      </div>
      
      <div>
        <h5 className="font-medium text-lg mb-4 text-[#345990]">Empresa</h5>
        <ul className="space-y-2">
          <li><Link to="/about" className="text-sm text-gray-600 hover:text-[#345990]">Sobre nós</Link></li>
          <li><Link to="/contact" className="text-sm text-gray-600 hover:text-[#345990]">Contacto</Link></li>
          <li><Link to={getClientAreaLink()} className="text-sm text-gray-600 hover:text-[#345990]">Área do Cliente</Link></li>
          <li><Link to="/blog" className="text-sm text-gray-600 hover:text-[#345990]">Blog</Link></li>
        </ul>
      </div>
    </div>
    
    <div className="border-t pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} AngoHost. Todos os direitos reservados.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/terms" className="text-sm text-gray-500 hover:text-[#345990]">Termos e Condições</Link>
          <Link to="/privacy" className="text-sm text-gray-500 hover:text-[#345990]">Política de Privacidade</Link>
        </div>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Layout;
