// Package the same built pages as a single offline file for visual review.
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const source=readFileSync(join(root,'assets/gallery.js'),'utf8');
const css=readFileSync(join(root,'assets/styles.css'),'utf8');
const images=Object.fromEntries(readdirSync(join(root,'assets/photos')).map(name=>[name.replace('.webp',''),'data:image/webp;base64,'+readFileSync(join(root,'assets/photos',name)).toString('base64')]));
const templates={};
for(const lang of ['de','nl','fr','en']){
 let html=readFileSync(join(root,`dist/${lang}/index.html`),'utf8');
 html=html.replace('<link rel="stylesheet" href="/assets/styles.css">',`<style>${css}</style>`).replace(/<link rel="preload"[^>]+>/,'');
 html=html.replace('/assets/favicon.svg','data:image/svg+xml,'+encodeURIComponent(readFileSync(join(root,'assets/favicon.svg'),'utf8')));
 html=html.replace(/src="\/assets\/(photos|thumbs)\/([^".]+)\.webp"/g,(m,type,file)=>'src="'+(type==='photos'?images[file]:'data:image/webp;base64,'+readFileSync(join(root,`assets/thumbs/${file}.webp`)).toString('base64'))+'"');
 const gallery=source.replace('const stage =','data.photos.forEach(p=>p.src=window.chazeauPhotoData[p.file]);\n  const stage =');
 html=html.replace('<script src="/assets/gallery.js" defer></script>','');
 html=html.replace('</body>',`<script>${gallery}\ndocument.querySelectorAll('.language-link').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.chazeauSwap(a.dataset.language)}));</script></body>`);
 templates[lang]=html;
}
const safe=x=>JSON.stringify(x).replace(/</g,'\\u003c');
const shell=`<!doctype html><html><head><meta charset="utf-8"><title>Chazeau</title></head><body><script>window.chazeauPhotoData=${safe(images)};window.chazeauTemplates=${safe(templates)};window.chazeauSwap=function(l){document.open();document.write(window.chazeauTemplates[l]);document.close()};let l='nl';try{const s=localStorage.getItem('chazeau-language');if(window.chazeauTemplates[s])l=s}catch(e){}window.chazeauSwap(l);</script></body></html>`;
const output=process.argv[2]?resolve(process.argv[2]):join(root,'chazeau-preview.html');
writeFileSync(output,shell);
console.log('Created self-contained multilingual preview:',output);
