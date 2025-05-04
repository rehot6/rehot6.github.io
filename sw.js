importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// 重要：每次构建时自动生成唯一版本号（需在Hugo构建流程中实现）
const CACHE_VERSION = '1746325402-ea11879';  // 每次部署递增版本号
const PRE_CACHE_NAME = `precache-${CACHE_VERSION}`;

// ========== 核心修改点 1：动态版本控制 ==========
workbox.precaching.precacheAndRoute([
  { 
    url: '/', 
    revision: CACHE_VERSION  // 动态版本绑定
  },
  { 
    url: '/icons/icon-192x192.png',
    revision: CACHE_VERSION 
  }
], {
  cleanUrls: false,
  directoryIndex: '/'
});

// ========== 核心修改点 2：缓存策略优化 ==========
// 文档类请求：强制网络优先 + 短时效缓存
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: `documents-${CACHE_VERSION}`,
    networkTimeoutSeconds: 3,  // 3秒超时
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60  // 1小时缓存
      })
    ]
  })
);

// 静态资源：带版本验证的缓存策略
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `assets-${CACHE_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60  // 7天
      })
    ]
  })
);