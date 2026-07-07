// Service worker appky Moje Stavba.
//
// Strategie: appka samotná (HTML/CSS/JS) se řídí "network-first" —
// vždycky se nejdřív zkusí stáhnout čerstvá verze ze sítě, a teprve
// když to selže (žádné připojení, typicky na stavbě), použije se
// poslední uložená verze z cache. Díky tomu se nová verze appky
// projeví hned při prvním otevření s internetem, ne až za pár dní.
//
// Obrázky/ikony (ty se prakticky nemění) zůstávají "cache-first" —
// rychlejší a šetří data.
const CACHE_NAME = 'mojestavba-v5';
const CORE_ASSETS = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './pdf-fonts.js',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
];
// Přípony souborů, u kterých dává smysl "cache-first" (obrázky, ikony
// etap) — jsou malé, mění se zřídka, netřeba je pořád znovu stahovat.
const CACHE_FIRST_EXT = /\.(svg|webp|png|jpg|jpeg)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // cizí CDN skripty necachujeme

  // Obrázky a ikony — rychlá cache, na pozadí se tiše obnoví pro příště.
  if (CACHE_FIRST_EXT.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const network = fetch(event.request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Appka samotná (HTML/CSS/JS) — vždycky nejdřív zkusit síť, ať se
  // nová verze projeví hned, jakmile má telefon signál. Cache je jen
  // záchranná síť pro chvíle bez připojení.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
