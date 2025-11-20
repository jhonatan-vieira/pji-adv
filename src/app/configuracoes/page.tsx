"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Upload, Save, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface OfficeSettings {
  office_name: string
  address: string
  oab_number: string
  logo_url: string
}

interface DocumentTemplate {
  id?: string
  template_type: 'procuracao' | 'contrato'
  template_name: string
  template_content: string
}

export default function ConfiguracoesPage() {
  const [officeSettings, setOfficeSettings] = useState<OfficeSettings>({
    office_name: '',
    address: '',
    oab_number: '',
    logo_url: ''
  })
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")

  useEffect(() => {
    loadOfficeSettings()
    loadTemplates()
  }, [])

  const loadOfficeSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('law_office_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setOfficeSettings(data)
      setLogoPreview(data.logo_url)
    }
  }

  const loadTemplates = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('user_id', user.id)

    if (!error && data) {
      setTemplates(data)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadLogo = async () => {
    if (!logoFile) return officeSettings.logo_url

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const fileExt = logoFile.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('office-logos')
      .upload(fileName, logoFile)

    if (error) {
      console.error('Erro ao fazer upload:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('office-logos')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const saveOfficeSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      let logoUrl = officeSettings.logo_url
      if (logoFile) {
        const uploadedUrl = await uploadLogo()
        if (uploadedUrl) {
          logoUrl = uploadedUrl
        }
      }

      const { error } = await supabase
        .from('law_office_settings')
        .upsert({
          user_id: user.id,
          office_name: officeSettings.office_name,
          address: officeSettings.address,
          oab_number: officeSettings.oab_number,
          logo_url: logoUrl,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setSuccess("Configurações salvas com sucesso!")
      setOfficeSettings({ ...officeSettings, logo_url: logoUrl })
      setLogoFile(null)
    } catch (err: any) {
      setError(err.message || "Erro ao salvar configurações")
    } finally {
      setLoading(false)
    }
  }

  const saveTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      if (selectedTemplate.id) {
        // Atualizar template existente
        const { error } = await supabase
          .from('document_templates')
          .update({
            template_name: selectedTemplate.template_name,
            template_content: selectedTemplate.template_content,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTemplate.id)

        if (error) throw error
      } else {
        // Criar novo template
        const { error } = await supabase
          .from('document_templates')
          .insert({
            user_id: user.id,
            template_type: selectedTemplate.template_type,
            template_name: selectedTemplate.template_name,
            template_content: selectedTemplate.template_content
          })

        if (error) throw error
      }

      setSuccess("Template salvo com sucesso!")
      loadTemplates()
      setSelectedTemplate(null)
    } catch (err: any) {
      setError(err.message || "Erro ao salvar template")
    } finally {
      setLoading(false)
    }
  }

  const createNewTemplate = (type: 'procuracao' | 'contrato') => {
    setSelectedTemplate({
      template_type: type,
      template_name: '',
      template_content: type === 'procuracao' 
        ? `PROCURAÇÃO

Por este instrumento particular de procuração, [NOME_CLIENTE], [NACIONALIDADE], [ESTADO_CIVIL], [PROFISSAO], portador(a) do RG nº [RG_CLIENTE] e CPF nº [CPF_CLIENTE], residente e domiciliado(a) à [ENDERECO_CLIENTE],

NOMEIA E CONSTITUI

seu(sua) bastante procurador(a) o(a) advogado(a) ${officeSettings.office_name || '[NOME_ESCRITORIO]'}, inscrito(a) na OAB sob o nº ${officeSettings.oab_number || '[OAB]'}, com escritório à ${officeSettings.address || '[ENDERECO_ESCRITORIO]'},

PODERES:

Para o foro em geral, com poderes especiais para [ESPECIFICAR_PODERES], podendo substabelecer esta procuração no todo ou em parte, com ou sem reserva de iguais poderes.

[CIDADE], [DATA]

_________________________________
[NOME_CLIENTE]
Outorgante`
        : `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: [NOME_CLIENTE], [NACIONALIDADE], [ESTADO_CIVIL], [PROFISSAO], portador(a) do RG nº [RG_CLIENTE] e CPF nº [CPF_CLIENTE], residente e domiciliado(a) à [ENDERECO_CLIENTE].

CONTRATADO: ${officeSettings.office_name || '[NOME_ESCRITORIO]'}, inscrito(a) na OAB sob o nº ${officeSettings.oab_number || '[OAB]'}, com escritório à ${officeSettings.address || '[ENDERECO_ESCRITORIO]'}.

OBJETO: Prestação de serviços advocatícios relacionados a [DESCREVER_SERVICOS].

HONORÁRIOS: [VALOR_HONORARIOS]

PRAZO: [PRAZO_CONTRATO]

[CIDADE], [DATA]

_________________________________          _________________________________
CONTRATANTE                                CONTRATADO`
    })
  }

  return (
    <DashboardLayout activeModule="configuracoes">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 mt-1">Configure os dados do seu escritório e templates de documentos</p>
        </div>

        {success && (
          <div className="p-4 rounded-lg flex items-center gap-3 bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg flex items-center gap-3 bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Tabs defaultValue="escritorio" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="escritorio" className="data-[state=active]:bg-blue-500">
              <Building2 className="w-4 h-4 mr-2" />
              Dados do Escritório
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-blue-500">
              <FileText className="w-4 h-4 mr-2" />
              Templates de Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="escritorio">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Informações do Escritório</CardTitle>
                <CardDescription>
                  Configure os dados que serão utilizados em documentos e relatórios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveOfficeSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="office_name" className="text-gray-300">Nome do Escritório</Label>
                      <Input
                        id="office_name"
                        value={officeSettings.office_name}
                        onChange={(e) => setOfficeSettings({ ...officeSettings, office_name: e.target.value })}
                        placeholder="Ex: Silva & Advogados Associados"
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="oab_number" className="text-gray-300">Número OAB</Label>
                      <Input
                        id="oab_number"
                        value={officeSettings.oab_number}
                        onChange={(e) => setOfficeSettings({ ...officeSettings, oab_number: e.target.value })}
                        placeholder="Ex: 123456/SP"
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-300">Endereço Completo</Label>
                    <Textarea
                      id="address"
                      value={officeSettings.address}
                      onChange={(e) => setOfficeSettings({ ...officeSettings, address: e.target.value })}
                      placeholder="Rua, número, complemento, bairro, cidade, estado, CEP"
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-gray-300">Logo do Escritório</Label>
                    <div className="flex items-center gap-4">
                      {logoPreview && (
                        <div className="w-32 h-32 border-2 border-gray-700 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                          <img 
                            src={logoPreview} 
                            alt="Logo" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          A logo será incluída automaticamente em todos os documentos gerados
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Templates</h3>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => createNewTemplate('procuracao')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Nova Procuração
                  </Button>
                  <Button
                    onClick={() => createNewTemplate('contrato')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Novo Contrato
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                  <h4 className="text-sm font-medium text-gray-400">Meus Templates</h4>
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`bg-gray-900 border-gray-800 cursor-pointer transition-all hover:border-blue-500 ${
                        selectedTemplate?.id === template.id ? 'border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {template.template_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {template.template_type === 'procuracao' ? 'Procuração' : 'Contrato'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                {selectedTemplate ? (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {selectedTemplate.id ? 'Editar Template' : 'Novo Template'}
                      </CardTitle>
                      <CardDescription>
                        Use variáveis como [NOME_CLIENTE], [CPF_CLIENTE], [ENDERECO_CLIENTE] que serão substituídas automaticamente
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={saveTemplate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="template_name" className="text-gray-300">Nome do Template</Label>
                          <Input
                            id="template_name"
                            value={selectedTemplate.template_name}
                            onChange={(e) => setSelectedTemplate({ 
                              ...selectedTemplate, 
                              template_name: e.target.value 
                            })}
                            placeholder="Ex: Procuração Padrão"
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="template_content" className="text-gray-300">Conteúdo</Label>
                          <Textarea
                            id="template_content"
                            value={selectedTemplate.template_content}
                            onChange={(e) => setSelectedTemplate({ 
                              ...selectedTemplate, 
                              template_content: e.target.value 
                            })}
                            className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
                            rows={20}
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Salvando..." : "Salvar Template"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedTemplate(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-12 text-center">
                      <FileText className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400">Selecione um template ou crie um novo</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
