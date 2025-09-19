// scripts/ensure-exports.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function ensure(file, code) {
  const p = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, code); // overwrite de propósito para garantir as exports
  console.log('[ensure-exports] wrote', file);
}

/* utils: exports nomeados */
ensure('src/lib/utils.ts', `export function validateCPF(raw: string): boolean {
  const cpf = (raw || '').replace(/\\D/g, '');
  if (cpf.length !== 11 || /^(\\d)\\1{10}$/.test(cpf)) return false;
  const calc = (base: string, f: number) => ((base.split('').reduce((s,n)=>s+parseInt(n,10)*f--,0)*10)%11)%10;
  const d1 = calc(cpf.slice(0,9), 10);
  const d2 = calc(cpf.slice(0,10), 11);
  return d1 === parseInt(cpf[9],10) && d2 === parseInt(cpf[10],10);
}
export function validateEmail(email: string): boolean { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email||''); }
export function getLotacaoLabel(v: string | number | null | undefined): string {
  const map: Record<string,string> = {'1':'Sede','2':'Campo'};
  const k = v==null ? '' : String(v); return map[k] ?? k;
}
export function getStatusColor(status: string): string {
  const s = (status||'').toLowerCase();
  if (['ativo','ok','sucesso','success'].includes(s)) return 'text-green-600';
  if (['pendente','pending','aguardando'].includes(s)) return 'text-yellow-600';
  if (['erro','error','inativo','blocked'].includes(s)) return 'text-red-600';
  return 'text-gray-600';
}
export function formatDate(input: string | Date): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'America/Fortaleza' }).format(d);
}
export function cn(...parts: Array<string | false | null | undefined>) { return parts.filter(Boolean).join(' '); }
export const noop = () => {};
export default { validateCPF, validateEmail, getLotacaoLabel, getStatusColor, formatDate, cn, noop };
`);

/* card: incluir Title/Description nomeados + default + 'use client' */
ensure('src/components/ui/card.tsx', `'use client';
import * as React from 'react';
export function Card(p: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...p} className={\`rounded-xl border p-4 shadow-sm bg-white \${p.className || ''}\`} />;
}
export function CardHeader(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={\`mb-3 \${p.className || ''}\`} />; }
export function CardContent(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={\`\${p.className || ''}\`} />; }
export function CardFooter(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={\`mt-3 \${p.className || ''}\`} />; }
export function CardTitle(p: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 {...p} className={\`text-lg font-semibold leading-none tracking-tight \${p.className || ''}\`} />; }
export function CardDescription(p: React.HTMLAttributes<HTMLParagraphElement>) { return <p {...p} className={\`text-sm text-gray-500 \${p.className || ''}\`} />; }
export default Card;
`);

/* modal + file-upload: default + nomeado + 'use client' */
ensure('src/components/ui/modal.tsx', `'use client';
import React from 'react';
type Props = React.PropsWithChildren<{ open: boolean; onClose?: () => void; title?: string; className?: string }>;
export function Modal({ open, onClose, title, className, children }: Props) {
  if (!open) return null;
  return (<div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
    <div className={\`relative z-10 rounded-xl bg-white p-4 shadow-lg w-full max-w-lg \${className||''}\`}>
      {title ? <h3 className="mb-2 text-lg font-semibold">{title}</h3> : null}
      {children}
    </div>
  </div>);
}
export default Modal;
`);
ensure('src/components/ui/file-upload.tsx', `'use client';
import React,{useRef} from 'react';
export function FileUpload({ onFiles, accept, multiple, className }:{
  onFiles?:(f:FileList)=>void; accept?:string; multiple?:boolean; className?:string
}){ const ref=useRef<HTMLInputElement>(null);
  return (<div className={\`border-dashed border rounded-xl p-4 text-center cursor-pointer \${className||''}\`} onClick={()=>ref.current?.click()}>
    <input ref={ref} type="file" className="hidden" accept={accept} multiple={multiple}
           onChange={e=>e.target.files && onFiles?.(e.target.files)} />
    <p>Click ou arraste arquivos aqui</p>
  </div>);
}
export default FileUpload;
`);

/* stubs com export nomeado + default + 'use client' */
ensure('src/components/layout/header.tsx', `'use client';
import React from 'react';
export function Header(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} /> }
export default Header;
`);

ensure('src/components/layout/sidebar.tsx', `'use client';
import React from 'react';
export function Sidebar(props: React.HTMLAttributes<HTMLDivElement>) { return <aside {...props} /> }
export default Sidebar;
`);

ensure('src/components/providers.tsx', `'use client';
import React from 'react';
export function Providers({ children }: { children: React.ReactNode }){ return <>{children}</> }
export default Providers;
`);

ensure('src/components/maps/advanced-map-container.tsx', `'use client';
import React from 'react';
type Props = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };
export function AdvancedMapContainer(props: Props){ return <div {...props} /> }
export default AdvancedMapContainer;
`);

ensure('src/components/ui/loading-spinner.tsx', `'use client';
import React from 'react';
export function LoadingSpinner(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} aria-label="Carregando…" /> }
export default LoadingSpinner;
`);

/* prisma: stub compatível (default + nomeado) */
ensure('src/lib/prisma.ts', `const prisma: any = new Proxy({}, {
  get: () => () => { throw new Error('Prisma não configurado neste ambiente'); }
});
export { prisma };
export default prisma;
`);

/* shim de ícones + reexports */
ensure('src/lib/icons.tsx', `import * as React from 'react';
export * from 'lucide-react'; // reexporta os válidos do pacote
// Fallbacks para ícones que não existem no pacote:
import { Package, Shield } from 'lucide-react';
export const Ammunition = (props: any) => <Package {...props} />;
export const Handcuffs  = (props: any) => <Shield {...props} />;
`);
