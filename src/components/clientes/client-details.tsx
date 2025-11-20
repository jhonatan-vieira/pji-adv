"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Building2,
  CreditCard
} from "lucide-react"
import type { Client } from "@/app/clientes/page"

interface ClientDetailsProps {
  client: Client
}

export function ClientDetails({ client }: ClientDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#0052CC]/10 rounded-full flex items-center justify-center">
            {client.tipo === "Pessoa Física" ? (
              <User className="w-8 h-8 text-[#0052CC]" />
            ) : (
              <Building2 className="w-8 h-8 text-[#0052CC]" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#0052CC]">{client.nome}</h3>
            <p className="text-sm text-[#42526E]">{client.tipo}</p>
          </div>
        </div>
        <Badge 
          variant={client.status === "Ativo" ? "default" : "secondary"}
          className={client.status === "Ativo" ? "bg-[#36B37E]" : ""}
        >
          {client.status}
        </Badge>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold text-[#0052CC] mb-4">Informações Básicas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-[#42526E] mt-0.5" />
              <div>
                <p className="text-sm text-[#42526E]">
                  {client.tipo === "Pessoa Física" ? "CPF" : "CNPJ"}
                </p>
                <p className="font-medium">{client.cpfCnpj}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#42526E] mt-0.5" />
              <div>
                <p className="text-sm text-[#42526E]">Data de Cadastro</p>
                <p className="font-medium">{client.dataCadastro}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold text-[#0052CC] mb-4">Contato</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#42526E] mt-0.5" />
              <div>
                <p className="text-sm text-[#42526E]">E-mail</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#42526E] mt-0.5" />
              <div>
                <p className="text-sm text-[#42526E]">Telefone</p>
                <p className="font-medium">{client.telefone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      {(client.endereco || client.cidade || client.estado || client.cep) && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold text-[#0052CC] mb-4">Endereço</h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#42526E] mt-0.5" />
              <div className="space-y-1">
                {client.endereco && <p className="font-medium">{client.endereco}</p>}
                {(client.cidade || client.estado) && (
                  <p className="text-sm text-[#42526E]">
                    {client.cidade}{client.cidade && client.estado && " - "}{client.estado}
                  </p>
                )}
                {client.cep && (
                  <p className="text-sm text-[#42526E]">CEP: {client.cep}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      {client.observacoes && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold text-[#0052CC] mb-4">Observações</h4>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#42526E] mt-0.5" />
              <p className="text-[#42526E]">{client.observacoes}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
