// spazio432 · service worker minimo: serve per installare il sito come app.
// Usa sempre la versione online; tiene una copia di calendario, biglietto e privacy
// solo per quando manca la rete. Senza copia mostra un avviso al posto dell'errore del browser.
const OFFLINE = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>spazio 432 · senza rete</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f1ea;color:#0a0a0a;
font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;text-align:center;padding:24px}b{font-size:28px;font-weight:900;display:block;margin-bottom:10px}
button{margin-top:18px;font:inherit;font-weight:bold;padding:10px 18px;border:2px solid #0a0a0a;background:#fff;box-shadow:4px 4px 0 #993C1D;cursor:pointer}</style></head>
<body><div><b>spazio432</b>sembra che manchi la connessione.<br>riprova tra un attimo.<br><button onclick="location.reload()">riprova</button></div></body></html>`;

const CACHE = 's432-v2';
// pagine pubbliche tenute da parte per quando manca la rete (all'ingresso il segnale può essere scarso):
// si usa sempre la versione online, la copia serve solo se la rete non risponde
const PAGINE = ['/', '/index', '/biglietto', '/privacy'];
// librerie esterne che servono a biglietto e calendario
const LIBRERIE = ['cdnjs.cloudflare.com/ajax/libs/html2canvas/', 'cdn.jsdelivr.net/npm/@supabase/supabase-js'];
const pulito = u => { const x = new URL(u); let s = x.pathname.replace(/\.html$/, ''); if (s === '/index') s = '/'; return x.origin + s; };

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    const pubblica = !url.hostname.startsWith('staff.') && PAGINE.includes(pulito(req.url).slice(url.origin.length) || '/');
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        if (pubblica && r.ok && r.type === 'basic') { const c = await caches.open(CACHE); c.put(pulito(req.url), r.clone()).catch(() => {}); }
        return r;
      } catch (err) {
        if (pubblica) {
          const r = await caches.match(pulito(req.url));
          if (r) return new Response(await r.blob(), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        return new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }
  if (LIBRERIE.some(l => req.url.includes(l))) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req.url);
      const net = fetch(req).then(r => { if (r.ok) c.put(req.url, r.clone()).catch(() => {}); return r; });
      if (hit) { net.catch(() => {}); return hit; }
      return net;
    })());
  }
  // tutto il resto (dati, Supabase, immagini): passa normalmente
});
