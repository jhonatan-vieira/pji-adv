import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface FinancialTransaction {
  id: string
  type: 'receita' | 'despesa'
  description: string
  amount: number
  date: string
  category: string
  client_name?: string
  process_number?: string
  status: 'pago' | 'pendente' | 'atrasado'
  created_at: string
  updated_at: string
}

export interface LegalCalculation {
  id: string
  tipo: string
  titulo: string
  valor_inicial: number
  valor_final: number
  data_inicial: string
  data_final: string
  indice: string
  processo_vinculado?: string
  resultado: {
    valorCorrigido: number
    percentualCorrecao: number
    diferenca: number
  }
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  titulo: string
  descricao?: string
  status: 'A fazer' | 'Em progresso' | 'Concluída'
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente'
  data_vencimento: string
  numero_processo?: string
  created_at: string
  updated_at: string
}

export interface LawOfficeSettings {
  id: string
  user_id: string
  office_name: string
  address: string
  oab_number: string
  logo_url: string
  created_at: string
  updated_at: string
}

export interface DocumentTemplate {
  id: string
  user_id: string
  template_type: 'procuracao' | 'contrato'
  template_name: string
  template_content: string
  created_at: string
  updated_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description: string
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado'
  priority: 'baixa' | 'media' | 'alta' | 'urgente'
  created_at: string
  updated_at: string
}

export interface SupportMessage {
  id: string
  ticket_id: string
  user_id: string
  message: string
  is_staff: boolean
  created_at: string
}
