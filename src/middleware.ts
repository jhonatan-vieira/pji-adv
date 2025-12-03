import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se as variáveis de ambiente estão configuradas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Variáveis de ambiente do Supabase não configuradas no middleware')
    // Permitir acesso à página de login mesmo sem configuração
    if (pathname.startsWith('/auth')) {
      return NextResponse.next()
    }
    // Redirecionar para login se tentar acessar outras páginas
    if (pathname !== '/auth/login') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isAuthPage = pathname.startsWith('/auth')
    const isAuthCallback = pathname === '/auth/callback'
    const isDashboard = pathname.startsWith('/dashboard')
    const isAdmin = pathname.startsWith('/admin')
    const isHomePage = pathname === '/'

    // SEMPRE permitir acesso ao callback (crítico para OAuth)
    if (isAuthCallback) {
      return response
    }

    // Se estiver na home page, redirecionar baseado na autenticação
    if (isHomePage) {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // Se não houver sessão e tentar acessar dashboard ou admin, redirecionar para login
    if (!session && (isDashboard || isAdmin)) {
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Se houver sessão e tentar acessar páginas de auth (exceto callback), redirecionar para dashboard
    if (session && isAuthPage && !isAuthCallback) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Em caso de erro, permitir acesso à página de login
    if (pathname.startsWith('/auth')) {
      return NextResponse.next()
    }
    // Evitar loop: não redirecionar se já estiver indo para login
    if (pathname !== '/auth/login') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (RSC data fetching - CRÍTICO!)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|_next/data|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
}
