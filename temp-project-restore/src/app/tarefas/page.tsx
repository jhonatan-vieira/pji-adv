"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Link as LinkIcon
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { supabase, type Task } from "@/lib/supabase"

export default function TarefasPage() {
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: "A fazer" as Task["status"],
    prioridade: "Média" as Task["prioridade"],
    data_vencimento: "",
    numero_processo: ""
  })

  useEffect(() => {
    setMounted(true)
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('data_vencimento', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
      toast.error('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      status: "A fazer",
      prioridade: "Média",
      data_vencimento: "",
      numero_processo: ""
    })
    setEditingTask(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update(formData)
          .eq('id', editingTask.id)

        if (error) throw error
        toast.success("Tarefa atualizada com sucesso!")
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([formData])

        if (error) throw error
        toast.success("Tarefa criada com sucesso!")
      }
      
      setIsDialogOpen(false)
      resetForm()
      loadTasks()
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error)
      toast.error('Erro ao salvar tarefa')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      titulo: task.titulo,
      descricao: task.descricao || "",
      status: task.status,
      prioridade: task.prioridade,
      data_vencimento: task.data_vencimento,
      numero_processo: task.numero_processo || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success("Tarefa excluída com sucesso!")
      loadTasks()
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
      toast.error('Erro ao excluir tarefa')
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error
      toast.success("Status atualizado!")
      loadTasks()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.numero_processo && task.numero_processo.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getPriorityColor = (prioridade: Task["prioridade"]) => {
    switch (prioridade) {
      case "Urgente":
        return "bg-red-100 text-red-700 border-red-200"
      case "Alta":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "Média":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Baixa":
        return "bg-green-100 text-green-700 border-green-200"
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "A fazer":
        return <Clock className="w-4 h-4" />
      case "Em progresso":
        return <AlertCircle className="w-4 h-4" />
      case "Concluída":
        return <CheckCircle2 className="w-4 h-4" />
    }
  }

  const tasksByStatus = {
    "A fazer": filteredTasks.filter(t => t.status === "A fazer"),
    "Em progresso": filteredTasks.filter(t => t.status === "Em progresso"),
    "Concluída": filteredTasks.filter(t => t.status === "Concluída")
  }

  const isOverdue = (dataVencimento: string) => {
    if (!mounted) return false
    return new Date(dataVencimento) < new Date() && new Date(dataVencimento).toDateString() !== new Date().toDateString()
  }

  const formatDate = (dateString: string) => {
    if (!mounted) return dateString
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex">
        <Sidebar activeModule="tarefas" />
        
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0052CC] mb-2">
                  Gestão de Tarefas & Prazos
                </h2>
                <p className="text-[#42526E]">
                  Organize suas tarefas e acompanhe prazos processuais
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0052CC] hover:bg-[#0052CC]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-[#0052CC]">
                      {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título *</Label>
                      <Input
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        placeholder="Ex: Elaborar contestação"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        placeholder="Descreva os detalhes da tarefa..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => setFormData({...formData, status: value as Task["status"]})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A fazer">A fazer</SelectItem>
                            <SelectItem value="Em progresso">Em progresso</SelectItem>
                            <SelectItem value="Concluída">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="prioridade">Prioridade</Label>
                        <Select 
                          value={formData.prioridade} 
                          onValueChange={(value) => setFormData({...formData, prioridade: value as Task["prioridade"]})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Urgente">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
                      <Input
                        id="data_vencimento"
                        type="date"
                        value={formData.data_vencimento}
                        onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="numero_processo">Vincular a Processo (opcional)</Label>
                      <Input
                        id="numero_processo"
                        value={formData.numero_processo}
                        onChange={(e) => setFormData({...formData, numero_processo: e.target.value})}
                        placeholder="Ex: 1000001-00.2024.8.00.0000"
                      />
                      <p className="text-xs text-[#42526E] mt-1">
                        Digite o número do processo para vincular esta tarefa
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-[#0052CC] hover:bg-[#0052CC]/90">
                        {editingTask ? "Atualizar" : "Criar"} Tarefa
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and View Toggle */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#42526E] w-4 h-4" />
                <Input 
                  placeholder="Buscar tarefas..." 
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 bg-white rounded-lg p-1 border">
                <Button
                  variant={viewMode === "kanban" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("kanban")}
                  className={viewMode === "kanban" ? "bg-[#0052CC]" : ""}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Kanban
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-[#0052CC]" : ""}
                >
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Total</p>
                    <p className="text-2xl font-bold text-[#0052CC]">{tasks.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-[#0052CC]/20" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">A Fazer</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tasks.filter(t => t.status === "A fazer").length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Em Progresso</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {tasks.filter(t => t.status === "Em progresso").length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-600/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Concluídas</p>
                    <p className="text-2xl font-bold text-[#36B37E]">
                      {tasks.filter(t => t.status === "Concluída").length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-[#36B37E]/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#42526E]">
              Carregando...
            </div>
          ) : (
            <>
              {/* Kanban View */}
              {viewMode === "kanban" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                    <Card key={status} className="bg-[#F4F5F7]">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#0052CC]">
                          {getStatusIcon(status as Task["status"])}
                          {status}
                          <span className="ml-auto text-sm font-normal text-[#42526E]">
                            {statusTasks.length}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {statusTasks.length === 0 ? (
                          <p className="text-center text-[#42526E] text-sm py-8">
                            Nenhuma tarefa
                          </p>
                        ) : (
                          statusTasks.map((task) => (
                            <Card key={task.id} className="bg-white hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="font-medium text-[#172B4D] flex-1">
                                    {task.titulo}
                                  </h3>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEdit(task)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                      </DropdownMenuItem>
                                      {task.status !== "A fazer" && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, "A fazer")}>
                                          Mover para A fazer
                                        </DropdownMenuItem>
                                      )}
                                      {task.status !== "Em progresso" && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Em progresso")}>
                                          Mover para Em progresso
                                        </DropdownMenuItem>
                                      )}
                                      {task.status !== "Concluída" && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Concluída")}>
                                          Mover para Concluída
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => handleDelete(task.id)}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                
                                {task.descricao && (
                                  <p className="text-sm text-[#42526E] mb-3 line-clamp-2">
                                    {task.descricao}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-2 mb-3">
                                  <span className={cn(
                                    "text-xs px-2 py-1 rounded-full border",
                                    getPriorityColor(task.prioridade)
                                  )}>
                                    {task.prioridade}
                                  </span>
                                  
                                  <span className={cn(
                                    "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                                    isOverdue(task.data_vencimento) 
                                      ? "bg-red-100 text-red-700" 
                                      : "bg-gray-100 text-gray-700"
                                  )}>
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(task.data_vencimento)}
                                  </span>
                                </div>

                                {task.numero_processo && (
                                  <div className="flex items-center gap-1 text-xs text-[#0052CC] bg-[#0052CC]/10 px-2 py-1 rounded">
                                    <LinkIcon className="w-3 h-3" />
                                    {task.numero_processo}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0052CC]">
                      Todas as Tarefas ({filteredTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 text-[#42526E]/30 mx-auto mb-4" />
                          <p className="text-[#42526E] font-medium">
                            Nenhuma tarefa encontrada
                          </p>
                        </div>
                      ) : (
                        filteredTasks.map((task) => (
                          <div 
                            key={task.id}
                            className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                task.status === "Concluída" ? "bg-[#36B37E]/10" : "bg-[#0052CC]/10"
                              )}>
                                {getStatusIcon(task.status)}
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="font-medium text-[#172B4D] mb-1">
                                  {task.titulo}
                                </h3>
                                {task.descricao && (
                                  <p className="text-sm text-[#42526E] line-clamp-1">
                                    {task.descricao}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "text-xs px-3 py-1 rounded-full border whitespace-nowrap",
                                getPriorityColor(task.prioridade)
                              )}>
                                {task.prioridade}
                              </span>

                              <span className={cn(
                                "text-xs px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap",
                                isOverdue(task.data_vencimento) 
                                  ? "bg-red-100 text-red-700" 
                                  : "bg-gray-100 text-gray-700"
                              )}>
                                <Calendar className="w-3 h-3" />
                                {formatDate(task.data_vencimento)}
                              </span>

                              {task.numero_processo && (
                                <div className="flex items-center gap-1 text-xs text-[#0052CC] bg-[#0052CC]/10 px-3 py-1 rounded whitespace-nowrap">
                                  <LinkIcon className="w-3 h-3" />
                                  {task.numero_processo}
                                </div>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(task)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  {task.status !== "A fazer" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, "A fazer")}>
                                      Mover para A fazer
                                    </DropdownMenuItem>
                                  )}
                                  {task.status !== "Em progresso" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Em progresso")}>
                                      Mover para Em progresso
                                    </DropdownMenuItem>
                                  )}
                                  {task.status !== "Concluída" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Concluída")}>
                                      Mover para Concluída
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDelete(task.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
