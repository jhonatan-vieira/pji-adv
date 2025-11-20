"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Calendar, FileText, DollarSign, AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Notification {
  id: string
  type: "prazo" | "processo" | "financeiro" | "sistema"
  title: string
  message: string
  date: string
  read: boolean
  priority: "high" | "medium" | "low"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    // Mock de notificações - integrar com Supabase posteriormente
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "prazo",
        title: "Prazo Urgente",
        message: "Contestação do Processo 1000001 vence hoje às 18h",
        date: new Date().toISOString(),
        read: false,
        priority: "high"
      },
      {
        id: "2",
        type: "processo",
        title: "Novo Andamento",
        message: "Processo 1000002 teve nova movimentação",
        date: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        priority: "medium"
      },
      {
        id: "3",
        type: "financeiro",
        title: "Pagamento Recebido",
        message: "Cliente João Silva efetuou pagamento de R$ 5.000,00",
        date: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        priority: "low"
      },
      {
        id: "4",
        type: "sistema",
        title: "Atualização Disponível",
        message: "Nova versão do sistema com melhorias de segurança",
        date: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        priority: "low"
      },
    ]

    setNotifications(mockNotifications)
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "prazo":
        return <Calendar className="w-5 h-5" />
      case "processo":
        return <FileText className="w-5 h-5" />
      case "financeiro":
        return <DollarSign className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getIconColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-blue-500 bg-blue-50"
    }
  }

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex">
        <Sidebar activeModule="notificacoes" />
        
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0052CC] mb-2">
                Notificações
              </h2>
              <p className="text-[#42526E]">
                {unreadCount > 0 
                  ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? "ões" : ""} não lida${unreadCount > 1 ? "s" : ""}`
                  : "Todas as notificações foram lidas"
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setFilter(filter === "all" ? "unread" : "all")}
              >
                {filter === "all" ? "Mostrar Não Lidas" : "Mostrar Todas"}
              </Button>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  className="bg-[#0052CC] hover:bg-[#0747A6]"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar Todas como Lidas
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#42526E]">
                    {filter === "unread" 
                      ? "Nenhuma notificação não lida"
                      : "Nenhuma notificação disponível"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`transition-all cursor-pointer hover:shadow-md ${
                    !notification.read ? "border-l-4 border-l-[#0052CC]" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.priority)}`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-[#0052CC]">
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {notification.priority === "high" && (
                              <Badge variant="destructive" className="text-xs">
                                Urgente
                              </Badge>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#0052CC] rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-[#42526E] mb-2">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-400">
                          {new Date(notification.date).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
