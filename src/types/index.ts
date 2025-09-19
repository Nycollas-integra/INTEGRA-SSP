export type Lotacao = 'SECRETARIA' | 'GCM_BY' | 'DEFESA_CIVIL' | 'VIGILANCIA_PATRIMONIAL'

export type UserStatus = 'PENDENTE_APROVACAO' | 'ATIVO' | 'INATIVO' | 'SUSPENSO'

export type CargoSecretaria = 
  | 'SECRETARIO'
  | 'SECRETARIO_EXECUTIVO'
  | 'ASSESSOR_ADMINISTRATIVO'
  | 'ADVOGADA'
  | 'ADVOGADA_COORD_RONDA_MP'
  | 'ASSISTENTE_SOCIAL'
  | 'PSICOLOGA'
  | 'GUARDA_DISPOSICAO'
  | 'VIGILANTE_DISPOSICAO'

export type CargoGCM = 
  | 'COMANDANTE'
  | 'SUBCOMANDANTE'
  | 'INSPETOR_CHEFE'
  | 'INSPETOR'
  | 'COMANDANTE_GUARNICAO'
  | 'OUVIDOR'
  | 'CORREGEDOR'
  | 'MOTORISTA'
  | 'GUARDA'
  | 'ATENDENTE_153'
  | 'DESPACHANTE_153'
  | 'OPERADOR_CFTV'
  | 'ARMEIRO'

export type CargoDefesaCivil = 
  | 'DIRETOR_DEFESA_CIVIL'
  | 'TECNICO'
  | 'AGENTE'
  | 'AUXILIADOR_FROTA'
  | 'DISPOSICAO'

export type CargoVigilancia = 
  | 'DIRETOR_VIGILANCIA'
  | 'SUPERVISOR_CHEFE'
  | 'SUPERVISOR'
  | 'VIGILANTE_EFETIVO'
  | 'VIGILANTE_CONTRATADO'

export type TipoOcorrencia = 
  | 'ATENDIMENTO'
  | 'PATRULHAMENTO'
  | 'OCORRENCIA_POLICIAL'
  | 'ACIDENTE_TRANSITO'
  | 'DISTURBIO_ORDEM_PUBLICA'
  | 'OUTROS'

export type StatusOcorrencia = 
  | 'ABERTA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA'

export type TipoItemArmaria = 
  | 'ARMA_FOGO'
  | 'MUNICAO'
  | 'COLETE'
  | 'RADIO'
  | 'TASER'
  | 'ALGEMAS'
  | 'OUTROS'

export type StatusItem = 
  | 'ATIVO'
  | 'MANUTENCAO'
  | 'BAIXADO'

export type AcaoArmaria = 
  | 'ENTREGA'
  | 'DEVOLUCAO'
  | 'TRANSFERENCIA'
  | 'MANUTENCAO'
  | 'BAIXA'

export type StatusViatura = 
  | 'DISPONIVEL'
  | 'EM_USO'
  | 'MANUTENCAO'
  | 'BAIXADA'

export type TipoEvento = 
  | 'REUNIAO'
  | 'TREINAMENTO'
  | 'CERIMONIA'
  | 'OUTROS'

export type StatusEvento = 
  | 'AGENDADO'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'CANCELADO'

export type TipoMural = 
  | 'INFORMATIVO'
  | 'URGENTE'
  | 'AVISO'
  | 'COMUNICADO'

export type StatusRondaMP = 
  | 'VALIDA'
  | 'A_VENCER'
  | 'VENCIDA'

export interface User {
  id: string
  nome: string
  cpf: string
  telefone?: string
  email: string
  matricula: string
  lotacao: Lotacao
  cargo: string
  funcaoDisposicao?: string
  foto?: string
  status: UserStatus
  aprovadoPor?: string
  aprovadoEm?: Date
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface Notification {
  id: string
  userId: string
  titulo: string
  mensagem: string
  tipo: string
  lida: boolean
  data: Date
}

export interface MapPin {
  id: string
  latitude: number
  longitude: number
  titulo: string
  tipo: string
  status?: string
  cor?: string
  dados?: any
}
