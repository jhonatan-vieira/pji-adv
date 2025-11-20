"use client"

import { useState, useEffect } from "react"
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
import { Check, ChevronsUpDown, User, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProcessFormData {
  numero: string
  cliente: string
  clienteId?: string
  tipo: string
  status: "Em andamento" | "Aguardando" | "Concluído" | "Arquivado"
  dataAbertura: string
  valorCausa?: string
  tribunal?: string
  vara?: string
  descricao?: string
  autor?: string
  reu?: string
  advogadoResponsavel?: string
}

interface ProcessFormProps {
  onSubmit: (data: ProcessFormData) => void
  initialData?: ProcessFormData
}

// Mock de clientes - em produção, isso viria de um contexto ou API
const mockClients = [
  {
    id: "1",
    nome: "João Silva",
    tipo: "Pessoa Física",
    cpfCnpj: "123.456.789-00",
    email: "joao.silva@email.com"
  },
  {
    id: "2",
    nome: "Maria Santos",
    tipo: "Pessoa Física",
    cpfCnpj: "987.654.321-00",
    email: "maria.santos@email.com"
  },
  {
    id: "3",
    nome: "Empresa XYZ Ltda",
    tipo: "Pessoa Jurídica",
    cpfCnpj: "12.345.678/0001-90",
    email: "contato@empresaxyz.com.br"
  }
]

export function ProcessForm({ onSubmit, initialData }: ProcessFormProps) {
  const [formData, setFormData] = useState<ProcessFormData>(
    initialData || {
      numero: "",
      cliente: "",
      clienteId: "",
      tipo: "",
      status: "Em andamento",
      dataAbertura: new Date().toISOString().split('T')[0],
      valorCausa: "",
      tribunal: "",
      vara: "",
      descricao: "",
      autor: "",
      reu: "",
      advogadoResponsavel: ""
    }
  )

  const [open, setOpen] = useState(false)
  const [clients] = useState(mockClients)

  // Listener para preencher formulário com dados importados
  useEffect(() => {
    const handleFillForm = (event: any) => {
      const importedData = event.detail
      setFormData(prev => ({
        ...prev,
        ...importedData
      }))
    }

    window.addEventListener('fillProcessForm', handleFillForm)
    return () => window.removeEventListener('fillProcessForm', handleFillForm)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof ProcessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClientSelect = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId)
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        clienteId: clientId,
        cliente: selectedClient.nome
      }))
    }
    setOpen(false)
  }

  const selectedClient = clients.find(c => c.id === formData.clienteId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0052CC]">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Número do Processo *</Label>
            <Input
              id="numero"
              placeholder="0000000-00.0000.0.00.0000"
              value={formData.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedClient ? (
                    <div className="flex items-center gap-2">
                      {selectedClient.tipo === "Pessoa Física" ? (
                        <User className="w-4 h-4 text-[#0052CC]" />
                      ) : (
                        <Building2 className="w-4 h-4 text-[#0052CC]" />
                      )}
                      <span className="truncate">{selectedClient.nome}</span>
                    </div>
                  ) : (
                    "Selecione um cliente..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar cliente..." />
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.nome}
                        onSelect={() => handleClientSelect(client.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.clienteId === client.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          {client.tipo === "Pessoa Física" ? (
                            <User className="w-4 h-4 text-[#0052CC]" />
                          ) : (
                            <Building2 className="w-4 h-4 text-[#0052CC]" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{client.nome}</p>
                            <p className="text-xs text-[#42526E]">
                              {client.cpfCnpj} • {client.email}
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedClient && (
              <p className="text-xs text-[#42526E] mt-1">
                {selectedClient.tipo} • {selectedClient.cpfCnpj}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Processo *</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleChange("tipo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cível">Cível</SelectItem>
                <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                <SelectItem value="Criminal">Criminal</SelectItem>
                <SelectItem value="Família">Família</SelectItem>
                <SelectItem value="Tributário">Tributário</SelectItem>
                <SelectItem value="Administrativo">Administrativo</SelectItem>
                <SelectItem value="Previdenciário">Previdenciário</SelectItem>
                <SelectItem value="Consumidor">Consumidor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleChange("status", value as ProcessFormData["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataAbertura">Data de Abertura *</Label>
            <Input
              id="dataAbertura"
              type="date"
              value={formData.dataAbertura}
              onChange={(e) => handleChange("dataAbertura", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorCausa">Valor da Causa</Label>
            <Input
              id="valorCausa"
              placeholder="R$ 0,00"
              value={formData.valorCausa}
              onChange={(e) => handleChange("valorCausa", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Informações do Tribunal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0052CC]">Informações do Tribunal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tribunal">Tribunal</Label>
            <Input
              id="tribunal"
              placeholder="Ex: TJSP, TRT-2, STJ"
              value={formData.tribunal}
              onChange={(e) => handleChange("tribunal", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vara">Vara</Label>
            <Input
              id="vara"
              placeholder="Ex: 1ª Vara Cível"
              value={formData.vara}
              onChange={(e) => handleChange("vara", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Partes do Processo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0052CC]">Partes do Processo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="autor">Autor</Label>
            <Input
              id="autor"
              placeholder="Nome do autor"
              value={formData.autor}
              onChange={(e) => handleChange("autor", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reu">Réu</Label>
            <Input
              id="reu"
              placeholder="Nome do réu"
              value={formData.reu}
              onChange={(e) => handleChange("reu", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="advogadoResponsavel">Advogado Responsável</Label>
          <Input
            id="advogadoResponsavel"
            placeholder="Nome do advogado responsável"
            value={formData.advogadoResponsavel}
            onChange={(e) => handleChange("advogadoResponsavel", e.target.value)}
          />
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0052CC]">Detalhes Adicionais</h3>
        
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição do Processo</Label>
          <Textarea
            id="descricao"
            placeholder="Descreva os detalhes do processo, objeto da ação, etc."
            rows={4}
            value={formData.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
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
          {initialData ? "Atualizar Processo" : "Cadastrar Processo"}
        </Button>
      </div>
    </form>
  )
}
