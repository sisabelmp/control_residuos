const BASE=new URL('./',self.registration.scope);
const PREFIX='control-residuos:'+BASE.pathname+':';
const CACHE=PREFIX+'v1';
const FILES=['./','index.html','style.css','app.mjs','core.mjs','manifest.webmanifest','icon-192.png','icon-512.png','icon.svg'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!FILES.includes(event.request.url))return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok&&!response.redirected){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
  return response;
 }).catch(async()=>{
  const cached=await caches.match(event.request);
  if(cached)return cached;
  if(event.request.mode==='navigate')return (await caches.match(new URL('index.html',BASE).href))||Response.error();
  return Response.error();
 }));
});
