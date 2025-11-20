/**
 * Serviço de integração com a API Datajud do CNJ
 * Documentação: https://datajud-wiki.cnj.jus.br/api-publica/
 */

interface DatajudProcessResponse {
  numeroProcesso: string
  classe?: {
    codigo: number
    nome: string
  }
  sistema?: {
    codigo: number
    nome: string
  }
  formato?: {
    codigo: number
    nome: string
  }
  tribunal?: string
  dataAjuizamento?: string
  movimentos?: Array<{
    codigo: number
    nome: string
    dataHora: string
  }>
  assuntos?: Array<{
    codigo: number
    nome: string
  }>
  orgaoJulgador?: {
    codigo: string
    nome: string
  }
  valorCausa?: number
}

interface ProcessFormData {
  numero: string
  cliente: string
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

/**
 * Importa dados de um processo através da API Datajud
 */
export async function importProcessFromPJe(numeroProcesso: string): Promise<ProcessFormData> {
  const apiKey = process.env.NEXT_PUBLIC_DATAJUD_API_KEY

  if (!apiKey) {
    throw new Error(
      "Chave API do Datajud não configurada. Configure NEXT_PUBLIC_DATAJUD_API_KEY nas variáveis de ambiente."
    )
  }

  // Remove caracteres especiais do número do processo
  const numeroLimpo = numeroProcesso.replace(/[^\d]/g, "")

  try {
    const response = await fetch(
      `https://api-publica.datajud.cnj.jus.br/api_publica_processo/_search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `APIKey ${apiKey}`,
        },
        body: JSON.stringify({
          query: {
            match: {
              numeroProcesso: numeroLimpo
            }
          }
        })
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Chave API inválida ou expirada")
      }
      if (response.status === 404) {
        throw new Error("Processo não encontrado na base do CNJ")
      }
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data = await response.json()

    if (!data.hits || !data.hits.hits || data.hits.hits.length === 0) {
      throw new Error("Processo não encontrado na base do CNJ")
    }

    const processData: DatajudProcessResponse = data.hits.hits[0]._source

    // Mapeia os dados da API para o formato do formulário
    return mapDatajudToFormData(processData)
  } catch (error: any) {
    console.error("Erro ao importar processo:", error)
    throw error
  }
}

/**
 * Mapeia os dados da API Datajud para o formato do formulário
 */
function mapDatajudToFormData(apiData: DatajudProcessResponse): ProcessFormData {
  // Formata o número do processo
  const numeroFormatado = formatarNumeroProcesso(apiData.numeroProcesso)

  // Determina o tipo de processo baseado na classe
  const tipo = mapearTipoProcesso(apiData.classe?.nome || "")

  // Determina o status baseado nos movimentos
  const status = determinarStatus(apiData.movimentos || [])

  // Formata a data de ajuizamento
  const dataAbertura = apiData.dataAjuizamento
    ? new Date(apiData.dataAjuizamento).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]

  // Formata o valor da causa
  const valorCausa = apiData.valorCausa
    ? `R$ ${apiData.valorCausa.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : undefined

  // Monta a descrição com informações dos assuntos
  const descricao = apiData.assuntos
    ? `Assuntos: ${apiData.assuntos.map((a) => a.nome).join(", ")}`
    : undefined

  return {
    numero: numeroFormatado,
    cliente: "Cliente Importado", // Será preenchido manualmente
    tipo,
    status,
    dataAbertura,
    valorCausa,
    tribunal: apiData.tribunal || undefined,
    vara: apiData.orgaoJulgador?.nome || undefined,
    descricao,
    autor: undefined, // Não disponível na API pública
    reu: undefined, // Não disponível na API pública
    advogadoResponsavel: undefined,
  }
}

/**
 * Formata o número do processo no padrão CNJ
 */
function formatarNumeroProcesso(numero: string): string {
  const limpo = numero.replace(/[^\d]/g, "")
  if (limpo.length !== 20) return numero

  return `${limpo.slice(0, 7)}-${limpo.slice(7, 9)}.${limpo.slice(9, 13)}.${limpo.slice(13, 14)}.${limpo.slice(14, 16)}.${limpo.slice(16, 20)}`
}

/**
 * Mapeia a classe do processo para o tipo usado no sistema
 */
function mapearTipoProcesso(classe: string): string {
  const classeUpper = classe.toUpperCase()

  if (classeUpper.includes("TRABALHISTA") || classeUpper.includes("TRABALHO")) {
    return "Trabalhista"
  }
  if (classeUpper.includes("CRIMINAL") || classeUpper.includes("PENAL")) {
    return "Criminal"
  }
  if (classeUpper.includes("FAMÍLIA") || classeUpper.includes("FAMILIA")) {
    return "Família"
  }
  if (classeUpper.includes("TRIBUTÁRIO") || classeUpper.includes("TRIBUTARIO") || classeUpper.includes("FISCAL")) {
    return "Tributário"
  }
  if (classeUpper.includes("PREVIDENCIÁRIO") || classeUpper.includes("PREVIDENCIARIO")) {
    return "Previdenciário"
  }
  if (classeUpper.includes("CONSUMIDOR") || classeUpper.includes("CONSUMERISTA")) {
    return "Consumidor"
  }
  if (classeUpper.includes("ADMINISTRATIVO")) {
    return "Administrativo"
  }

  return "Cível" // Padrão
}

/**
 * Determina o status do processo baseado nos movimentos
 */
function determinarStatus(
  movimentos: Array<{ codigo: number; nome: string; dataHora: string }>
): "Em andamento" | "Aguardando" | "Concluído" | "Arquivado" {
  if (movimentos.length === 0) return "Em andamento"

  const ultimoMovimento = movimentos[movimentos.length - 1]
  const nomeMovimento = ultimoMovimento.nome.toUpperCase()

  if (
    nomeMovimento.includes("ARQUIVADO") ||
    nomeMovimento.includes("BAIXA DEFINITIVA")
  ) {
    return "Arquivado"
  }

  if (
    nomeMovimento.includes("SENTENÇA") ||
    nomeMovimento.includes("ACÓRDÃO") ||
    nomeMovimento.includes("TRÂNSITO EM JULGADO")
  ) {
    return "Concluído"
  }

  if (
    nomeMovimento.includes("AGUARDANDO") ||
    nomeMovimento.includes("SUSPENSO") ||
    nomeMovimento.includes("SOBRESTADO")
  ) {
    return "Aguardando"
  }

  return "Em andamento"
}
