/* 立方体チャレンジ Service Worker
   キャッシュ名はリリースごとに GAME_VER と合わせて更新すること */
const CACHE = "cube-challenge-v1.04";
const ASSETS = [
  "./",
  "./index.html",
  "./howto.png",
  "./moonrabbit.mp3",
  "./pandahush.mp3",
  "./lanternfrog.mp3",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Supabase等の外部APIやPOSTには触らない
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  // ページ本体はネット優先（更新をすぐ反映）、オフライン時はキャッシュ
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const cp = r.clone();
          caches.open(CACHE).then(c => c.put("./index.html", cp));
          return r;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // その他のアセットはキャッシュ優先
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(r => {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
        return r;
      })
    )
  );
});
