const shelf = "/offline-reader.html";
const favicon = "/favicon.ico";
const shelfCache = "uts-offline-shell-v1";
const articlesCache = "uts-offline-articles-v1";
const offlineArticle = /^\/api\/reading\/(en|bn)\/[a-z0-9-]+$/;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(shelfCache).then((cache) => cache.addAll([shelf,favicon])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("uts-offline-shell-") && key !== shelfCache).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname === shelf || url.pathname === favicon) {
    event.respondWith(caches.open(shelfCache).then(async (cache) => await cache.match(url.pathname) ?? fetch(request)));
    return;
  }
  if (request.mode !== "navigate") return;
  event.respondWith((async () => {
    if (offlineArticle.test(url.pathname)) {
      const saved = await (await caches.open(articlesCache)).match(url.pathname);
      if (saved) return saved;
    }
    try { return await fetch(request); }
    catch {
      return await (await caches.open(shelfCache)).match(shelf) ?? new Response("Offline",{status:503});
    }
  })());
});
