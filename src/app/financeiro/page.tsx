"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Briefcase
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea"
import { supabase, type FinancialTransaction } from "@/lib/supabase"
import { toast } from "sonner"

export default function FinanceiroPage() {
  const [mounted, setMounted] = useState(false)
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "receita" | "despesa">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
      toast.error('Erro ao carregar transações')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  // Cálculos
  const totalReceitas = transactions
    .filter(t => t.type === "receita")
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const totalDespesas = transactions
    .filter(t => t.type === "despesa")
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const saldo = totalReceitas - totalDespesas

  const receitasPendentes = transactions
    .filter(t => t.type === "receita" && t.status === "pendente")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Filtros
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.process_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || t.type === filterType
    return matchesSearch && matchesType
  })

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newTransaction = {
      type: formData.get("type") as "receita" | "despesa",
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
      date: formData.get("date") as string,
      category: formData.get("category") as string,
      client_name: formData.get("client") as string || null,
      process_number: formData.get("process") as string || null,
      status: formData.get("status") as "pago" | "pendente" | "atrasado"
    }

    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert([newTransaction])

      if (error) throw error

      toast.success('Lançamento adicionado com sucesso!')
      setIsDialogOpen(false)
      loadTransactions()
      
      // Reset form
      e.currentTarget.reset()
    } catch (error) {
      console.error('Erro ao adicionar transação:', error)
      toast.error('Erro ao adicionar lançamento')
    }
  }

  const generateInvoice = (transaction: FinancialTransaction) => {
    // Simulação de geração de PDF
    toast.success(`Gerando fatura para: ${transaction.description}`)
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      <div className="flex">
        <Sidebar activeModule="financeiro" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#172B4D] mb-2">Gestão Financeira</h1>
                <p className="text-[#42526E]">Controle completo de receitas, despesas e faturas</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Lançamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Lançamento Financeiro</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova receita ou despesa ao sistema
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTransaction} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo *</Label>
                        <Select name="type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receita">Receita</SelectItem>
                            <SelectItem value="despesa">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Valor (R$) *</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição *</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Ex: Honorários advocatícios"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria *</Label>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Honorários">Honorários</SelectItem>
                            <SelectItem value="Consultoria">Consultoria</SelectItem>
                            <SelectItem value="Custas">Custas Processuais</SelectItem>
                            <SelectItem value="Despesas Gerais">Despesas Gerais</SelectItem>
                            <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Data *</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client">Cliente (opcional)</Label>
                        <Input
                          id="client"
                          name="client"
                          placeholder="Nome do cliente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="process">Processo (opcional)</Label>
                        <Input
                          id="process"
                          name="process"
                          placeholder="Número do processo"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select name="status" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="atrasado">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-[#0052CC] hover:bg-[#0747A6]">
                        Adicionar Lançamento
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#42526E]">
                    Total Receitas
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-[#36B37E]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#36B37E]">
                    R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-[#42526E] mt-1">
                    +12% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#42526E]">
                    Total Despesas
                  </CardTitle>
                  <TrendingDown className="w-4 h-4 text-[#FF5630]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#FF5630]">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-[#42526E] mt-1">
                    -5% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#42526E]">
                    Saldo
                  </CardTitle>
                  <DollarSign className="w-4 h-4 text-[#0052CC]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0052CC]">
                    R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-[#42526E] mt-1">
                    Receitas - Despesas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-[#42526E]">
                    A Receber
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-[#FFAB00]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#FFAB00]">
                    R$ {receitasPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-[#42526E] mt-1">
                    Receitas pendentes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros e Busca */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#42526E] w-4 h-4" />
                    <Input
                      placeholder="Buscar por descrição, cliente ou processo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="receita">Receitas</SelectItem>
                      <SelectItem value="despesa">Despesas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Transações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0052CC]">Lançamentos Financeiros</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-[#42526E]">
                    Carregando...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-12 text-[#42526E]">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhum lançamento encontrado</p>
                      </div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              transaction.type === "receita" 
                                ? "bg-[#36B37E]/10" 
                                : "bg-[#FF5630]/10"
                            }`}>
                              {transaction.type === "receita" ? (
                                <TrendingUp className="w-6 h-6 text-[#36B37E]" />
                              ) : (
                                <TrendingDown className="w-6 h-6 text-[#FF5630]" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium text-[#172B4D]">
                                {transaction.description}
                              </p>
                              <div className="flex gap-4 mt-1 text-sm text-[#42526E]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                </span>
                                {transaction.client_name && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {transaction.client_name}
                                  </span>
                                )}
                                {transaction.process_number && (
                                  <span className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    {transaction.process_number}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className={`text-xl font-bold ${
                                transaction.type === "receita" 
                                  ? "text-[#36B37E]" 
                                  : "text-[#FF5630]"
                              }`}>
                                {transaction.type === "receita" ? "+" : "-"}
                                R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                transaction.status === "pago"
                                  ? "bg-[#36B37E]/10 text-[#36B37E]"
                                  : transaction.status === "pendente"
                                  ? "bg-[#FFAB00]/10 text-[#FFAB00]"
                                  : "bg-[#FF5630]/10 text-[#FF5630]"
                              }`}>
                                {transaction.status === "pago" ? "Pago" : transaction.status === "pendente" ? "Pendente" : "Atrasado"}
                              </span>
                            </div>
                          </div>

                          {transaction.type === "receita" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-4"
                              onClick={() => generateInvoice(transaction)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Gerar Fatura
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
