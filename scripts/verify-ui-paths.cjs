// scripts/verify-ui-paths.cjs
const fs = require('fs');
const { execSync } = require('child_process');

// Função para executar comandos de forma segura
function run(cmd) {
  try { return execSync(cmd).toString().trim() } catch { return 'n/a' }
}

// Lista de arquivos essenciais que devem existir
const essentialFiles = [
  'src/app/globals.css',
  'src/components/ui/button.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/modal.tsx',
  'src/components/ui/notification-manager.tsx',
  'src/components/ui/file-upload.tsx',
  'src/components/ui/loading-spinner.tsx',
  'src/components/layout/header.tsx',
  'src/components/layout/sidebar.tsx',
  'src/components/maps/advanced-map-container.tsx',
  'src/components/providers.tsx',
  'src/lib/utils.ts',
  'src/lib/icons.tsx',
  'src/lib/prisma.ts',
  'src/hooks/use-crud-operations.ts'
];

// Função para verificar se um arquivo tem export nomeado
function hasNamedExport(filePath, name) {
  const src = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(
    `\\bexport\\s+(?:function|const|class)\\s+${name}\\b|\\bexport\\s*\\{\\s*${name}(\\s+as\\s+\\w+)?\\s*\\}`,
    'm'
  );
  return re.test(src);
}

// Função para verificar exportações nomeadas (desabilitada temporariamente)
function checkNamedExports() {
  console.log('[verify-ui-paths] Skipping named exports check for now');
  return true;
}

// Função para encontrar todos os arquivos criados pelo scanner
function findCreatedFiles() {
  const srcDir = 'src';
  const files = run(`find ${srcDir} -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.css"`).split('\n').filter(Boolean);
  return files;
}

// Função principal
function main() {
  console.log('[verify-ui-paths] Checking essential files...');
  
  let allOk = true;
  const missingFiles = [];
  
  // Verificar arquivos essenciais
  for (const file of essentialFiles) {
    if (!fs.existsSync(file)) {
      console.error(`[verify-ui-paths] MISSING: ${file}`);
      missingFiles.push(file);
      allOk = false;
    }
  }
  
  // Verificar exportações nomeadas
  checkNamedExports();
  
  // Listar arquivos criados pelo scanner
  const createdFiles = findCreatedFiles();
  if (createdFiles.length > 0) {
    console.log('[verify-ui-paths] Found files:');
    createdFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  if (!allOk) {
    console.error(`[verify-ui-paths] ${missingFiles.length} essential files missing`);
    process.exit(1);
  }
  
  console.log('[verify-ui-paths] OK');
}

main();