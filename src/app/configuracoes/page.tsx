"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

const Header = dynamic(() => import("@/components/dashboard/header").then(mod => ({ default: mod.Header })))
const Sidebar = dynamic(() => import("@/components/dashboard/sidebar").then(mod => ({ default: mod.Sidebar })))

export default function ConfiguracoesPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar activeModule="configuracoes" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0052CC] mb-2">
              Configurações
            </h1>
            <p className="text-sm sm:text-base text-[#42526E]">
              Gerencie suas preferências e configurações do sistema
            </p>
          </div>

          {/* Tabs de Configurações */}
          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-white p-1 rounded-lg">
              <TabsTrigger value="perfil" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="notificacoes" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="seguranca" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="aparencia" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Aparência</span>
              </TabsTrigger>
              <TabsTrigger value="sistema" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Sistema</span>
              </TabsTrigger>
            </TabsList>

            {/* Perfil */}
            <TabsContent value="perfil" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações de perfil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" placeholder="Seu nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oab">OAB</Label>
                      <Input id="oab" placeholder="OAB/UF 000000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <textarea 
                      id="bio"
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>
                  <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notificações */}
            <TabsContent value="notificacoes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Preferências de Notificações</CardTitle>
                  <CardDescription>Escolha como deseja receber notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notif">Notificações por E-mail</Label>
                      <p className="text-sm text-[#42526E]">Receba atualizações importantes por e-mail</p>
                    </div>
                    <Switch 
                      id="email-notif"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notif">Notificações Push</Label>
                      <p className="text-sm text-[#42526E]">Receba notificações no navegador</p>
                    </div>
                    <Switch 
                      id="push-notif"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-4 text-[#0052CC]">Tipos de Notificações</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="prazos">Prazos e Audiências</Label>
                        <Switch id="prazos" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="processos">Atualizações de Processos</Label>
                        <Switch id="processos" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="financeiro">Movimentações Financeiras</Label>
                        <Switch id="financeiro" defaultChecked />
                      </div>
                    </div>
                  </div>
                  <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Segurança */}
            <TabsContent value="seguranca" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Segurança da Conta</CardTitle>
                  <CardDescription>Gerencie a segurança da sua conta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha-atual">Senha Atual</Label>
                      <Input id="senha-atual" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nova-senha">Nova Senha</Label>
                      <Input id="nova-senha" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                      <Input id="confirmar-senha" type="password" />
                    </div>
                    <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                      Alterar Senha
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Autenticação de Dois Fatores</Label>
                        <p className="text-sm text-[#42526E]">Adicione uma camada extra de segurança</p>
                      </div>
                      <Switch 
                        id="2fa"
                        checked={twoFactor}
                        onCheckedChange={setTwoFactor}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aparência */}
            <TabsContent value="aparencia" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Personalização</CardTitle>
                  <CardDescription>Customize a aparência do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                          <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded"></div>
                          <span className="text-xs">Claro</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2 border-[#0052CC]">
                          <div className="w-8 h-8 bg-gray-900 border-2 border-[#0052CC] rounded"></div>
                          <span className="text-xs">Escuro</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-900 border-2 border-gray-300 rounded"></div>
                          <span className="text-xs">Auto</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Aparência
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sistema */}
            <TabsContent value="sistema" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0052CC]">Configurações do Sistema</CardTitle>
                  <CardDescription>Preferências gerais do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idioma">Idioma</Label>
                      <select 
                        id="idioma"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                      >
                        <option>Português (Brasil)</option>
                        <option>English</option>
                        <option>Español</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuso">Fuso Horário</Label>
                      <select 
                        id="fuso"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                      >
                        <option>América/São Paulo (GMT-3)</option>
                        <option>América/Manaus (GMT-4)</option>
                        <option>América/Rio_Branco (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                  <Button className="bg-[#0052CC] hover:bg-[#0747A6]">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
