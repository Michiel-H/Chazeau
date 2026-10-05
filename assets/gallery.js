(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('gallery-data').textContent);
  const stage = document.querySelector('.gallery-stage');
  const photo = document.querySelector('.gallery-photo');
  const thumbs = Array.from(document.querySelectorAll('.thumbnail'));
  const strip = document.querySelector('.gallery-thumbnails');
  const counter = document.querySelector('.gallery-counter');
  const announcement = document.querySelector('#gallery-announcement');
  const error = document.querySelector('.gallery-error');
  let selected = 0;
  let touchStart = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value, storage) {
    try { storage.setItem(key, value); } catch (_) { /* Storage may be disabled. */ }
  }
  function read(key, storage) {
    try { return storage.getItem(key); } catch (_) { return null; }
  }
  function revealThumbnail(index) {
    const thumb = thumbs[index];
    const left = thumb.offsetLeft - strip.offsetLeft;
    const right = left + thumb.offsetWidth;
    if (left < strip.scrollLeft) strip.scrollTo({left:Math.max(0,left-4),behavior:reducedMotion?'instant':'smooth'});
    else if (right > strip.scrollLeft + strip.clientWidth) strip.scrollTo({left:right-strip.clientWidth+4,behavior:reducedMotion?'instant':'smooth'});
  }
  function select(index, announce = true) {
    selected = (index + data.photos.length) % data.photos.length;
    const entry = data.photos[selected];
    const nextSource = entry.src || '/assets/photos/' + entry.file + '.webp';
    error.hidden = true;
    photo.classList.toggle('portrait', entry.portrait);
    photo.alt = data.alt[selected];
    if (photo.getAttribute('src') !== nextSource) {
      photo.classList.add('loading');
      photo.src = nextSource;
    }
    counter.textContent = String(selected+1).padStart(2,'0') + ' / ' + String(data.photos.length).padStart(2,'0');
    thumbs.forEach((thumb, i) => thumb.setAttribute('aria-pressed',String(i===selected)));
    revealThumbnail(selected);
    store('chazeau-photo',String(selected),sessionStorage);
    if (announce) announcement.textContent = data.photo + ' ' + (selected+1) + ' ' + data.of + ' ' + data.photos.length + ': ' + data.alt[selected];
    const preload = new Image();
    const nextEntry = data.photos[(selected+1)%data.photos.length];
    preload.src = nextEntry.src || '/assets/photos/' + nextEntry.file + '.webp';
  }
  photo.addEventListener('load', () => { photo.classList.remove('loading'); error.hidden = true; });
  photo.addEventListener('error', () => { photo.classList.remove('loading'); error.hidden = false; });
  document.querySelector('.gallery-prev').addEventListener('click', () => select(selected-1));
  document.querySelector('.gallery-next').addEventListener('click', () => select(selected+1));
  thumbs.forEach((thumb,i) => thumb.addEventListener('click',()=>select(i)));
  document.querySelector('.gallery').addEventListener('keydown',event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key==='ArrowLeft') { event.preventDefault(); select(selected-1); }
    if (event.key==='ArrowRight') { event.preventDefault(); select(selected+1); }
  });
  stage.addEventListener('touchstart', event => {
    if (event.touches.length===1) touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};
  },{passive:true});
  stage.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx=event.changedTouches[0].clientX-touchStart.x;
    const dy=event.changedTouches[0].clientY-touchStart.y;
    if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.3) select(selected+(dx<0?1:-1));
    touchStart=null;
  },{passive:true});
  stage.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
  document.querySelectorAll('.language-link').forEach(link => link.addEventListener('click', () => {
    store('chazeau-language',link.dataset.language,localStorage);
  }));
  const storedIndex=Number(read('chazeau-photo',sessionStorage));
  if (Number.isInteger(storedIndex) && storedIndex>=0 && storedIndex<data.photos.length) select(storedIndex,false);
  if (photo.complete && !photo.naturalWidth) error.hidden=false;
})();
