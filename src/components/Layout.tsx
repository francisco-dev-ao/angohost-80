
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="font-bold text-2xl text-hostify-700">
              Hostify
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/domains" className="px-4 py-2 text-sm font-medium">
                    Domínios
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Alojamento Web</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/cpanel"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Hospedagem cPanel</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Hospedagem compartilhada com cPanel
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/wordpress"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">WordPress Hosting</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Hospedagem otimizada para WordPress
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/vps"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">VPS</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Servidores privados virtuais
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/dedicated"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Servidores Dedicados</div>
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
                  <NavigationMenuTrigger>Email Corporativo</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/email"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Email Profissional</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Solução de email profissional para empresas
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/exchange"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Exchange Online</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Microsoft Exchange Online e Microsoft 365
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/client">
              <Button variant="default">Área do Cliente</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-10">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Hostify</h3>
            <p className="text-sm text-muted-foreground">
              Soluções em hospedagem web confiáveis e de alta performance para o seu negócio online.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-4">Produtos</h3>
            <ul className="space-y-2">
              <li><Link to="/products/cpanel" className="text-sm text-muted-foreground hover:text-foreground">Hospedagem cPanel</Link></li>
              <li><Link to="/products/wordpress" className="text-sm text-muted-foreground hover:text-foreground">Hospedagem WordPress</Link></li>
              <li><Link to="/products/vps" className="text-sm text-muted-foreground hover:text-foreground">Servidores VPS</Link></li>
              <li><Link to="/products/dedicated" className="text-sm text-muted-foreground hover:text-foreground">Servidores Dedicados</Link></li>
              <li><Link to="/products/email" className="text-sm text-muted-foreground hover:text-foreground">E-mails Corporativos</Link></li>
              <li><Link to="/products/domains" className="text-sm text-muted-foreground hover:text-foreground">Registro de Domínios</Link></li>
              <li><Link to="/products/ssl" className="text-sm text-muted-foreground hover:text-foreground">Certificados SSL</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">Sobre nós</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contato</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">Central de Ajuda</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contato</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>contato@hostify.com</p>
              <p>+55 (11) 1234-5678</p>
              <p>São Paulo, SP - Brasil</p>
            </address>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="container mt-8 pt-6 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Hostify. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
