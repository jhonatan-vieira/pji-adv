"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MessageSquare, Mail, Phone, FileText, Send, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Header = dynamic(() => import("@/components/dashboard/header").then(mod => ({ default: mod.Header })))
const Sidebar = dynamic(() => import("@/components/dashboard/sidebar").then(mod => ({ default: mod.Sidebar })))

export default function SuportePage() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false)

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    setTicketSubmitted(true)
    setTimeout(() => setTicketSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar activeModule="suporte" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0052CC] mb-2">
              Central de Suporte
            </h1>
            <p className="text-sm sm:text-base text-[#42526E]">
              Estamos aqui para ajudar você
            </p>
          </div>

          {/* Mensagem de Sucesso */}
          {ticketSubmitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Ticket enviado com sucesso!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Nossa equipe entrará em contato em breve.
                </p>
              </div>
            </div>
          )}

          {/* Cards de Contato Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#0052CC]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0052CC]">E-mail</h3>
                    <p className="text-sm text-[#42526E] mt-1">suporte@pjiadv.com.br</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Enviar E-mail
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0052CC]">Telefone</h3>
                    <p className="text-sm text-[#42526E] mt-1">(11) 9999-9999</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Ligar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0052CC]">Chat ao Vivo</h3>
                    <p className="text-sm text-[#42526E] mt-1">Disponível 24/7</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Iniciar Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de Suporte */}
          <Tabs defaultValue="ticket" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2 bg-white p-1 rounded-lg">
              <TabsTrigger value="ticket" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Abrir Ticket</span>
              </TabsTrigger>
              <TabsTrigger value="meus-tickets" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Meus Tickets</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
            </TabsList>

            {/* Abrir Ticket */}
            <TabsContent value="ticket">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Abrir Novo Ticket</CardTitle>
                  <CardDescription>Descreva seu problema ou dúvida detalhadamente</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" placeholder="Seu nome" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assunto">Assunto</Label>
                      <Input id="assunto" placeholder="Resumo do problema" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <select 
                        id="categoria"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="tecnico">Problema Técnico</option>
                        <option value="duvida">Dúvida</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prioridade">Prioridade</Label>
                      <select 
                        id="prioridade"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                        required
                      >
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição Detalhada</Label>
                      <textarea 
                        id="descricao"
                        className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                        placeholder="Descreva seu problema ou dúvida com o máximo de detalhes possível..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="anexo">Anexar Arquivo (opcional)</Label>
                      <Input id="anexo" type="file" />
                      <p className="text-xs text-[#42526E]">Formatos aceitos: PDF, PNG, JPG (máx. 5MB)</p>
                    </div>
                    <Button type="submit" className="w-full bg-[#0052CC] hover:bg-[#0747A6]">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meus Tickets */}
            <TabsContent value="meus-tickets">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Meus Tickets</CardTitle>
                  <CardDescription>Acompanhe o status dos seus tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Ticket 1 */}
                    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#0052CC]">Problema de Login</h4>
                            <p className="text-xs text-[#42526E]">Ticket #12345</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium self-start sm:self-center">
                          Resolvido
                        </span>
                      </div>
                      <p className="text-sm text-[#42526E] mb-2">
                        Não conseguia acessar minha conta após atualização...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#42526E]">
                        <span>Aberto em: 15/01/2024</span>
                        <span>Resolvido em: 16/01/2024</span>
                      </div>
                    </div>

                    {/* Ticket 2 */}
                    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#0052CC]">Dúvida sobre Relatórios</h4>
                            <p className="text-xs text-[#42526E]">Ticket #12346</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium self-start sm:self-center">
                          Em Andamento
                        </span>
                      </div>
                      <p className="text-sm text-[#42526E] mb-2">
                        Como exportar relatórios personalizados em PDF?
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#42526E]">
                        <span>Aberto em: 18/01/2024</span>
                        <span>Última atualização: Hoje</span>
                      </div>
                    </div>

                    {/* Ticket 3 */}
                    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#0052CC]">Sugestão de Melhoria</h4>
                            <p className="text-xs text-[#42526E]">Ticket #12347</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium self-start sm:self-center">
                          Aguardando
                        </span>
                      </div>
                      <p className="text-sm text-[#42526E] mb-2">
                        Adicionar filtro de data nos processos...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#42526E]">
                        <span>Aberto em: 10/01/2024</span>
                        <span>Última atualização: 12/01/2024</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Perguntas Frequentes</CardTitle>
                  <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F4F5F7] rounded-lg">
                      <h4 className="font-semibold text-[#0052CC] mb-2">Como redefinir minha senha?</h4>
                      <p className="text-sm text-[#42526E]">
                        Acesse a página de login e clique em "Esqueci minha senha". Você receberá um e-mail com instruções para criar uma nova senha.
                      </p>
                    </div>
                    <div className="p-4 bg-[#F4F5F7] rounded-lg">
                      <h4 className="font-semibold text-[#0052CC] mb-2">Como adicionar um novo processo?</h4>
                      <p className="text-sm text-[#42526E]">
                        Vá até a seção "Processos" no menu lateral e clique no botão "Novo Processo". Preencha as informações necessárias e salve.
                      </p>
                    </div>
                    <div className="p-4 bg-[#F4F5F7] rounded-lg">
                      <h4 className="font-semibold text-[#0052CC] mb-2">Como exportar relatórios?</h4>
                      <p className="text-sm text-[#42526E]">
                        Na seção "Relatórios", selecione o tipo de relatório desejado, configure os filtros e clique em "Exportar". Você pode escolher entre PDF, Excel ou CSV.
                      </p>
                    </div>
                    <div className="p-4 bg-[#F4F5F7] rounded-lg">
                      <h4 className="font-semibold text-[#0052CC] mb-2">O sistema funciona offline?</h4>
                      <p className="text-sm text-[#42526E]">
                        Algumas funcionalidades básicas funcionam offline, mas para sincronização completa é necessária conexão com a internet.
                      </p>
                    </div>
                    <div className="p-4 bg-[#F4F5F7] rounded-lg">
                      <h4 className="font-semibold text-[#0052CC] mb-2">Como configurar notificações?</h4>
                      <p className="text-sm text-[#42526E]">
                        Acesse "Configurações" no menu e vá até a aba "Notificações". Lá você pode personalizar quais alertas deseja receber e por qual canal.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
