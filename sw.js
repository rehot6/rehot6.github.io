importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// 预缓存关键资源（HTML/CSS/JS/图片）
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },  // 首页
  // 添加其他需要预缓存的路径，例如：
//   { url: '/styles/main.css', revision: '1' },
//   { url: '/scripts/app.js', revision: '1' },
  { url: '/icons/icon-192x192.png', revision: '1' }
]);

// 缓存策略：优先网络，失败后使用缓存（适用于动态内容）
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst()
);

// 缓存策略：缓存优先（适用于静态资源）
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.CacheFirst()
);