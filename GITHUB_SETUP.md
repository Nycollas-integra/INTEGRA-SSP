# 🚀 Como Subir o INTEGRA SSP-BY para o GitHub

## 📋 **Passos para Publicar no GitHub**

### **1. Criar Repositório no GitHub**

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"** (botão verde)
3. Preencha os dados:
   - **Repository name:** `integra-ssp-by`
   - **Description:** `Sistema Integrado de Gestão para Secretarias de Segurança Pública`
   - **Visibility:** Public (ou Private se preferir)
   - **NÃO** marque "Add a README file" (já temos um)
   - **NÃO** marque "Add .gitignore" (já temos um)
   - **NÃO** marque "Choose a license" (já temos um)

4. Clique em **"Create repository"**

### **2. Conectar Repositório Local ao GitHub**

Execute os comandos abaixo no terminal (dentro da pasta do projeto):

```bash
# Adicionar o repositório remoto (substitua SEU-USUARIO pelo seu username)
git remote add origin https://github.com/SEU-USUARIO/integra-ssp-by.git

# Renomear branch principal para main (se necessário)
git branch -M main

# Fazer push do código para o GitHub
git push -u origin main
```

### **3. Configurar GitHub Pages (Opcional)**

Para hospedar o site no GitHub Pages:

1. Vá em **Settings** do repositório
2. Role até **Pages** no menu lateral
3. Em **Source**, selecione **GitHub Actions**
4. Crie um arquivo `.github/workflows/deploy.yml` com:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

### **4. Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXTAUTH_SECRET=seu-secret-super-seguro-aqui
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

### **5. Documentação Adicional**

O projeto já inclui:

- ✅ **README.md** - Documentação completa
- ✅ **LICENSE** - Licença MIT
- ✅ **env.example** - Exemplo de variáveis de ambiente
- ✅ **FUNCIONALIDADES.md** - Lista detalhada de funcionalidades
- ✅ **STATUS.md** - Status atual do projeto
- ✅ **DEMO.md** - Guia de demonstração

## 🔧 **Comandos Úteis**

### **Atualizar o Repositório**
```bash
git add .
git commit -m "Descrição da atualização"
git push origin main
```

### **Criar Nova Branch**
```bash
git checkout -b feature/nova-funcionalidade
git push -u origin feature/nova-funcionalidade
```

### **Voltar para Main**
```bash
git checkout main
```

## 📱 **Badges para o README**

Adicione estes badges no topo do README.md:

```markdown
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-5.10.2-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)
```

## 🎯 **Próximos Passos**

1. **Configurar CI/CD** - GitHub Actions para deploy automático
2. **Configurar Banco de Produção** - PostgreSQL para produção
3. **Configurar Domínio** - Domínio personalizado
4. **Configurar SSL** - Certificado SSL para HTTPS
5. **Configurar Backup** - Backup automático do banco

## 🆘 **Problemas Comuns**

### **Erro de Autenticação**
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### **Erro de Push**
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### **Erro de Permissão**
- Verifique se você tem permissão para escrever no repositório
- Use SSH em vez de HTTPS se configurado

## 📞 **Suporte**

Se tiver problemas, consulte:
- [Documentação do Git](https://git-scm.com/doc)
- [Documentação do GitHub](https://docs.github.com/)
- [Documentação do Next.js](https://nextjs.org/docs)

---

**🎉 Seu projeto está pronto para o GitHub!**
