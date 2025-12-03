"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react"
import { createBrowserClient } from '@supabase/ssr'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  // Criar cliente Supabase com SSR
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Verificar se há mensagem de erro ou confirmação na URL
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    const confirmedParam = searchParams.get('confirmed')
    
    if (errorParam) {
      setError(decodeURIComponent(messageParam || 'Erro ao processar autenticação'))
    }
    
    if (confirmedParam === 'true') {
      setSuccess("Email confirmado com sucesso! Faça login para continuar.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Mensagens de erro mais amigáveis e específicas
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.')
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada e spam.')
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Email inválido. Digite um email válido.')
        } else if (error.message.includes('User not found')) {
          throw new Error('Usuário não encontrado. Crie uma conta primeiro.')
        } else {
          throw new Error(`Erro ao fazer login: ${error.message}`)
        }
      }

      if (data.session && data.user) {
        setSuccess("Login realizado com sucesso! Redirecionando...")
        
        // Aguardar um pouco para garantir que a sessão foi salva
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Usar router.push em vez de window.location.href
        router.push('/dashboard')
        router.refresh() // Forçar refresh para atualizar o middleware
      } else {
        throw new Error('Erro inesperado ao fazer login. Tente novamente.')
      }
    } catch (err: any) {
      console.error('Erro completo:', err)
      setError(err.message || "Erro ao fazer login. Tente novamente.")
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validar senha
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado. Faça login ou recupere sua senha.')
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Email inválido. Digite um email válido.')
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.')
        } else {
          throw new Error(`Erro ao criar conta: ${error.message}`)
        }
      }

      if (data.user) {
        // Verificar se o email precisa ser confirmado
        if (data.user.identities && data.user.identities.length === 0) {
          setError("Este email já está cadastrado. Faça login ou recupere sua senha.")
        } else if (data.session) {
          // Se já tiver sessão (confirmação automática), redirecionar
          setSuccess("Conta criada com sucesso! Redirecionando...")
          
          // Aguardar um pouco para garantir que a sessão foi salva
          await new Promise(resolve => setTimeout(resolve, 500))
          
          router.push('/dashboard')
          router.refresh() // Forçar refresh para atualizar o middleware
        } else {
          // Se precisar confirmar email
          setSuccess("Conta criada com sucesso! Verifique seu email para confirmar o cadastro e depois faça login.")
          setIsSignUp(false)
          setEmail("")
          setPassword("")
        }
      }
    } catch (err: any) {
      console.error('Erro completo:', err)
      setError(err.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw new Error(`Erro ao enviar email: ${error.message}`)
      }

      setSuccess("Email de recuperação enviado! Verifique sua caixa de entrada.")
      setTimeout(() => {
        setIsForgotPassword(false)
        setEmail("")
      }, 3000)
    } catch (err: any) {
      console.error('Erro completo:', err)
      setError(err.message || "Erro ao enviar email de recuperação")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      console.error('Erro completo:', err)
      // Mensagem mais clara para erro de OAuth não configurado
      if (err.message?.includes('Unsupported provider') || err.message?.includes('missing OAuth secret')) {
        setError("Login com Google não está configurado. Configure o OAuth do Google no painel do Supabase (Authentication > Providers > Google) adicionando Client ID e Client Secret do Google Cloud Console.")
      } else {
        setError(err.message || "Erro ao fazer login com Google")
      }
      setLoading(false)
    }
  }

  // Renderizar formulário de recuperação de senha
  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background com gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-700/10" />
        
        {/* Efeitos de fundo */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-blue-700/20 rounded-full blur-3xl" />

        <Card className="w-full max-w-md relative z-10 shadow-2xl border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <CardHeader className="space-y-4 sm:space-y-6 text-center pb-6 sm:pb-8">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1cf5cfcf-aeb5-4917-881a-024458c3580b.webp" 
                alt="PJI ADV Logo" 
                className="h-12 sm:h-16 w-auto"
              />
            </div>
            
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Recuperar Senha
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2 text-sm sm:text-base">
                Digite seu email para receber o link de recuperação
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                  <p className="text-xs sm:text-sm text-red-400 break-words">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                  <p className="text-xs sm:text-sm text-green-400 break-words">{success}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 sm:pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium h-10 sm:h-11 shadow-lg shadow-blue-500/20 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Link de Recuperação"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm sm:text-base"
                  onClick={() => {
                    setIsForgotPassword(false)
                    setError("")
                    setSuccess("")
                  }}
                  disabled={loading}
                >
                  Voltar para o login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-700/10" />
      
      {/* Efeitos de fundo */}
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-blue-700/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <CardHeader className="space-y-4 sm:space-y-6 text-center pb-6 sm:pb-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1cf5cfcf-aeb5-4917-881a-024458c3580b.webp" 
              alt="PJI ADV Logo" 
              className="h-12 sm:h-16 w-auto"
            />
          </div>
          
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              {isSignUp ? "Criar Conta" : "Bem-vindo"}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2 text-sm sm:text-base">
              Sistema de Gestão Jurídica Integrada
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                <p className="text-xs sm:text-sm text-red-400 whitespace-pre-wrap break-words">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                <p className="text-xs sm:text-sm text-green-400 break-words">{success}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 sm:pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 sm:pl-10 pr-9 sm:pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Link de recuperação de senha - apenas no modo login */}
            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium h-10 sm:h-11 shadow-lg shadow-blue-500/20 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  isSignUp ? "Criar Conta" : "Entrar"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-500">Ou continue com</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium h-10 sm:h-11 border-gray-300 text-sm sm:text-base"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm sm:text-base"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setSuccess("")
                }}
                disabled={loading}
              >
                {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
              </Button>
            </div>
          </form>

          {/* Informação de acesso */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-[10px] sm:text-xs text-blue-400 text-center">
              💡 <strong>Primeiro acesso?</strong> Crie sua conta e confirme o email para acessar a dashboard.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800 text-center">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Versão 1.0 - Sistema Seguro e Profissional
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
