const C='carb-v2';
const LIBS=['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js','https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js'];
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(async c=>{await c.addAll(SHELL);await Promise.allSettled(LIBS.map(u=>c.add(u)))}).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,e.request.mode==='navigate'||e.request.url.startsWith(self.location.origin)?{cache:'no-store'}:undefined).then(r=>{
    if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
