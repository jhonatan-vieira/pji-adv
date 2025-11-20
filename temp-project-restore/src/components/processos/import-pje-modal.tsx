"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { importProcessFromPJe } from "@/lib/services/datajud-service"

interface ImportPJeModalProps {
  onImportSuccess: (processData: any) => void
}

export function ImportPJeModal({ onImportSuccess }: ImportPJeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [numeroProcesso, setNumeroProcesso] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    if (!numeroProcesso.trim()) {
      setError("Por favor, informe o número do processo")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const processData = await importProcessFromPJe(numeroProcesso)
      onImportSuccess(processData)
      setIsOpen(false)
      setNumeroProcesso("")
    } catch (err: any) {
      setError(err.message || "Erro ao importar processo. Verifique o número e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setNumeroProcesso("")
      setError(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-[#36B37E] text-[#36B37E] hover:bg-[#36B37E]/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Importar do PJe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#0052CC] flex items-center gap-2">
            <Download className="w-5 h-5" />
            Importar Processo do PJe
          </DialogTitle>
          <DialogDescription>
            Importe automaticamente os dados de um processo através da API Datajud do CNJ.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="numeroProcesso">
              Número do Processo *
            </Label>
            <Input
              id="numeroProcesso"
              placeholder="0000000-00.0000.0.00.0000"
              value={numeroProcesso}
              onChange={(e) => setNumeroProcesso(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleImport()
                }
              }}
            />
            <p className="text-xs text-[#42526E]">
              Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[#0052CC] mb-2">
              ℹ️ Sobre a Importação
            </h4>
            <ul className="text-xs text-[#42526E] space-y-1">
              <li>• Os dados serão buscados na API Datajud do CNJ</li>
              <li>• O formulário será preenchido automaticamente</li>
              <li>• Você poderá revisar antes de salvar</li>
              <li>• É necessário configurar a chave API nas variáveis de ambiente</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isLoading || !numeroProcesso.trim()}
            className="bg-[#36B37E] hover:bg-[#36B37E]/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Importar Processo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
