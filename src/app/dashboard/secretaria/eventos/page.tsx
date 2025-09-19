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
  Calendar,
  MapPin,
  Users,
  Clock,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause
} from '@/lib/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useCrudOperations } from '@/hooks/use-crud-operations'
import { useNotifications } from '@/components/ui/notification-manager'
import { formatDate, getStatusColor } from '@/lib/utils'

interface Evento {
  id: string
  titulo: string
  descricao: string
  dataInicio: string
  dataFim?: string
  local: string
  tipo: 'REUNIAO' | 'TREINAMENTO' | 'CERIMONIA' | 'OUTROS'
  status: 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  anexos: string[]
  publico: string[]
  createdAt: string
  updatedAt: string
}

export default function EventosPage() {
  const { data: session } = useSession()
  const { success, error, warning, info } = useNotifications()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const [tipoFilter, setTipoFilter] = useState('TODOS')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('view')
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null)
  const [formData, setFormData] = useState<Partial<Evento>>({})

  const crudOperations = useCrudOperations({
    entityName: 'Evento',
    onDelete: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEventos(prev => prev.filter(evento => evento.id !== id))
    },
    onSave: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newEvento = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        anexos: [],
        publico: [],
        status: 'AGENDADO'
      }
      setEventos(prev => [newEvento, ...prev])
    },
    onUpdate: async (id: string, data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEventos(prev => prev.map(evento => 
        evento.id === id 
          ? { ...evento, ...data, updatedAt: new Date().toISOString() }
          : evento
      ))
    }
  })

  useEffect(() => {
    // Carregar dados reais do banco de dados
    const loadData = async () => {
      try {
        setLoading(true)
        // TODO: Implementar carregamento real dos dados
        // const eventosData = await prisma.evento.findMany()
        // setEventos(eventosData)
        setEventos([])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        error('Erro ao carregar dados dos eventos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getTipoLabel = (tipo: string) => {
    const labels = {
      'REUNIAO': 'Reunião',
      'TREINAMENTO': 'Treinamento',
      'CERIMONIA': 'Cerimônia',
      'OUTROS': 'Outros'
    }
    return labels[tipo as keyof typeof labels] || tipo
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      'REUNIAO': 'bg-blue-100 text-blue-800',
      'TREINAMENTO': 'bg-green-100 text-green-800',
      'CERIMONIA': 'bg-purple-100 text-purple-800',
      'OUTROS': 'bg-gray-100 text-gray-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'EM_ANDAMENTO':
        return <Play className="w-4 h-4 text-yellow-500" />
      case 'CONCLUIDO':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'CANCELADO':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = 
      evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.local.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'TODOS' || evento.status === statusFilter
    const matchesTipo = tipoFilter === 'TODOS' || evento.tipo === tipoFilter

    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleCreateEvento = () => {
    setModalType('create')
    setSelectedEvento(null)
    setEditingEvento(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEditEvento = (evento: Evento) => {
    setModalType('edit')
    setSelectedEvento(null)
    setEditingEvento(evento)
    setFormData(evento)
    setShowModal(true)
  }

  const handleViewEvento = (evento: Evento) => {
    setModalType('view')
    setSelectedEvento(evento)
    setEditingEvento(null)
    setShowModal(true)
  }

  const handleDeleteEvento = (evento: Evento) => {
    crudOperations.handleDelete(evento.id, evento.titulo)
  }

  const handleSaveEvento = () => {
    if (editingEvento) {
      crudOperations.handleSave({ ...formData, id: editingEvento.id }, true)
    } else {
      crudOperations.handleSave(formData, false)
    }
    setShowModal(false)
    setFormData({})
    setEditingEvento(null)
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canManageEventos = () => {
    const user = session?.user
    if (!user) return false
    
    return user.cargo === 'SECRETARIO' || 
           user.cargo === 'SECRETARIO_EXECUTIVO' || 
           user.cargo === 'ASSESSOR_ADMINISTRATIVO'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos Institucionais</h1>
          <p className="text-gray-600 mt-1">
            Gestão de eventos, reuniões e cerimônias
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          {canManageEventos() && (
            <Button onClick={handleCreateEvento} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: eventos.length, color: 'bg-blue-500' },
          { label: 'Agendados', value: eventos.filter(e => e.status === 'AGENDADO').length, color: 'bg-blue-500' },
          { label: 'Em Andamento', value: eventos.filter(e => e.status === 'EM_ANDAMENTO').length, color: 'bg-yellow-500' },
          { label: 'Concluídos', value: eventos.filter(e => e.status === 'CONCLUIDO').length, color: 'bg-green-500' }
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                  <Calendar className="w-6 h-6 text-white" />
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
                placeholder="Pesquisar por título, descrição ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="AGENDADO">Agendado</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="TODOS">Todos os Tipos</option>
                <option value="REUNIAO">Reunião</option>
                <option value="TREINAMENTO">Treinamento</option>
                <option value="CERIMONIA">Cerimônia</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eventos List */}
      <div className="space-y-4">
        {filteredEventos.map((evento) => (
          <motion.div
            key={evento.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(evento.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {evento.titulo}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(evento.tipo)}`}>
                        {getTipoLabel(evento.tipo)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(evento.status)}`}>
                        {evento.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {evento.descricao}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{evento.local}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(evento.dataInicio)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{evento.publico.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEvento(evento)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {canManageEventos() && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEvento(evento)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvento(evento)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'view' ? 'Detalhes do Evento' :
          modalType === 'edit' ? 'Editar Evento' :
          'Novo Evento'
        }
        size="lg"
      >
        <div className="space-y-6">
          {modalType === 'view' && selectedEvento && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Título</label>
                  <p className="text-gray-900">{selectedEvento.titulo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <p className="text-gray-900">{getTipoLabel(selectedEvento.tipo)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-gray-900">{selectedEvento.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Local</label>
                  <p className="text-gray-900">{selectedEvento.local}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <p className="text-gray-900">{selectedEvento.descricao}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Data de Início</label>
                  <p className="text-gray-900">{formatDate(selectedEvento.dataInicio)}</p>
                </div>
                {selectedEvento.dataFim && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data de Fim</label>
                    <p className="text-gray-900">{formatDate(selectedEvento.dataFim)}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Público-Alvo</label>
                <p className="text-gray-900">{selectedEvento.publico.join(', ')}</p>
              </div>
            </div>
          )}

          {(modalType === 'edit' || modalType === 'create') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <Input
                  value={formData.titulo || ''}
                  onChange={(e) => handleFormChange('titulo', e.target.value)}
                  placeholder="Título do evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                <textarea
                  value={formData.descricao || ''}
                  onChange={(e) => handleFormChange('descricao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={3}
                  placeholder="Descrição do evento..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <select
                    value={formData.tipo || ''}
                    onChange={(e) => handleFormChange('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="REUNIAO">Reunião</option>
                    <option value="TREINAMENTO">Treinamento</option>
                    <option value="CERIMONIA">Cerimônia</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status || 'AGENDADO'}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="AGENDADO">Agendado</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Local *</label>
                <Input
                  value={formData.local || ''}
                  onChange={(e) => handleFormChange('local', e.target.value)}
                  placeholder="Local do evento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
                  <Input
                    type="datetime-local"
                    value={formData.dataInicio ? formData.dataInicio.slice(0, 16) : ''}
                    onChange={(e) => handleFormChange('dataInicio', e.target.value + ':00Z')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
                  <Input
                    type="datetime-local"
                    value={formData.dataFim ? formData.dataFim.slice(0, 16) : ''}
                    onChange={(e) => handleFormChange('dataFim', e.target.value + ':00Z')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Público-Alvo *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['SECRETARIA', 'GCM_BY', 'DEFESA_CIVIL', 'VIGILANCIA_PATRIMONIAL', 'TODOS'].map((publico) => (
                    <label key={publico} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.publico?.includes(publico) || false}
                        onChange={(e) => {
                          const currentPublico = formData.publico || []
                          if (e.target.checked) {
                            handleFormChange('publico', [...currentPublico, publico])
                          } else {
                            handleFormChange('publico', currentPublico.filter(p => p !== publico))
                          }
                        }}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-700">{publico}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEvento} className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  {modalType === 'edit' ? 'Atualizar' : 'Salvar'} Evento
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <crudOperations.ConfirmationModalComponent />
    </div>
  )
}
