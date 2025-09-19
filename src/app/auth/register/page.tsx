'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Shield, CheckCircle, XCircle } from '@/lib/icons'
// Fallback para imports relativos (compatibilidade com Netlify)
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/card'
import { toast } from 'react-hot-toast'
import { validateCPF, validateEmail, getLotacaoColor, getLotacaoLabel } from '@/lib/utils'

const CARGOS = {
  SECRETARIA: [
    'SECRETARIO',
    'SECRETARIO_EXECUTIVO',
    'ASSESSOR_ADMINISTRATIVO',
    'ADVOGADA',
    'ADVOGADA_COORD_RONDA_MP',
    'ASSISTENTE_SOCIAL',
    'PSICOLOGA',
    'GUARDA_DISPOSICAO',
    'VIGILANTE_DISPOSICAO'
  ],
  GCM_BY: [
    'COMANDANTE',
    'SUBCOMANDANTE',
    'INSPETOR_CHEFE',
    'INSPETOR',
    'COMANDANTE_GUARNICAO',
    'OUVIDOR',
    'CORREGEDOR',
    'MOTORISTA',
    'GUARDA',
    'ATENDENTE_153',
    'DESPACHANTE_153',
    'OPERADOR_CFTV',
    'ARMEIRO'
  ],
  DEFESA_CIVIL: [
    'DIRETOR_DEFESA_CIVIL',
    'TECNICO',
    'AGENTE',
    'AUXILIADOR_FROTA',
    'DISPOSICAO'
  ],
  VIGILANCIA_PATRIMONIAL: [
    'DIRETOR_VIGILANCIA',
    'SUPERVISOR_CHEFE',
    'SUPERVISOR',
    'VIGILANTE_EFETIVO',
    'VIGILANTE_CONTRATADO'
  ]
}

