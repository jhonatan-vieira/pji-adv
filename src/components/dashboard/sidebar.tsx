"use client"

import { useState, memo, useCallback } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  Calculator,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bell,
  MessageSquare,
  Shield,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeModule?: string
}

// Componente de item de menu memoizado
const MenuItem = memo(({ 
  item, 
  isActive, 
  collapsed,
  onClick
}: { 
  item: any
  isActive: boolean
  collapsed: boolean
  onClick?: () => void
}) => {
  const Icon = item.icon
  
  return (
    <Link href={item.href} prefetch={false} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 h-11 transition-all duration-200",
          isActive 
            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg shadow-blue-500/20" 
            : "text-gray-400 hover:bg-gray-900 hover:text-white",
          collapsed && "justify-center"
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-blue-500 text-white"
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </Button>
    </Link>
  )
})
MenuItem.displayName = "MenuItem"

export const Sidebar = memo(function Sidebar({ activeModule = "dashboard" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Memoizar toggle para evitar re-criação
  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null, href: "/dashboard" },
    { id: "processos", icon: FileText, label: "Processos", badge: "12", href: "/processos" },
    { id: "clientes", icon: Users, label: "Clientes", badge: null, href: "/clientes" },
    { id: "tarefas", icon: Calendar, label: "Tarefas & Prazos", badge: "5", href: "/tarefas" },
    { id: "financeiro", icon: DollarSign, label: "Financeiro", badge: null, href: "/financeiro" },
    { id: "calculos", icon: Calculator, label: "Cálculos", badge: null, href: "/calculos" },
    { id: "relatorios", icon: BarChart3, label: "Relatórios", badge: null, href: "/relatorios" },
    { id: "notificacoes", icon: Bell, label: "Notificações", badge: "3", href: "/notificacoes" },
  ]

  const bottomItems = [
    { id: "admin", icon: Shield, label: "Admin", href: "/admin" },
    { id: "suporte", icon: MessageSquare, label: "Suporte", href: "/suporte" },
    { id: "configuracoes", icon: Settings, label: "Configurações", href: "/configuracoes" },
  ]

  return (
    <>
      {/* Botão Mobile Menu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobile}
        className="fixed bottom-4 right-4 z-50 lg:hidden bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Overlay Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-black border-r border-gray-800 transition-all duration-300 flex flex-col",
          "fixed lg:relative z-40",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isActive={item.id === activeModule}
              collapsed={collapsed}
              onClick={closeMobile}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          {bottomItems.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isActive={item.id === activeModule}
              collapsed={collapsed}
              onClick={closeMobile}
            />
          ))}
          
          {/* Botão de colapsar - apenas desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="hidden lg:flex w-full h-9 text-gray-400 hover:bg-gray-900 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>
    </>
  )
})
