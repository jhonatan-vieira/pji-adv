"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "../../../components/dashboard/header"
import { Sidebar } from "../../../components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { 
  Activity, 
  ArrowLeft,
  Search,
  Filter,
  Download,
  User,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"
import { supabase } from "../../../lib/supabase"

interface Log {
  id: string
  type: "login" | "logout" | "create" | "edit" | "delete" | "error" | "info"
  user: string
  action: string
  details: string
  timestamp: string
  ip?: string
}

export default function AdminLogsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<Log[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    checkAuth()
    loadLogs()
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

  const loadLogs = async () => {
    // Mock data - em produção, buscar do Supabase
    const mockLogs: Log[] = [
      {
        id: "1",
        type: "login",
        user: "admin@pjiadv.com",
        action: "Login realizado",
        details: "Login bem-sucedido no sistema",
        timestamp: "2024-12-03T10:30:00",
        ip: "192.168.1.100"
      },
      {
        id: "2",
        type: "create",
        user: "joao.silva@pjiadv.com",
        action: "Processo criado",
        details: "Criou processo 1000005-00.2024.8.00.0000",
        timestamp: "2024-12-03T10:15:00",
        ip: "192.168.1.101"
      },
      {
        id: "3",
        type: "edit",
        user: "maria.santos@pjiadv.com",
        action: "Usuário editado",
        details: "Editou perfil de Pedro Costa",
        timestamp: "2024-12-03T09:45:00",
        ip: "192.168.1.102"
      },
      {
        id: "4",
        type: "delete",
        user: "admin@pjiadv.com",
        action: "Processo excluído",
        details: "Excluiu processo 1000004-00.2024.8.00.0000",
        timestamp: "2024-12-03T09:30:00",
        ip: "192.168.1.100"
      },
      {
        id: "5",
        type: "error",
        user: "pedro.costa@pjiadv.com",
        action: "Erro de autenticação",
        details: "Tentativa de login com senha incorreta",
        timestamp: "2024-12-03T09:00:00",
        ip: "192.168.1.103"
      },
      {
        id: "6",
        type: "logout",
        user: "joao.silva@pjiadv.com",
        action: "Logout realizado",
        details: "Usuário saiu do sistema",
        timestamp: "2024-12-03T08:45:00",
        ip: "192.168.1.101"
      },
      {
        id: "7",
        type: "info",
        user: "Sistema",
        action: "Backup automático",
        details: "Backup diário realizado com sucesso",
        timestamp: "2024-12-03T03:00:00",
        ip: "Sistema"
      }
    ]
    
    setLogs(mockLogs)
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === "all" || log.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const getLogIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="w-5 h-5 text-green-600" />
      case "logout":
        return <LogOut className="w-5 h-5 text-gray-600" />
      case "create":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "edit":
        return <Edit className="w-5 h-5 text-yellow-600" />
      case "delete":
        return <Trash2 className="w-5 h-5 text-red-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-green-50 border-green-200"
      case "logout":
        return "bg-gray-50 border-gray-200"
      case "create":
        return "bg-blue-50 border-blue-200"
      case "edit":
        return "bg-yellow-50 border-yellow-200"
      case "delete":
        return "bg-red-50 border-red-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const handleExport = () => {
    // Implementar exportação de logs
    console.log("Exportar logs")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#42526E] font-medium">Carregando logs...</p>
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
              <Activity className="w-8 h-8 text-[#0052CC]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC]">
                Logs de Atividades
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#42526E]">
              Histórico completo de ações no sistema
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0052CC]">
                    {logs.length}
                  </p>
                  <p className="text-xs text-[#42526E]">Total de Logs</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {logs.filter(l => l.type === "login").length}
                  </p>
                  <p className="text-xs text-[#42526E]">Logins</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {logs.filter(l => l.type === "create" || l.type === "edit").length}
                  </p>
                  <p className="text-xs text-[#42526E]">Modificações</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {logs.filter(l => l.type === "error").length}
                  </p>
                  <p className="text-xs text-[#42526E]">Erros</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#42526E]" />
              <Input
                placeholder="Buscar logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border rounded-md bg-white"
              >
                <option value="all">Todos</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Criação</option>
                <option value="edit">Edição</option>
                <option value="delete">Exclusão</option>
                <option value="error">Erros</option>
                <option value="info">Info</option>
              </select>
              
              <Button
                onClick={handleExport}
                variant="outline"
                className="text-[#0052CC] border-[#0052CC]"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Logs List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0052CC]">
                Atividades Recentes ({filteredLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-lg border ${getLogColor(log.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getLogIcon(log.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <p className="font-medium text-[#0052CC] text-sm">
                              {log.action}
                            </p>
                            <p className="text-xs text-[#42526E]">
                              {log.details}
                            </p>
                          </div>
                          <span className="text-xs text-[#42526E] whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-[#42526E] mt-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{log.user}</span>
                          </div>
                          {log.ip && (
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              <span>{log.ip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
