"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  email: string
  name: string
  role: string
  status: "active" | "inactive"
  created_at: string
  last_login?: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user",
    password: ""
  })

  useEffect(() => {
    checkAuth()
    loadUsers()
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

  const loadUsers = async () => {
    // Mock data - em produção, buscar do Supabase
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@pjiadv.com",
        name: "Administrador",
        role: "admin",
        status: "active",
        created_at: "2024-01-15",
        last_login: "2024-12-03"
      },
      {
        id: "2",
        email: "joao.silva@pjiadv.com",
        name: "João Silva",
        role: "user",
        status: "active",
        created_at: "2024-02-20",
        last_login: "2024-12-02"
      },
      {
        id: "3",
        email: "maria.santos@pjiadv.com",
        name: "Maria Santos",
        role: "user",
        status: "active",
        created_at: "2024-03-10",
        last_login: "2024-12-01"
      },
      {
        id: "4",
        email: "pedro.costa@pjiadv.com",
        name: "Pedro Costa",
        role: "user",
        status: "inactive",
        created_at: "2024-04-05",
        last_login: "2024-11-15"
      }
    ]
    
    setUsers(mockUsers)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateUser = async () => {
    // Implementar criação de usuário via Supabase
    console.log("Criar usuário:", newUser)
    setShowCreateModal(false)
    setNewUser({ email: "", name: "", role: "user", password: "" })
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      // Implementar exclusão via Supabase
      console.log("Excluir usuário:", userId)
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const handleToggleStatus = async (userId: string) => {
    // Implementar toggle de status via Supabase
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#42526E] font-medium">Carregando usuários...</p>
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
              <Users className="w-8 h-8 text-[#0052CC]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC]">
                Gerenciar Usuários
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#42526E]">
              Criar, editar e gerenciar usuários do sistema
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#42526E]" />
              <Input
                placeholder="Buscar usuários por nome ou email..."
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
              Novo Usuário
            </Button>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0052CC]">
                Usuários Cadastrados ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-[#42526E]">Nome</th>
                      <th className="text-left p-3 text-sm font-medium text-[#42526E]">Email</th>
                      <th className="text-left p-3 text-sm font-medium text-[#42526E]">Função</th>
                      <th className="text-left p-3 text-sm font-medium text-[#42526E]">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-[#42526E]">Último Acesso</th>
                      <th className="text-right p-3 text-sm font-medium text-[#42526E]">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#0052CC] rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-[#0052CC]">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-[#42526E]">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin" 
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {user.role === "admin" ? "Administrador" : "Usuário"}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {user.status === "active" ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Ativo
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Inativo
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-sm text-[#42526E]">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString('pt-BR') : "Nunca"}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-xl text-[#0052CC]">Criar Novo Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Digite o nome completo"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Função</Label>
                      <select
                        id="role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleCreateUser}
                        className="flex-1 bg-[#0052CC] hover:bg-[#0747A6] text-white"
                      >
                        Criar Usuário
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
