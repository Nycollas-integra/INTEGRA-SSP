import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { validateCPF, validateEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nome,
      cpf,
      telefone,
      email,
      matricula,
      lotacao,
      cargo,
      funcaoDisposicao,
      senha
    } = body

    // Validações
    if (!nome || !cpf || !email || !matricula || !lotacao || !cargo || !senha) {
      return NextResponse.json(
        { message: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    if (!validateCPF(cpf)) {
      return NextResponse.json(
        { message: 'CPF inválido' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'E-mail inválido' },
        { status: 400 }
      )
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { message: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se já existe usuário com mesmo email, CPF ou matrícula
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { cpf },
          { matricula }
        ]
      }
    })

    if (existingUser) {
      let message = 'Já existe um usuário cadastrado com '
      if (existingUser.email === email) message += 'este e-mail'
      else if (existingUser.cpf === cpf) message += 'este CPF'
      else if (existingUser.matricula === matricula) message += 'esta matrícula'
      
      return NextResponse.json(
        { message },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome,
        cpf,
        telefone: telefone || null,
        email,
        matricula,
        lotacao,
        cargo,
        funcaoDisposicao: funcaoDisposicao || null,
        senha: hashedPassword,
        status: 'PENDENTE_APROVACAO'
      }
    })

    // Se for o primeiro usuário, aprovar automaticamente como Secretário Executivo
    const userCount = await prisma.user.count()
    if (userCount === 1) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: 'ATIVO',
          aprovadoEm: new Date(),
          cargo: 'SECRETARIO_EXECUTIVO'
        }
      })
    }

    return NextResponse.json(
      { 
        message: 'Cadastro realizado com sucesso! Aguarde aprovação.',
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          matricula: user.matricula,
          lotacao: user.lotacao,
          status: user.status
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro no cadastro:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
