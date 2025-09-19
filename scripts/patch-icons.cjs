// scripts/patch-icons.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
function walk(dir, acc=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p);
  }
  return acc;
}
let patched=0;
for (const f of walk(path.join(ROOT,'src'))) {
  let s = fs.readFileSync(f,'utf8');
  if (/from\s+['"]lucide-react['"]/.test(s)) {
    s = s.replace(/from\s+['"]lucide-react['"]/g, "from '@/lib/icons'");
    fs.writeFileSync(f, s);
    console.log('[patch-icons] rewrote import in', f);
    patched++;
  }
}
console.log('[patch-icons] total patched:', patched);