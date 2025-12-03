"use client"

import { memo } from "react"
import { Bell, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

// Componente memoizado para evitar re-renders desnecessários
export const Header = memo(function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="h-16 sm:h-20 border-b border-gray-800 bg-black flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      {/* Logo - Aumentada e responsiva */}
      <div className="flex items-center gap-3">
        <img 
          src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1cf5cfcf-aeb5-4917-881a-024458c3580b.webp" 
          alt="PJI ADV Logo" 
          className="h-12 sm:h-14 md:h-16 w-auto"
          loading="lazy"
          width={64}
          height={64}
        />
      </div>

      {/* Barra de Pesquisa - Oculta em mobile, visível em tablet+ */}
      <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input 
            placeholder="Buscar processos, clientes, tarefas..." 
            className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500 w-full"
          />
        </div>
      </div>

      {/* Ações do Usuário */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botão de busca mobile */}
        <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-900">
          <Search className="w-5 h-5 text-gray-400" />
        </Button>

        <Link href="/notificacoes" prefetch={false}>
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-900">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </Button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-gray-900">
              <User className="w-5 h-5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                  Minha Conta
                </p>
                {user && (
                  <p className="text-xs text-gray-400 break-words">{user.email}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer">
              <Link href="/configuracoes" className="w-full" prefetch={false}>
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer">
              <Link href="/suporte" className="w-full" prefetch={false}>
                Suporte
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem 
              onClick={signOut}
              className="text-red-500 cursor-pointer focus:bg-gray-800 focus:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
})
