
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronDown, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminProducts = () => {
  const { products, isLoading, updateProductStatus } = useAdminProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
            <p className="text-muted-foreground">
              Gerenciar produtos e serviços
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de produtos</CardTitle>
            <CardDescription>
              Total de {filteredProducts.length} produtos disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço Mensal</TableHead>
                      <TableHead>Preço Anual</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center"
                        >
                          Nenhum produto encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.priceMonthly.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "AOA",
                            })}
                          </TableCell>
                          <TableCell>
                            {product.priceYearly.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "AOA",
                            })}
                          </TableCell>
                          <TableCell>
                            {product.isActive ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                <Check className="mr-1 h-3 w-3" /> Ativo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                <X className="mr-1 h-3 w-3" /> Inativo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(product.createdAt), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Abrir menu</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {}}>
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateProductStatus(product.id, !product.isActive)}
                                >
                                  {product.isActive ? "Desativar" : "Ativar"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
