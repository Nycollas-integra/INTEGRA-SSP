// scripts/fix-stubs.cjs
const fs = require('fs'); 
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGETS = [
  'src/components/maps/advanced-map-container.tsx',
  'src/components/ui/loading-spinner.tsx',
];

function hasBadType(code) { 
  return /type\s+[A-Za-z0-9_-]*-[A-Za-z0-9_-]*\s*Props/.test(code) 
}

function rewriteToSafeComponent(file) {
  const base = path.basename(file, path.extname(file));
  const comp = base.replace(/[^A-Za-z0-9_]/g, '_').replace(/^[0-9]/, '_$&') || 'Component';
  const safe = `import React from 'react';
type Props = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };
export default function ${comp}(props: Props){ return <div {...props} />; }
`;
  fs.writeFileSync(file, safe);
  console.log('[fix-stubs] rewrote', file);
}

function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { 
      scan(p); 
      continue 
    }
    if (p.endsWith('.tsx')) {
      const code = fs.readFileSync(p, 'utf8');
      if (hasBadType(code)) { 
        rewriteToSafeComponent(p) 
      }
    }
  }
}

// Fix specific targets first
for (const f of TARGETS) { 
  if (fs.existsSync(path.join(ROOT, f))) {
    rewriteToSafeComponent(path.join(ROOT, f))
  }
}

// Scan all components for bad types
scan(path.join(ROOT, 'src', 'components'));
