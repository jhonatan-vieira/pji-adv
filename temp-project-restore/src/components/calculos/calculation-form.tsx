"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalculationFormData {
  tipo: string
  titulo: string
  valorInicial: number
  dataInicial: string
  dataFinal: string
  indice: string
  processoVinculado?: string
  observacoes?: string
}

interface CalculationFormProps {
  onSubmit: (data: any) => void
}

// Mock de processos - em produção, isso viria de um contexto ou API
const mockProcesses = [
  {
    id: "1",
    numero: "1000001-00.2024.8.00.0000",
    cliente: "João Silva",
    tipo: "Cível"
  },
  {
    id: "2",
    numero: "1000002-00.2024.8.00.0001",
    cliente: "Maria Santos",
    tipo: "Trabalhista"
  },
  {
    id: "3",
    numero: "1000003-00.2024.8.00.0002",
    cliente: "Pedro Oliveira",
    tipo: "Criminal"
  }
]

export function CalculationForm({ onSubmit }: CalculationFormProps) {
  const [formData, setFormData] = useState<CalculationFormData>({
    tipo: "",
    titulo: "",
    valorInicial: 0,
    dataInicial: "",
    dataFinal: new Date().toISOString().split('T')[0],
    indice: "",
    processoVinculado: "",
    observacoes: ""
  })

  const [open, setOpen] = useState(false)
  const [processes] = useState(mockProcesses)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simular cálculo
    const mesesDecorridos = calcularMeses(formData.dataInicial, formData.dataFinal)
    const taxaMensal = getTaxaMensal(formData.indice)
    const valorFinal = calcularValorCorrigido(formData.valorInicial, taxaMensal, mesesDecorridos)
    const percentualCorrecao = ((valorFinal - formData.valorInicial) / formData.valorInicial) * 100
    
    const resultado = {
      ...formData,
      valorFinal,
      resultado: {
        valorCorrigido: valorFinal,
        percentualCorrecao: percentualCorrecao,
        diferenca: valorFinal - formData.valorInicial,
        mesesDecorridos,
        taxaMensal,
        detalhamento: gerarDetalhamento(formData.valorInicial, taxaMensal, mesesDecorridos)
      }
    }
    
    onSubmit(resultado)
  }

  const handleChange = (field: keyof CalculationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleProcessSelect = (processNumber: string) => {
    setFormData(prev => ({
      ...prev,
      processoVinculado: processNumber
    }))
    setOpen(false)
  }

  const selectedProcess = processes.find(p => p.numero === formData.processoVinculado)

  // Funções auxiliares de cálculo
  const calcularMeses = (dataInicial: string, dataFinal: string): number => {
    const inicio = new Date(dataInicial)
    const fim = new Date(dataFinal)
    const meses = (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth())
    return Math.max(0, meses)
  }

  const getTaxaMensal = (indice: string): number => {
    const taxas: { [key: string]: number } = {
      "INPC": 0.0041, // 0.41% ao mês (exemplo)
      "IPCA": 0.0045, // 0.45% ao mês (exemplo)
      "IGPM": 0.0050, // 0.50% ao mês (exemplo)
      "SELIC": 0.0083, // 0.83% ao mês (exemplo)
      "TR": 0.0010, // 0.10% ao mês (exemplo)
      "CDI": 0.0080 // 0.80% ao mês (exemplo)
    }
    return taxas[indice] || 0.005
  }

  const calcularValorCorrigido = (valorInicial: number, taxaMensal: number, meses: number): number => {
    if (formData.tipo === "Juros Compostos") {
      return valorInicial * Math.pow(1 + taxaMensal, meses)
    } else if (formData.tipo === "Juros Simples") {
      return valorInicial * (1 + taxaMensal * meses)
    } else {
      // Correção Monetária (composta)
      return valorInicial * Math.pow(1 + taxaMensal, meses)
    }
  }

  const gerarDetalhamento = (valorInicial: number, taxaMensal: number, meses: number) => {
    const detalhes = []
    let valorAtual = valorInicial
    
    for (let i = 1; i <= Math.min(meses, 12); i++) {
      const valorAnterior = valorAtual
      valorAtual = valorAtual * (1 + taxaMensal)
      detalhes.push({
        mes: i,
        valorAnterior,
        taxa: taxaMensal * 100,
        correcao: valorAtual - valorAnterior,
        valorAtualizado: valorAtual
      })
    }
    
    return detalhes
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Cálculo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0052CC]">Tipo de Cálculo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Cálculo *</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleChange("tipo", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Correção Monetária">Correção Monetária</SelectItem>
                <SelectItem value="Juros Compostos">Juros Compostos</SelectItem>
                <SelectItem value="Juros Simples">Juros Simples</SelectItem>
                <SelectItem value="Atualização Trabalhista">Atualização Trabalhista</SelectItem>
                <SelectItem value="Liquidação de Sentença">Liquidação de Sentença</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indice">Índice de Correção *</Label>
            <Select 
              value={formData.indice} 
              onValueChange={(value) => handleChange("indice", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o índice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INPC">INPC</SelectItem>
                <SelectItem value="IPCA">IPCA</SelectItem>
                <SelectItem value="IGPM">IGP-M</SelectItem>
                <SelectItem value="SELIC">SELIC</SelectItem>
                <SelectItem value="TR">TR</SelectItem>
                <SelectItem value="CDI">CDI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Cálculo *</Label>
          <Input
            id="titulo"
            placeholder="Ex: Correção Monetária - Processo 1000001"
            value={formData.titulo}
            onChange={(e) => handleChange("titulo", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Valores e Datas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0052CC]">Valores e Período</h3>
        
        <div className="space-y-2">
          <Label htmlFor="valorInicial">Valor Inicial *</Label>
          <Input
            id="valorInicial"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.valorInicial || ""}
            onChange={(e) => handleChange("valorInicial", parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicial">Data Inicial *</Label>
            <Input
              id="dataInicial"
              type="date"
              value={formData.dataInicial}
              onChange={(e) => handleChange("dataInicial", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFinal">Data Final *</Label>
            <Input
              id="dataFinal"
              type="date"
              value={formData.dataFinal}
              onChange={(e) => handleChange("dataFinal", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Vinculação a Processo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0052CC]">Vinculação (Opcional)</h3>
        
        <div className="space-y-2">
          <Label>Processo Vinculado</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedProcess ? (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0052CC]" />
                    <span className="truncate">{selectedProcess.numero}</span>
                  </div>
                ) : (
                  "Selecione um processo (opcional)..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-0">
              <Command>
                <CommandInput placeholder="Buscar processo..." />
                <CommandEmpty>Nenhum processo encontrado.</CommandEmpty>
                <CommandGroup>
                  {processes.map((process) => (
                    <CommandItem
                      key={process.id}
                      value={process.numero}
                      onSelect={() => handleProcessSelect(process.numero)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.processoVinculado === process.numero ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <FileText className="w-4 h-4 text-[#0052CC]" />
                        <div className="flex-1">
                          <p className="font-medium">{process.numero}</p>
                          <p className="text-xs text-[#42526E]">
                            {process.cliente} • {process.tipo}
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedProcess && (
            <p className="text-xs text-[#42526E] mt-1">
              Cliente: {selectedProcess.cliente} • Tipo: {selectedProcess.tipo}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            placeholder="Adicione observações sobre o cálculo..."
            rows={3}
            value={formData.observacoes}
            onChange={(e) => handleChange("observacoes", e.target.value)}
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-[#0052CC] hover:bg-[#0052CC]/90"
        >
          Calcular
        </Button>
      </div>
    </form>
  )
}
