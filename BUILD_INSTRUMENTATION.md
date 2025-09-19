# 🔧 INSTRUMENTAÇÃO: Build Netlify com Debug Detalhado

## ✅ **OBJETIVO ALCANÇADO**

**Meta:** Garantir arquivos UI existam e instrumentar build para mostrar erro real
**Status:** ✅ **IMPLEMENTADO COM SUCESSO**

## 🛠️ **IMPLEMENTAÇÕES REALIZADAS**

### **A) Arquivos UI Garantidos ✅**
- ✅ **`src/components/ui/button.tsx`** - Minúsculo, versionado
- ✅ **`src/components/ui/input.tsx`** - Minúsculo, versionado
- ✅ **`src/components/ui/card.tsx`** - Minúsculo, versionado
- ✅ **Case sensitivity** - `git config core.ignorecase false`
- ✅ **.gitignore** - Exceções explícitas para UI components

### **B) Imports Normalizados ✅**
- ✅ **Auth pages** - Imports relativos (sem risco de alias)
- ✅ **Resto do projeto** - Alias `@` mantido
- ✅ **Fallback robusto** - Funciona mesmo se alias falhar

### **C) Configurações Simplificadas ✅**
- ✅ **next.config.js** - Mínimo funcional com alias `@`
- ✅ **tsconfig.json** - baseUrl e paths corretos
- ✅ **netlify.toml** - Configuração mínima
- ✅ **.nvmrc** - Node 22 LTS

### **D) Instrumentação de Build ✅**
- ✅ **print-env.cjs** - Log detalhado do ambiente
- ✅ **verify-ui-paths.cjs** - Verificação compacta
- ✅ **package.json** - Scripts simples e válidos
- ✅ **typecheck** - Script adicionado

## 🔍 **LOGS DE DEBUG NO NETLIFY**

### **Prebuild Output Esperado:**
```
[env] Node v22.x.x
[env] npm x.x.x
[env] git rev abc1234
[env] files ui: -rw-r--r-- 1 user wheel 443 button.tsx
                -rw-r--r-- 1 user wheel 445 input.tsx
                -rw-r--r-- 1 user wheel 604 card.tsx
[verify-ui-paths] OK
```

### **Se Houver Erro Real:**
- ✅ **Webpack errors** - Mostrados claramente
- ✅ **TypeScript errors** - Detalhados
- ✅ **Module resolution** - Erro específico
- ✅ **Build process** - Log completo

## 📋 **ARQUIVOS MODIFICADOS**

1. **`.gitignore`** - Exceções explícitas para UI
2. **`next.config.js`** - Simplificado para mínimo funcional
3. **`netlify.toml`** - Configuração mínima
4. **`scripts/print-env.cjs`** - Log detalhado do ambiente
5. **`scripts/verify-ui-paths.cjs`** - Formato compacto
6. **`package.json`** - Script typecheck adicionado

## 🚀 **COMO TESTAR**

### **1. Desenvolvimento Local**
```bash
cd /tmp/integra-ssp-by
npm ci
npm run typecheck
npm run build
```

### **2. Verificação de Logs**
```bash
npm run prebuild
# Deve mostrar logs detalhados do ambiente
```

### **3. Deploy Netlify**
- ✅ **Logs detalhados** - Ambiente e arquivos UI
- ✅ **Erro real** - Se houver falha, será específico
- ✅ **Build limpo** - Sem "Module not found" genérico

## ✅ **CRITÉRIOS DE ACEITE**

- ✅ **Prebuild mostra** - Node, npm, git rev, files ui
- ✅ **"[verify-ui-paths] OK"** - Componentes validados
- ✅ **Erro real** - Se falhar, será webpack/TypeScript específico
- ✅ **Build funcional** - Login/Registro compilam
- ✅ **Configuração mínima** - Arquivos limpos e funcionais

## 🎯 **BENEFÍCIOS**

1. **Debug preciso** - Logs detalhados do ambiente
2. **Erro específico** - Não mais "Module not found" genérico
3. **Configuração limpa** - Arquivos mínimos e funcionais
4. **Fallback robusto** - Imports relativos nas páginas críticas
5. **Versionamento garantido** - UI components sempre presentes

**🚀 PROJETO INSTRUMENTADO E PRONTO PARA DEPLOY NO NETLIFY!**
