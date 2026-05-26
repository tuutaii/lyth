// src/hooks/usePushNotification.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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

      // getToken() tự động liên kết và đăng ký Service Worker '/firebase-messaging-sw.js' mặc định
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token) {
        console.log('[usePushNotification] ✅ FCM Token:', token);
        setFcmToken(token);
        
        // Tự động lưu Token và cấu hình giờ nhận thông báo mặc định vào Firestore
        if (typeof window !== "undefined") {
          let userId = localStorage.getItem("lyth_user_id");
          if (!userId) {
            userId = "user_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("lyth_user_id", userId);
          }
          const defaultTime = localStorage.getItem("lyth_noti_time") || "09:00";
          await setDoc(doc(db, "users", userId), {
            fcmToken: token,
            notificationTime: defaultTime,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log('[usePushNotification] ✅ Auto-saved token to Firestore for user:', userId);
        }
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
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setPermissionStatus('granted');
        fetchFcmToken();
      } else if (Notification.permission === 'denied') {
        setPermissionStatus('denied');
      }
    } else {
      setPermissionStatus('unsupported');
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
