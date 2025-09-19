'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Shield, Users, MapPin, FileText } from '@/lib/icons'
// Fallback para imports relativos (compatibilidade com Netlify)
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/card'
import { toast } from 'react-hot-toast'
import { validateEmail } from '@/lib/utils'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        usuario: formData.usuario,
        senha: formData.senha,
        redirect: false
      })

      if (result?.error) {
        toast.error('Credenciais inválidas')
      } else {
        toast.success('Login realizado com sucesso!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo e Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-500 rounded-full mb-4 animate-pulse-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            INTEGRA SSP-BY
          </h1>
          <p className="text-gray-600">
            Sistema Integrado de Gestão da Secretaria de Segurança Pública
          </p>
        </motion.div>

        {/* Card de Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="gradient-card shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Acesso ao Sistema
              </CardTitle>
              <CardDescription className="text-gray-600">
                Digite suas credenciais para continuar
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    name="usuario"
                    type="text"
                    placeholder="E-mail ou Matrícula"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    required
                    className="h-12 text-lg"
                    label="Usuário"
                  />
                  
                  <div className="relative">
                    <Input
                      name="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Senha"
                      value={formData.senha}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-lg pr-12"
                      label="Senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold gradient-brand hover:opacity-90 transition-all duration-200 hover-lift"
                  loading={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <a
                    href="/auth/register"
                    className="text-brand-500 hover:text-brand-600 font-medium transition-colors"
                  >
                    Cadastre-se aqui
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Gestão de Pessoal</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Mapas Inteligentes</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Relatórios</p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            © 2024 Secretaria de Segurança Pública - Todos os direitos reservados
          </p>
        </motion.div>
      </div>
    </div>
  )
}
