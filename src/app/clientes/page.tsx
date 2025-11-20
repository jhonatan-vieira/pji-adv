"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClientForm } from "@/components/clientes/client-form"
import { ClientDetails } from "@/components/clientes/client-details"
import { toast } from "sonner"

// Tipos
export interface Client {
  id: string
  nome: string
  tipo: "Pessoa Física" | "Pessoa Jurídica"
  cpfCnpj: string
  email: string
  telefone: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  dataCadastro: string
  status: "Ativo" | "Inativo"
  observacoes?: string
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      nome: "João Silva",
      tipo: "Pessoa Física",
      cpfCnpj: "123.456.789-00",
      email: "joao.silva@email.com",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      dataCadastro: "15/01/2024",
      status: "Ativo",
      observacoes: "Cliente desde 2024"
    },
    {
      id: "2",
      nome: "Maria Santos",
      tipo: "Pessoa Física",
      cpfCnpj: "987.654.321-00",
      email: "maria.santos@email.com",
      telefone: "(11) 91234-5678",
      endereco: "Av. Paulista, 1000",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
      dataCadastro: "20/01/2024",
      status: "Ativo"
    },
    {
      id: "3",
      nome: "Empresa XYZ Ltda",
      tipo: "Pessoa Jurídica",
      cpfCnpj: "12.345.678/0001-90",
      email: "contato@empresaxyz.com.br",
      telefone: "(11) 3456-7890",
      endereco: "Rua Comercial, 500",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890",
      dataCadastro: "10/02/2024",
      status: "Ativo",
      observacoes: "Empresa de tecnologia"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const handleAddClient = (clientData: Omit<Client, "id" | "dataCadastro">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    }
    setClients([newClient, ...clients])
    setIsDialogOpen(false)
    toast.success("Cliente cadastrado com sucesso!")
  }

  const handleEditClient = (clientData: Omit<Client, "id" | "dataCadastro">) => {
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...clientData, id: editingClient.id, dataCadastro: editingClient.dataCadastro }
          : c
      ))
      setEditingClient(null)
      setIsDialogOpen(false)
      toast.success("Cliente atualizado com sucesso!")
    }
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id))
    toast.success("Cliente excluído com sucesso!")
  }

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client)
    setIsDetailsOpen(true)
  }

  const filteredClients = clients.filter(client =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpfCnpj.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: Client["status"]) => {
    return status === "Ativo" 
      ? "bg-[#36B37E]/10 text-[#36B37E]" 
      : "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex">
        <Sidebar activeModule="clientes" />
        
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0052CC] mb-2">
                  Gestão de Clientes
                </h2>
                <p className="text-[#42526E]">
                  Gerencie seus clientes e contatos
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-[#0052CC] hover:bg-[#0052CC]/90"
                    onClick={() => setEditingClient(null)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#0052CC]">
                      {editingClient ? "Editar Cliente" : "Cadastrar Novo Cliente"}
                    </DialogTitle>
                  </DialogHeader>
                  <ClientForm 
                    onSubmit={editingClient ? handleEditClient : handleAddClient}
                    initialData={editingClient || undefined}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#42526E] w-4 h-4" />
                <Input 
                  placeholder="Buscar por nome, CPF/CNPJ ou email..." 
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="border-[#0052CC] text-[#0052CC]">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Total de Clientes</p>
                    <p className="text-2xl font-bold text-[#0052CC]">{clients.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#0052CC]/20" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Clientes Ativos</p>
                    <p className="text-2xl font-bold text-[#36B37E]">
                      {clients.filter(c => c.status === "Ativo").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-[#36B37E]/20 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Pessoa Jurídica</p>
                    <p className="text-2xl font-bold text-[#0052CC]">
                      {clients.filter(c => c.tipo === "Pessoa Jurídica").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-[#0052CC]/20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clients List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0052CC]">
                Lista de Clientes ({filteredClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-[#42526E]/30 mx-auto mb-4" />
                    <p className="text-[#42526E] font-medium">
                      Nenhum cliente encontrado
                    </p>
                    <p className="text-sm text-[#42526E] mt-2">
                      {searchTerm 
                        ? "Tente ajustar os filtros de busca" 
                        : "Clique em 'Novo Cliente' para começar"}
                    </p>
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div 
                      key={client.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-[#0052CC]/10 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-[#0052CC]" />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">Nome</p>
                            <p className="font-medium text-[#0052CC]">{client.nome}</p>
                            <p className="text-xs text-[#42526E] mt-1">{client.tipo}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">CPF/CNPJ</p>
                            <p className="font-medium">{client.cpfCnpj}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">Contato</p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <Mail className="w-3 h-3 text-[#42526E]" />
                                <span className="truncate">{client.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Phone className="w-3 h-3 text-[#42526E]" />
                                <span>{client.telefone}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                              {client.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(client)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingClient(client)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Client Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0052CC]">Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && <ClientDetails client={selectedClient} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
