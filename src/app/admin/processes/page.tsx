"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Building
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Process {
  id: string
  number: string
  client: string
  type: string
  status: "active" | "pending" | "closed"
  created_at: string
  deadline?: string
  description: string
}

export default function AdminProcessesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processes, setProcesses] = useState<Process[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProcess, setNewProcess] = useState({
    number: "",
    client: "",
    type: "",
    description: "",
    deadline: ""
  })

  useEffect(() => {
    checkAuth()
    loadProcesses()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/auth/login')
        return
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      router.push('/auth/login')
    }
  }

  const loadProcesses = async () => {
    // Mock data - em produção, buscar do Supabase
    const mockProcesses: Process[] = [
      {
        id: "1",
        number: "1000001-00.2024.8.00.0000",
        client: "João Silva",
        type: "Trabalhista",
        status: "active",
        created_at: "2024-01-15",
        deadline: "2024-12-20",
        description: "Ação trabalhista referente a horas extras não pagas"
      },
      {
        id: "2",
        number: "1000002-00.2024.8.00.0000",
        client: "Maria Santos",
        type: "Cível",
        status: "active",
        created_at: "2024-02-20",
        deadline: "2024-12-15",
        description: "Ação de cobrança de dívida"
      },
      {
        id: "3",
        number: "1000003-00.2024.8.00.0000",
        client: "Pedro Costa",
        type: "Criminal",
        status: "pending",
        created_at: "2024-03-10",
        deadline: "2024-12-25",
        description: "Defesa em processo criminal"
      },
      {
        id: "4",
        number: "1000004-00.2024.8.00.0000",
        client: "Ana Oliveira",
        type: "Família",
        status: "closed",
        created_at: "2024-04-05",
        description: "Processo de divórcio consensual - Finalizado"
      }
    ]
    
    setProcesses(mockProcesses)
  }

  const filteredProcesses = processes.filter(process =>
    process.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateProcess = async () => {
    // Implementar criação de processo via Supabase
    console.log("Criar processo:", newProcess)
    setShowCreateModal(false)
    setNewProcess({ number: "", client: "", type: "", description: "", deadline: "" })
  }

  const handleDeleteProcess = async (processId: string) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      // Implementar exclusão via Supabase
      console.log("Excluir processo:", processId)
      setProcesses(processes.filter(p => p.id !== processId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "closed":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Em Andamento"
      case "pending":
        return "Pendente"
      case "closed":
        return "Encerrado"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#42526E] font-medium">Carregando processos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar activeModule="admin" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin')}
              className="mb-4 text-[#42526E] hover:text-[#0052CC]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-[#0052CC]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC]">
                Gerenciar Processos
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#42526E]">
              Visualizar, criar e editar processos jurídicos
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E]">Em Andamento</p>
                    <p className="text-2xl font-bold text-green-600">
                      {processes.filter(p => p.status === "active").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E]">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {processes.filter(p => p.status === "pending").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E]">Encerrados</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {processes.filter(p => p.status === "closed").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#42526E]" />
              <Input
                placeholder="Buscar processos por número, cliente ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0052CC] hover:bg-[#0747A6] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Processo
            </Button>
          </div>

          {/* Processes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProcesses.map((process) => (
              <Card key={process.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium text-[#0052CC] mb-1">
                        {process.number}
                      </CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                        {getStatusLabel(process.status)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#42526E]">
                      <User className="w-4 h-4" />
                      <span>{process.client}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[#42526E]">
                      <Building className="w-4 h-4" />
                      <span>{process.type}</span>
                    </div>
                    
                    {process.deadline && (
                      <div className="flex items-center gap-2 text-sm text-[#42526E]">
                        <Calendar className="w-4 h-4" />
                        <span>Prazo: {new Date(process.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-[#42526E] line-clamp-2">
                      {process.description}
                    </p>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProcess(process.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Process Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <Card className="w-full max-w-2xl my-8">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0052CC]">Criar Novo Processo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="number">Número do Processo</Label>
                        <Input
                          id="number"
                          value={newProcess.number}
                          onChange={(e) => setNewProcess({ ...newProcess, number: e.target.value })}
                          placeholder="0000000-00.0000.0.00.0000"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="client">Cliente</Label>
                        <Input
                          id="client"
                          value={newProcess.client}
                          onChange={(e) => setNewProcess({ ...newProcess, client: e.target.value })}
                          placeholder="Nome do cliente"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Tipo de Processo</Label>
                        <select
                          id="type"
                          value={newProcess.type}
                          onChange={(e) => setNewProcess({ ...newProcess, type: e.target.value })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Selecione...</option>
                          <option value="Trabalhista">Trabalhista</option>
                          <option value="Cível">Cível</option>
                          <option value="Criminal">Criminal</option>
                          <option value="Família">Família</option>
                          <option value="Tributário">Tributário</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="deadline">Prazo</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newProcess.deadline}
                          onChange={(e) => setNewProcess({ ...newProcess, deadline: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newProcess.description}
                        onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
                        placeholder="Descreva o processo..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleCreateProcess}
                        className="flex-1 bg-[#0052CC] hover:bg-[#0747A6] text-white"
                      >
                        Criar Processo
                      </Button>
                      <Button
                        onClick={() => setShowCreateModal(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