const CARGO_LABELS = {
  SECRETARIO: 'Secretário',
  SECRETARIO_EXECUTIVO: 'Secretário Executivo',
  ASSESSOR_ADMINISTRATIVO: 'Assessor Administrativo',
  ADVOGADA: 'Advogada',
  ADVOGADA_COORD_RONDA_MP: 'Advogada Coord. Ronda MP',
  ASSISTENTE_SOCIAL: 'Assistente Social',
  PSICOLOGA: 'Psicóloga',
  GUARDA_DISPOSICAO: 'Guarda à disposição',
  VIGILANTE_DISPOSICAO: 'Vigilante à disposição',
  COMANDANTE: 'Comandante',
  SUBCOMANDANTE: 'Subcomandante',
  INSPETOR_CHEFE: 'Inspetor-Chefe',
  INSPETOR: 'Inspetor',
  COMANDANTE_GUARNICAO: 'Comandante de Guarnição',
  OUVIDOR: 'Ouvidor',
  CORREGEDOR: 'Corregedor',
  MOTORISTA: 'Motorista',
  GUARDA: 'Guarda',
  ATENDENTE_153: 'Atendente 153',
  DESPACHANTE_153: 'Despachante 153',
  OPERADOR_CFTV: 'Operador CFTV',
  ARMEIRO: 'Armeiro',
  DIRETOR_DEFESA_CIVIL: 'Diretor da Defesa Civil',
  TECNICO: 'Técnico',
  AGENTE: 'Agente',
  AUXILIADOR_FROTA: 'Auxiliador de Frota',
  DISPOSICAO: 'À disposição',
  DIRETOR_VIGILANCIA: 'Diretor da Vigilância',
  SUPERVISOR_CHEFE: 'Supervisor-Chefe',
  SUPERVISOR: 'Supervisor',
  VIGILANTE_EFETIVO: 'Vigilante Efetivo',
  VIGILANTE_CONTRATADO: 'Vigilante Contratado'
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    matricula: '',
    lotacao: 'SECRETARIA' as keyof typeof CARGOS,
    cargo: '',
    funcaoDisposicao: '',
    senha: '',
    confirmarSenha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.matricula.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória'
    }

    if (!formData.lotacao) {
      newErrors.lotacao = 'Lotação é obrigatória'
    }

    if (!formData.cargo) {
      newErrors.cargo = 'Cargo é obrigatório'
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória'
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória'
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cpf: formData.cpf.replace(/\D/g, ''),
          telefone: formData.telefone.replace(/\D/g, '')
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso! Aguarde aprovação.')
        router.push('/auth/login')
      } else {
        toast.error(data.message || 'Erro ao realizar cadastro')
      }
    } catch (error) {
      toast.error('Erro ao realizar cadastro')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
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
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({
      ...prev,
      telefone: formatted
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 py-8 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
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
            Cadastro no Sistema
          </h1>
          <p className="text-gray-600">
            Preencha os dados para solicitar acesso ao INTEGRA SSP-BY
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="gradient-card shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                Dados Pessoais
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Todos os campos são obrigatórios
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <Input
                      name="nome"
                      type="text"
                      placeholder="Nome completo"
                      value={formData.nome}
                      onChange={handleInputChange}
                      error={errors.nome}
                      label="Nome Completo *"
                      className="h-12"
                    />
                  </div>

                  {/* CPF */}
                  <div>
                    <Input
                      name="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      error={errors.cpf}
                      label="CPF *"
                      className="h-12"
                      maxLength={14}
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <Input
                      name="telefone"
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                      error={errors.telefone}
                      label="Telefone"
                      className="h-12"
                      maxLength={15}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      label="E-mail *"
                      className="h-12"
                    />
                  </div>

                  {/* Matrícula */}
                  <div>
                    <Input
                      name="matricula"
                      type="text"
                      placeholder="SSP123456789"
                      value={formData.matricula}
                      onChange={handleInputChange}
                      error={errors.matricula}
                      label="Matrícula *"
                      className="h-12"
                    />
                  </div>

                  {/* Lotação */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lotação *
                    </label>
                    <select
                      name="lotacao"
                      value={formData.lotacao}
                      onChange={handleInputChange}
                      className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                      <option value="">Selecione a lotação</option>
                      {Object.keys(CARGOS).map((lotacao) => (
                        <option key={lotacao} value={lotacao}>
                          {getLotacaoLabel(lotacao)}
                        </option>
                      ))}
                    </select>
                    {errors.lotacao && (
                      <p className="text-sm text-red-500 mt-1">{errors.lotacao}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo *
                    </label>
                    <select
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                      <option value="">Selecione o cargo</option>
                      {formData.lotacao && CARGOS[formData.lotacao].map((cargo) => (
                        <option key={cargo} value={cargo}>
                          {CARGO_LABELS[cargo as keyof typeof CARGO_LABELS]}
                        </option>
                      ))}
                    </select>
                    {errors.cargo && (
                      <p className="text-sm text-red-500 mt-1">{errors.cargo}</p>
                    )}
                  </div>

                  {/* Função à disposição */}
                  <div className="md:col-span-2">
                    <Input
                      name="funcaoDisposicao"
                      type="text"
                      placeholder="Função à disposição (opcional)"
                      value={formData.funcaoDisposicao}
                      onChange={handleInputChange}
                      label="Função à Disposição"
                      className="h-12"
                    />
                  </div>

                  {/* Senha */}
                  <div>
                    <div className="relative">
                      <Input
                        name="senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.senha}
                        onChange={handleInputChange}
                        error={errors.senha}
                        label="Senha *"
                        className="h-12 pr-12"
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

                  {/* Confirmar Senha */}
                  <div>
                    <div className="relative">
                      <Input
                        name="confirmarSenha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua senha"
                        value={formData.confirmarSenha}
                        onChange={handleInputChange}
                        error={errors.confirmarSenha}
                        label="Confirmar Senha *"
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Validação de senha */}
                {formData.senha && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {formData.senha.length >= 6 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${formData.senha.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                          Mínimo 6 caracteres
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {formData.senha === formData.confirmarSenha && formData.confirmarSenha ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${formData.senha === formData.confirmarSenha && formData.confirmarSenha ? 'text-green-600' : 'text-red-600'}`}>
                          Senhas coincidem
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => router.push('/auth/login')}
                  >
                    Voltar ao Login
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-lg font-semibold gradient-brand hover:opacity-90 transition-all duration-200 hover-lift"
                    loading={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Solicitar Cadastro'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
