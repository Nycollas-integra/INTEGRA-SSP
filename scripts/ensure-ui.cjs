// scripts/ensure-ui.cjs
const fs = require('fs'); 
const path = require('path');

function write(p, code){
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p) || process.env.FORCE_REWRITE_UI === '1') fs.writeFileSync(p, code);
}

// UI básicos
write(path.join(__dirname,'..','src','components','ui','button.tsx'), `import * as React from 'react'
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
export function Button({ className = '', ...props }: ButtonProps) {
  const base='inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border transition focus:outline-none focus:ring disabled:opacity-50'
  return <button className={\`\${base} \${className}\`} {...props} />
}
export default Button
`);

write(path.join(__dirname,'..','src','components','ui','input.tsx'), `import * as React from 'react'
type InputProps = React.InputHTMLAttributes<HTMLInputElement>
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className='', ...p }, ref)=>{
  const base='flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring focus:border'
  return <input ref={ref} className={\`\${base} \${className}\`} {...p} />
})
Input.displayName='Input'
export default Input
`);

write(path.join(__dirname,'..','src','components','ui','card.tsx'), `import * as React from 'react'
export function Card(p:React.HTMLAttributes<HTMLDivElement>){ return <div {...p} className={\`rounded-xl border p-4 shadow-sm bg-white \${p.className||''}\`} /> }
export function CardHeader(p:React.HTMLAttributes<HTMLDivElement>){ return <div {...p} className={\`mb-3 \${p.className||''}\`} /> }
export function CardContent(p:React.HTMLAttributes<HTMLDivElement>){ return <div {...p} className={\`\${p.className||''}\`} /> }
export function CardFooter(p:React.HTMLAttributes<HTMLDivElement>){ return <div {...p} className={\`mt-3 \${p.className||''}\`} /> }
export default Card
`);

// UI adicionais
write(path.join(__dirname,'..','src','components','ui','modal.tsx'), `import React from 'react'
type Props = React.PropsWithChildren<{ open:boolean; onClose?:()=>void; title?:string; className?:string }>
export default function Modal({ open, onClose, title, className, children }: Props){
  if(!open) return null
  return (<div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
    <div className={\`relative z-10 rounded-xl bg-white p-4 shadow-lg w-full max-w-lg \${className||''}\`}>
      {title ? <h3 className="mb-2 text-lg font-semibold">{title}</h3> : null}
      {children}
    </div>
  </div>)
}
`);

write(path.join(__dirname,'..','src','components','ui','notification-manager.tsx'), `import React,{createContext,useContext,useState,useCallback} from 'react'
type Notice={id:number;message:string}; type Ctx={notify:(m:string)=>void}
const Ctx=createContext<Ctx>({notify:()=>{}})
export function useNotifications(){ return useContext(Ctx) }
export default function NotificationManager({children}:{children:React.ReactNode}){
  const [items,setItems]=useState<Notice[]>([])
  const notify=useCallback((m:string)=>{ setItems(p=>[...p,{id:Date.now(),message:m}]); setTimeout(()=>setItems(p=>p.slice(1)),3000) },[])
  return (<Ctx.Provider value={{notify}}>
    {children}
    <div className="fixed bottom-4 right-4 space-y-2">
      {items.map(n=><div key={n.id} className="rounded-md bg-black text-white px-3 py-2 shadow">{n.message}</div>)}
    </div>
  </Ctx.Provider>)
}
`);

write(path.join(__dirname,'..','src','components','ui','file-upload.tsx'), `import React,{useRef} from 'react'
export default function FileUpload({ onFiles, accept, multiple, className }:{ onFiles?:(f:FileList)=>void; accept?:string; multiple?:boolean; className?:string }){
  const ref=useRef<HTMLInputElement>(null)
  return (<div className={\`border-dashed border rounded-xl p-4 text-center cursor-pointer \${className||''}\`} onClick={()=>ref.current?.click()}>
    <input ref={ref} type="file" className="hidden" accept={accept} multiple={multiple} onChange={e=>e.target.files&&onFiles?.(e.target.files)} />
    <p>Click ou arraste arquivos aqui</p>
  </div>)
}
`);

// lib + hooks
write(path.join(__dirname,'..','src','lib','utils.ts'), `export function cn(...c:Array<string|false|null|undefined>){ return c.filter(Boolean).join(' ') }
export const noop=(..._args:any[])=>{}
`);

write(path.join(__dirname,'..','src','hooks','use-crud-operations.ts'), `import {useCallback,useState} from 'react'
export function useCrudOperations<T=any>(endpoint=''){
  const [loading,setLoading]=useState(false); const [error,setError]=useState<unknown>(null)
  const request=useCallback(async (method:string, body?:any)=>{
    setLoading(true); setError(null)
    try{
      const res=await fetch(endpoint,{ method, headers:{'Content-Type':'application/json'}, body: body?JSON.stringify(body):undefined })
      if(!res.ok) throw new Error(await res.text()); const data=await res.json().catch(()=>null); return data
    }catch(e){ setError(e); throw e } finally{ setLoading(false) }
  },[endpoint])
  return { loading, error, list:()=>request('GET'), create:(d:T)=>request('POST',d), update:(id:string|number,d:Partial<T>)=>request('PUT',{id,...d}), remove:(id:string|number)=>request('DELETE',{id}) }
}
`);

console.log('[ensure-ui] ensured ui/lib/hooks stubs');