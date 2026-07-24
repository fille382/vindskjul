// Service worker: gör kartan användbar offline.
// Kärnfilerna cachas vid installation; kartrutor cachas allteftersom man tittar på dem.
const KARN_CACHE = "vindskjul-karna-v5";
const TILE_CACHE = "vindskjul-tiles-v1";
const MAX_TILES = 1500;

const KARN_FILER = [
  "./",
  "./index.html",
  "./manifest.json",
  "./ikon.svg",
  "./platser_skane.js",
  "./hallplatser_skane.js",
  "./skaneleden_led.js",
  "./butiker_skane.js",
  "./gardsbutiker_skane.js",
  "./vatten_skane.js",
  "./sevardheter_skane.js",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css",
  "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css",
  "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(KARN_CACHE)
      .then(cache => cache.addAll(KARN_FILER))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(namn => Promise.all(
        namn.filter(n => n !== KARN_CACHE && n !== TILE_CACHE).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

async function trimmaCache(cache, max) {
  const nycklar = await cache.keys();
  if (nycklar.length > max) {
    // Äldst först — ta bort tills vi är under taket
    for (let i = 0; i < nycklar.length - max; i++) {
      await cache.delete(nycklar[i]);
    }
  }
}

// Kartrutor & CDN-bibliotek: cache först (de ändras aldrig för samma URL).
async function cacheForst(req, cacheNamn, max) {
  const cache = await caches.open(cacheNamn);
  const traff = await cache.match(req);
  if (traff) return traff;
  const svar = await fetch(req);
  if (svar.ok || svar.type === "opaque") {
    cache.put(req, svar.clone());
    if (max) trimmaCache(cache, max);
  }
  return svar;
}

// Egna filer: cache direkt (snabbt & offline-säkert), uppdatera i bakgrunden
// så att nästa besök får senaste versionen.
async function cacheSedanUppdatera(req) {
  const cache = await caches.open(KARN_CACHE);
  const traff = await cache.match(req);
  const natverk = fetch(req)
    .then(svar => {
      if (svar.ok) cache.put(req, svar.clone());
      return svar;
    })
    .catch(() => null);
  if (traff) return traff;
  const svar = await natverk;
  if (svar) return svar;
  if (req.mode === "navigate") {
    const startsida = await cache.match("./index.html");
    if (startsida) return startsida;
  }
  throw new Error("offline och ej cachad: " + req.url);
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const arTile = url.hostname.endsWith("tile.openstreetmap.org") ||
                 url.hostname.endsWith("waymarkedtrails.org");
  if (arTile) {
    e.respondWith(cacheForst(e.request, TILE_CACHE, MAX_TILES));
  } else if (url.hostname === "unpkg.com") {
    e.respondWith(cacheForst(e.request, KARN_CACHE));
  } else {
    e.respondWith(cacheSedanUppdatera(e.request));
  }
});
