"use client";

import { usePushNotification } from "@/hooks/usePushNotification";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
  const { permissionStatus, requestPermission } = usePushNotification();
  const [testSent, setTestSent] = useState(false);

  // Hàm test bắn thông báo hiển thị ngay trên Safari (nếu đã cấp quyền)
  const handleTestNotification = () => {
    if (permissionStatus === "granted" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("✨ Test Thông Báo Safari", {
          body: "Bạn đã nhận được thông báo từ Lyth Astrologer!",
          icon: "/app_icon.png",
          tag: "test-safari",
        });
        setTestSent(true);
        setTimeout(() => setTestSent(false), 3000);
      });
    } else {
      requestPermission();
    }
  };

  if (permissionStatus === "granted") {
    return (
      <button 
        onClick={handleTestNotification}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4bf88]/30 bg-[#0f0b1e]/80 text-[#e4bf88] hover:bg-[#e4bf88]/10 transition-all text-[10px] sm:text-xs font-montserrat shadow-lg backdrop-blur-md cursor-pointer"
      >
        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#e4bf88]" />
        <span className="hidden sm:inline">{testSent ? "Đã Gửi Test!" : "Test Thông Báo"}</span>
      </button>
    );
  }

  if (permissionStatus === "denied" || permissionStatus === "unsupported") {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-[#d97b6c] text-[10px] sm:text-xs font-montserrat shadow-lg backdrop-blur-md">
        <BellOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">{permissionStatus === "denied" ? "Đã Tắt" : "KO Hỗ Trợ"}</span>
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      disabled={permissionStatus === "loading"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4bf88]/50 bg-gradient-to-r from-[#b8996a]/20 to-[#e4bf88]/20 text-[#eae3d2] hover:text-white transition-all duration-300 text-[10px] sm:text-xs font-montserrat tracking-wide cursor-pointer shadow-lg backdrop-blur-md"
    >
      {permissionStatus === "loading" ? (
        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-[#e4bf88]" />
      ) : (
        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e4bf88]" />
      )}
      <span className="hidden sm:inline">
        {permissionStatus === "loading" ? "Đang Kết Nối..." : "Nhận Noti"}
      </span>
    </button>
  );
}
