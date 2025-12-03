/**
 * Utilitários de Performance e Cache
 * Funções para otimizar carregamento e performance do app
 */

// Cache simples em memória para dados frequentemente acessados
const cache = new Map<string, { data: any; timestamp: number }>()

// Tempo de cache padrão: 5 minutos
const DEFAULT_CACHE_TIME = 5 * 60 * 1000

/**
 * Busca dados com cache
 * @param key Chave única para o cache
 * @param fetcher Função que busca os dados
 * @param cacheTime Tempo de cache em ms (padrão: 5 minutos)
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheTime: number = DEFAULT_CACHE_TIME
): Promise<T> {
  const cached = cache.get(key)
  const now = Date.now()

  // Retornar do cache se ainda válido
  if (cached && now - cached.timestamp < cacheTime) {
    return cached.data
  }

  // Buscar dados novos
  const data = await fetcher()
  cache.set(key, { data, timestamp: now })
  
  return data
}

/**
 * Limpa cache específico ou todo o cache
 * @param key Chave específica (opcional)
 */
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

/**
 * Debounce para otimizar chamadas frequentes
 * @param func Função a ser executada
 * @param wait Tempo de espera em ms
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle para limitar execuções
 * @param func Função a ser executada
 * @param limit Intervalo mínimo entre execuções em ms
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Lazy load de componentes com retry
 * @param importFunc Função de import dinâmico
 * @param retries Número de tentativas
 */
export async function lazyLoadWithRetry<T>(
  importFunc: () => Promise<T>,
  retries: number = 3
): Promise<T> {
  try {
    return await importFunc()
  } catch (error) {
    if (retries > 0) {
      // Esperar um pouco antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000))
      return lazyLoadWithRetry(importFunc, retries - 1)
    }
    throw error
  }
}

/**
 * Prefetch de dados para melhorar UX
 * @param key Chave do cache
 * @param fetcher Função que busca os dados
 */
export function prefetchData<T>(
  key: string,
  fetcher: () => Promise<T>
): void {
  // Executar em background sem bloquear
  fetchWithCache(key, fetcher).catch(console.error)
}

/**
 * Otimização de imagens - retorna URL otimizada
 * @param url URL da imagem
 * @param width Largura desejada
 * @param quality Qualidade (1-100)
 */
export function optimizeImageUrl(
  url: string,
  width?: number,
  quality: number = 75
): string {
  // Se for URL do Vercel Blob, adicionar parâmetros de otimização
  if (url.includes('vercel-storage.com')) {
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    params.set('q', quality.toString())
    return `${url}?${params.toString()}`
  }
  
  return url
}

/**
 * Batch de requisições para reduzir chamadas
 */
export class RequestBatcher<T> {
  private queue: Array<{
    resolve: (value: T) => void
    reject: (error: any) => void
  }> = []
  private timer: NodeJS.Timeout | null = null
  private batchFn: (items: number) => Promise<T[]>
  private delay: number

  constructor(batchFn: (items: number) => Promise<T[]>, delay: number = 50) {
    this.batchFn = batchFn
    this.delay = delay
  }

  add(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject })

      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(() => this.flush(), this.delay)
    })
  }

  private async flush() {
    const items = this.queue.splice(0)
    if (items.length === 0) return

    try {
      const results = await this.batchFn(items.length)
      items.forEach((item, index) => {
        item.resolve(results[index])
      })
    } catch (error) {
      items.forEach(item => item.reject(error))
    }
  }
}
