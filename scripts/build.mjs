import {mkdir,rm,cp,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {content,languages,photos,listing,origin} from '../content.mjs';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const output=join(root,'dist');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const flags={
 de:'<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><path fill="#191919" d="M0 0h30v7H0z"/><path fill="#d83235" d="M0 7h30v7H0z"/><path fill="#f2c847" d="M0 14h30v6H0z"/></svg>',
 nl:'<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><path fill="#ae2633" d="M0 0h30v7H0z"/><path fill="#fff" d="M0 7h30v7H0z"/><path fill="#214585" d="M0 14h30v6H0z"/></svg>',
 fr:'<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><path fill="#244c90" d="M0 0h10v20H0z"/><path fill="#fff" d="M10 0h10v20H10z"/><path fill="#d93643" d="M20 0h10v20H20z"/></svg>',
 en:'<svg class="flag" viewBox="0 0 60 40" aria-hidden="true"><defs><clipPath id="uk-clip"><path d="M0 0h60v40H0z"/></clipPath></defs><g clip-path="url(#uk-clip)"><path fill="#234077" d="M0 0h60v40H0z"/><path stroke="#fff" stroke-width="8" d="m0 0 60 40m0-40L0 40"/><path stroke="#c43545" stroke-width="3" d="m0 0 60 40m0-40L0 40"/><path stroke="#fff" stroke-width="13" d="M30 0v40M0 20h60"/><path stroke="#c43545" stroke-width="7" d="M30 0v40M0 20h60"/></g></svg>'
};
const arrow=direction=>`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${direction==='left'?'M14 5l-7 7 7 7':'M10 5l7 7-7 7'}" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const autoLanguage=`<script>(()=>{if(location.pathname!=='/')return;let l;try{l=localStorage.getItem('chazeau-language')}catch(e){}if(!['de','nl','fr','en'].includes(l)){const preferred=navigator.languages||[navigator.language||'fr'];l=preferred.map(v=>v.slice(0,2).toLowerCase()).find(v=>['de','nl','fr','en'].includes(v))||'fr'}location.replace('/'+l+'/'+location.search+location.hash)})()</script>`;
function render(lang,rootPage=false){
 const t=content[lang];
 const galleryData=JSON.stringify({photos,alt:t.alt,photo:t.photo,of:t.of}).replace(/</g,'\\u003c');
 const sections=t.sections.map((s,i)=>`<section class="story-section" aria-labelledby="story-${i}"><div><p class="section-number">0${i+1}</p><h2 class="section-heading" id="story-${i}">${esc(s.heading)}</h2></div><div class="prose">${s.paragraphs.map((p,j)=>`<p${i===0&&j===0?' class="opening"':''}>${esc(p)}</p>`).join('')}</div></section>`).join('');
 return `<!doctype html>
<html lang="${languages[lang].locale}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#193e35"><title>${esc(t.pageTitle)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${origin}/${lang}/">
${Object.keys(languages).map(l=>`<link rel="alternate" hreflang="${languages[l].locale}" href="${origin}/${l}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${origin}/">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="preload" as="image" href="/assets/photos/${photos[0].file}.webp" fetchpriority="high">
<link rel="stylesheet" href="/assets/styles.css">
<meta property="og:type" content="website"><meta property="og:site_name" content="Chazeau">
<meta property="og:title" content="${esc(t.pageTitle)}"><meta property="og:description" content="${esc(t.description)}"><meta property="og:url" content="${origin}/${lang}/"><meta property="og:locale" content="${languages[lang].locale.replace('-','_')}">
${rootPage?autoLanguage:''}
<script src="/assets/gallery.js" defer></script>
</head>
<body id="top">
<a class="skip-link" href="#main">${esc(t.skip)}</a>
<header class="site-header wrap">
 <a class="wordmark" href="#top" aria-label="${esc(t.home)}"><span class="wordmark-main">CHAZEAU</span><span class="wordmark-place">Ardèche, France</span></a>
 <nav class="language-nav" aria-label="${esc(t.language)}">${Object.keys(languages).map(l=>`<a class="language-link" href="/${l}/" data-language="${l}" hreflang="${languages[l].locale}" lang="${languages[l].locale}" aria-label="${languages[l].name}" title="${languages[l].name}"${l===lang?' aria-current="page"':''}>${flags[l]}<span class="sr-only">${languages[l].name}</span></a>`).join('')}</nav>
</header>
<main id="main">
 <div class="wrap">
  <section class="gallery" aria-label="${esc(t.gallery)}">
   <div class="gallery-stage" tabindex="0" aria-label="${esc(t.gallery)}">
    <img class="gallery-photo" src="/assets/photos/${photos[0].file}.webp" alt="${esc(t.alt[0])}" width="1536" height="1152" fetchpriority="high" decoding="async">
    <button class="gallery-control gallery-prev" type="button" aria-label="${esc(t.previous)}">${arrow('left')}</button>
    <button class="gallery-control gallery-next" type="button" aria-label="${esc(t.next)}">${arrow('right')}</button>
    <p class="gallery-error" role="status" hidden>${esc(t.imageError)}</p>
   </div>
   <div class="gallery-meta"><span class="gallery-location">Chazeau · Rochepaule, Ardèche</span><span class="gallery-counter" aria-hidden="true">01 / 10</span></div>
   <p class="sr-only" id="gallery-announcement" aria-live="polite" aria-atomic="true">${esc(t.photo)} 1 ${esc(t.of)} 10</p>
   <div class="gallery-thumbnails" role="group" aria-label="${esc(t.thumbnails)}">${photos.map((p,i)=>`<button class="thumbnail" type="button" aria-label="${esc(t.photo)} ${i+1}: ${esc(t.alt[i])}" aria-pressed="${i===0}"><img src="/assets/thumbs/${p.file}.webp" alt="" width="240" height="170" loading="lazy" decoding="async"></button>`).join('')}</div>
  </section>
  <div class="introduction"><p class="eyebrow">${esc(t.eyebrow)}</p><h1>${esc(t.title)}</h1><p class="intro-subtitle">${esc(t.subtitle)}</p></div>
  <div class="facts">${t.facts.map((f,i)=>`<div class="fact"><span class="fact-value${i===3?' fact-pool':''}">${esc(f[0])}</span><span class="fact-label">${esc(f[1])}</span></div>`).join('')}</div>
  ${sections}
  <div class="closing"><p>${esc(t.closing)}</p></div>
 </div>
 <section class="contact-section" aria-labelledby="contact-heading"><div class="contact-inner wrap"><div><p class="section-number">04</p><h2 id="contact-heading" class="section-heading">${esc(t.contactHeading)}</h2></div><div><p class="contact-description">${esc(t.contactDescription)}</p><div class="contact-actions"><a class="primary-link" href="${listing}" target="_blank" rel="noopener noreferrer">${esc(t.listing)}</a></div><address class="contact-address"><div><strong>L’Immobilière du Lac</strong><br>300, Grand Rue<br>07320 Devesset, ${esc(t.country)}</div><div><span class="sr-only">${esc(t.phone)}: </span><a href="tel:+33611652615">+33 6 11 65 26 15</a><br><span class="sr-only">${esc(t.email)}: </span><a href="mailto:contact@limmobiliere-du-lac.com">contact@limmobiliere-du-lac.com</a></div></address></div></div></section>
</main>
<footer class="site-footer wrap"><span class="footer-name">Chazeau</span><div class="footer-notes"><p>${esc(t.risksBefore)} <a href="https://www.georisques.gouv.fr" target="_blank" rel="noopener noreferrer">Géorisques</a>.</p><p>${esc(t.fees)}</p></div></footer>
<script type="application/json" id="gallery-data">${galleryData}</script>
</body></html>`;
}
// Fail the build rather than publishing incomplete translations or photo labels.
for(const lang of Object.keys(languages)){
 if(!content[lang]||content[lang].alt.length!==photos.length)throw new Error(`Incomplete language: ${lang}`);
 for(const key of Object.keys(content.nl))if(content[lang][key]===undefined)throw new Error(`Missing ${lang}.${key}`);
}
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(join(root,'assets'),join(output,'assets'),{recursive:true});
for(const lang of Object.keys(languages)){
 await mkdir(join(output,lang),{recursive:true});
 await writeFile(join(output,lang,'index.html'),render(lang));
}
await writeFile(join(output,'index.html'),render('fr',true));
await writeFile(join(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Object.keys(languages).map(l=>`<url><loc>${origin}/${l}/</loc>${Object.keys(languages).map(k=>`<xhtml:link rel="alternate" hreflang="${languages[k].locale}" href="${origin}/${k}/"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/></url>`).join('')}</urlset>`);
console.log('Built Chazeau: four complete language versions, 10 photographs, sitemap and metadata.');
