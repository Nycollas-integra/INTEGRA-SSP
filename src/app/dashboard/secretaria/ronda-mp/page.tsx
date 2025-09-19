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
  MapPin,
  Calendar,
  User,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Save,
  X
} from '@/lib/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useCrudOperations } from '@/hooks/use-crud-operations'
import { useNotifications } from '@/components/ui/notification-manager'
import { formatDate, getStatusColor } from '@/lib/utils'

interface RondaMP {
  id: string
  endereco: string
  latitude: number
  longitude: number
  beneficiario: string
  cpf: string
  telefone: string
  validade: string
  status: 'VALIDA' | 'A_VENCER' | 'VENCIDA'
  observacoes?: string
  anexos: string[]
  createdAt: string
  updatedAt: string
}

export default function RondaMPPage() {
  const { data: session } = useSession()
  const { success, error, warning, info } = useNotifications()
  const [rondas, setRondas] = useState<RondaMP[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('view')
  const [selectedRonda, setSelectedRonda] = useState<RondaMP | null>(null)
  const [editingRonda, setEditingRonda] = useState<RondaMP | null>(null)
  const [formData, setFormData] = useState<Partial<RondaMP>>({})

  const crudOperations = useCrudOperations({
    entityName: 'Ronda MP',
    onDelete: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRondas(prev => prev.filter(ronda => ronda.id !== id))
    },
    onSave: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newRonda = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        anexos: [],
        status: calculateStatus(data.validade)
      }
      setRondas(prev => [newRonda, ...prev])
    },
    onUpdate: async (id: string, data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRondas(prev => prev.map(ronda => 
        ronda.id === id 
          ? { ...ronda, ...data, updatedAt: new Date().toISOString(), status: calculateStatus(data.validade) }
          : ronda
      ))
    }
  })

  useEffect(() => {
    // Carregar dados reais do banco de dados
    const loadData = async () => {
      try {
        setLoading(true)
        // TODO: Implementar carregamento real dos dados
        // const rondasData = await prisma.rondaMariaDaPenha.findMany()
        // setRondas(rondasData)
        setRondas([])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        error('Erro ao carregar dados das rondas MP')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const calculateStatus = (validade: string): 'VALIDA' | 'A_VENCER' | 'VENCIDA' => {
    const hoje = new Date()
    const dataValidade = new Date(validade)
    const diasRestantes = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    if (diasRestantes < 0) return 'VENCIDA'
    if (diasRestantes <= 7) return 'A_VENCER'
    return 'VALIDA'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALIDA':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'A_VENCER':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'VENCIDA':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDA':
        return 'text-green-600 bg-green-100'
      case 'A_VENCER':
        return 'text-yellow-600 bg-yellow-100'
      case 'VENCIDA':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredRondas = rondas.filter(ronda => {
    const matchesSearch = 
      ronda.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ronda.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ronda.cpf.includes(searchTerm) ||
      ronda.telefone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'TODOS' || ronda.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateRonda = () => {
    setModalType('create')
    setSelectedRonda(null)
    setEditingRonda(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEditRonda = (ronda: RondaMP) => {
    setModalType('edit')
    setSelectedRonda(null)
    setEditingRonda(ronda)
    setFormData(ronda)
    setShowModal(true)
  }

  const handleViewRonda = (ronda: RondaMP) => {
    setModalType('view')
    setSelectedRonda(ronda)
    setEditingRonda(null)
    setShowModal(true)
  }

  const handleDeleteRonda = (ronda: RondaMP) => {
    crudOperations.handleDelete(ronda.id, ronda.beneficiario)
  }

  const handleSaveRonda = () => {
    if (editingRonda) {
      crudOperations.handleSave({ ...formData, id: editingRonda.id }, true)
    } else {
      crudOperations.handleSave(formData, false)
    }
    setShowModal(false)
    setFormData({})
    setEditingRonda(null)
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({ ...prev, cpf: formatted }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, telefone: formatted }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando rondas MP...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ronda Maria da Penha</h1>
          <p className="text-gray-600 mt-1">
            Gestão de rondas preventivas para mulheres em situação de violência
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleCreateRonda} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nova Ronda
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: rondas.length, color: 'bg-blue-500' },
          { label: 'Válidas', value: rondas.filter(r => r.status === 'VALIDA').length, color: 'bg-green-500' },
          { label: 'A Vencer', value: rondas.filter(r => r.status === 'A_VENCER').length, color: 'bg-yellow-500' },
          { label: 'Vencidas', value: rondas.filter(r => r.status === 'VENCIDA').length, color: 'bg-red-500' }
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                  <MapPin className="w-6 h-6 text-white" />
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
                placeholder="Pesquisar por beneficiária, endereço, CPF ou telefone..."
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
                <option value="VALIDA">Válida</option>
                <option value="A_VENCER">A Vencer</option>
                <option value="VENCIDA">Vencida</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rondas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRondas.map((ronda) => (
          <motion.div
            key={ronda.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{ronda.beneficiario}</CardTitle>
                      <CardDescription>Ronda MP</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(ronda.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 truncate">{ronda.endereco}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{ronda.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Vence em: {formatDate(ronda.validade)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ronda.status)}`}>
                    {ronda.status}
                  </span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewRonda(ronda)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditRonda(ronda)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteRonda(ronda)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
          modalType === 'view' ? 'Detalhes da Ronda MP' :
          modalType === 'edit' ? 'Editar Ronda MP' :
          'Nova Ronda MP'
        }
        size="lg"
      >
        <div className="space-y-6">
          {modalType === 'view' && selectedRonda && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Beneficiária</label>
                  <p className="text-gray-900">{selectedRonda.beneficiario}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-gray-900">{selectedRonda.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CPF</label>
                  <p className="text-gray-900">{selectedRonda.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-gray-900">{selectedRonda.telefone}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Endereço</label>
                <p className="text-gray-900">{selectedRonda.endereco}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Validade</label>
                <p className="text-gray-900">{formatDate(selectedRonda.validade)}</p>
              </div>
              
              {selectedRonda.observacoes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Observações</label>
                  <p className="text-gray-900">{selectedRonda.observacoes}</p>
                </div>
              )}
            </div>
          )}

          {(modalType === 'edit' || modalType === 'create') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiária *</label>
                  <Input
                    value={formData.beneficiario || ''}
                    onChange={(e) => handleFormChange('beneficiario', e.target.value)}
                    placeholder="Nome completo da beneficiária"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                  <Input
                    value={formData.cpf || ''}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                  <Input
                    value={formData.telefone || ''}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validade *</label>
                  <Input
                    type="date"
                    value={formData.validade ? formData.validade.split('T')[0] : ''}
                    onChange={(e) => handleFormChange('validade', e.target.value + 'T00:00:00Z')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço *</label>
                <Input
                  value={formData.endereco || ''}
                  onChange={(e) => handleFormChange('endereco', e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => handleFormChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={3}
                  placeholder="Observações sobre a ronda..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveRonda} className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  {modalType === 'edit' ? 'Atualizar' : 'Salvar'} Ronda
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
