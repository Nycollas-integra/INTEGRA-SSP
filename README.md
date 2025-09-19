# 🏛️ INTEGRA SSP-BY

**Sistema Integrado de Gestão para Secretarias de Segurança Pública**

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10.2-2D3748)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 **Visão Geral**

O **INTEGRA SSP-BY** é um sistema completo e moderno desenvolvido para gestão de Secretarias de Segurança Pública, oferecendo uma solução integrada que abrange todos os aspectos operacionais e administrativos.

### ✨ **Características Principais**

- 🏢 **Gestão Modular** por lotação (Secretaria, GCM, Defesa Civil, Vigilância)
- 🔐 **Sistema de Autenticação** robusto com controle de acesso granular
- 📊 **Dashboard Inteligente** com métricas em tempo real
- 🗺️ **Mapas Interativos** com filtros e clusters
- 📎 **Sistema de Anexos** com upload drag & drop
- 🔔 **Notificações Modernas** com animações suaves
- 📱 **Design Responsivo** mobile-first
- 🎨 **Interface Moderna** com tema azul-petróleo

## 🚀 **Tecnologias Utilizadas**

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações suaves
- **Radix UI** - Componentes acessíveis
- **Leaflet** - Mapas interativos

### **Backend**
- **NextAuth.js** - Autenticação
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **PostgreSQL** - Banco de dados (produção)

### **Ferramentas**
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão

## 📋 **Funcionalidades**

### 🏢 **Módulos da Secretaria**
- **RH** - Gestão de recursos humanos
- **Assessoria Jurídica** - Processos e designações
- **Ronda Maria da Penha** - Gestão de rondas preventivas
- **Eventos Institucionais** - Reuniões, treinamentos e cerimônias
- **Mural de Informação** - Comunicações internas
- **Agenda Institucional** - Gestão de agendas
- **Ofícios/Memorandos** - Documentos oficiais

### 🚔 **Módulos da GCM**
- **Escalas & Patrulhas** - Gestão de escalas
- **Ocorrências** - Registro e acompanhamento
- **Viaturas** - Controle de frota
- **Armaria & Equipamentos** - Inventário e cautelas
- **Ouvidoria** - Atendimento ao cidadão
- **Corregedoria** - Processos disciplinares
- **153/Despacho** - Central de atendimento
- **CFTV** - Monitoramento por câmeras

### 🗺️ **Mapas Inteligentes**
- Visualização geográfica em tempo real
- Filtros dinâmicos por tipo e status
- Clusters inteligentes para muitos pontos
- Exportação de dados (JSON)
- Controles de navegação avançados

### 📊 **Sistema de Relatórios**
- Geração de relatórios por lotação
- Diferentes formatos (Tabela, Gráfico, Mapa, Dashboard)
- Exportação e compartilhamento
- Interface exclusiva para Secretários

## 🛠️ **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Git

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/integra-ssp-by.git
cd integra-ssp-by
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
NEXTAUTH_SECRET=seu-secret-aqui
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

### **4. Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### **5. Execute o projeto**
```bash
npm run dev
```

Acesse: http://localhost:3000

## 👤 **Primeiro Acesso**

Após a instalação, o primeiro usuário é automaticamente criado:

- **Email:** admin@ssp.gov.br
- **Senha:** admin123
- **Cargo:** Secretário Executivo

⚠️ **Importante:** Altere a senha padrão após o primeiro login!

## 📱 **Screenshots**

### Dashboard Principal
![Dashboard](https://via.placeholder.com/800x400/0F4C5C/FFFFFF?text=Dashboard+Principal)

### Módulo de Armaria
![Armaria](https://via.placeholder.com/800x400/0F4C5C/FFFFFF?text=Armaria+%26+Equipamentos)

### Mapas Interativos
![Mapas](https://via.placeholder.com/800x400/0F4C5C/FFFFFF?text=Mapas+Interativos)

## 🏗️ **Estrutura do Projeto**

```
src/
├── app/                    # Páginas do Next.js
│   ├── auth/              # Autenticação
│   ├── dashboard/         # Dashboard e módulos
│   └── api/               # API Routes
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de interface
│   ├── layout/           # Layout e navegação
│   └── maps/             # Componentes de mapas
├── hooks/                # Hooks personalizados
├── lib/                  # Utilitários e configurações
└── types/                # Definições de tipos
```

## 🔧 **Scripts Disponíveis**

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Gera build de produção
npm run start        # Executa build de produção
npm run lint         # Executa ESLint
npm run db:seed      # Popula banco com dados iniciais
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 **Equipe de Desenvolvimento**

- **Desenvolvedor Principal:** [Seu Nome]
- **Email:** seu.email@exemplo.com
- **GitHub:** [@seu-usuario](https://github.com/seu-usuario)

## 📞 **Suporte**

Para suporte e dúvidas:
- 📧 Email: suporte@integra-ssp.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: https://integra-ssp.com

## 🏆 **Reconhecimentos**

- **Next.js Team** - Framework incrível
- **Tailwind CSS** - Sistema de design
- **Prisma** - ORM moderno
- **Radix UI** - Componentes acessíveis

---

**Desenvolvido com ❤️ para as Secretarias de Segurança Pública do Brasil**

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black)](https://nextjs.org/)
[![Powered by TypeScript](https://img.shields.io/badge/Powered%20by-TypeScript-blue)](https://www.typescriptlang.org/)