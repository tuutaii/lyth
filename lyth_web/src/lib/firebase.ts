import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAIgi8bSM69w7ogD7ca0Vmmwbrh4i2U5Qs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lyth-fae36.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lyth-fae36",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lyth-fae36.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "286125890834",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:286125890834:web:b379c31e1ac21bbf3ca7cb",
  measurementId: "G-VK2F5HT84R",
};

// Initialize Firebase (tránh lỗi "duplicate app" khi hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Hàm lấy Messaging instance — phải async vì isSupported() trả về Promise
// Safari iOS cũ và một số trình duyệt không hỗ trợ FCM → trả về null thay vì crash
export const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export { app, db };

