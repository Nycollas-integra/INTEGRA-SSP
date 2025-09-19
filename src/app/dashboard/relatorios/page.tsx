'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Printer,
  Share2
} from '@/lib/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNotifications } from '@/components/ui/notification-manager'
import { formatDate } from '@/lib/utils'

interface Relatorio {
  id: string
  titulo: string
  descricao: string
  tipo: 'TABELA' | 'GRAFICO' | 'MAPA' | 'DASHBOARD'
  categoria: 'OCORRENCIAS' | 'USUARIOS' | 'VIATURAS' | 'ARMARIA' | 'EVENTOS' | 'GERAL'
  periodo: string
  status: 'GERANDO' | 'PRONTO' | 'ERRO'
  tamanho: string
  createdAt: string
  dados?: any
}

export default function RelatoriosPage() {
  const { data: session } = useSession()
  const { success, error, warning, info } = useNotifications()
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('TODAS')
  const [tipoFilter, setTipoFilter] = useState('TODOS')
  const [showGerarModal, setShowGerarModal] = useState(false)
  const [novoRelatorio, setNovoRelatorio] = useState<Partial<Relatorio>>({})

  useEffect(() => {
    // Carregar dados reais do banco de dados
    const loadData = async () => {
      try {
        setLoading(true)
        // TODO: Implementar carregamento real dos dados
        // const relatoriosData = await prisma.relatorio.findMany()
        // setRelatorios(relatoriosData)
        setRelatorios([])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        error('Erro ao carregar dados dos relatórios')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'TABELA':
        return <FileText className="w-5 h-5" />
      case 'GRAFICO':
        return <BarChart3 className="w-5 h-5" />
      case 'MAPA':
        return <MapPin className="w-5 h-5" />
      case 'DASHBOARD':
        return <PieChart className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'TABELA':
        return 'bg-blue-100 text-blue-600'
      case 'GRAFICO':
        return 'bg-green-100 text-green-600'
      case 'MAPA':
        return 'bg-purple-100 text-purple-600'
      case 'DASHBOARD':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getCategoriaLabel = (categoria: string) => {
    const labels = {
      'OCORRENCIAS': 'Ocorrências',
      'USUARIOS': 'Usuários',
      'VIATURAS': 'Viaturas',
      'ARMARIA': 'Armaria',
      'EVENTOS': 'Eventos',
      'GERAL': 'Geral'
    }
    return labels[categoria as keyof typeof labels] || categoria
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRONTO':
        return 'text-green-600 bg-green-100'
      case 'GERANDO':
        return 'text-yellow-600 bg-yellow-100'
      case 'ERRO':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredRelatorios = relatorios.filter(relatorio => {
    const matchesSearch = 
      relatorio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relatorio.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategoria = categoriaFilter === 'TODAS' || relatorio.categoria === categoriaFilter
    const matchesTipo = tipoFilter === 'TODOS' || relatorio.tipo === tipoFilter

    return matchesSearch && matchesCategoria && matchesTipo
  })

  const handleGerarRelatorio = () => {
    setNovoRelatorio({})
    setShowGerarModal(true)
  }

  const handleDownloadRelatorio = (relatorio: Relatorio) => {
    if (relatorio.status !== 'PRONTO') {
      warning('Relatório ainda não está pronto para download')
      return
    }
    
    success(`Download do relatório "${relatorio.titulo}" iniciado`)
    // Simular download
  }

  const handleVisualizarRelatorio = (relatorio: Relatorio) => {
    if (relatorio.status !== 'PRONTO') {
      warning('Relatório ainda não está pronto para visualização')
      return
    }
    
    info(`Visualizando relatório "${relatorio.titulo}"`)
    // Simular visualização
  }

  const handleGerarNovoRelatorio = () => {
    if (!novoRelatorio.titulo || !novoRelatorio.categoria || !novoRelatorio.tipo) {
      error('Preencha todos os campos obrigatórios')
      return
    }

    const novoRelatorioCompleto: Relatorio = {
      ...novoRelatorio,
      id: Date.now().toString(),
      status: 'GERANDO',
      tamanho: '-',
      createdAt: new Date().toISOString(),
      periodo: novoRelatorio.periodo || 'Últimos 30 dias'
    } as Relatorio

    setRelatorios(prev => [novoRelatorioCompleto, ...prev])
    setShowGerarModal(false)
    setNovoRelatorio({})
    success('Relatório em geração! Você será notificado quando estiver pronto.')

    // Simular geração do relatório
    setTimeout(() => {
      setRelatorios(prev => prev.map(r => 
        r.id === novoRelatorioCompleto.id 
          ? { ...r, status: 'PRONTO', tamanho: '1.2 MB' }
          : r
      ))
      success(`Relatório "${novoRelatorioCompleto.titulo}" está pronto!`)
    }, 5000)
  }

  const canAccessRelatorios = () => {
    const user = session?.user
    if (!user) return false
    
    return user.cargo === 'SECRETARIO' || user.cargo === 'SECRETARIO_EXECUTIVO'
  }

  if (!canAccessRelatorios()) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Apenas Secretários podem acessar os relatórios</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">
            Geração e visualização de relatórios do sistema
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleGerarRelatorio} className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: relatorios.length, color: 'bg-blue-500' },
          { label: 'Prontos', value: relatorios.filter(r => r.status === 'PRONTO').length, color: 'bg-green-500' },
          { label: 'Gerando', value: relatorios.filter(r => r.status === 'GERANDO').length, color: 'bg-yellow-500' },
          { label: 'Com Erro', value: relatorios.filter(r => r.status === 'ERRO').length, color: 'bg-red-500' }
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <select
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="TODAS">Todas as Categorias</option>
                <option value="OCORRENCIAS">Ocorrências</option>
                <option value="USUARIOS">Usuários</option>
                <option value="VIATURAS">Viaturas</option>
                <option value="ARMARIA">Armaria</option>
                <option value="EVENTOS">Eventos</option>
                <option value="GERAL">Geral</option>
              </select>
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="TODOS">Todos os Tipos</option>
                <option value="TABELA">Tabela</option>
                <option value="GRAFICO">Gráfico</option>
                <option value="MAPA">Mapa</option>
                <option value="DASHBOARD">Dashboard</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRelatorios.map((relatorio) => (
          <motion.div
            key={relatorio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getTipoColor(relatorio.tipo)} rounded-lg flex items-center justify-center`}>
                      {getTipoIcon(relatorio.tipo)}
                    </div>
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{relatorio.titulo}</CardTitle>
                      <CardDescription>{getCategoriaLabel(relatorio.categoria)}</CardDescription>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(relatorio.status)}`}>
                    {relatorio.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {relatorio.descricao}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Período:</span>
                    <span className="font-medium">{relatorio.periodo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tamanho:</span>
                    <span className="font-medium">{relatorio.tamanho}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Criado em:</span>
                    <span className="font-medium">{formatDate(relatorio.createdAt)}</span>
                  </div>
                </div>

                {relatorio.dados && (
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resumo:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(relatorio.dados).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisualizarRelatorio(relatorio)}
                      disabled={relatorio.status !== 'PRONTO'}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadRelatorio(relatorio)}
                      disabled={relatorio.status !== 'PRONTO'}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={relatorio.status !== 'PRONTO'}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={relatorio.status !== 'PRONTO'}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal de Gerar Relatório */}
      {showGerarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowGerarModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gerar Novo Relatório</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <Input
                  value={novoRelatorio.titulo || ''}
                  onChange={(e) => setNovoRelatorio(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Título do relatório"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select
                  value={novoRelatorio.categoria || ''}
                  onChange={(e) => setNovoRelatorio(prev => ({ ...prev, categoria: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Selecione a categoria</option>
                  <option value="OCORRENCIAS">Ocorrências</option>
                  <option value="USUARIOS">Usuários</option>
                  <option value="VIATURAS">Viaturas</option>
                  <option value="ARMARIA">Armaria</option>
                  <option value="EVENTOS">Eventos</option>
                  <option value="GERAL">Geral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select
                  value={novoRelatorio.tipo || ''}
                  onChange={(e) => setNovoRelatorio(prev => ({ ...prev, tipo: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="TABELA">Tabela</option>
                  <option value="GRAFICO">Gráfico</option>
                  <option value="MAPA">Mapa</option>
                  <option value="DASHBOARD">Dashboard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <Input
                  value={novoRelatorio.periodo || ''}
                  onChange={(e) => setNovoRelatorio(prev => ({ ...prev, periodo: e.target.value }))}
                  placeholder="Ex: Janeiro 2024, Últimos 30 dias"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={novoRelatorio.descricao || ''}
                  onChange={(e) => setNovoRelatorio(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={3}
                  placeholder="Descrição do relatório..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowGerarModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGerarNovoRelatorio} className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
