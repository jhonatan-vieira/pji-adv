import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

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
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // Ignorar erros de cookie em middleware
              console.error('Erro ao definir cookie:', error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', options)
            } catch (error) {
              // Ignorar erros de cookie em middleware
              console.error('Erro ao remover cookie:', error)
            }
          },
        },
      }
    )
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Erro ao trocar código por sessão:', error)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=session_error&message=${encodeURIComponent(error.message)}`
        )
      }
      
      if (data.session) {
        console.log('Sessão criada com sucesso para usuário:', data.user?.email)
        
        // Criar resposta de redirecionamento
        const response = NextResponse.redirect(`${requestUrl.origin}/?confirmed=true`)
        
        // Garantir que os cookies de sessão sejam definidos
        const sessionCookies = [
          { name: 'sb-access-token', value: data.session.access_token },
          { name: 'sb-refresh-token', value: data.session.refresh_token },
        ]
        
        sessionCookies.forEach(({ name, value }) => {
          response.cookies.set(name, value, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        })
        
        return response
      }
      
      // Se não houver sessão, mas também não houver erro
      console.warn('Nenhuma sessão criada após troca de código')
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=no_session&message=${encodeURIComponent('Não foi possível criar sessão. Tente fazer login novamente.')}`
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
