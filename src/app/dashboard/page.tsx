"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
    
    // Verificar se há parâmetro de confirmação
    if (searchParams.get('confirmed') === 'true') {
      setShowSuccess(true)
      // Remover o parâmetro da URL após 5 segundos
      setTimeout(() => {
        setShowSuccess(false)
        router.replace('/dashboard')
      }, 5000)
    }
  }, [searchParams])

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Erro ao verificar sessão:', error)
        router.push('/auth/login')
        return
      }
      
      if (!session) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#42526E] font-medium">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar activeModule="dashboard" />
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Mensagem de sucesso */}
          {showSuccess && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">
                  ✅ Login realizado com sucesso!
                </p>
                <p className="text-xs text-green-700 mt-1 break-words">
                  Bem-vindo ao sistema PJI ADV. Você está autenticado como <strong>{userEmail}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC] mb-2">
              Bem-vindo ao PJI ADV
            </h2>
            <p className="text-sm sm:text-base text-[#42526E]">
              Visão geral da sua gestão jurídica
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatsCard
              title="Processos Ativos"
              value="12"
              icon={FileText}
              trend={{ value: "+3 este mês", positive: true }}
              color="blue"
            />
            <StatsCard
              title="Clientes"
              value="28"
              icon={Users}
              trend={{ value: "+5 este mês", positive: true }}
              color="green"
            />
            <StatsCard
              title="Prazos Próximos"
              value="5"
              icon={Calendar}
              trend={{ value: "3 esta semana", positive: false }}
              color="gray"
            />
            <StatsCard
              title="Receita Mensal"
              value="R$ 45.2k"
              icon={DollarSign}
              trend={{ value: "+12% vs mês anterior", positive: true }}
              color="green"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Processos Recentes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base sm:text-lg text-[#0052CC]">Processos Recentes</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#0052CC] text-xs sm:text-sm">
                  Ver todos
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 sm:p-4 bg-[#F4F5F7] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0052CC]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#0052CC]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#0052CC] text-xs sm:text-sm truncate">
                            Processo {1000000 + i}-00.2024.8.00.0000
                          </p>
                          <p className="text-xs text-[#42526E] truncate">
                            Cliente Exemplo {i}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 sm:px-3 py-1 bg-[#36B37E]/10 text-[#36B37E] rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ml-2">
                        Em andamento
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tarefas Urgentes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base sm:text-lg text-[#0052CC]">Tarefas Urgentes</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#0052CC] text-xs sm:text-sm">
                  Ver todas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { task: "Contestação - Processo 1000001", date: "Hoje", priority: "high" },
                    { task: "Audiência - Processo 1000002", date: "Amanhã", priority: "high" },
                    { task: "Recurso - Processo 1000003", date: "Em 3 dias", priority: "medium" }
                  ].map((item, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 sm:p-4 bg-[#F4F5F7] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.priority === "high" 
                            ? "bg-red-100" 
                            : "bg-yellow-100"
                        }`}>
                          <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            item.priority === "high" 
                              ? "text-red-500" 
                              : "text-yellow-600"
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#0052CC] text-xs sm:text-sm truncate">
                            {item.task}
                          </p>
                          <p className="text-xs text-[#42526E]">
                            Prazo: {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Desempenho */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-[#0052CC]">Desempenho Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64 flex items-center justify-center bg-[#F4F5F7] rounded-lg">
                  <div className="text-center px-4">
                    <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-[#0052CC] mx-auto mb-3" />
                    <p className="text-[#42526E] font-medium text-sm sm:text-base">
                      Gráfico de desempenho será implementado no próximo módulo
                    </p>
                    <p className="text-xs sm:text-sm text-[#42526E] mt-2">
                      Visualização de processos, receitas e produtividade
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#42526E] font-medium">Carregando...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
