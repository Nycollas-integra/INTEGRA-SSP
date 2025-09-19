'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  Shield,
  Radio,
  Zap,
  Handcuffs,
  Ammunition,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Save,
  X
} from '@/lib/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useCrudOperations } from '@/hooks/use-crud-operations'
import { useNotifications } from '@/components/ui/notification-manager'
import { FileUpload } from '@/components/ui/file-upload'
import { formatDate, getStatusColor } from '@/lib/utils'

interface ItemArmaria {
  id: string
  tipo: string
  marca: string
  modelo: string
  numeroSerie?: string
  etiqueta?: string
  calibre?: string
  nivel?: string
  status: string
  alocacao: string
  observacoes?: string
  anexos: string[]
  createdAt: string
  updatedAt: string
}

interface CautelaArmaria {
  id: string
  itemId: string
  servidorId: string
  dataSaida: string
  previsaoDevolucao?: string
  condicaoEntrega: string
  responsavelEntrega: string
  dataDevolucao?: string
  condicaoRetorno?: string
  responsavelRecebimento?: string
  observacoes?: string
  anexos: string[]
  item: ItemArmaria
}

export default function ArmariaPage() {
  const { data: session } = useSession()
  const { success, error, warning } = useNotifications()
  const [activeTab, setActiveTab] = useState<'inventario' | 'cautelas' | 'historico'>('inventario')
  const [items, setItems] = useState<ItemArmaria[]>([])
  const [cautelas, setCautelas] = useState<CautelaArmaria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'item' | 'cautela' | 'devolucao' | 'edit'>('item')
  const [selectedItem, setSelectedItem] = useState<ItemArmaria | null>(null)
  const [editingItem, setEditingItem] = useState<ItemArmaria | null>(null)
  const [formData, setFormData] = useState<Partial<ItemArmaria>>({})

  const crudOperations = useCrudOperations({
    entityName: 'Item',
    onDelete: async (id: string) => {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000))
      setItems(prev => prev.filter(item => item.id !== id))
    },
    onSave: async (data: any) => {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newItem = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        anexos: []
      }
      setItems(prev => [newItem, ...prev])
    },
    onUpdate: async (id: string, data: any) => {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000))
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...data, updatedAt: new Date().toISOString() }
          : item
      ))
    }
  })

  useEffect(() => {
    // Carregar dados reais do banco de dados
    const loadData = async () => {
      try {
        setLoading(true)
        // TODO: Implementar carregamento real dos dados
        // const itemsData = await prisma.itemArmaria.findMany()
        // const cautelasData = await prisma.cautelaArmaria.findMany()
        // setItems(itemsData)
        // setCautelas(cautelasData)
        setItems([])
        setCautelas([])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        error('Erro ao carregar dados da armaria')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getTipoIcon = (tipo: string) => {
    const icons = {
      'ARMA_FOGO': Shield,
      'MUNICAO': Ammunition,
      'COLETE': Shield,
      'RADIO': Radio,
      'TASER': Zap,
      'ALGEMAS': Handcuffs,
      'OUTROS': Package
    }
    return icons[tipo as keyof typeof icons] || Package
  }

  const getTipoLabel = (tipo: string) => {
    const labels = {
      'ARMA_FOGO': 'Arma de Fogo',
      'MUNICAO': 'Munição',
      'COLETE': 'Colete Balístico',
      'RADIO': 'Rádio',
      'TASER': 'Taser',
      'ALGEMAS': 'Algemas',
      'OUTROS': 'Outros'
    }
    return labels[tipo as keyof typeof labels] || tipo
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'MANUTENCAO':
        return <Wrench className="w-4 h-4 text-yellow-500" />
      case 'BAIXADO':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredItems = items.filter(item =>
    item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.etiqueta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numeroSerie?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateItem = () => {
    setModalType('item')
    setSelectedItem(null)
    setEditingItem(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEditItem = (item: ItemArmaria) => {
    setModalType('edit')
    setSelectedItem(null)
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleViewItem = (item: ItemArmaria) => {
    setModalType('item')
    setSelectedItem(item)
    setEditingItem(null)
    setShowModal(true)
  }

  const handleCreateCautela = (item: ItemArmaria) => {
    setModalType('cautela')
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleDevolverItem = (cautela: CautelaArmaria) => {
    setModalType('devolucao')
    setSelectedItem(cautela.item)
    setShowModal(true)
  }

  const handleDeleteItem = (item: ItemArmaria) => {
    crudOperations.handleDelete(item.id, `${item.marca} ${item.modelo}`)
  }

  const handleSaveItem = () => {
    if (editingItem) {
      crudOperations.handleSave({ ...formData, id: editingItem.id }, true)
    } else {
      crudOperations.handleSave(formData, false)
    }
    setShowModal(false)
    setFormData({})
    setEditingItem(null)
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da armaria...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Armaria & Equipamentos</h1>
          <p className="text-gray-600 mt-1">
            Gestão de armas, equipamentos e cautelas
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleCreateItem} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'inventario', label: 'Inventário', count: items.length },
            { id: 'cautelas', label: 'Cautelas Ativas', count: cautelas.filter(c => !c.dataDevolucao).length },
            { id: 'historico', label: 'Histórico', count: cautelas.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Pesquisar por marca, modelo, etiqueta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'inventario' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item) => {
            const IconComponent = getTipoIcon(item.tipo)
            return (
              <Card key={item.id} className="hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.marca} {item.modelo}</CardTitle>
                        <CardDescription>{getTipoLabel(item.tipo)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Etiqueta:</p>
                      <p className="font-medium">{item.etiqueta || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Série:</p>
                      <p className="font-medium">{item.numeroSerie || 'N/A'}</p>
                    </div>
                    {item.calibre && (
                      <div>
                        <p className="text-gray-600">Calibre:</p>
                        <p className="font-medium">{item.calibre}</p>
                      </div>
                    )}
                    {item.nivel && (
                      <div>
                        <p className="text-gray-600">Nível:</p>
                        <p className="font-medium">{item.nivel}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm">Alocação:</p>
                    <p className="font-medium text-sm">{item.alocacao}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateCautela(item)}
                        disabled={item.status !== 'ATIVO'}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Cautela
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewItem(item)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditItem(item)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteItem(item)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>
      )}

      {activeTab === 'cautelas' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {cautelas.filter(c => !c.dataDevolucao).map((cautela) => (
            <Card key={cautela.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cautela.item.marca} {cautela.item.modelo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Etiqueta: {cautela.item.etiqueta} • Série: {cautela.item.numeroSerie}
                      </p>
                      <p className="text-sm text-gray-500">
                        Servidor: {cautela.servidorId} • Saída: {formatDate(cautela.dataSaida)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDevolverItem(cautela)}
                    >
                      Devolver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {activeTab === 'historico' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {cautelas.map((cautela) => (
            <Card key={cautela.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      cautela.dataDevolucao ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      <Package className={`w-6 h-6 ${
                        cautela.dataDevolucao ? 'text-green-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cautela.item.marca} {cautela.item.modelo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Servidor: {cautela.servidorId} • Responsável: {cautela.responsavelEntrega}
                      </p>
                      <p className="text-sm text-gray-500">
                        Saída: {formatDate(cautela.dataSaida)}
                        {cautela.dataDevolucao && ` • Devolução: ${formatDate(cautela.dataDevolucao)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cautela.dataDevolucao ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {cautela.dataDevolucao ? 'Devolvido' : 'Em Uso'}
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'item' ? 'Novo Item' :
          modalType === 'edit' ? 'Editar Item' :
          modalType === 'cautela' ? 'Nova Cautela' :
          'Devolver Item'
        }
        size="lg"
      >
        <div className="space-y-6">
          {modalType === 'item' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <select
                    value={formData.tipo || ''}
                    onChange={(e) => handleFormChange('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="ARMA_FOGO">Arma de Fogo</option>
                    <option value="MUNICAO">Munição</option>
                    <option value="COLETE">Colete Balístico</option>
                    <option value="RADIO">Rádio</option>
                    <option value="TASER">Taser</option>
                    <option value="ALGEMAS">Algemas</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Selecione o status</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="BAIXADO">Baixado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                  <Input
                    value={formData.marca || ''}
                    onChange={(e) => handleFormChange('marca', e.target.value)}
                    placeholder="Ex: Taurus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                  <Input
                    value={formData.modelo || ''}
                    onChange={(e) => handleFormChange('modelo', e.target.value)}
                    placeholder="Ex: PT 24/7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Série</label>
                  <Input
                    value={formData.numeroSerie || ''}
                    onChange={(e) => handleFormChange('numeroSerie', e.target.value)}
                    placeholder="Ex: ABC123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta</label>
                  <Input
                    value={formData.etiqueta || ''}
                    onChange={(e) => handleFormChange('etiqueta', e.target.value)}
                    placeholder="Ex: ARM001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calibre</label>
                  <Input
                    value={formData.calibre || ''}
                    onChange={(e) => handleFormChange('calibre', e.target.value)}
                    placeholder="Ex: .40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                  <Input
                    value={formData.nivel || ''}
                    onChange={(e) => handleFormChange('nivel', e.target.value)}
                    placeholder="Ex: IIIA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alocação *</label>
                <Input
                  value={formData.alocacao || ''}
                  onChange={(e) => handleFormChange('alocacao', e.target.value)}
                  placeholder="Ex: GCM Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => handleFormChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={3}
                  placeholder="Observações sobre o item..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anexos</label>
                <FileUpload
                  files={formData.anexos || []}
                  onFilesChange={(files) => handleFormChange('anexos', files)}
                  maxFiles={5}
                  maxSize={10}
                  acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.mp4']}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveItem} className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Item
                </Button>
              </div>
            </div>
          )}

          {modalType === 'edit' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <select
                    value={formData.tipo || ''}
                    onChange={(e) => handleFormChange('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="ARMA_FOGO">Arma de Fogo</option>
                    <option value="MUNICAO">Munição</option>
                    <option value="COLETE">Colete Balístico</option>
                    <option value="RADIO">Rádio</option>
                    <option value="TASER">Taser</option>
                    <option value="ALGEMAS">Algemas</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Selecione o status</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="BAIXADO">Baixado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                  <Input
                    value={formData.marca || ''}
                    onChange={(e) => handleFormChange('marca', e.target.value)}
                    placeholder="Ex: Taurus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                  <Input
                    value={formData.modelo || ''}
                    onChange={(e) => handleFormChange('modelo', e.target.value)}
                    placeholder="Ex: PT 24/7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Série</label>
                  <Input
                    value={formData.numeroSerie || ''}
                    onChange={(e) => handleFormChange('numeroSerie', e.target.value)}
                    placeholder="Ex: ABC123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etiqueta</label>
                  <Input
                    value={formData.etiqueta || ''}
                    onChange={(e) => handleFormChange('etiqueta', e.target.value)}
                    placeholder="Ex: ARM001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calibre</label>
                  <Input
                    value={formData.calibre || ''}
                    onChange={(e) => handleFormChange('calibre', e.target.value)}
                    placeholder="Ex: .40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                  <Input
                    value={formData.nivel || ''}
                    onChange={(e) => handleFormChange('nivel', e.target.value)}
                    placeholder="Ex: IIIA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alocação *</label>
                <Input
                  value={formData.alocacao || ''}
                  onChange={(e) => handleFormChange('alocacao', e.target.value)}
                  placeholder="Ex: GCM Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => handleFormChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={3}
                  placeholder="Observações sobre o item..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anexos</label>
                <FileUpload
                  files={formData.anexos || []}
                  onFilesChange={(files) => handleFormChange('anexos', files)}
                  maxFiles={5}
                  maxSize={10}
                  acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.mp4']}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveItem} className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Atualizar Item
                </Button>
              </div>
            </div>
          )}
          
          {modalType === 'cautela' && (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <p className="text-gray-600">Formulário de cautela será implementado aqui</p>
              <p className="text-sm text-gray-500 mt-2">
                Item: {selectedItem?.marca} {selectedItem?.modelo}
              </p>
            </div>
          )}
          
          {modalType === 'devolucao' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600">Formulário de devolução será implementado aqui</p>
              <p className="text-sm text-gray-500 mt-2">
                Item: {selectedItem?.marca} {selectedItem?.modelo}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <crudOperations.ConfirmationModalComponent />
    </div>
  )
}
