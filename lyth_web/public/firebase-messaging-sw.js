// public/firebase-messaging-sw.js
// ============================================================
// Service Worker cho Firebase Cloud Messaging
// Chạy ngầm ngay cả khi người dùng đã tắt tab / ứng dụng
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

// Firebase Config của Lyth — App ID có Analytics
firebase.initializeApp({
  apiKey: "AIzaSyAIgi8bSM69w7ogD7ca0Vmmwbrh4i2U5Qs",
  authDomain: "lyth-fae36.firebaseapp.com",
  projectId: "lyth-fae36",
  storageBucket: "lyth-fae36.firebasestorage.app",
  messagingSenderId: "286125890834",
  appId: "1:286125890834:web:b379c31e1ac21bbf3ca7cb",
  measurementId: "G-VK2F5HT84R",
});

const messaging = firebase.messaging();

// -------------------------------------------------------
// 1. XỬ LÝ THÔNG BÁO KHI ỨNG DỤNG Ở NỀN (BACKGROUND)
// Kích hoạt khi tab bị tắt hoặc mất focus
// -------------------------------------------------------
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Nhận thông báo nền:', payload);

  const notificationTitle = payload.notification?.title || '✨ Lyth — An Yên Astrologer';
  const notificationOptions = {
    body: payload.notification?.body || 'Có thông điệp mới từ vũ trụ dành cho bạn!',
    icon: '/app_icon.jpg',
    badge: '/app_icon.jpg',
    image: payload.notification?.image || null,
    data: {
      url: payload.data?.url || '/',
      ...payload.data,
    },
    vibrate: [200, 100, 200],
    tag: 'lyth-notification', // Gộp nhiều thông báo thành 1, tránh spam
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// -------------------------------------------------------
// 2. XỬ LÝ CLICK VÀO THÔNG BÁO
// -------------------------------------------------------
self.addEventListener('notificationclick', function (event) {
  console.log('[firebase-messaging-sw.js] Click thông báo:', event.notification.tag);
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  // Ngăn Service Worker bị kill trước khi hoàn thành tác vụ async
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // Focus vào tab đã mở nếu có, tránh mở trùng lặp
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // Nếu chưa có tab nào, mở tab mới
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
