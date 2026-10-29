/* 立方体チャレンジ Service Worker
   キャッシュ名はリリースごとに GAME_VER と合わせて更新すること */
const CACHE = "cube-challenge-v1.28-b20261030.8";
const ASSETS = [
  "./",
  "./index.html",
  "./light-menu.mjs",
  "./privacy.html",
  "./ranking-privacy.html",
  "./howto.png",
  "./moonrabbit.mp3",
  "./pandahush.mp3",
  "./lanternfrog.mp3",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
];
const APP_ROOT = new URL("./", self.location.href);
const APP_INDEX = new URL("index.html", APP_ROOT);
const isAppPage = url => url.origin === APP_ROOT.origin &&
  (url.pathname === APP_ROOT.pathname || url.pathname === APP_INDEX.pathname);

function cacheResponse(e, key, response) {
  // 保存失敗は通信成功まで失敗扱いにしない。SWが終了しても保存を待てるようにする。
  const copy = response.clone();
  e.waitUntil(caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {}));
}

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
    // privacy.htmlや存在しないURLをゲーム本体として保存・代用しない。
    if (!isAppPage(url)) return;
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const finalURL = new URL(r.url || e.request.url);
          if (r.status === 200 && isAppPage(finalURL) &&
              /\btext\/html\b/i.test(r.headers.get("content-type") || "")) {
            cacheResponse(e, APP_INDEX.href, r);
          }
          return r;
        })
        .catch(() => caches.open(CACHE).then(c => c.match(APP_INDEX.href))
          .then(hit => hit || Response.error()))
    );
    return;
  }

  // その他のアセットはキャッシュ優先
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(r => {
        if (r.ok && r.type !== "opaque") cacheResponse(e, e.request, r);
        return r;
      })
    )
  );
});
