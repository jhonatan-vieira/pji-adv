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
  FileText, 
  MoreVertical,
  Edit,
  Trash2,
  Eye
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
import { ProcessForm } from "@/components/processos/process-form"
import { ImportPJeModal } from "@/components/processos/import-pje-modal"
import { toast } from "sonner"

// Tipos
interface Process {
  id: string
  numero: string
  cliente: string
  tipo: string
  status: "Em andamento" | "Aguardando" | "Concluído" | "Arquivado"
  dataAbertura: string
  valorCausa?: string
  tribunal?: string
  vara?: string
}

export default function ProcessosPage() {
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: "1",
      numero: "1000001-00.2024.8.00.0000",
      cliente: "João Silva",
      tipo: "Cível",
      status: "Em andamento",
      dataAbertura: "15/01/2024",
      valorCausa: "R$ 50.000,00",
      tribunal: "TJSP",
      vara: "1ª Vara Cível"
    },
    {
      id: "2",
      numero: "1000002-00.2024.8.00.0001",
      cliente: "Maria Santos",
      tipo: "Trabalhista",
      status: "Aguardando",
      dataAbertura: "20/01/2024",
      valorCausa: "R$ 25.000,00",
      tribunal: "TRT-2",
      vara: "3ª Vara do Trabalho"
    },
    {
      id: "3",
      numero: "1000003-00.2024.8.00.0002",
      cliente: "Pedro Oliveira",
      tipo: "Criminal",
      status: "Em andamento",
      dataAbertura: "10/02/2024",
      tribunal: "TJRJ",
      vara: "2ª Vara Criminal"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)

  const handleAddProcess = (processData: Omit<Process, "id">) => {
    const newProcess: Process = {
      ...processData,
      id: Date.now().toString()
    }
    setProcesses([newProcess, ...processes])
    setIsDialogOpen(false)
    toast.success("Processo cadastrado com sucesso!")
  }

  const handleEditProcess = (processData: Omit<Process, "id">) => {
    if (editingProcess) {
      setProcesses(processes.map(p => 
        p.id === editingProcess.id 
          ? { ...processData, id: editingProcess.id }
          : p
      ))
      setEditingProcess(null)
      setIsDialogOpen(false)
      toast.success("Processo atualizado com sucesso!")
    }
  }

  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id))
    toast.success("Processo excluído com sucesso!")
  }

  const handleImportSuccess = (processData: any) => {
    setEditingProcess(null)
    // Abre o dialog com os dados importados
    setIsDialogOpen(true)
    // Simula o preenchimento do formulário
    setTimeout(() => {
      const formEvent = new CustomEvent('fillProcessForm', { 
        detail: processData 
      })
      window.dispatchEvent(formEvent)
    }, 100)
    toast.success("Processo importado com sucesso! Revise os dados e salve.")
  }

  const filteredProcesses = processes.filter(process =>
    process.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: Process["status"]) => {
    switch (status) {
      case "Em andamento":
        return "bg-[#36B37E]/10 text-[#36B37E]"
      case "Aguardando":
        return "bg-yellow-100 text-yellow-700"
      case "Concluído":
        return "bg-blue-100 text-blue-700"
      case "Arquivado":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex">
        <Sidebar activeModule="processos" />
        
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0052CC] mb-2">
                  Gestão de Processos
                </h2>
                <p className="text-[#42526E]">
                  Gerencie todos os seus processos e casos jurídicos
                </p>
              </div>
              
              <div className="flex gap-3">
                <ImportPJeModal onImportSuccess={handleImportSuccess} />
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-[#0052CC] hover:bg-[#0052CC]/90"
                      onClick={() => setEditingProcess(null)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Processo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-[#0052CC]">
                        {editingProcess ? "Editar Processo" : "Cadastrar Novo Processo"}
                      </DialogTitle>
                    </DialogHeader>
                    <ProcessForm 
                      onSubmit={editingProcess ? handleEditProcess : handleAddProcess}
                      initialData={editingProcess || undefined}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#42526E] w-4 h-4" />
                <Input 
                  placeholder="Buscar por número, cliente ou tipo..." 
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Total</p>
                    <p className="text-2xl font-bold text-[#0052CC]">{processes.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-[#0052CC]/20" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Em Andamento</p>
                    <p className="text-2xl font-bold text-[#36B37E]">
                      {processes.filter(p => p.status === "Em andamento").length}
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
                    <p className="text-sm text-[#42526E] mb-1">Aguardando</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {processes.filter(p => p.status === "Aguardando").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Concluídos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {processes.filter(p => p.status === "Concluído").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processes Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0052CC]">
                Lista de Processos ({filteredProcesses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProcesses.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-[#42526E]/30 mx-auto mb-4" />
                    <p className="text-[#42526E] font-medium">
                      Nenhum processo encontrado
                    </p>
                    <p className="text-sm text-[#42526E] mt-2">
                      {searchTerm 
                        ? "Tente ajustar os filtros de busca" 
                        : "Clique em 'Novo Processo' para começar"}
                    </p>
                  </div>
                ) : (
                  filteredProcesses.map((process) => (
                    <div 
                      key={process.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-[#0052CC]/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-[#0052CC]" />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">Número</p>
                            <p className="font-medium text-[#0052CC]">{process.numero}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">Cliente</p>
                            <p className="font-medium">{process.cliente}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">Tipo</p>
                            <p className="font-medium">{process.tipo}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-[#42526E] mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                              {process.status}
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
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingProcess(process)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteProcess(process.id)}
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
    </div>
  )
}
