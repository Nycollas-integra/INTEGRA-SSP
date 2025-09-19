// scripts/ensure-styles.cjs
const fs = require('fs'); 
const path = require('path');

const appDir = path.join(__dirname, '..', 'src', 'app');
const appGlobals = path.join(appDir, 'globals.css');

fs.mkdirSync(appDir, { recursive: true });

if (!fs.existsSync(appGlobals)) {
  const css = `/* globals gerado automaticamente */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --bg:#fff; --fg:#111827 }
html,body{height:100%}
body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial}
`;
  fs.writeFileSync(appGlobals, css);
  console.log('[ensure-styles] Created src/app/globals.css');
} else {
  console.log('[ensure-styles] src/app/globals.css already exists');
}
