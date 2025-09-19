#!/bin/bash

echo "🚀 Configurando INTEGRA SSP-BY..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar cliente Prisma
echo "🔧 Configurando banco de dados..."
npx prisma generate

# Criar banco de dados
echo "🗄️ Criando banco de dados..."
npx prisma db push

# Popular com dados de exemplo
echo "🌱 Populando banco com dados de exemplo..."
npm run db:seed

echo "✅ Configuração concluída!"
echo ""
echo "🎉 INTEGRA SSP-BY está pronto para uso!"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
echo ""
echo "Usuário administrador:"
echo "  Email: admin@ssp.gov.br"
echo "  Senha: admin123"
echo ""
echo "Bem-vindo ao INTEGRA SSP-BY! 🚀"
