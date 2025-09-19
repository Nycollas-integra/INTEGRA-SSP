// scripts/ensure-icons.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function walk(dir, acc=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

// coleta todos os identificadores importados de '@/lib/icons'
const wanted = new Set();
for (const file of walk(SRC)) {
  const src = fs.readFileSync(file, 'utf8');
  const re = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/lib\/icons['"]/g;
  let m;
  while ((m = re.exec(src))) {
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const n of names) {
      // remove "as Alias"
      const base = n.split(/\s+as\s+/i)[0].trim();
      if (base) wanted.add(base);
    }
  }
}

// garanta alguns ícones comuns que podem aparecer fora do scan inicial
['Shield','Eye','EyeOff','Users','Radio','Zap','Package','CheckCircle','Wrench','XCircle','AlertTriangle','Download','Plus','Search','Filter','Edit','Trash2','Save','Ammunition','Handcuffs'].forEach(n => wanted.add(n));

// lista mínima garantida para evitar imports undefined
const MINIMUM_ICONS = ['Shield','Eye','EyeOff','Users','Radio','Zap','Package','CheckCircle','Wrench','XCircle','AlertTriangle','Download','Plus','Search','Filter','Edit','Trash2','Save'];
MINIMUM_ICONS.forEach(n => wanted.add(n));

// se nada encontrado, não faz nada
if (!wanted.size) {
  console.log('[ensure-icons] no imports found');
  process.exit(0);
}

// separe fallbacks (não existem no lucide)
const FALLBACKS = new Set(['Ammunition','Handcuffs']);
const realIcons = [...wanted].filter(n => !FALLBACKS.has(n));
const needsFallback = [...wanted].filter(n => FALLBACKS.has(n));

// gera o conteúdo do arquivo
const header = `import * as React from 'react';\nimport { ${realIcons.sort().join(', ')} } from 'lucide-react';\n`;
const named = realIcons.length ? `export { ${realIcons.sort().join(', ')} };\n` : '';
const fb = `
export const Ammunition: React.FC<React.ComponentProps<typeof Package>> = (p) => <Package {...p} />;
export const Handcuffs:  React.FC<React.ComponentProps<typeof Shield>>  = (p) => <Shield {...p} />;
`;
const extras = `export * from 'lucide-react';\n`;

const code = `${header}${named}${fb}${extras}`;

const out = path.join(SRC, 'lib', 'icons.tsx');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, code);
console.log('[ensure-icons] wrote', out, 'with', realIcons.length, 'icons + fallbacks:', needsFallback.join(', ') || 'none');
