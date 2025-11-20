"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, FileText, Calendar, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function RelatoriosPage() {
  const [financialData, setFinancialData] = useState<any[]>([])
  const [processData, setProcessData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Dados financeiros por mês
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: true })

      // Agrupar por mês
      const monthlyData = transactions?.reduce((acc: any, t: any) => {
        const month = new Date(t.date).toLocaleDateString("pt-BR", { month: "short" })
        const existing = acc.find((item: any) => item.month === month)
        
        if (existing) {
          if (t.type === "receita") {
            existing.receitas += t.amount
          } else {
            existing.despesas += t.amount
          }
        } else {
          acc.push({
            month,
            receitas: t.type === "receita" ? t.amount : 0,
            despesas: t.type === "despesa" ? t.amount : 0,
          })
        }
        return acc
      }, []) || []

      setFinancialData(monthlyData)

      // Dados de processos (mock para demonstração)
      setProcessData([
        { name: "Em Andamento", value: 12, color: "#0052CC" },
        { name: "Concluídos", value: 8, color: "#36B37E" },
        { name: "Arquivados", value: 5, color: "#6B778C" },
      ])

      setLoading(false)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    // Implementar exportação para PDF
    alert("Exportando relatório em PDF...")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <Header />
        <div className="flex">
          <Sidebar activeModule="relatorios" />
          <main className="flex-1 p-8">
            <div className="text-center py-12">
              <p className="text-[#42526E]">Carregando relatórios...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex">
        <Sidebar activeModule="relatorios" />
        
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0052CC] mb-2">
                Relatórios e Análises
              </h2>
              <p className="text-[#42526E]">
                Visualize o desempenho do seu escritório
              </p>
            </div>
            <Button onClick={exportToPDF} className="bg-[#0052CC] hover:bg-[#0747A6]">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Receita Total</p>
                    <p className="text-2xl font-bold text-[#0052CC]">R$ 145.2k</p>
                  </div>
                  <div className="w-12 h-12 bg-[#36B37E]/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#36B37E]" />
                  </div>
                </div>
                <p className="text-xs text-[#36B37E] mt-2">+12% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Processos Ativos</p>
                    <p className="text-2xl font-bold text-[#0052CC]">12</p>
                  </div>
                  <div className="w-12 h-12 bg-[#0052CC]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#0052CC]" />
                  </div>
                </div>
                <p className="text-xs text-[#36B37E] mt-2">+3 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-[#0052CC]">87%</p>
                  </div>
                  <div className="w-12 h-12 bg-[#36B37E]/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#36B37E]" />
                  </div>
                </div>
                <p className="text-xs text-[#36B37E] mt-2">+5% vs trimestre anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Prazos Cumpridos</p>
                    <p className="text-2xl font-bold text-[#0052CC]">94%</p>
                  </div>
                  <div className="w-12 h-12 bg-[#0052CC]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#0052CC]" />
                  </div>
                </div>
                <p className="text-xs text-[#36B37E] mt-2">Excelente desempenho</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Receitas e Despesas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0052CC]">Receitas vs Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="receitas" fill="#36B37E" name="Receitas" />
                    <Bar dataKey="despesas" fill="#FF5630" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Processos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0052CC]">Status dos Processos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {processData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Tendência */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-[#0052CC]">Tendência de Crescimento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="receitas" 
                      stroke="#36B37E" 
                      strokeWidth={2}
                      name="Receitas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
