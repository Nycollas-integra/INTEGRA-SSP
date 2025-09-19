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
  MapPin,
  Clock,
  User,
  FileText,
  Camera,
  Video,
  Paperclip,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play
} from '@/lib/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { toast } from 'react-hot-toast'
import { formatDate, getStatusColor } from '@/lib/utils'

interface Ocorrencia {
  id: string
  titulo: string
  descricao: string
  tipo: string
  status: string
  endereco: string
  latitude?: number
  longitude?: number
  criadorId: string
  criadorNome: string
  citados: string[]
  anexos: string[]
  dataOcorrencia: string
  createdAt: string
  updatedAt: string
}

export default function OcorrenciasPage() {
  const { data: session } = useSession()
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const [tipoFilter, setTipoFilter] = useState('TODOS')
  const [showModal, setShowModal] = useState(false)
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<Ocorrencia | null>(null)
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('view')

  // Dados mockados para demonstração
  const mockOcorrencias: Ocorrencia[] = [
    {
      id: '1',
      titulo: 'Distúrbio na Praça Central',
      descricao: 'Relato de aglomeração e perturbação do sossego na Praça Central. Pessoas em situação de rua causando transtornos aos comerciantes locais.',
      tipo: 'DISTURBIO_ORDEM_PUBLICA',
      status: 'ABERTA',
      endereco: 'Praça Central, Centro - São Paulo/SP',
      latitude: -23.5505,
      longitude: -46.6333,
      criadorId: '12345',
      criadorNome: 'Sgt. João Silva',
      citados: ['67890', '54321'],
      anexos: ['foto1.jpg', 'video1.mp4'],
      dataOcorrencia: '2024-01-15T14:30:00Z',
      createdAt: '2024-01-15T14:35:00Z',
      updatedAt: '2024-01-15T14:35:00Z'
    },
    {
      id: '2',
      titulo: 'Acidente de Trânsito - Rua das Flores',
      descricao: 'Colisão entre veículo e motocicleta na Rua das Flores. Vítima encaminhada ao hospital. Trânsito parcialmente interrompido.',
      tipo: 'ACIDENTE_TRANSITO',
      status: 'EM_ANDAMENTO',
      endereco: 'Rua das Flores, 123 - Centro - São Paulo/SP',
      latitude: -23.5515,
      longitude: -46.6343,
      criadorId: '67890',
      criadorNome: 'Cb. Maria Santos',
      citados: ['12345', '98765'],
      anexos: ['foto2.jpg', 'relatorio.pdf'],
      dataOcorrencia: '2024-01-15T16:45:00Z',
      createdAt: '2024-01-15T16:50:00Z',
      updatedAt: '2024-01-15T16:50:00Z'
    },
    {
      id: '3',
      titulo: 'Patrulhamento Preventivo - Centro Histórico',
      descricao: 'Ronda preventiva no centro histórico. Verificação de pontos críticos e abordagem a pessoas em situação de rua.',
      tipo: 'PATRULHAMENTO',
      status: 'CONCLUIDA',
      endereco: 'Centro Histórico - São Paulo/SP',
      latitude: -23.5495,
      longitude: -46.6323,
      criadorId: '54321',
      criadorNome: 'Sgt. Pedro Oliveira',
      citados: ['11111', '22222'],
      anexos: ['relatorio_patrulha.pdf'],
      dataOcorrencia: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:05:00Z',
      updatedAt: '2024-01-15T18:00:00Z'
    }
  ]

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setOcorrencias(mockOcorrencias)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getTipoLabel = (tipo: string) => {
    const labels = {
      'ATENDIMENTO': 'Atendimento',
      'PATRULHAMENTO': 'Patrulhamento',
      'OCORRENCIA_POLICIAL': 'Ocorrência Policial',
      'ACIDENTE_TRANSITO': 'Acidente de Trânsito',
      'DISTURBIO_ORDEM_PUBLICA': 'Distúrbio da Ordem Pública',
      'OUTROS': 'Outros'
    }
    return labels[tipo as keyof typeof labels] || tipo
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      'ATENDIMENTO': 'bg-blue-100 text-blue-800',
      'PATRULHAMENTO': 'bg-green-100 text-green-800',
      'OCORRENCIA_POLICIAL': 'bg-red-100 text-red-800',
      'ACIDENTE_TRANSITO': 'bg-orange-100 text-orange-800',
      'DISTURBIO_ORDEM_PUBLICA': 'bg-yellow-100 text-yellow-800',
      'OUTROS': 'bg-gray-100 text-gray-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'EM_ANDAMENTO':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'CONCLUIDA':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'CANCELADA':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    const matchesSearch = 
      ocorrencia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ocorrencia.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ocorrencia.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ocorrencia.criadorNome.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'TODOS' || ocorrencia.status === statusFilter
    const matchesTipo = tipoFilter === 'TODOS' || ocorrencia.tipo === tipoFilter

    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleViewOcorrencia = (ocorrencia: Ocorrencia) => {
    setSelectedOcorrencia(ocorrencia)
    setModalType('view')
    setShowModal(true)
  }

  const handleEditOcorrencia = (ocorrencia: Ocorrencia) => {
    setSelectedOcorrencia(ocorrencia)
    setModalType('edit')
    setShowModal(true)
  }

  const handleCreateOcorrencia = () => {
    setSelectedOcorrencia(null)
    setModalType('create')
    setShowModal(true)
  }

  const canCreateOcorrencia = () => {
    const user = session?.user
    if (!user) return false
    
    const allowedRoles = [
      'COMANDANTE',
      'SUBCOMANDANTE', 
      'INSPETOR_CHEFE',
      'INSPETOR',
      'COMANDANTE_GUARNICAO',
      'SECRETARIO',
      'SECRETARIO_EXECUTIVO'
    ]
    
    return allowedRoles.includes(user.cargo)
  }

  const canViewOcorrencia = (ocorrencia: Ocorrencia) => {
    const user = session?.user
    if (!user) return false
    
    // Secretários veem tudo
    if (user.cargo === 'SECRETARIO' || user.cargo === 'SECRETARIO_EXECUTIVO') {
      return true
    }
    
    // Criador vê suas ocorrências
    if (ocorrencia.criadorId === user.matricula) {
      return true
    }
    
    // Citados veem ocorrências onde foram citados
    if (ocorrencia.citados.includes(user.matricula)) {
      return true
    }
    
    return false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando ocorrências...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ocorrências GCM</h1>
          <p className="text-gray-600 mt-1">
            Gestão de ocorrências e atendimentos
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          {canCreateOcorrencia() && (
            <Button onClick={handleCreateOcorrencia} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Nova Ocorrência
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: ocorrencias.length, color: 'bg-blue-500' },
          { label: 'Abertas', value: ocorrencias.filter(o => o.status === 'ABERTA').length, color: 'bg-red-500' },
          { label: 'Em Andamento', value: ocorrencias.filter(o => o.status === 'EM_ANDAMENTO').length, color: 'bg-yellow-500' },
          { label: 'Concluídas', value: ocorrencias.filter(o => o.status === 'CONCLUIDA').length, color: 'bg-green-500' }
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
                placeholder="Pesquisar por título, descrição, endereço..."
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
                <option value="ABERTA">Aberta</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="TODOS">Todos os Tipos</option>
                <option value="ATENDIMENTO">Atendimento</option>
                <option value="PATRULHAMENTO">Patrulhamento</option>
                <option value="OCORRENCIA_POLICIAL">Ocorrência Policial</option>
                <option value="ACIDENTE_TRANSITO">Acidente de Trânsito</option>
                <option value="DISTURBIO_ORDEM_PUBLICA">Distúrbio da Ordem Pública</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ocorrências List */}
      <div className="space-y-4">
        {filteredOcorrencias
          .filter(ocorrencia => canViewOcorrencia(ocorrencia))
          .map((ocorrencia) => (
          <motion.div
            key={ocorrencia.id}
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
                        {getStatusIcon(ocorrencia.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ocorrencia.titulo}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(ocorrencia.tipo)}`}>
                        {getTipoLabel(ocorrencia.tipo)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ocorrencia.status)}`}>
                        {ocorrencia.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {ocorrencia.descricao}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{ocorrencia.endereco}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{ocorrencia.criadorNome}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(ocorrencia.dataOcorrencia)}</span>
                      </div>
                    </div>
                    
                    {ocorrencia.anexos.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {ocorrencia.anexos.length} anexo(s)
                        </span>
                        {ocorrencia.anexos.some(anexo => anexo.includes('.mp4')) && (
                          <Video className="w-4 h-4 text-red-500" />
                        )}
                        {ocorrencia.anexos.some(anexo => anexo.includes('.jpg') || anexo.includes('.png')) && (
                          <Camera className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOcorrencia(ocorrencia)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {canCreateOcorrencia() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditOcorrencia(ocorrencia)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
          modalType === 'view' ? 'Detalhes da Ocorrência' :
          modalType === 'edit' ? 'Editar Ocorrência' :
          'Nova Ocorrência'
        }
        size="xl"
      >
        <div className="space-y-6">
          {modalType === 'view' && selectedOcorrencia && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Título</label>
                  <p className="text-gray-900">{selectedOcorrencia.titulo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-gray-900">{selectedOcorrencia.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <p className="text-gray-900">{getTipoLabel(selectedOcorrencia.tipo)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Criado por</label>
                  <p className="text-gray-900">{selectedOcorrencia.criadorNome}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <p className="text-gray-900 mt-1">{selectedOcorrencia.descricao}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Endereço</label>
                <p className="text-gray-900">{selectedOcorrencia.endereco}</p>
              </div>
              
              {selectedOcorrencia.anexos.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Anexos</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedOcorrencia.anexos.map((anexo, index) => (
                      <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{anexo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {(modalType === 'edit' || modalType === 'create') && (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Formulário de {modalType === 'create' ? 'criação' : 'edição'} será implementado aqui</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
