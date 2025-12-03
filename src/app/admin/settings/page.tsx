"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Settings, 
  ArrowLeft,
  Save,
  Globe,
  Mail,
  Bell,
  Lock,
  Database,
  Palette,
  CheckCircle
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "PJI ADV",
    siteUrl: "https://pjiadv.com",
    adminEmail: "admin@pjiadv.com",
    supportEmail: "suporte@pjiadv.com",
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    primaryColor: "#0052CC",
    secondaryColor: "#36B37E"
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/auth/login')
        return
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      router.push('/auth/login')
    }
  }

  const handleSave = async () => {
    // Implementar salvamento via Supabase
    console.log("Salvar configurações:", settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#42526E] font-medium">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar activeModule="admin" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin')}
              className="mb-4 text-[#42526E] hover:text-[#0052CC]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-[#0052CC]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0052CC]">
                Configurações do Sistema
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#42526E]">
              Gerencie as configurações gerais da aplicação
            </p>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                Configurações salvas com sucesso!
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configurações Gerais */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#0052CC]" />
                  <CardTitle className="text-lg text-[#0052CC]">Configurações Gerais</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Nome do Sistema</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="siteUrl">URL do Sistema</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="adminEmail">Email do Administrador</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#0052CC]" />
                  <CardTitle className="text-lg text-[#0052CC]">Notificações</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações por Email</Label>
                    <p className="text-xs text-[#42526E]">Receber alertas por email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações Push</Label>
                    <p className="text-xs text-[#42526E]">Alertas no navegador</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#0052CC]" />
                  <CardTitle className="text-lg text-[#0052CC]">Segurança</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-xs text-[#42526E]">Segurança adicional no login</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Manutenção</Label>
                    <p className="text-xs text-[#42526E]">Desabilitar acesso temporariamente</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Backup */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#0052CC]" />
                  <CardTitle className="text-lg text-[#0052CC]">Backup</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Automático</Label>
                    <p className="text-xs text-[#42526E]">Backup periódico dos dados</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="backupFrequency">Frequência de Backup</Label>
                  <select
                    id="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="hourly">A cada hora</option>
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="monthly">Mensalmente</option>
                  </select>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Fazer Backup Agora
                </Button>
              </CardContent>
            </Card>

            {/* Aparência */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#0052CC]" />
                  <CardTitle className="text-lg text-[#0052CC]">Aparência</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-[#0052CC] hover:bg-[#0747A6] text-white px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
