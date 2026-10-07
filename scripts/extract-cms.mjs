import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parse} from '@babel/parser';

const manifest = {};
const humanProps = new Set(['label','title','desc','description','summary','subtitle','q','a','name','role','bio','specialization','readTime','email','phone']);
const humanArrays = new Set(['zones','protocols','hardware','certifications','scopeOptions']);
const attrs = new Set(['alt','title','placeholder','aria-label']);
function jsxText(value) {
  const lines=value.split(/\r\n|\n|\r/); let last=0;
  lines.forEach((line,i)=>{if (/[^ \t]/.test(line)) last=i;});
  return lines.map((line,i)=>{let s=line.replace(/\t/g,' '); if(i) s=s.replace(/^ +/,''); if(i<lines.length-1)s=s.replace(/ +$/,''); return s && i<last?s+' ':s;}).join('');
}
for(const folder of ['pages','components']) for(const file of fs.readdirSync('src/'+folder).filter(f=>f.endsWith('.tsx'))) {
  if(['HeroVideo.tsx','Logo.tsx'].includes(file)) continue;
  const filename='src/'+folder+'/'+file, source=fs.readFileSync(filename,'utf8');
  if(source.includes("from '../cms'")) throw new Error('Extraction is one-time; source already converted');
  const name=file.replace('.tsx',''); const fields=[]; const edits=[]; let i=0;
  const ast=parse(source,{sourceType:'module',plugins:['typescript','jsx']});
  function add(node,value,kind='text',jsx=false){
    if(!value.trim() || !/[a-zA-ZąęóśłżźćńĄĘÓŚŁŻŹĆŃ]/.test(value))return;
    const key=name.toLowerCase()+'.'+crypto.createHash('sha1').update(value+'|'+i++).digest('hex').slice(0,10);
    fields.push({key,label:value.trim().slice(0,90),value,type:kind});
    const expression=`cmsText(${JSON.stringify(key)}, ${JSON.stringify(value)})`;
    edits.push([node.start,node.end,jsx?`{${expression}}`:expression]);
  }
  function walk(node,parent,anc=[]){
    if(!node||typeof node!=='object') return;
    if(node.type==='JSXText') {add(node,jsxText(node.value),'text',true); return;}
    if(node.type==='StringLiteral') {
      if(parent?.type==='JSXAttribute'&&attrs.has(parent.name.name)) add(node,node.value,'text',true);
      else if(parent?.type==='ObjectProperty'&&parent.value===node&&humanProps.has(parent.key.name||parent.key.value)) add(node,node.value);
      else if(parent?.type==='ArrayExpression' && anc.some(p=>(p.type==='ObjectProperty'&&humanArrays.has(p.key.name))||(p.type==='VariableDeclarator'&&humanArrays.has(p.id?.name)))) add(node,node.value);
      return;
    }
    for(const [key,child] of Object.entries(node)) if(!['loc','start','end','extra','comments','leadingComments','trailingComments'].includes(key)) {
      if(Array.isArray(child))child.forEach(x=>walk(x,node,[...anc,node])); else if(child&&typeof child==='object')walk(child,node,[...anc,node]);
    }
  }
  walk(ast);
  let updated=source;
  for(const [start,end,value] of edits.sort((a,b)=>b[0]-a[0])) updated=updated.slice(0,start)+value+updated.slice(end);
  fs.writeFileSync(filename,"import { cmsText } from '../cms';\n"+updated);
  manifest[name]=fields;
}
fs.mkdirSync('wordpress/intelispaces',{recursive:true});
fs.writeFileSync('wordpress/intelispaces/content-seed.json',JSON.stringify(manifest,null,2));
console.log('CMS fields:',Object.values(manifest).reduce((n,x)=>n+x.length,0));
