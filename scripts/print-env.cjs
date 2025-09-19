// scripts/print-env.cjs
const { execSync } = require('child_process');
const run = c => { try { return execSync(c).toString().trim() } catch { return 'n/a' } };
console.log('[env] Node', process.version);
console.log('[env] npm', run('npm -v'));
console.log('[env] git rev', run('git rev-parse --short HEAD'));
console.log('[env] files ui:\n' + run('ls -la src/components/ui || echo "no ui dir"'));