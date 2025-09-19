'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileText, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  Shield,
  Car,
  Eye
} from '@/lib/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getLotacaoColor, getLotacaoLabel } from '@/lib/utils'

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const user = session.user
  const isSecretario = user.cargo === 'SECRETARIO' || user.cargo === 'SECRETARIO_EXECUTIVO'

  const stats = [
    {
      title: 'Usuários Ativos',
      value: '0',
      change: '0%',
      changeType: 'neutral' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Ocorrências Hoje',
      value: '0',
      change: '0%',
      changeType: 'neutral' as const,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Viaturas em Uso',
      value: '0',
      change: '0%',
      changeType: 'neutral' as const,
      icon: Car,
      color: 'bg-orange-500'
    },
    {
      title: 'Pontos Monitorados',
      value: '0',
      change: '0%',
      changeType: 'neutral' as const,
      icon: MapPin,
      color: 'bg-purple-500'
    }
  ]

  const recentActivities: any[] = []

  const quickActions = [
    {
      title: 'Nova Ocorrência',
      description: 'Registrar nova ocorrência',
      href: '/dashboard/gcm/ocorrencias',
      icon: FileText,
      color: 'bg-blue-500',
      show: user.lotacao === 'GCM_BY' || isSecretario
    },
    {
      title: 'Ver Mapas',
      description: 'Acessar mapas interativos',
      href: '/dashboard/mapas',
      icon: MapPin,
      color: 'bg-green-500',
      show: true
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios',
      href: '/dashboard/relatorios',
      icon: TrendingUp,
      color: 'bg-purple-500',
      show: isSecretario
    },
    {
      title: 'Agenda',
      description: 'Ver agenda institucional',
      href: '/dashboard/secretaria/agenda',
      icon: Calendar,
      color: 'bg-orange-500',
      show: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bem-vindo, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-brand-100 text-lg">
              {getLotacaoLabel(user.lotacao)} • {user.cargo}
            </p>
            <p className="text-brand-200 text-sm mt-1">
              Último acesso: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs ontem</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-brand-500" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas movimentações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Nenhuma atividade recente</p>
                    <p className="text-xs text-gray-500 mt-1">As atividades aparecerão aqui quando houver movimentações</p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {recentActivities.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Ver todas as atividades
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-brand-500" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.filter(action => action.show).map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover-lift"
                    onClick={() => window.location.href = action.href}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status do Sistema</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Operacional</span>
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">99.9%</p>
                <p className="text-xs text-gray-500">Últimos 30 dias</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Online</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
                <p className="text-xs text-gray-500">Agora</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
