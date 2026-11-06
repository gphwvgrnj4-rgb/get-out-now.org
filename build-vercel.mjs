// Vercel build: copy the static site to dist/ and point form POSTs at /api/form
// (which forwards to the original Netlify forms). Page content is not changed.
import fs from "fs"; import path from "path";
const SKIP = new Set([".git","node_modules","netlify","api","dist",".vercel","netlify.toml","_redirects","_headers","vercel.json","build-vercel.mjs","package.json","package-lock.json",".vercelignore"]);
const out = "dist"; fs.rmSync(out,{recursive:true,force:true});
function copy(src,dst){ for(const e of fs.readdirSync(src,{withFileTypes:true})){ if(src==="."&&(SKIP.has(e.name)||e.name.endsWith(".md")))continue;
  const s=path.join(src,e.name), d=path.join(dst,e.name);
  if(e.isDirectory()){fs.mkdirSync(d,{recursive:true});copy(s,d);continue}
  if(e.name.endsWith(".html")){ let h=fs.readFileSync(s,"utf8");
    h=h.replaceAll("fetch('/',{method:'POST'","fetch('/api/form?ajax=1',{method:'POST'");
    h=h.replace(/(<form[^>]*data-netlify="true"[^>]*action=")([^"]*)"/g,(m,a,b)=>a+"/api/form?next="+encodeURIComponent(b)+'"');
    fs.writeFileSync(d,h);} else fs.copyFileSync(s,d);}}
fs.mkdirSync(out); copy(".",out); console.log("built dist/");
