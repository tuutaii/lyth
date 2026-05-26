"use client";

import { usePushNotification } from "@/hooks/usePushNotification";
import { Bell, BellOff, Loader2, Settings, X, Clock, Sparkles, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper to get or create unique user ID in local storage
const getOrCreateUserId = () => {
  if (typeof window === "undefined") return "";
  let userId = localStorage.getItem("lyth_user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("lyth_user_id", userId);
  }
  return userId;
};

export default function NotificationBell() {
  const { permissionStatus, requestPermission, fcmToken } = usePushNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedTime, setSelectedTime] = useState("09:00");

  // Read initial saved time preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTime = localStorage.getItem("lyth_noti_time") || "09:00";
      setSelectedTime(savedTime);
    }
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      if (typeof window !== "undefined") {
        // Save to LocalStorage
        localStorage.setItem("lyth_noti_time", selectedTime);
        
        // Save to Firestore
        const userId = getOrCreateUserId();
        if (userId) {
          await setDoc(
            doc(db, "users", userId),
            {
              fcmToken: fcmToken || null,
              notificationTime: selectedTime,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          console.log("✅ [NotificationSettings] Saved time", selectedTime, "to Firestore for user:", userId);
        }
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsOpen(false);
      }, 1200);
    } catch (err) {
      console.error("❌ [NotificationSettings] Error saving settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // 1. STATE: NOTIFICATION IS GRANTED -> SHOW CONFIGURATION DIALOG BUTTON
  if (permissionStatus === "granted") {
    return (
      <>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.8 rounded-full border border-[#e4bf88]/30 bg-[#0f0b1e]/80 text-[#e4bf88] hover:bg-[#e4bf88]/10 hover:border-[#e4bf88]/50 transition-all text-[10px] sm:text-xs font-montserrat shadow-lg backdrop-blur-md cursor-pointer group"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e4bf88] group-hover:rotate-45 transition-transform duration-300" />
          <span className="hidden sm:inline">Giờ Nhận: {selectedTime}</span>
          <span className="sm:hidden">Giờ Noti</span>
        </button>

        {/* Custom Premium Glassmorphic Dialog Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div 
              className="w-full max-w-sm rounded-3xl p-1 bg-gradient-to-b from-[#e4bf88]/30 to-[#a9b388]/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full rounded-[22px] bg-[#0c091e]/95 border border-[#e4bf88]/20 p-6 flex flex-col relative overflow-hidden text-center gap-5">
                
                {/* Ambient lights */}
                <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full blur-[45px] bg-[#e4bf88]/25 pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full blur-[45px] bg-[#a9b388]/15 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between z-10">
                  <h3 className="text-xs font-montserrat font-bold tracking-[0.18em] text-[#e4bf88] uppercase flex items-center gap-2 select-none">
                    <Clock className="w-4 h-4 text-[#e4bf88]" />
                    Giờ Nhận Thông Điệp
                  </h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/5 text-[#dfd9cd] hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <div className="text-left text-xs leading-relaxed text-[#dfd9cd] font-montserrat z-10 flex flex-col gap-1.5">
                  <p>
                    Vũ trụ sẽ gửi thông điệp chiêm tinh ngày mới dành riêng cho em vào mốc giờ mong muốn.
                  </p>
                  {fcmToken ? (
                    <span className="text-[9px] text-[#a9b388] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a9b388] animate-pulse" />
                      Đã kết nối thiết bị thành công
                    </span>
                  ) : (
                    <span className="text-[9px] text-yellow-500/80 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80 animate-pulse" />
                      Đang đồng bộ thiết bị nhận tin...
                    </span>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="flex flex-col gap-2.5 z-10">
                  <span className="text-[10px] font-bold text-[#e4bf88] uppercase tracking-wider text-left select-none">Chọn nhanh giờ nhận:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "🌅 07:00", value: "07:00" },
                      { label: "☀️ 12:00", value: "12:00" },
                      { label: "🌌 21:00", value: "21:00" }
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setSelectedTime(preset.value)}
                        className={`py-2.5 rounded-xl text-[10px] font-montserrat font-semibold border transition-all cursor-pointer ${
                          selectedTime === preset.value
                            ? "bg-[#e4bf88]/20 border-[#e4bf88] text-[#eae3d2] shadow-[0_0_12px_rgba(228,191,136,0.15)]"
                            : "bg-white/5 border-white/5 text-[#dfd9cd] hover:bg-white/10 hover:border-white/10"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Time Selector */}
                <div className="flex flex-col gap-2.5 z-10">
                  <span className="text-[10px] font-bold text-[#e4bf88] uppercase tracking-wider text-left select-none">Hoặc chọn giờ tùy chỉnh:</span>
                  <div className="relative flex items-center bg-[#0a0715]/60 border border-[#e4bf88]/25 rounded-xl px-4 py-3 text-sm focus-within:border-[#e4bf88] transition-all">
                    <Clock className="w-4 h-4 text-[#e4bf88] shrink-0 mr-3 pointer-events-none" />
                    <input 
                      type="time" 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-transparent text-[#eae3d2] focus:outline-none font-montserrat text-sm cursor-pointer select-none"
                      required
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="mt-2 w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#b8996a] to-[#e4bf88] text-[#050409] font-montserrat font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_18px_rgba(228,191,136,0.25)] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Đang Lưu...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Lưu Thành Công!
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Lưu Cài Đặt
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. STATE: NOTIFICATION IS DENIED / UNSUPPORTED
  if (permissionStatus === "denied" || permissionStatus === "unsupported") {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-[#d97b6c] text-[10px] sm:text-xs font-montserrat shadow-lg backdrop-blur-md">
        <BellOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">{permissionStatus === "denied" ? "Đã Tắt" : "KO Hỗ Trợ"}</span>
      </div>
    );
  }

  // 3. STATE: INITIAL / IDLE / REQUESTABLE -> SHOW REQUEST PERMISSION BUTTON
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
