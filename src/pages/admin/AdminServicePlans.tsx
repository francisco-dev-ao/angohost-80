import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminServicePlans, ServicePlan } from "@/hooks/useAdminServicePlans";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminServicePlans = () => {
  const { servicePlans, isLoading, createServicePlan, updateServicePlan, deleteServicePlan } = useAdminServicePlans();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ServicePlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    service_type: "hosting",
    price_monthly: 0,
    price_yearly: 0,
    features: {},
    is_popular: false,
    is_active: true
  });
  const [featureKey, setFeatureKey] = useState("");
  const [featureValue, setFeatureValue] = useState("");

  const serviceTypes = Array.from(new Set(servicePlans.map(plan => plan.service_type)));

  const filteredPlans = servicePlans.filter(
    (plan) => 
      (selectedType === "all" || plan.service_type === selectedType) && 
      (plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleOpenDialog = (plan?: ServicePlan) => {
    if (plan) {
      setCurrentPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description || "",
        service_type: plan.service_type,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        features: plan.features || {},
        is_popular: plan.is_popular,
        is_active: plan.is_active
      });
    } else {
      setCurrentPlan(null);
      setFormData({
        name: "",
        description: "",
        service_type: "hosting",
        price_monthly: 0,
        price_yearly: 0,
        features: {},
        is_popular: false,
        is_active: true
      });
    }
    setIsDialogOpen(true);
    setFeatureKey("");
    setFeatureValue("");
  };

  const handleOpenDeleteDialog = (plan: ServicePlan) => {
    setCurrentPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('price') ? Number(value) : value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addFeature = () => {
    if (featureKey && featureValue) {
      setFormData({
        ...formData,
        features: {
          ...formData.features,
          [featureKey]: featureValue
        }
      });
      setFeatureKey("");
      setFeatureValue("");
    }
  };

  const removeFeature = (key: string) => {
    const updatedFeatures = { ...formData.features };
    delete updatedFeatures[key];
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPlan) {
        await updateServicePlan(currentPlan.id, formData);
      } else {
        await createServicePlan(formData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save service plan:", error);
    }
  };

  const handleDelete = async () => {
    if (currentPlan) {
      await deleteServicePlan(currentPlan.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Planos de Serviço</h2>
            <p className="text-muted-foreground">
              Gerencie os planos de serviço e seus preços
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Novo Plano
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Planos</CardTitle>
            <CardDescription>
              Total de {filteredPlans.length} planos disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Buscar planos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      <TableHead>Tipo</TableHead>
                      <TableHead>Preço Mensal</TableHead>
                      <TableHead>Preço Anual</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Popular</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Nenhum plano encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">
                            <div>
                              {plan.name}
                              {plan.description && (
                                <div className="text-xs text-muted-foreground">{plan.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{plan.service_type}</TableCell>
                          <TableCell>{formatPrice(plan.price_monthly)}</TableCell>
                          <TableCell>{formatPrice(plan.price_yearly)}</TableCell>
                          <TableCell>
                            <Badge variant={plan.is_active ? "default" : "secondary"}>
                              {plan.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={plan.is_popular ? "default" : "outline"}>
                              {plan.is_popular ? "Sim" : "Não"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenDialog(plan)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleOpenDeleteDialog(plan)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{currentPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
            <DialogDescription>
              {currentPlan
                ? "Edite os detalhes do plano de serviço existente."
                : "Adicione um novo plano de serviço ao sistema."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="features">Recursos</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service_type">Tipo de Serviço</Label>
                    <Select
                      value={formData.service_type}
                      onValueChange={(value) => handleSelectChange("service_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hosting">Hospedagem</SelectItem>
                        <SelectItem value="vps">VPS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="domain">Domínio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_monthly">Preço Mensal (AOA)</Label>
                    <Input
                      id="price_monthly"
                      name="price_monthly"
                      type="number"
                      value={formData.price_monthly}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_yearly">Preço Anual (AOA)</Label>
                    <Input
                      id="price_yearly"
                      name="price_yearly"
                      type="number"
                      value={formData.price_yearly}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_popular">Popular</Label>
                    <Switch
                      id="is_popular"
                      checked={formData.is_popular}
                      onCheckedChange={(checked) => handleSwitchChange("is_popular", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Ativo</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="features" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="feature_key">Recurso</Label>
                      <Input
                        id="feature_key"
                        value={featureKey}
                        onChange={(e) => setFeatureKey(e.target.value)}
                        placeholder="Ex: storage, bandwidth, cpu"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="feature_value">Valor</Label>
                      <Input
                        id="feature_value"
                        value={featureValue}
                        onChange={(e) => setFeatureValue(e.target.value)}
                        placeholder="Ex: 10GB, Ilimitado, 4 vCPUs"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={addFeature}>Adicionar</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2">Recursos Adicionados</h3>
                    {Object.keys(formData.features).length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum recurso adicionado</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(formData.features).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <div>
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(key)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o plano {currentPlan?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminServicePlans;
