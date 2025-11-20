"use client"

import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex">
        <Sidebar activeModule="dashboard" />
        
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0052CC] mb-2">
              Bem-vindo ao PJI ADV
            </h2>
            <p className="text-[#42526E]">
              Visão geral da sua gestão jurídica
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Processos Recentes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#0052CC]">Processos Recentes</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#0052CC]">
                  Ver todos
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0052CC]/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#0052CC]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0052CC]">
                            Processo {1000000 + i}-00.2024.8.00.0000
                          </p>
                          <p className="text-sm text-[#42526E]">
                            Cliente Exemplo {i}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-[#36B37E]/10 text-[#36B37E] rounded-full text-xs font-medium">
                        Em andamento
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tarefas Urgentes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#0052CC]">Tarefas Urgentes</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#0052CC]">
                  Ver todas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: "Contestação - Processo 1000001", date: "Hoje", priority: "high" },
                    { task: "Audiência - Processo 1000002", date: "Amanhã", priority: "high" },
                    { task: "Recurso - Processo 1000003", date: "Em 3 dias", priority: "medium" }
                  ].map((item, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.priority === "high" 
                            ? "bg-red-100" 
                            : "bg-yellow-100"
                        }`}>
                          <AlertCircle className={`w-5 h-5 ${
                            item.priority === "high" 
                              ? "text-red-500" 
                              : "text-yellow-600"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-[#0052CC]">
                            {item.task}
                          </p>
                          <p className="text-sm text-[#42526E]">
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
                <CardTitle className="text-[#0052CC]">Desempenho Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-[#F4F5F7] rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-[#0052CC] mx-auto mb-3" />
                    <p className="text-[#42526E] font-medium">
                      Gráfico de desempenho será implementado no próximo módulo
                    </p>
                    <p className="text-sm text-[#42526E] mt-2">
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
