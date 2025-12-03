import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Variáveis de ambiente do Supabase não configuradas')
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=config_error&message=${encodeURIComponent('Configuração do Supabase ausente. Configure as variáveis de ambiente.')}`
    )
  }

  // Se houver erro na URL, redirecionar para login com mensagem
  if (error) {
    console.error('Erro no callback:', error, error_description)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=callback_error&message=${encodeURIComponent(error_description || error)}`
    )
  }

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              console.error('Erro ao definir cookie:', error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', options)
            } catch (error) {
              console.error('Erro ao remover cookie:', error)
            }
          },
        },
      }
    )
    
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Erro ao trocar código por sessão:', exchangeError)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=session_error&message=${encodeURIComponent(exchangeError.message)}`
        )
      }
      
      if (data.session) {
        console.log('Sessão criada com sucesso para usuário:', data.user?.email)
        
        // Redirecionar para dashboard após autenticação bem-sucedida
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }
      
      // Se não houver sessão, mas também não houver erro
      console.warn('Nenhuma sessão criada após troca de código')
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=no_session&message=${encodeURIComponent('Não foi possível criar sessão. Tente novamente.')}`
      )
      
    } catch (error: any) {
      console.error('Erro ao processar callback:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=callback_exception&message=${encodeURIComponent(error.message || 'Erro inesperado')}`
      )
    }
  }

  // Se não houver código nem erro, redirecionar para login
  console.warn('Callback sem código ou erro')
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
