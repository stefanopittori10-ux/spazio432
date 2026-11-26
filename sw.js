// spazio432 · service worker minimo: serve per installare il sito come app.
// Non salva niente in cache (così vedete sempre l'ultima versione pubblicata):
// se manca la rete, al posto della pagina d'errore del browser mostra un avviso.
const OFFLINE = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>spazio 432 · senza rete</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f1ea;color:#0a0a0a;
font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;text-align:center;padding:24px}b{font-size:28px;font-weight:900;display:block;margin-bottom:10px}
button{margin-top:18px;font:inherit;font-weight:bold;padding:10px 18px;border:2px solid #0a0a0a;background:#fff;box-shadow:4px 4px 0 #993C1D;cursor:pointer}</style></head>
<body><div><b>spazio432</b>sembra che manchi la connessione.<br>riprova tra un attimo.<br><button onclick="location.reload()">riprova</button></div></body></html>`;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;   // dati, immagini, Supabase: passano normalmente
  e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
