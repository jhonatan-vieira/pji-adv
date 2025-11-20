"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileDown, 
  Link as LinkIcon, 
  Calendar,
  TrendingUp,
  DollarSign,
  Percent
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CalculationResultProps {
  calculation: any
  onClose: () => void
  onDownloadPDF: (calculation: any) => void
  onLinkToProcess: (calculation: any) => void
}

export function CalculationResult({ 
  calculation, 
  onClose, 
  onDownloadPDF, 
  onLinkToProcess 
}: CalculationResultProps) {
  const resultado = calculation.resultado

  return (
    <div className="space-y-6">
      {/* Resumo do Cálculo */}
      <Card className="bg-gradient-to-br from-[#0052CC]/5 to-[#36B37E]/5 border-[#0052CC]/20">
        <CardHeader>
          <CardTitle className="text-[#0052CC] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Resumo do Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg">
              <DollarSign className="w-8 h-8 text-[#42526E] mx-auto mb-2" />
              <p className="text-sm text-[#42526E] mb-1">Valor Inicial</p>
              <p className="text-2xl font-bold text-[#0052CC]">
                {calculation.valorInicial.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg">
              <Percent className="w-8 h-8 text-[#0052CC] mx-auto mb-2" />
              <p className="text-sm text-[#42526E] mb-1">Correção</p>
              <p className="text-2xl font-bold text-[#0052CC]">
                {resultado.percentualCorrecao.toFixed(2)}%
              </p>
            </div>

            <div className="text-center p-4 bg-white rounded-lg">
              <DollarSign className="w-8 h-8 text-[#36B37E] mx-auto mb-2" />
              <p className="text-sm text-[#42526E] mb-1">Valor Corrigido</p>
              <p className="text-2xl font-bold text-[#36B37E]">
                {resultado.valorCorrigido.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#42526E] mb-1">Diferença (Ganho)</p>
                <p className="text-xl font-bold text-[#36B37E]">
                  + {resultado.diferenca.toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#42526E] mb-1">Período</p>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0052CC]" />
                  {resultado.mesesDecorridos} meses
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Cálculo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0052CC]">Informações do Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#42526E] mb-1">Título</p>
              <p className="font-medium">{calculation.titulo}</p>
            </div>
            <div>
              <p className="text-sm text-[#42526E] mb-1">Tipo de Cálculo</p>
              <p className="font-medium">{calculation.tipo}</p>
            </div>
            <div>
              <p className="text-sm text-[#42526E] mb-1">Índice Utilizado</p>
              <p className="font-medium">{calculation.indice}</p>
            </div>
            <div>
              <p className="text-sm text-[#42526E] mb-1">Taxa Mensal</p>
              <p className="font-medium">{(resultado.taxaMensal * 100).toFixed(4)}%</p>
            </div>
            <div>
              <p className="text-sm text-[#42526E] mb-1">Data Inicial</p>
              <p className="font-medium">{calculation.dataInicial}</p>
            </div>
            <div>
              <p className="text-sm text-[#42526E] mb-1">Data Final</p>
              <p className="font-medium">{calculation.dataFinal}</p>
            </div>
            {calculation.processoVinculado && (
              <div className="md:col-span-2">
                <p className="text-sm text-[#42526E] mb-1">Processo Vinculado</p>
                <p className="font-medium flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#0052CC]" />
                  {calculation.processoVinculado}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento Mensal */}
      {resultado.detalhamento && resultado.detalhamento.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0052CC]">
              Detalhamento Mensal (Primeiros 12 meses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead className="text-right">Valor Anterior</TableHead>
                    <TableHead className="text-right">Taxa (%)</TableHead>
                    <TableHead className="text-right">Correção</TableHead>
                    <TableHead className="text-right">Valor Atualizado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultado.detalhamento.map((item: any) => (
                    <TableRow key={item.mes}>
                      <TableCell className="font-medium">{item.mes}º</TableCell>
                      <TableCell className="text-right">
                        {item.valorAnterior.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.taxa.toFixed(4)}%
                      </TableCell>
                      <TableCell className="text-right text-[#36B37E]">
                        + {item.correcao.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.valorAtualizado.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      {calculation.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0052CC]">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#42526E] whitespace-pre-wrap">{calculation.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          variant="outline"
          onClick={onClose}
        >
          Fechar
        </Button>
        {!calculation.processoVinculado && (
          <Button 
            variant="outline"
            className="border-[#0052CC] text-[#0052CC]"
            onClick={() => onLinkToProcess(calculation)}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Anexar a Processo
          </Button>
        )}
        <Button 
          className="bg-[#0052CC] hover:bg-[#0052CC]/90"
          onClick={() => onDownloadPDF(calculation)}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Baixar PDF
        </Button>
      </div>
    </div>
  )
}
