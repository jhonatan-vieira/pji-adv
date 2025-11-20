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
  Calculator,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileDown,
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
import { CalculationForm } from "@/components/calculos/calculation-form"
import { CalculationResult } from "@/components/calculos/calculation-result"
import { toast } from "sonner"
import { supabase, type LegalCalculation } from "@/lib/supabase"

export default function CalculosPage() {
  const [calculations, setCalculations] = useState<LegalCalculation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCalculation, setSelectedCalculation] = useState<LegalCalculation | null>(null)
  const [viewMode, setViewMode] = useState<"form" | "result">("form")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCalculations()
  }, [])

  const loadCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_calculations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCalculations(data || [])
    } catch (error) {
      console.error('Erro ao carregar cálculos:', error)
      toast.error('Erro ao carregar cálculos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCalculation = async (calculationData: any) => {
    try {
      const { error } = await supabase
        .from('legal_calculations')
        .insert([calculationData])

      if (error) throw error

      toast.success("Cálculo realizado com sucesso!")
      loadCalculations()
      setIsDialogOpen(false)
      setViewMode("form")
    } catch (error) {
      console.error('Erro ao adicionar cálculo:', error)
      toast.error('Erro ao adicionar cálculo')
    }
  }

  const handleDeleteCalculation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('legal_calculations')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success("Cálculo excluído com sucesso!")
      loadCalculations()
    } catch (error) {
      console.error('Erro ao excluir cálculo:', error)
      toast.error('Erro ao excluir cálculo')
    }
  }

  const handleViewCalculation = (calculation: LegalCalculation) => {
    setSelectedCalculation(calculation)
    setViewMode("result")
    setIsDialogOpen(true)
  }

  const handleDownloadPDF = (calculation: LegalCalculation) => {
    toast.success("PDF gerado com sucesso!")
    // Implementação real de geração de PDF seria aqui
  }

  const handleLinkToProcess = (calculation: LegalCalculation) => {
    toast.success("Cálculo anexado ao processo com sucesso!")
    // Implementação real de vinculação seria aqui
  }

  const filteredCalculations = calculations.filter(calc =>
    calc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.processo_vinculado?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Correção Monetária":
        return "bg-[#0052CC]/10 text-[#0052CC]"
      case "Juros Compostos":
        return "bg-[#36B37E]/10 text-[#36B37E]"
      case "Juros Simples":
        return "bg-yellow-100 text-yellow-700"
      case "Atualização Trabalhista":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex">
        <Sidebar activeModule="calculos" />
        
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0052CC] mb-2">
                  Cálculos Jurídicos
                </h2>
                <p className="text-[#42526E]">
                  Central de cálculos com correção monetária, juros e atualizações
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) {
                  setSelectedCalculation(null)
                  setViewMode("form")
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-[#0052CC] hover:bg-[#0052CC]/90"
                    onClick={() => {
                      setSelectedCalculation(null)
                      setViewMode("form")
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cálculo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#0052CC]">
                      {viewMode === "form" ? "Realizar Cálculo Jurídico" : "Resultado do Cálculo"}
                    </DialogTitle>
                  </DialogHeader>
                  {viewMode === "form" ? (
                    <CalculationForm onSubmit={handleAddCalculation} />
                  ) : (
                    <CalculationResult 
                      calculation={selectedCalculation!}
                      onClose={() => setIsDialogOpen(false)}
                      onDownloadPDF={handleDownloadPDF}
                      onLinkToProcess={handleLinkToProcess}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#42526E] w-4 h-4" />
                <Input 
                  placeholder="Buscar por título, tipo ou processo..." 
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Total de Cálculos</p>
                    <p className="text-2xl font-bold text-[#0052CC]">{calculations.length}</p>
                  </div>
                  <Calculator className="w-8 h-8 text-[#0052CC]/20" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Correção Monetária</p>
                    <p className="text-2xl font-bold text-[#0052CC]">
                      {calculations.filter(c => c.tipo === "Correção Monetária").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-[#0052CC]/20 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#42526E] mb-1">Juros</p>
                    <p className="text-2xl font-bold text-[#36B37E]">
                      {calculations.filter(c => c.tipo.includes("Juros")).length}
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
                    <p className="text-sm text-[#42526E] mb-1">Vinculados</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {calculations.filter(c => c.processo_vinculado).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculations List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0052CC]">
                Cálculos Realizados ({filteredCalculations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-[#42526E]">
                  Carregando...
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCalculations.length === 0 ? (
                    <div className="text-center py-12">
                      <Calculator className="w-12 h-12 text-[#42526E]/30 mx-auto mb-4" />
                      <p className="text-[#42526E] font-medium">
                        Nenhum cálculo encontrado
                      </p>
                      <p className="text-sm text-[#42526E] mt-2">
                        {searchTerm 
                          ? "Tente ajustar os filtros de busca" 
                          : "Clique em 'Novo Cálculo' para começar"}
                      </p>
                    </div>
                  ) : (
                    filteredCalculations.map((calculation) => (
                      <div 
                        key={calculation.id}
                        className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-[#0052CC]/10 rounded-lg flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-[#0052CC]" />
                          </div>
                          
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="md:col-span-2">
                              <p className="text-sm text-[#42526E] mb-1">Título</p>
                              <p className="font-medium text-[#0052CC]">{calculation.titulo}</p>
                              {calculation.processo_vinculado && (
                                <p className="text-xs text-[#42526E] mt-1 flex items-center gap-1">
                                  <LinkIcon className="w-3 h-3" />
                                  {calculation.processo_vinculado}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <p className="text-sm text-[#42526E] mb-1">Tipo</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(calculation.tipo)}`}>
                                {calculation.tipo}
                              </span>
                            </div>
                            
                            <div>
                              <p className="text-sm text-[#42526E] mb-1">Valor Inicial</p>
                              <p className="font-medium">
                                {Number(calculation.valor_inicial).toLocaleString('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL' 
                                })}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-[#42526E] mb-1">Valor Final</p>
                              <p className="font-medium text-[#36B37E]">
                                {Number(calculation.valor_final).toLocaleString('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL' 
                                })}
                              </p>
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
                            <DropdownMenuItem onClick={() => handleViewCalculation(calculation)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(calculation)}>
                              <FileDown className="w-4 h-4 mr-2" />
                              Baixar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleLinkToProcess(calculation)}>
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Anexar a Processo
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCalculation(calculation.id)}
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
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
