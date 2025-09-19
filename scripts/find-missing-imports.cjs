// scripts/find-missing-imports.cjs
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para executar comandos de forma segura
function run(cmd) {
  try { return execSync(cmd).toString().trim() } catch { return 'n/a' }
}

// Função para criar diretórios recursivamente
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Função para escrever arquivo se não existir
function writeIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    ensureDir(filePath);
    fs.writeFileSync(filePath, content);
    console.log(`[scanner:stub] ${filePath}`);
    return true;
  }
  return false;
}

// Função para renomear arquivo sem extensão para com extensão
function renameIfNeeded(filePath, newPath) {
  if (fs.existsSync(filePath) && !fs.existsSync(newPath)) {
    fs.renameSync(filePath, newPath);
    console.log(`[scanner:rename] ${filePath} -> ${newPath}`);
    return true;
  }
  return false;
}

// Função para testar existência de arquivo com extensões
function testFileExists(basePath) {
  const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.module.css', '.css'];
  const indexExtensions = ['/index.tsx', '/index.ts', '/index.js', '/index.jsx'];
  
  for (const ext of extensions) {
    const fullPath = basePath + ext;
    if (fs.existsSync(fullPath)) return fullPath;
  }
  
  for (const ext of indexExtensions) {
    const fullPath = basePath + ext;
    if (fs.existsSync(fullPath)) return fullPath;
  }
  
  return null;
}

// Função para determinar extensão correta baseada no caminho
function getCorrectExtension(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  
  if (relativePath.includes('/components/') || 
      relativePath.includes('/layout/') || 
      relativePath.includes('/maps/') || 
      relativePath.includes('/providers')) {
    return '.tsx';
  }
  
  if (relativePath.includes('/hooks/')) {
    return '.ts';
  }
  
  if (relativePath.includes('/lib/')) {
    return '.ts';
  }
  
  if (filePath.endsWith('.module.css') || filePath.endsWith('.css')) {
    return '.css';
  }
  
  return '.tsx'; // default
}

// Função para sanitizar nomes de identificadores
function sanitizeName(name) {
  return name.replace(/[^A-Za-z0-9_]/g, '_').replace(/^[0-9]/, '_$&') || 'Component';
}

// Função para gerar stub de componente TSX
function stubComponentTSX(nameGuess = 'Component') {
  const name = sanitizeName(nameGuess);
  return `import React from 'react';
type Props = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };
export default function ${name}(props: Props){ return <div {...props} />; }
`;
}

// Função para gerar stub de hook TS
function stubHookTS() {
  return `export function useGenerated(){ return {} as any }
export default useGenerated
`;
}

// Função para gerar stub de lib TS
function stubLibTS() {
  return `export const noop = () => {}
export default {}
`;
}

// Função para extrair imports de um arquivo
function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];
  
  // Regex para capturar imports
  const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
  const exportFromRegex = /export\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
  const dynamicImportRegex = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  
  let match;
  
  // Capturar imports estáticos
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Capturar export from
  while ((match = exportFromRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Capturar imports dinâmicos
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

// Função para resolver caminho relativo
function resolvePath(filePath, importPath) {
  if (importPath.startsWith('@/')) {
    return path.join(__dirname, '..', 'src', importPath.slice(2));
  }
  
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const fileDir = path.dirname(filePath);
    return path.resolve(fileDir, importPath);
  }
  
  return null;
}

// Função para gerar stub baseado no tipo
function generateStub(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  
  if (ext === '.css' || ext === '.module.css') {
    return `/* Generated CSS stub */
`;
  }
  
  if (relativePath.includes('/components/') || 
      relativePath.includes('/layout/') || 
      relativePath.includes('/maps/') || 
      relativePath.includes('/providers')) {
    return stubComponentTSX(baseName);
  }
  
  if (relativePath.includes('/hooks/')) {
    return stubHookTS();
  }
  
  if (relativePath.includes('/lib/')) {
    return stubLibTS();
  }
  
  return `// Generated stub
export default {}
`;
}

// Função para corrigir stubs antigos sem extensão
function fixOldStubs() {
  const fixes = [
    { from: 'src/components/layout/header', to: 'src/components/layout/header.tsx' },
    { from: 'src/components/layout/sidebar', to: 'src/components/layout/sidebar.tsx' },
    { from: 'src/components/maps/advanced-map-container', to: 'src/components/maps/advanced-map-container.tsx' },
    { from: 'src/components/providers', to: 'src/components/providers.tsx' },
    { from: 'src/components/ui/loading-spinner', to: 'src/components/ui/loading-spinner.tsx' }
  ];
  
  for (const fix of fixes) {
    const fromPath = path.join(__dirname, '..', fix.from);
    const toPath = path.join(__dirname, '..', fix.to);
    renameIfNeeded(fromPath, toPath);
  }
}

// Função para corrigir stubs com identificadores inválidos
function fixInvalidStubs() {
  const fixes = [
    'src/components/layout/header.tsx',
    'src/components/layout/sidebar.tsx',
    'src/components/maps/advanced-map-container.tsx',
    'src/components/providers.tsx',
    'src/components/ui/loading-spinner.tsx',
  ];
  
  for (const f of fixes) {
    const abs = path.join(__dirname, '..', f);
    if (fs.existsSync(abs)) {
      const base = path.basename(f, path.extname(f));
      fs.writeFileSync(abs, stubComponentTSX(base));
      console.log('[scanner:fix]', f);
    }
  }
}

// Função principal
function main() {
  console.log('[scanner] Starting import scan...');
  
  // Corrigir stubs antigos primeiro
  fixOldStubs();
  
  // Corrigir stubs com identificadores inválidos
  fixInvalidStubs();
  
  // Encontrar todos os arquivos TypeScript/JavaScript
  const srcDir = path.join(__dirname, '..', 'src');
  const files = run(`find ${srcDir} -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx"`).split('\n').filter(Boolean);
  
  const missingFiles = new Set();
  
  for (const file of files) {
    try {
      const imports = extractImports(file);
      
      for (const importPath of imports) {
        // Ignorar pacotes externos
        if (!importPath.startsWith('@/') && !importPath.startsWith('./') && !importPath.startsWith('../')) {
          continue;
        }
        
        // Ignorar pacotes do Next.js/React
        if (importPath.startsWith('next/') || importPath.startsWith('react') || importPath.startsWith('@types/')) {
          continue;
        }
        
        const resolvedPath = resolvePath(file, importPath);
        if (!resolvedPath) continue;
        
        const existingFile = testFileExists(resolvedPath);
        if (!existingFile) {
          // Determinar extensão correta
          const correctExt = getCorrectExtension(resolvedPath);
          const correctPath = resolvedPath + correctExt;
          missingFiles.add(correctPath);
        }
      }
    } catch (error) {
      console.warn(`[scanner] Warning: Could not process ${file}:`, error.message);
    }
  }
  
  // Criar stubs para arquivos faltantes
  let createdCount = 0;
  for (const missingFile of missingFiles) {
    const stub = generateStub(missingFile);
    if (writeIfNotExists(missingFile, stub)) {
      createdCount++;
    }
  }
  
  console.log(`[scanner] Created ${createdCount} stubs`);
  console.log('[scanner] Import scan complete');
}

main();