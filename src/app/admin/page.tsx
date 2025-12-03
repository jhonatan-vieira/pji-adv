"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Settings, Activity, Shield, TrendingUp, AlertCircle, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProcesses: 0,
    activeUsers: 0,
    systemHealth: "Excelente"
  })

  useEffect(() => {
    checkAdminAuth()
    loadStats()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/auth/login')
        return
      }
      
      setUserEmail(session.user.email || null)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      router.push('/auth/login')
    }
  }

  const loadStats = async () => {
    // Aqui você pode carregar estatísticas reais do banco de dados
    // Por enquanto, usando dados mock
    setStats({
      totalUsers: 28,
      totalProcesses: 12,
      activeUsers: 15,
      systemHealth: "Excelente"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#42526E] font-medium">Carregando painel administrativo...</p>
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
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-[#0052CC]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC]">
                Painel Administrativo
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#42526E]">
              Gerencie usuários, processos e configurações do sistema
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#42526E]">
                  Total de Usuários
                </CardTitle>
                <Users className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0052CC]">{stats.totalUsers}</div>
                <p className="text-xs text-[#42526E] mt-1">
                  {stats.activeUsers} ativos
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#42526E]">
                  Total de Processos
                </CardTitle>
                <FileText className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0052CC]">{stats.totalProcesses}</div>
                <p className="text-xs text-[#42526E] mt-1">
                  Em andamento
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#42526E]">
                  Saúde do Sistema
                </CardTitle>
                <Activity className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0052CC]">{stats.systemHealth}</div>
                <p className="text-xs text-[#42526E] mt-1">
                  Todos os serviços operacionais
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#42526E]">
                  Banco de Dados
                </CardTitle>
                <Database className="w-4 h-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0052CC]">98%</div>
                <p className="text-xs text-[#42526E] mt-1">
                  Capacidade disponível
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Gerenciar Usuários */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/users')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#0052CC]">Usuários</CardTitle>
                    <p className="text-sm text-[#42526E]">Gerenciar usuários</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#42526E] mb-4">
                  Criar, editar e gerenciar permissões de usuários do sistema
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            {/* Gerenciar Processos */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/processes')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#0052CC]">Processos</CardTitle>
                    <p className="text-sm text-[#42526E]">Gerenciar processos</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#42526E] mb-4">
                  Visualizar, criar e editar processos jurídicos do sistema
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/settings')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#0052CC]">Configurações</CardTitle>
                    <p className="text-sm text-[#42526E]">Sistema</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#42526E] mb-4">
                  Configurar parâmetros gerais e preferências do sistema
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            {/* Logs de Atividades */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/logs')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#0052CC]">Logs</CardTitle>
                    <p className="text-sm text-[#42526E]">Atividades</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#42526E] mb-4">
                  Visualizar histórico de ações e atividades do sistema
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            {/* Relatórios */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/reports')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#0052CC]">Relatórios</CardTitle>
                    <p className="text-sm text-[#42526E]">Análises</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#42526E] mb-4">
                  Gerar relatórios e análises detalhadas do sistema
                </p>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/security')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#0052CC]">Segurança</CardTitle>
                    <p className="text-sm text-[#42526E]">Proteção</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#42526E] mb-4">
                  Gerenciar permissões, acessos e políticas de segurança
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <Card className="mt-6 sm:mt-8 border-l-4 border-l-yellow-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-lg text-[#0052CC]">Alertas do Sistema</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Backup Agendado:</strong> Próximo backup automático em 2 horas
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Atualização Disponível:</strong> Nova versão do sistema disponível
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
