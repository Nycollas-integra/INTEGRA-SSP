import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário administrador inicial
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ssp.gov.br' },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      cpf: '00000000000',
      email: 'admin@ssp.gov.br',
      matricula: 'SSP000001',
      lotacao: 'SECRETARIA',
      cargo: 'SECRETARIO_EXECUTIVO',
      status: 'ATIVO',
      senha: hashedPassword,
      aprovadoEm: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  console.log('✅ Usuário administrador criado:', admin.email)

  // Criar alguns usuários de exemplo
  const users = [
    {
      nome: 'João Silva',
      cpf: '12345678901',
      email: 'joao.silva@ssp.gov.br',
      matricula: 'SSP000002',
      lotacao: 'GCM_BY',
      cargo: 'COMANDANTE',
      status: 'ATIVO' as const
    },
    {
      nome: 'Maria Santos',
      cpf: '98765432109',
      email: 'maria.santos@ssp.gov.br',
      matricula: 'SSP000003',
      lotacao: 'GCM_BY',
      cargo: 'GUARDA',
      status: 'ATIVO' as const
    },
    {
      nome: 'Pedro Oliveira',
      cpf: '11122233344',
      email: 'pedro.oliveira@ssp.gov.br',
      matricula: 'SSP000004',
      lotacao: 'DEFESA_CIVIL',
      cargo: 'DIRETOR_DEFESA_CIVIL',
      status: 'ATIVO' as const
    },
    {
      nome: 'Ana Costa',
      cpf: '55566677788',
      email: 'ana.costa@ssp.gov.br',
      matricula: 'SSP000005',
      lotacao: 'VIGILANCIA_PATRIMONIAL',
      cargo: 'DIRETOR_VIGILANCIA',
      status: 'ATIVO' as const
    }
  ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        senha: hashedPassword,
        aprovadoPor: admin.id,
        aprovadoEm: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log('✅ Usuário criado:', user.email)
  }

  // Criar alguns itens de armaria de exemplo
  const itensArmaria = [
    {
      tipo: 'ARMA_FOGO' as const,
      marca: 'Taurus',
      modelo: 'PT 24/7',
      numeroSerie: 'ABC123456',
      etiqueta: 'ARM001',
      calibre: '.40',
      status: 'ATIVO' as const,
      alocacao: 'GCM Centro',
      observacoes: 'Arma em perfeito estado'
    },
    {
      tipo: 'COLETE' as const,
      marca: 'Proteção',
      modelo: 'Nível IIIA',
      etiqueta: 'COL001',
      nivel: 'IIIA',
      status: 'ATIVO' as const,
      alocacao: 'GCM Centro',
      observacoes: 'Colete balístico nível IIIA'
    },
    {
      tipo: 'RADIO' as const,
      marca: 'Motorola',
      modelo: 'DP4400',
      numeroSerie: 'MOT789012',
      etiqueta: 'RAD001',
      status: 'ATIVO' as const,
      alocacao: 'GCM Centro',
      observacoes: 'Rádio comunicador'
    }
  ]

  for (const itemData of itensArmaria) {
    const item = await prisma.itemArmaria.create({
      data: {
        ...itemData,
        anexos: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log('✅ Item de armaria criado:', item.etiqueta)
  }

  // Criar algumas ocorrências de exemplo
  const ocorrencias = [
    {
      titulo: 'Distúrbio na Praça Central',
      descricao: 'Relato de aglomeração e perturbação do sossego na Praça Central.',
      tipo: 'DISTURBIO_ORDEM_PUBLICA' as const,
      status: 'ABERTA' as const,
      endereco: 'Praça Central, Centro - São Paulo/SP',
      latitude: -23.5505,
      longitude: -46.6333,
      criadorId: admin.id,
      citados: ['SSP000002', 'SSP000003'],
      anexos: [],
      dataOcorrencia: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      titulo: 'Acidente de Trânsito - Rua das Flores',
      descricao: 'Colisão entre veículo e motocicleta na Rua das Flores.',
      tipo: 'ACIDENTE_TRANSITO' as const,
      status: 'EM_ANDAMENTO' as const,
      endereco: 'Rua das Flores, 123 - Centro - São Paulo/SP',
      latitude: -23.5515,
      longitude: -46.6343,
      criadorId: admin.id,
      citados: ['SSP000002'],
      anexos: [],
      dataOcorrencia: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  for (const ocorrenciaData of ocorrencias) {
    const ocorrencia = await prisma.ocorrencia.create({
      data: ocorrenciaData
    })
    console.log('✅ Ocorrência criada:', ocorrencia.titulo)
  }

  // Criar algumas rondas MP de exemplo
  const rondasMP = [
    {
      endereco: 'Rua das Flores, 123 - Centro',
      latitude: -23.5505,
      longitude: -46.6333,
      beneficiario: 'Maria da Silva',
      cpf: '11122233344',
      telefone: '(11) 99999-9999',
      validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      status: 'VALIDA' as const,
      observacoes: 'Ronda preventiva',
      anexos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      endereco: 'Avenida Paulista, 1000 - Bela Vista',
      latitude: -23.5615,
      longitude: -46.6565,
      beneficiario: 'Ana Costa',
      cpf: '55566677788',
      telefone: '(11) 88888-8888',
      validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
      status: 'A_VENCER' as const,
      observacoes: 'Ronda preventiva',
      anexos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  for (const rondaData of rondasMP) {
    const ronda = await prisma.rondaMP.create({
      data: rondaData
    })
    console.log('✅ Ronda MP criada:', ronda.beneficiario)
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
