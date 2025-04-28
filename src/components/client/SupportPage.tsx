
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TicketIcon, MessageSquare, Plus } from "lucide-react";
import { Ticket, TicketMessage } from "@/types/client";

const SupportPage = () => {
  const { user } = useSupabaseAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    subject: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    department: "",
    content: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('client_tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Convert DB status format to our interface format
        const formattedTickets: Ticket[] = (data || []).map(ticket => ({
          ...ticket,
          // Map from DB enum "in_progress" to our interface's "in-progress"
          status: ticket.status === 'in_progress' ? 'in-progress' : 
                 (ticket.status === 'open' ? 'open' : 'closed')
        } as Ticket));
        
        setTickets(formattedTickets);
      } catch (error: any) {
        console.error('Error fetching tickets:', error);
        toast.error('Erro ao carregar tickets de suporte');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [user]);

  const fetchTicketMessages = async (ticketId: string) => {
    if (!user) return;

    try {
      setLoadingMessages(true);
      
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Transform data to match our interface
      const formattedMessages: TicketMessage[] = (data || []).map(msg => ({
        ...msg,
        attachments: msg.attachments ? 
          (typeof msg.attachments === 'string' ? 
            JSON.parse(msg.attachments as string) : 
            msg.attachments as any[]) 
          : []
      }));
      
      setTicketMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error fetching ticket messages:', error);
      toast.error('Erro ao carregar mensagens do ticket');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleViewTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setViewDialogOpen(true);
    await fetchTicketMessages(ticket.id);
  };

  const handleSubmitNewTicket = async () => {
    if (!user) return;
    
    try {
      const ticketNumber = `TK-${Date.now().toString().slice(-6)}`;
      
      // Convert our interface's priority to DB enum format
      const priority = newTicket.priority;
      
      // Convert our interface's status format to DB enum format
      const status = 'open';
      
      const { data, error } = await supabase
        .from('client_tickets')
        .insert({
          user_id: user.id,
          ticket_number: ticketNumber,
          subject: newTicket.subject,
          content: newTicket.content,
          priority: priority,
          department: newTicket.department || null,
          status: status,
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        // Convert the returned DB format to our interface format
        const newTicketData: Ticket = {
          ...data[0],
          status: data[0].status === 'in_progress' ? 'in-progress' : 
                 (data[0].status === 'open' ? 'open' : 'closed')
        } as Ticket;
        
        setTickets([newTicketData, ...tickets]);
      }
      
      setNewTicket({
        subject: "",
        priority: "medium",
        department: "",
        content: "",
      });
      setCreateDialogOpen(false);
      
      toast.success('Ticket de suporte criado com sucesso');
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast.error('Erro ao criar ticket de suporte');
    }
  };

  const handleSendReply = async () => {
    if (!user || !selectedTicket || !newMessage.trim()) return;
    
    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user.id,
          content: newMessage,
          is_staff: false,
        });
        
      if (error) throw error;
      
      if (selectedTicket.status === 'closed') {
        // Convert our interface's status format to DB enum format
        const dbStatus = 'open';
        
        await supabase
          .from('client_tickets')
          .update({ status: dbStatus, updated_at: new Date().toISOString() })
          .eq('id', selectedTicket.id);
          
        setSelectedTicket({
          ...selectedTicket,
          status: 'open',
          updated_at: new Date().toISOString(),
        });
        
        setTickets(tickets.map(t => 
          t.id === selectedTicket.id 
            ? { ...t, status: 'open', updated_at: new Date().toISOString() } 
            : t
        ));
      }
      
      await fetchTicketMessages(selectedTicket.id);
      
      setNewMessage("");
      
      toast.success('Resposta enviada com sucesso');
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast.error('Erro ao enviar resposta');
    }
  };

  const getStatusBadge = (status: 'open' | 'closed' | 'in-progress') => {
    const statusColors = {
      'open': 'bg-green-500',
      'in-progress': 'bg-blue-500',
      'closed': 'bg-gray-500',
    };

    return (
      <Badge className={statusColors[status]}>
        {status === 'open' ? 'Aberto' : 
         status === 'in-progress' ? 'Em Progresso' : 'Fechado'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    const priorityColors = {
      'low': 'bg-gray-500',
      'medium': 'bg-blue-500',
      'high': 'bg-yellow-500',
      'urgent': 'bg-red-500',
    };

    const priorityLabels = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta',
      'urgent': 'Urgente',
    };

    return (
      <Badge className={priorityColors[priority]}>
        {priorityLabels[priority]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suporte Técnico</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Novo Ticket</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Ticket de Suporte</DialogTitle>
              <DialogDescription>
                Preencha os detalhes para obter ajuda da nossa equipe de suporte.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input 
                  id="subject" 
                  placeholder="Digite o assunto do seu ticket" 
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select 
                    value={newTicket.priority} 
                    onValueChange={(value: "low" | "medium" | "high" | "urgent") => setNewTicket({...newTicket, priority: value})}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento (Opcional)</Label>
                  <Input 
                    id="department" 
                    placeholder="Ex: Técnico, Financeiro" 
                    value={newTicket.department}
                    onChange={(e) => setNewTicket({...newTicket, department: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Detalhes do Problema</Label>
                <Textarea 
                  id="message" 
                  placeholder="Descreva detalhadamente o problema ou dúvida..."
                  value={newTicket.content}
                  onChange={(e) => setNewTicket({...newTicket, content: e.target.value})}
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmitNewTicket}>Enviar Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Carregando tickets de suporte...</div>
      ) : tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <TicketIcon className="text-primary mt-1" size={20} />
                    <div>
                      <CardTitle>{ticket.subject}</CardTitle>
                      <CardDescription>
                        Ticket #{ticket.ticket_number} • Criado em {' '}
                        {format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{ticket.content}</p>
                
                {ticket.department && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">
                      Departamento: {ticket.department}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewTicket(ticket)}
                  className="flex items-center gap-1"
                >
                  <MessageSquare size={16} />
                  <span>Ver Conversação</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Nenhum ticket de suporte encontrado</CardTitle>
            <CardDescription>
              Crie um novo ticket caso precise de ajuda com seus serviços.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => setCreateDialogOpen(true)}>
              Criar Ticket de Suporte
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTicket?.subject}</span>
              <div className="flex items-center gap-2">
                {selectedTicket && (
                  <>
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </>
                )}
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedTicket && (
                <>
                  Ticket #{selectedTicket.ticket_number} • Criado em {' '}
                  {format(new Date(selectedTicket.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {loadingMessages ? (
              <div className="text-center py-4">Carregando mensagens...</div>
            ) : (
              <>
                {selectedTicket && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Você</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(selectedTicket.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="mt-1 p-3 bg-muted rounded-lg">
                          <p className="whitespace-pre-wrap">{selectedTicket.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {ticketMessages.map((message) => (
                  <div key={message.id} className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-full ${
                        message.is_staff ? 'bg-blue-500' : 'bg-primary'
                      } text-white flex items-center justify-center text-sm`}>
                        {message.is_staff ? 'S' : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {message.is_staff ? 'Suporte' : 'Você'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        <div className={`mt-1 p-3 ${
                          message.is_staff ? 'bg-blue-50' : 'bg-muted'
                        } rounded-lg`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          
                          {message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs font-medium">Anexos:</p>
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="text-xs text-blue-500 underline">
                                  {attachment.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedTicket?.status === 'closed' && (
                  <div className="text-center py-2">
                    <Badge variant="outline" className="border-red-200 text-red-500">
                      Este ticket foi fechado
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Você pode reabri-lo enviando uma nova mensagem
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Textarea 
                placeholder="Digite sua resposta..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Fechar</Button>
              <Button onClick={handleSendReply} disabled={!newMessage.trim()}>
                Enviar Resposta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportPage;
