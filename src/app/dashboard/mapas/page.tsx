'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { MapPin, Layers, Filter, Download, RefreshCw } from '@/lib/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AdvancedMapContainer } from '@/components/maps/advanced-map-container'
import { MapPin as MapPinType } from '@/types'

export default function MapasPage() {
  const { data: session } = useSession()
  const [pins, setPins] = useState<MapPinType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPin, setSelectedPin] = useState<MapPinType | null>(null)

  useEffect(() => {
    // Carregar dados reais do banco de dados
    const loadData = async () => {
      try {
        setLoading(true)
        // TODO: Implementar carregamento real dos dados
        // const pinsData = await prisma.mapPin.findMany()
        // setPins(pinsData)
        setPins([])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // error('Erro ao carregar dados dos mapas')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handlePinClick = (pin: MapPinType) => {
    setSelectedPin(pin)
  }

  const handleRefresh = () => {
    setLoading(true)
    // Simular refresh
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const getPinIcon = (tipo: string) => {
    const icons = {
      'OCORRENCIA': '🚨',
      'VTR': '🚔',
      'RONDA_MP': '🏠',
      'PONTO': '👁️',
      'ABRIGO': '🏢',
      'PATRULHA': '🚶'
    }
    return icons[tipo as keyof typeof icons] || '📍'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'ATIVO': 'text-green-600 bg-green-100',
      'ABERTO': 'text-blue-600 bg-blue-100',
      'EM_ANDAMENTO': 'text-yellow-600 bg-yellow-100',
      'CONCLUIDO': 'text-green-600 bg-green-100',
      'CANCELADO': 'text-red-600 bg-red-100'
    }
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando mapas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mapas Inteligentes</h1>
          <p className="text-gray-600 mt-1">
            Visualização geográfica de ocorrências, viaturas e pontos de interesse
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mapa Principal */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-brand-500" />
                Mapa Interativo
              </CardTitle>
              <CardDescription>
                Clique nos marcadores para ver detalhes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AdvancedMapContainer
                pins={pins}
                onPinClick={handlePinClick}
                height="600px"
                showFilters={true}
                showControls={true}
                showClusters={true}
                center={[-23.5505, -46.6333]}
                zoom={13}
              />
            </CardContent>
          </Card>
        </div>

        {/* Painel de Detalhes */}
        <div className="space-y-6">
          {/* Pin Selecionado */}
          {selectedPin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">{getPinIcon(selectedPin.tipo)}</span>
                    {selectedPin.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="text-sm font-medium">{selectedPin.tipo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPin.status || '')}`}>
                      {selectedPin.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Coordenadas:</span>
                    <span className="text-xs text-gray-500">
                      {selectedPin.latitude.toFixed(4)}, {selectedPin.longitude.toFixed(4)}
                    </span>
                  </div>
                  {selectedPin.dados && (
                    <div className="pt-3 border-t">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Detalhes:</h4>
                      {Object.entries(selectedPin.dados).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Lista de Pontos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Layers className="w-5 h-5 mr-2 text-brand-500" />
                Pontos no Mapa
              </CardTitle>
              <CardDescription>
                {pins.length} pontos encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pins.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Nenhum ponto no mapa</p>
                    <p className="text-xs text-gray-500 mt-1">Os pontos aparecerão aqui quando houver dados</p>
                  </div>
                ) : (
                  pins.map((pin) => (
                    <div
                      key={pin.id}
                      onClick={() => setSelectedPin(pin)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPin?.id === pin.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getPinIcon(pin.tipo)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {pin.titulo}
                          </p>
                          <p className="text-xs text-gray-500">{pin.tipo}</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pin.status || '')}`}>
                              {pin.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total de Pontos:</span>
                <span className="text-sm font-medium">{pins.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ocorrências:</span>
                <span className="text-sm font-medium">
                  {pins.filter(p => p.tipo === 'OCORRENCIA').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Viaturas:</span>
                <span className="text-sm font-medium">
                  {pins.filter(p => p.tipo === 'VTR').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rondas MP:</span>
                <span className="text-sm font-medium">
                  {pins.filter(p => p.tipo === 'RONDA_MP').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
