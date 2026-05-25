// src/hooks/usePushNotification.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/firebase';

// VAPID Key lấy từ Firebase Console > Project Settings > Cloud Messaging > Web Push Certificates
const VAPID_KEY = 'BM-HQt8Jk_-fd2iv6vSEPUYI7VxVvlUn1NOnKflhQIxC2lLR6JDFe4fc6a1mmYEq46PKM8onbxHlgrPjMlzO0Qc';

export type PermissionStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unsupported';

export interface UsePushNotificationReturn {
  permissionStatus: PermissionStatus;
  fcmToken: string | null;
  requestPermission: () => Promise<void>;
}

export function usePushNotification(): UsePushNotificationReturn {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Lấy FCM Token sau khi đã được cấp quyền
  const fetchFcmToken = useCallback(async () => {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        setPermissionStatus('unsupported');
        return;
      }

      // Đợi Service Worker sẵn sàng rồi mới lấy token
      const swRegistration = await navigator.serviceWorker.ready;

      // getToken() trả về chuỗi token định danh duy nhất cho thiết bị này
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });

      if (token) {
        console.log('[usePushNotification] ✅ FCM Token:', token);
        setFcmToken(token);
        // TODO: Gửi token lên Firestore để backend lưu và gửi thông báo sau này
        // Ví dụ: await saveTokenToFirestore(userId, token);
      } else {
        console.warn('[usePushNotification] ⚠️ Không lấy được token — kiểm tra quyền và VAPID Key.');
      }
    } catch (error) {
      console.error('[usePushNotification] ❌ Lỗi lấy FCM Token:', error);
    }
  }, []);

  // Đăng ký Service Worker khi component mount.
  // useEffect đảm bảo chỉ chạy ở CLIENT — tránh lỗi "window is not defined" do SSR của Next.js
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((reg) => console.log('[usePushNotification] ✅ SW đăng ký thành công, scope:', reg.scope))
      .catch((err) => console.error('[usePushNotification] ❌ SW thất bại:', err));

    // Đồng bộ trạng thái quyền đã cấp từ lần trước (không hỏi lại người dùng)
    if (Notification.permission === 'granted') {
      setPermissionStatus('granted');
      fetchFcmToken();
    } else if (Notification.permission === 'denied') {
      setPermissionStatus('denied');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lắng nghe thông báo khi app đang mở (foreground)
  // Service Worker KHÔNG tự hiển thị popup ở foreground — phải tự xử lý ở đây
  useEffect(() => {
    if (permissionStatus !== 'granted') return;
    let unsubscribe: (() => void) | undefined;

    const setupForegroundListener = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        console.log('[usePushNotification] 🔔 Foreground notification:', payload);
        // Hiển thị toast/banner in-app ở đây nếu cần
        // Ví dụ: toast.info(payload.notification?.body)
      });
    };

    setupForegroundListener();
    return () => unsubscribe?.();
  }, [permissionStatus]);

  // Hàm xin quyền thông báo
  // CHỈ được gọi khi người dùng CHỦ ĐỘNG nhấn nút — không được tự gọi khi load trang
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermissionStatus('unsupported');
      return;
    }

    setPermissionStatus('loading');
    try {
      // Hộp thoại hệ thống xin quyền — trình duyệt yêu cầu phải từ user gesture
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPermissionStatus('granted');
        await fetchFcmToken();
      } else {
        setPermissionStatus('denied');
        console.warn('[usePushNotification] Người dùng từ chối quyền thông báo.');
      }
    } catch (error) {
      console.error('[usePushNotification] ❌ Lỗi xin quyền:', error);
      setPermissionStatus('denied');
    }
  }, [fetchFcmToken]);

  return { permissionStatus, fcmToken, requestPermission };
}
