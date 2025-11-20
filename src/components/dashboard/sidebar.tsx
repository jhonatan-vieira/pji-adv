"use client"

import { useState } from "react"
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
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeModule?: string
}

export function Sidebar({ activeModule = "dashboard" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null, href: "/" },
    { id: "processos", icon: FileText, label: "Processos", badge: "12", href: "/processos" },
    { id: "clientes", icon: Users, label: "Clientes", badge: null, href: "/clientes" },
    { id: "tarefas", icon: Calendar, label: "Tarefas & Prazos", badge: "5", href: "/tarefas" },
    { id: "financeiro", icon: DollarSign, label: "Financeiro", badge: null, href: "/financeiro" },
    { id: "calculos", icon: Calculator, label: "Cálculos", badge: null, href: "/calculos" },
    { id: "relatorios", icon: BarChart3, label: "Relatórios", badge: null, href: "/relatorios" },
    { id: "notificacoes", icon: Bell, label: "Notificações", badge: "3", href: "/notificacoes" },
  ]

  const bottomItems = [
    { id: "suporte", icon: MessageSquare, label: "Suporte", href: "/suporte" },
    { id: "configuracoes", icon: Settings, label: "Configurações", href: "/configuracoes" },
  ]

  return (
    <aside 
      className={cn(
        "h-[calc(100vh-4rem)] bg-black border-r border-gray-800 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activeModule
          
          return (
            <Link key={item.id} href={item.href}>
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
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon
          const isActive = item.id === activeModule
          
          return (
            <Link key={item.id} href={item.href}>
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
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              </Button>
            </Link>
          )
        })}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-9 text-gray-400 hover:bg-gray-900 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </aside>
  )
}
