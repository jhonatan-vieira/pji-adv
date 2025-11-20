"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Send, HelpCircle, Book, Video } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface SupportTicket {
  id: string
  subject: string
  description: string
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado'
  priority: 'baixa' | 'media' | 'alta' | 'urgente'
  created_at: string
}

interface SupportMessage {
  id: string
  message: string
  is_staff: boolean
  created_at: string
}

export default function SuportePage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showNewTicket, setShowNewTicket] = useState(false)
  
  // Formulário novo ticket
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta' | 'urgente'>('media')

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(selectedTicket.id)
    }
  }, [selectedTicket])

  const loadTickets = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTickets(data)
    }
  }

  const loadMessages = async (ticketId: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data)
    }
  }

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject,
        description,
        priority,
        status: 'aberto'
      })
      .select()
      .single()

    if (!error && data) {
      setTickets([data, ...tickets])
      setSubject("")
      setDescription("")
      setPriority('media')
      setShowNewTicket(false)
    }

    setLoading(false)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !newMessage.trim()) return

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: selectedTicket.id,
        user_id: user.id,
        message: newMessage,
        is_staff: false
      })
      .select()
      .single()

    if (!error && data) {
      setMessages([...messages, data])
      setNewMessage("")
    }

    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any, label: string, icon: any }> = {
      aberto: { variant: "default", label: "Aberto", icon: AlertCircle },
      em_andamento: { variant: "secondary", label: "Em Andamento", icon: Clock },
      resolvido: { variant: "default", label: "Resolvido", icon: CheckCircle },
      fechado: { variant: "outline", label: "Fechado", icon: CheckCircle }
    }
    const config = variants[status] || variants.aberto
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      baixa: "bg-gray-500",
      media: "bg-blue-500",
      alta: "bg-orange-500",
      urgente: "bg-red-500"
    }
    return (
      <Badge className={`${colors[priority]} text-white`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const faqItems = [
    {
      question: "Como cadastrar um novo cliente?",
      answer: "Acesse o menu 'Clientes' e clique no botão 'Novo Cliente'. Preencha os dados necessários e salve."
    },
    {
      question: "Como criar um novo processo?",
      answer: "No menu 'Processos', clique em 'Novo Processo' e preencha as informações do processo judicial."
    },
    {
      question: "Como fazer cálculos jurídicos?",
      answer: "Acesse 'Cálculos' no menu lateral e escolha o tipo de cálculo desejado (trabalhista, previdenciário, etc.)."
    },
    {
      question: "Como configurar meu escritório?",
      answer: "Vá em 'Configurações' > 'Dados do Escritório' para cadastrar informações como nome, OAB e logo."
    }
  ]

  return (
    <DashboardLayout activeModule="suporte">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Central de Suporte</h1>
            <p className="text-gray-400 mt-1">Tire suas dúvidas e entre em contato com nossa equipe</p>
          </div>
          <Button 
            onClick={() => setShowNewTicket(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Ticket
          </Button>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-500">
              <MessageSquare className="w-4 h-4 mr-2" />
              Meus Tickets
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-blue-500">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="recursos" className="data-[state=active]:bg-blue-500">
              <Book className="w-4 h-4 mr-2" />
              Recursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            {showNewTicket && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Novo Ticket de Suporte</CardTitle>
                  <CardDescription>Descreva sua dúvida ou problema</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-300">Assunto</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Descreva brevemente o problema"
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva detalhadamente sua dúvida ou problema"
                        className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-gray-300">Prioridade</Label>
                      <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Criando..." : "Criar Ticket"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowNewTicket(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-lg font-semibold text-white">Tickets</h3>
                {tickets.length === 0 ? (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                      <p className="text-gray-400">Nenhum ticket criado</p>
                    </CardContent>
                  </Card>
                ) : (
                  tickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className={`bg-gray-900 border-gray-800 cursor-pointer transition-all hover:border-blue-500 ${
                        selectedTicket?.id === ticket.id ? 'border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-white text-sm line-clamp-1">
                              {ticket.subject}
                            </h4>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center justify-between">
                            {getStatusBadge(ticket.status)}
                            <span className="text-xs text-gray-500">
                              {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-white">{selectedTicket.subject}</CardTitle>
                          <CardDescription>{selectedTicket.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getPriorityBadge(selectedTicket.priority)}
                          {getStatusBadge(selectedTicket.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-lg ${
                              msg.is_staff
                                ? 'bg-blue-500/10 border border-blue-500/20'
                                : 'bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-400">
                                {msg.is_staff ? 'Equipe de Suporte' : 'Você'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(msg.created_at).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{msg.message}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          className="bg-gray-800 border-gray-700 text-white"
                          disabled={selectedTicket.status === 'fechado'}
                        />
                        <Button 
                          type="submit" 
                          disabled={loading || selectedTicket.status === 'fechado'}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">Selecione um ticket para ver as mensagens</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Perguntas Frequentes</CardTitle>
                <CardDescription>Respostas rápidas para dúvidas comuns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">{item.question}</h4>
                    <p className="text-sm text-gray-400">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recursos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <Book className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-white">Documentação</CardTitle>
                  <CardDescription>Guias completos sobre todas as funcionalidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Acessar Documentação
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <Video className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-white">Tutoriais em Vídeo</CardTitle>
                  <CardDescription>Aprenda assistindo passo a passo</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Ver Tutoriais
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
