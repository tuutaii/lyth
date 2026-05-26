"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import CosmicBackground from "@/components/CosmicBackground";
import StellarCarousel from "@/components/StellarCarousel";
import CosmicNavbar from "@/components/CosmicNavbar";
import NotificationBell from "@/components/NotificationBell";
import { usePushNotification } from "@/hooks/usePushNotification";
import { fetchDailyMessages, DailyMessage } from "@/lib/firebase-mock";
import { Star, User, Compass, RefreshCw, ChevronLeft, Sparkles, BookOpen, Sun, Activity, Zap, ShieldAlert, Layers, Music, Volume2, VolumeX, Heart, Sparkle, Key, Loader2 } from "lucide-react";
import * as NatalData from "@/lib/natal-data";
import { 
  cosmicAudio, 
  tarotDeck, 
  zodiacList, 
  getCompatibility, 
  calculateBirthChart, 
  TarotCard,
  getCurrentZodiacSeason,
  getCurrentMoonPhase
} from "@/lib/astrology-helpers";

const majorArcanaTarotDeck = [
  { name: "Chàng Khờ (The Fool)", englishName: "THE FOOL", image: "🃏", glowColor: "rgba(228, 191, 136, 0.4)" },
  { name: "Nhà Ảo Thuật (The Magician)", englishName: "THE MAGICIAN", image: "🧙‍♂️", glowColor: "rgba(0, 229, 255, 0.4)" },
  { name: "Nữ Đại Tư Tế (The High Priestess)", englishName: "THE HIGH PRIESTESS", image: "🔮", glowColor: "rgba(106, 90, 205, 0.4)" },
  { name: "Nữ Hoàng (The Empress)", englishName: "THE EMPRESS", image: "👑", glowColor: "rgba(247, 140, 163, 0.4)" },
  { name: "Hoàng Đế (The Emperor)", englishName: "THE EMPEROR", image: "🏛️", glowColor: "rgba(255, 179, 0, 0.4)" },
  { name: "Đức Giáo Hoàng (The Hierophant)", englishName: "THE HIEROPHANT", image: "⛪", glowColor: "rgba(184, 153, 106, 0.4)" },
  { name: "Tình Nhân (The Lovers)", englishName: "THE LOVERS", image: "💞", glowColor: "rgba(247, 140, 163, 0.4)" },
  { name: "Chiến Xa (The Chariot)", englishName: "THE CHARIOT", image: "🏎️", glowColor: "rgba(184, 153, 106, 0.4)" },
  { name: "Sức Mạnh (Strength)", englishName: "STRENGTH", image: "🦁", glowColor: "rgba(255, 179, 0, 0.4)" },
  { name: "Ẩn Sĩ (The Hermit)", englishName: "THE HERMIT", image: "🕯️", glowColor: "rgba(106, 90, 205, 0.4)" },
  { name: "Vòng Quay Số Phận (Wheel of Fortune)", englishName: "WHEEL OF FORTUNE", image: "☸️", glowColor: "rgba(184, 153, 106, 0.4)" },
  { name: "Công Lý (Justice)", englishName: "JUSTICE", image: "⚖️", glowColor: "rgba(169, 179, 136, 0.4)" },
  { name: "Người Treo (The Hanged Man)", englishName: "THE HANGED MAN", image: "🧘", glowColor: "rgba(106, 90, 205, 0.4)" },
  { name: "Tử Thần (Death)", englishName: "DEATH", image: "💀", glowColor: "rgba(184, 153, 106, 0.3)" },
  { name: "Tiết Độ (Temperance)", englishName: "TEMPERANCE", image: "🧪", glowColor: "rgba(169, 179, 136, 0.4)" },
  { name: "Ác Quỷ (The Devil)", englishName: "THE DEVIL", image: "😈", glowColor: "rgba(217, 123, 108, 0.35)" },
  { name: "Tòa Tháp (The Tower)", englishName: "THE TOWER", image: "⚡", glowColor: "rgba(217, 123, 108, 0.4)" },
  { name: "Ngôi Sao (The Star)", englishName: "THE STAR", image: "⭐", glowColor: "rgba(0, 229, 255, 0.4)" },
  { name: "Mặt Trăng (The Moon)", englishName: "THE MOON", image: "🌙", glowColor: "rgba(106, 90, 205, 0.4)" },
  { name: "Mặt Trời (The Sun)", englishName: "THE SUN", image: "🌞", glowColor: "rgba(255, 179, 0, 0.4)" },
  { name: "Phán Xét (Judgement)", englishName: "JUDGEMENT", image: "🔔", glowColor: "rgba(184, 153, 106, 0.4)" },
  { name: "Thế Giới (The World)", englishName: "THE WORLD", image: "🌍", glowColor: "rgba(0, 229, 255, 0.4)" }
];

export default function Home() {
  const { permissionStatus, requestPermission } = usePushNotification();
  const [messages, setMessages] = useState<DailyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Calibrating cosmic alignment...");
  const [activeTab, setActiveTab] = useState("messages");

  // Dynamic Sun Season and Moon Phase states (avoiding SSR hydrations issues)
  const [currentSeason, setCurrentSeason] = useState<any>(null);
  const [currentMoon, setCurrentMoon] = useState<any>(null);
  const [showStellarDropdown, setShowStellarDropdown] = useState(false);

  // 1. ASTRO SOUNDSCAPE PLAYER STATE
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // 2. DAILY TAROT FLIP STATE
  const [shuffledTarotDeck, setShuffledTarotDeck] = useState<TarotCard[]>([]);
  const [selectedTarot, setSelectedTarot] = useState<TarotCard | null>(null);
  const [isTarotFlipped, setIsTarotFlipped] = useState(false);
  const [selectedTarotIndex, setSelectedTarotIndex] = useState<number | null>(null);

  // GEMINI AI TAROT INTEGRATION
  const [isGeneratingReading, setIsGeneratingReading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [drawLimit, setDrawLimit] = useState<{ canDraw: boolean; remaining: number }>({ canDraw: true, remaining: 2 });
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // 3. HOROSCOPE COMPATIBILITY STATE
  const [compSign1, setCompSign1] = useState("Scorpio");
  const [compSign2, setCompSign2] = useState("Pisces");
  const [compResult, setCompResult] = useState<{ score: number; stars: number; analysis: string } | null>(null);
  const [isCalculatingComp, setIsCalculatingComp] = useState(false);

  // 4. BIRTH CHART GENERATOR STATE
  const [birthName, setBirthName] = useState("");
  const [birthDate, setBirthDate] = useState("2000-05-10");
  const [birthTime, setBirthTime] = useState("08:00");
  const [birthLocation, setBirthLocation] = useState("Đồng Tháp");
  const [birthChartData, setBirthChartData] = useState<any>(null);
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);

  const messageSectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const leftGateX = useTransform(scrollY, [250, 750], ["0%", "-102%"]);
  const rightGateX = useTransform(scrollY, [250, 750], ["0%", "102%"]);
  const relicScale = useTransform(scrollY, [200, 700], [0.5, 1.15]);
  const relicRotate = useTransform(scrollY, [0, 1200], [0, 360]);

  const loadData = async () => {
    setLoading(true);
    // Alternate Vietnamese/English astrological expressions reflecting "An Yên Astrologer"
    const phrases = [
      "Đang hiệu chỉnh quỹ đạo các hành tinh...",
      "Thiết lập bản đồ sao cá nhân...",
      "Đang tham vấn thông điệp vũ trụ...",
      "Dệt nên những sợi chỉ của số mệnh..."
    ];
    let phraseIdx = 0;
    
    const interval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setLoadingText(phrases[phraseIdx]);
    }, 450);

    try {
      const data = await fetchDailyMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const renderChartsTab = () => {
    const handleGenerateChart = (e: React.FormEvent) => {
      e.preventDefault();
      if (!birthName.trim()) return;
      setIsGeneratingChart(true);
      setTimeout(() => {
        const result = calculateBirthChart(birthName, birthDate, birthTime, birthLocation);
        setBirthChartData(result);
        setIsGeneratingChart(false);
      }, 1500);
    };

    return (
      <div className="w-full flex flex-col items-center justify-start gap-12 mt-4 px-2">
        {/* Tab Header */}
        <div className="text-center select-none">
          <span className="text-[10px] tracking-[0.35em] text-[#e4bf88] font-montserrat uppercase font-bold">
            Interactive Natal Map
          </span>
          <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase mt-1">
            Bản Đồ Sao Bản Mệnh
          </h2>
          <p className="text-xs text-[#dfd9cd] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
            "Bản đồ sao tại thời điểm em cất tiếng khóc chào đời là cuốn nhật ký mật mã ghi lại hành trình định mệnh của linh hồn em."
          </p>
          <div className="w-16 h-[1.5px] bg-[#e4bf88]/40 mx-auto mt-4" />
        </div>

        {/* 1. Form or Loading or Result */}
        {!birthChartData && !isGeneratingChart ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-glass-dark border border-[#e4bf88]/20 p-6 md:p-8 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-sm tracking-[0.2em] text-[#e4bf88] font-montserrat uppercase font-bold text-center mb-6">
              Nhập Thông Tin Khởi Tạo
            </h3>
            <form onSubmit={handleGenerateChart} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-wider text-[#dfd9cd] uppercase font-bold">Họ và Tên</label>
                <input 
                  type="text" 
                  value={birthName}
                  onChange={(e) => setBirthName(e.target.value)}
                  placeholder="Ví dụ: An Yên"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0715]/60 border border-[#e4bf88]/25 text-[#eae3d2] placeholder-[#7a7265] text-sm focus:outline-none focus:border-[#e4bf88] focus:ring-1 focus:ring-[#e4bf88] transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-[#dfd9cd] uppercase font-bold">Ngày Sinh</label>
                  <input 
                    type="date" 
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0715]/60 border border-[#e4bf88]/25 text-[#eae3d2] text-sm focus:outline-none focus:border-[#e4bf88] transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-[#dfd9cd] uppercase font-bold">Giờ Sinh</label>
                  <input 
                    type="time" 
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0715]/60 border border-[#e4bf88]/25 text-[#eae3d2] text-sm focus:outline-none focus:border-[#e4bf88] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-wider text-[#dfd9cd] uppercase font-bold">Nơi Sinh (Tỉnh/Thành)</label>
                <input 
                  type="text" 
                  value={birthLocation}
                  onChange={(e) => setBirthLocation(e.target.value)}
                  placeholder="Ví dụ: Đồng Tháp"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0715]/60 border border-[#e4bf88]/25 text-[#eae3d2] placeholder-[#7a7265] text-sm focus:outline-none focus:border-[#e4bf88] transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                className="mt-4 px-6 py-4.5 rounded-xl bg-gradient-to-r from-[#b8996a] to-[#e4bf88] text-[#050409] hover:brightness-110 font-montserrat font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(228,191,136,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Khởi Tạo Bản Đồ Sao
              </button>
            </form>
          </motion.div>
        ) : isGeneratingChart ? (
          <div className="w-full max-w-lg bg-glass-dark border border-[#e4bf88]/20 p-6 md:p-10 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center gap-6 min-h-[300px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-2 border-dashed border-[#e4bf88] border-t-transparent flex items-center justify-center"
            >
              <Compass className="w-8 h-8 text-[#e4bf88]" />
            </motion.div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-lora font-bold text-[#e4bf88] tracking-wider animate-pulse">
                Đang Giải Mã Mật Mã Hành Tinh...
              </h3>
              <p className="text-xs text-[#dfd9cd] font-light max-w-xs leading-relaxed">
                Đang tính toán góc chiếu hoàng đạo, thiết lập bản đồ sao và chuẩn bị luận giải tiếng Việt cá nhân hóa từ Tài Astrologer...
              </p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center gap-12"
          >
            {/* SVG Interactive Zodiac Wheel Card */}
            <div className="w-full max-w-4xl bg-glass-dark border border-[#e4bf88]/20 p-6 md:p-8 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center justify-center gap-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#e4bf88]/3 to-transparent pointer-events-none" />
              
              {/* Interactive SVG Zodiac Circle Chart */}
              <div className="relative shrink-0 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center bg-[#0a0715]/40 rounded-full border border-[#e4bf88]/15 shadow-inner">
                {/* Spinning decorative frame */}
                <div className="absolute inset-2 border border-dashed border-[#e4bf88]/15 rounded-full animate-spin-slow pointer-events-none" />
                
                <svg width="100%" height="100%" viewBox="0 0 300 300" className="w-full h-full select-none">
                  {/* Outer Sign circle rings */}
                  <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(228, 191, 136, 0.35)" strokeWidth="1.2" />
                  <circle cx="150" cy="150" r="115" fill="none" stroke="rgba(228, 191, 136, 0.2)" strokeWidth="0.8" />
                  <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(228, 191, 136, 0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
                  <circle cx="150" cy="150" r="10" fill="rgba(228, 191, 136, 0.15)" stroke="rgba(228, 191, 136, 0.5)" strokeWidth="1" />
                  
                  {/* Aspect lines connecting planets in complex mystical web */}
                  {birthChartData.planets.map((p1: any, idx1: number) => 
                    birthChartData.planets.map((p2: any, idx2: number) => {
                      if (idx1 >= idx2) return null;
                      const isAspect = (idx1 + idx2) % 3 === 0;
                      if (!isAspect) return null;
                      
                      const rad1 = (p1.angle * Math.PI) / 180;
                      const rad2 = (p2.angle * Math.PI) / 180;
                      const x1 = 150 + Math.cos(rad1) * 85;
                      const y1 = 150 + Math.sin(rad1) * 85;
                      const x2 = 150 + Math.cos(rad2) * 85;
                      const y2 = 150 + Math.sin(rad2) * 85;
                      
                      return (
                        <line 
                          key={`${idx1}-${idx2}`}
                          x1={x1} y1={y1} x2={x2} y2={y2} 
                          stroke="rgba(228, 191, 136, 0.18)" 
                          strokeWidth="0.75" 
                          strokeDasharray={(idx1 * idx2) % 2 === 0 ? "2 2" : undefined}
                        />
                      );
                    })
                  )}

                  {/* Draw 12 Houses divisions lines */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const x1 = 150 + Math.cos(rad) * 10;
                    const y1 = 150 + Math.sin(rad) * 10;
                    const x2 = 150 + Math.cos(rad) * 115;
                    const y2 = 150 + Math.sin(rad) * 115;
                    return (
                      <line 
                        key={deg}
                        x1={x1} y1={y1} x2={x2} y2={y2} 
                        stroke="rgba(228, 191, 136, 0.08)" 
                        strokeWidth="0.75" 
                      />
                    );
                  })}

                  {/* Outer Zodiac glyph labels */}
                  {zodiacList.map((zod, idx) => {
                    const deg = idx * 30 + 15;
                    const rad = (deg * Math.PI) / 180;
                    const x = 150 + Math.cos(rad) * 125;
                    const y = 150 + Math.sin(rad) * 125 + 4; // adjust text vertical center alignment
                    return (
                      <text 
                        key={zod.name}
                        x={x} y={y} 
                        fill="rgba(228, 191, 136, 0.7)" 
                        fontSize="10" 
                        textAnchor="middle"
                        fontFamily="serif"
                      >
                        {zod.glyph}
                      </text>
                    );
                  })}

                  {/* Plot Planet Coordinates */}
                  {birthChartData.planets.map((planet: any) => {
                    const rad = (planet.angle * Math.PI) / 180;
                    const px = 150 + Math.cos(rad) * 85;
                    const py = 150 + Math.sin(rad) * 85;
                    
                    return (
                      <g key={planet.name} className="cursor-pointer group">
                        <circle cx={px} cy={py} r="8.5" fill="#0f0b1e" stroke="#e4bf88" strokeWidth="1" />
                        <text 
                          x={px} y={py + 3} 
                          fill="#e4bf88" 
                          fontSize="9" 
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {planet.icon}
                        </text>
                        {/* Tooltip on SVG node */}
                        <title>{`${planet.name}: Cung ${planet.sign}, Nhà ${planet.house}`}</title>
                      </g>
                    );
                  })}
                  
                  {/* Ascendant Line arrow */}
                  <g>
                    <line x1="45" y1="150" x2="255" y2="150" stroke="#e4bf88" strokeWidth="1.5" />
                    <polygon points="45,150 55,145 55,155" fill="#e4bf88" />
                    <text x="35" y="153" fill="#e4bf88" fontSize="9" fontWeight="bold">ASC</text>
                  </g>
                </svg>
              </div>

              {/* General brief details card */}
              <div className="flex-1 flex flex-col justify-center gap-4 text-center lg:text-left">
                <span className="text-[10px] tracking-[0.3em] text-[#e4bf88] font-montserrat uppercase font-bold">
                  Bản đồ sao cá nhân của
                </span>
                <h3 className="text-2xl font-lora font-bold text-[#eae3d2] leading-tight">
                  {birthName}
                </h3>
                <div className="w-full h-[1px] bg-[#e4bf88]/15 my-1" />
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-left text-xs font-montserrat">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#dfd9cd]">Ngày sinh gốc:</span>
                    <strong className="text-[#eae3d2]">{new Date(birthDate).toLocaleDateString('vi-VN')}</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#dfd9cd]">Giờ sinh gốc:</span>
                    <strong className="text-[#eae3d2]">{birthTime} (GMT+7)</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#dfd9cd]">Địa điểm sinh:</span>
                    <strong className="text-[#eae3d2]">{birthLocation}</strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#dfd9cd]">Hệ thống nhà:</span>
                    <strong className="text-[#eae3d2]">Placidus (Mặc Định)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Tam Trụ Bản Mệnh (The Big Three) */}
            <div className="w-full flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e4bf88]" />
                <h3 className="text-xs tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
                  Tam Trụ Bản Mệnh (The Big Three)
                </h3>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    key: "sun",
                    data: birthChartData.interpretations.sun,
                    glow: "rgba(255, 179, 0, 0.15)",
                    icon: "🌞"
                  },
                  {
                    key: "moon",
                    data: birthChartData.interpretations.moon,
                    glow: "rgba(106, 90, 205, 0.15)",
                    icon: "🌙"
                  },
                  {
                    key: "asc",
                    data: birthChartData.interpretations.asc,
                    glow: "rgba(0, 229, 255, 0.15)",
                    icon: "🧭"
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    className="bg-glass-dark border border-[#e4bf88]/20 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col gap-3 relative overflow-hidden"
                    style={{ boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px ${item.glow}` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] tracking-wider text-[#e4bf88] font-montserrat uppercase font-semibold">
                          Cung {item.data.sign} {item.data.glyph}
                        </span>
                        <h4 className="text-base font-lora font-bold text-[#eae3d2] leading-snug">
                          {item.key === "sun" ? "Mặt Trời" : item.key === "moon" ? "Mặt Trăng" : "Cung Mọc"}
                        </h4>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#e4bf88]/15 my-1" />
                    <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify">
                      {item.data.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Planets placements detail list */}
            <div className="w-full flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#e4bf88]" />
                <h3 className="text-xs tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
                  Bảng Placements Toàn Diện Hành Tinh
                </h3>
              </div>
              <div className="w-full bg-glass-dark border border-[#e4bf88]/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-3 bg-[#0a0715]/60 px-6 py-3.5 border-b border-[#e4bf88]/15 text-[10px] tracking-wider text-[#e4bf88] uppercase font-bold">
                  <span>Hành Tinh</span>
                  <span>Cung Hoàng Đạo</span>
                  <span className="text-right">Tọa Độ Cung/Nhà</span>
                </div>
                <div className="divide-y divide-[#e4bf88]/10">
                  {birthChartData.planets.map((planet: any) => (
                    <div key={planet.name} className="grid grid-cols-3 px-6 py-4 text-xs font-montserrat hover:bg-white/3 transition-colors duration-200">
                      <div className="flex items-center gap-2 font-medium text-[#eae3d2]">
                        <span className="text-lg filter drop-shadow-[0_1px_4px_rgba(228,191,136,0.3)]">{planet.icon}</span>
                        <span>{planet.name}</span>
                      </div>
                      <div className="flex items-center text-[#eae3d2]">
                        <span>Cung {planet.sign}</span>
                      </div>
                      <div className="flex items-center justify-end text-right text-[#dfd9cd]">
                        <span>Góc {planet.angle}° • Nhà {planet.house}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setBirthChartData(null)}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-[#e4bf88]/35 text-[#eae3d2] hover:text-white transition-all duration-300 font-montserrat text-xs tracking-wider uppercase font-semibold cursor-pointer shadow-md"
            >
              Tính Lại Bản Đồ Sao Khác
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  const renderCosmosTab = () => (
    <div className="w-full flex flex-col items-center justify-start gap-12 mt-4 px-2">
      {/* Tab Header */}
      <div className="text-center select-none">
        <span className="text-[10px] tracking-[0.35em] text-[#e4bf88] font-montserrat uppercase font-bold">
          Spiritual Journey
        </span>
        <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase mt-1">
          Hành Trình Linh Hồn
        </h2>
        <p className="text-xs text-[#dfd9cd] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
          "Những góc chiếu đặc biệt và các điểm nút hoàng đạo tiết lộ bài học nghiệp quả và định hướng phát triển sâu thẳm bên trong em."
        </p>
        <div className="w-16 h-[1.5px] bg-[#e4bf88]/40 mx-auto mt-4" />
      </div>

      {/* Soul Journey Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {NatalData.soulJourney.map((journey, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (idx % 2) * 0.1, duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="bg-glass-dark border border-[#e4bf88]/20 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col items-center text-center gap-3 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-full bg-[#0a0715]/60 border border-[#e4bf88]/25 flex items-center justify-center text-3xl shadow-sm">
              {journey.icon}
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-[9px] tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
                {journey.subtitle}
              </span>
              <h4 className="text-lg font-lora font-bold text-[#eae3d2] uppercase mt-1">
                {journey.title}
              </h4>
            </div>
            <div className="w-12 h-[1px] bg-[#e4bf88]/20 my-1" />
            <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light">
              {journey.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Element Balance */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Element */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#e4bf88]" />
            <h3 className="text-xs tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
              Dòng Chảy Nguyên Tố
            </h3>
          </div>
          {Object.entries(NatalData.elementBalance).map(([name, item]) => (
            <div key={name} className="bg-glass-dark border border-[#e4bf88]/20 p-5 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0a0715]/60 flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-montserrat font-bold text-[#eae3d2] uppercase tracking-wide">
                    Nguyên tố {name}
                  </h4>
                  <span className={`text-[10px] font-montserrat font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.status === "Mạnh" ? "bg-[#a9b388]/20 text-[#cdd5b5]" : "bg-[#d97b6c]/20 text-[#f78c9f]"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light mt-2 text-justify">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modality */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#e4bf88]" />
            <h3 className="text-xs tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
              Bản Sắc Tính Chất
            </h3>
          </div>
          {Object.entries(NatalData.modalityBalance).map(([name, item]) => (
            <div key={name} className="bg-glass-dark border border-[#e4bf88]/20 p-5 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0a0715]/60 flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-montserrat font-bold text-[#eae3d2] uppercase tracking-wide">
                    Tính chất {name}
                  </h4>
                  <span className={`text-[10px] font-montserrat font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.status === "Mạnh" ? "bg-[#a9b388]/20 text-[#cdd5b5]" : "bg-[#d97b6c]/20 text-[#f78c9f]"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light mt-2 text-justify">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGuidanceTab = () => {
    const mbti = NatalData.personalityProfile;
    
    const handleCalculateComp = (e: React.FormEvent) => {
      e.preventDefault();
      setIsCalculatingComp(true);
      setCompResult(null);
      setTimeout(() => {
        const result = getCompatibility(compSign1, compSign2);
        setCompResult(result);
        setIsCalculatingComp(false);
      }, 1200);
    };
    
    return (
      <div className="w-full flex flex-col items-center justify-start gap-12 mt-4 px-2">
        {/* Tab Header */}
        <div className="text-center select-none">
          <span className="text-[10px] tracking-[0.35em] text-[#e4bf88] font-montserrat uppercase font-bold">
            Guidance & Identity
          </span>
          <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase mt-1">
            Căn Tính & Định Mệnh
          </h2>
          <p className="text-xs text-[#dfd9cd] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
            "✦ Hãy cung cấp giờ sinh chính xác ở tab CHARTS để có bản đồ sao cá nhân đầy đủ và chi tiết hơn em nhé!"
          </p>
          <div className="w-16 h-[1.5px] bg-[#e4bf88]/40 mx-auto mt-4" />
        </div>

        {/* Numerology & MBTI grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Numerology */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-glass-dark border border-[#e4bf88]/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e4bf88]/3 to-transparent pointer-events-none" />
            <h3 className="text-[10px] tracking-[0.3em] text-[#e4bf88] font-montserrat uppercase font-bold">
              Numerology
            </h3>
            <span className="text-7xl font-lora font-bold text-[#e4bf88] filter drop-shadow-[0_4px_12px_rgba(228,191,136,0.35)]">
              8
            </span>
            <span className="text-xs tracking-[0.25em] text-[#eae3d2] font-montserrat font-bold uppercase mt-1">
              Con Số Chủ Đạo
            </span>
            <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify mt-2">
              Con số của sự cân bằng và khả năng hiện thực hóa mọi ước mơ. Sự kết hợp giữa năng lượng Kim Ngưu vững chãi và con số 8 đầy quyền năng giúp em làm chủ được vận mệnh, tạo nên những giá trị bền vững từ chính bản lĩnh và nội lực phi thường của mình.
            </p>
          </motion.div>

          {/* MBTI */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-glass-dark border border-[#e4bf88]/20 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e4bf88]/3 to-transparent pointer-events-none" />
            <h3 className="text-[10px] tracking-[0.3em] text-[#e4bf88] font-montserrat uppercase font-bold">
              Astrological Personality Profile
            </h3>
            <span className="text-5xl font-lora font-bold text-[#e4bf88] tracking-[0.1em] filter drop-shadow-[0_4px_12px_rgba(228,191,136,0.35)] mt-2">
              {mbti.mbti}
            </span>
            <span className="text-xs tracking-[0.25em] text-[#eae3d2] font-montserrat font-bold uppercase mt-1">
              {mbti.title}
            </span>
            <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light mt-1">
              {mbti.desc}
            </p>
            <div className="w-full h-[1px] bg-[#e4bf88]/15 my-1" />
            <div className="w-full flex flex-col gap-3 text-left">
              <div className="flex items-start gap-2">
                <Star className="w-3.5 h-3.5 text-[#e4bf88] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-[#eae3d2] font-montserrat">
                  <strong className="text-[#eae3d2] font-semibold">Điểm mạnh:</strong> {mbti.strength}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Sun className="w-3.5 h-3.5 text-[#e4bf88] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-[#eae3d2] font-montserrat">
                  <strong className="text-[#eae3d2] font-semibold">Lời khuyên:</strong> {mbti.advice}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Life Indicators */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#e4bf88]" />
            <h3 className="text-xs tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
              Chỉ Số Sinh Tồn (Life Indicators)
            </h3>
          </div>
          <div className="w-full flex flex-col gap-4">
            {NatalData.lifeIndices.map((index, idx) => (
              <div key={idx} className="bg-glass-dark border border-[#e4bf88]/20 p-5 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-lora font-bold text-[#eae3d2]">
                    {index.title}
                  </h4>
                  <span className="text-xs text-[#e4bf88]">{index.rank}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-montserrat font-bold text-[#e4bf88] w-14 shrink-0">
                    {index.score}%
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#0a0715]/60 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#b8996a] to-[#e4bf88] rounded-full" style={{ width: `${index.score}%` }} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-[#dfd9cd] font-montserrat font-light mt-1">
                  {index.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Soul Resonance / Horoscope Compatibility */}
        <div className="w-full flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#e4bf88]" />
            <h3 className="text-xs tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
              Giao Thoa Tâm Hồn (Soul Resonance)
            </h3>
          </div>
          <div className="bg-glass-dark border border-[#e4bf88]/25 p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-start gap-6 w-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <h4 className="text-sm font-lora font-bold text-[#eae3d2] uppercase tracking-wider text-center">
              Khám Phá Độ Tương Hợp Đôi Lứa
            </h4>
            
            <form onSubmit={handleCalculateComp} className="w-full max-w-lg flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-[#dfd9cd] uppercase font-bold">Em (Cung 1)</label>
                  <select 
                    value={compSign1}
                    onChange={(e) => setCompSign1(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0a0715]/60 border border-[#e4bf88]/25 text-[#eae3d2] text-xs focus:outline-none focus:border-[#e4bf88] transition-all duration-300 font-montserrat"
                  >
                    {zodiacList.map((z) => (
                      <option key={z.name} value={z.name} className="bg-[#120f22] text-[#eae3d2]">
                        {z.glyph} {z.vietnameseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-[#dfd9cd] uppercase font-bold">Người Ấy (Cung 2)</label>
                  <select 
                    value={compSign2}
                    onChange={(e) => setCompSign2(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0a0715]/60 border border-[#e4bf88]/25 text-[#eae3d2] text-xs focus:outline-none focus:border-[#e4bf88] transition-all duration-300 font-montserrat"
                  >
                    {zodiacList.map((z) => (
                      <option key={z.name} value={z.name} className="bg-[#120f22] text-[#eae3d2]">
                        {z.glyph} {z.vietnameseName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCalculatingComp}
                className="mt-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#b8996a] to-[#e4bf88] text-[#050409] font-montserrat font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_18px_rgba(228,191,136,0.2)] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Heart className={`w-4 h-4 ${isCalculatingComp ? "animate-pulse fill-red-500 text-red-500" : ""}`} />
                {isCalculatingComp ? "Đang Giao Thoa Luân Xa..." : "Hòa Quyện Linh Hồn"}
              </button>
            </form>

            {isCalculatingComp && (
              <div className="flex flex-col items-center gap-2 animate-pulse py-4">
                <div className="w-10 h-10 border-2 border-dashed border-[#e4bf88] border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] tracking-wider text-[#e4bf88] uppercase font-bold">Đang tính góc tương hợp hoàng đạo...</span>
              </div>
            )}

            {compResult && !isCalculatingComp && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg bg-[#0a0715]/40 border border-[#e4bf88]/20 p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center gap-3 mt-2"
              >
                <div className="flex items-center justify-center gap-6 select-none">
                  <span className="bg-[#0f0b1e] border border-[#e4bf88]/30 px-4 py-2 rounded-full font-montserrat font-bold text-xs text-[#e4bf88] shadow-sm">
                    {zodiacList.find(z => z.name === compSign1)?.glyph} {zodiacList.find(z => z.name === compSign1)?.vietnameseName}
                  </span>
                  <Heart className="w-5 h-5 text-[#d97b6c] fill-[#d97b6c] animate-pulse" />
                  <span className="bg-[#0f0b1e] border border-[#e4bf88]/30 px-4 py-2 rounded-full font-montserrat font-bold text-xs text-[#e4bf88] shadow-sm">
                    {zodiacList.find(z => z.name === compSign2)?.glyph} {zodiacList.find(z => z.name === compSign2)?.vietnameseName}
                  </span>
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <span className="text-[11px] tracking-widest text-[#dfd9cd] uppercase font-bold font-montserrat">Điểm Số Giao Thoa</span>
                  <span className="text-4xl font-lora font-bold text-[#e4bf88] mt-1 filter drop-shadow-[0_2px_8px_rgba(228,191,136,0.35)]">
                    Tương Hợp: {compResult.score}%
                  </span>
                  <span className="text-[#e4bf88] text-lg tracking-widest mt-1">
                    {"★".repeat(Math.floor(compResult.stars)) + (compResult.stars % 1 !== 0 ? "½" : "") + "☆".repeat(5 - Math.ceil(compResult.stars))}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify mt-2 max-w-md border-t border-[#e4bf88]/15 pt-3">
                  {compResult.analysis}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Technical Data */}
        <div className="w-full flex flex-col gap-4 mt-2 mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#e4bf88]" />
            <h3 className="text-xs tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
              Tọa Độ Bản Mệnh (Technical Data)
            </h3>
          </div>
          <div className="bg-glass-dark border border-[#e4bf88]/20 p-6 rounded-2xl flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between text-xs font-montserrat border-b border-[#e4bf88]/10 pb-2">
              <span className="text-[#dfd9cd]">Kinh độ, Vĩ độ</span>
              <span className="font-semibold text-[#eae3d2]">10.28° N, 105.65° E (Lai Vung, Đồng Tháp)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-montserrat border-b border-[#e4bf88]/10 pb-2">
              <span className="text-[#dfd9cd]">Hệ thống nhà (House System)</span>
              <span className="font-semibold text-[#eae3d2]">Placidus</span>
            </div>
            <div className="flex items-center justify-between text-xs font-montserrat pb-1">
              <span className="text-[#dfd9cd]">Ngày sinh gốc</span>
              <span className="font-semibold text-[#eae3d2]">10/05/2000 | 08:00 AM (GMT+7)</span>
            </div>
            <p className="text-[10px] text-[#dfd9cd] font-montserrat italic text-center mt-3 leading-relaxed">
              ✦ Các chỉ số kỹ thuật phục vụ việc xác định chính xác góc chiếu hành tinh và phân tích lá số chiêm tinh.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderJournalTab = () => (
    <div className="w-full flex flex-col items-center justify-start gap-12 mt-4 px-2">
      {/* Tab Header */}
      <div className="text-center select-none">
        <span className="text-[10px] tracking-[0.35em] text-[#e4bf88] font-montserrat uppercase font-bold">
          Stellar Wisdom Journal
        </span>
        <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase mt-1">
          Nhật Ký Tinh Tú
        </h2>
        <p className="text-xs text-[#dfd9cd] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
          "Chiêm nghiệm tri thức cổ xưa về sự dịch chuyển tinh tú và chu kỳ của linh hồn."
        </p>
        <div className="w-16 h-[1.5px] bg-[#e4bf88]/40 mx-auto mt-4" />
      </div>

      {/* Journal Feed */}
      <div className="flex flex-col gap-6 w-full">
        {[
          {
            date: "19 THÁNG 5, 2026 • BÀI VIẾT NỔI BẬT",
            title: "Nghệ Thuật Sống Chậm Giữa Mùa Sao Thủy Đi Lùi (Mercury Retrograde)",
            excerpt: "Khi Sao Thủy stations đi lùi tại cung Khí, vũ trụ đang gửi tín hiệu nhắc nhở chúng ta dừng lại và nhìn nhận lại chặng đường cũ. Đây không phải thời gian để hoảng loạn, mà là cơ hội vàng để sửa chữa, tái lập mục tiêu và học cách kiên nhẫn với chính mình...",
            readTime: "Đọc 5 phút"
          },
          {
            date: "18 THÁNG 5, 2026 • TRI THỨC MẶT TRĂNG",
            title: "Chu Kỳ 29.5 Ngày Của Mặt Trăng Và Sự Chuyển Hóa Cảm Xúc Nội Tâm",
            excerpt: "Từ kỳ Trăng Non tĩnh lặng cho đến đêm Trăng Tròn rực rỡ, thế giới nội tâm của chúng ta luôn trôi theo nhịp điệu thủy triều của vệ tinh tự nhiên này. Thấu hiểu dòng chảy của trăng giúp bạn chủ động ôm ấp xúc cảm và đón nhận sự bình an thực sự...",
            readTime: "Đọc 4 phút"
          }
        ].map((post, idx) => (
          <motion.article
            key={idx}
initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex-1">
              <span className="text-[9px] tracking-wider text-[#e4bf88] font-montserrat font-bold block mb-1.5">
                {post.date}
              </span>
              <h3 className="text-base font-lora font-bold text-[#eae3d2] mb-2 leading-snug group-hover:text-[#e4bf88] transition-colors">
                {post.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify md:pr-8">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-1.5 self-start md:self-center shrink-0">
              <span className="text-[10px] tracking-wider text-[#dfd9cd] font-montserrat uppercase font-semibold group-hover:text-white transition-colors">
                Xem thêm
              </span>
              <span className="text-[9px] text-[#e4bf88] font-montserrat font-bold bg-[#0a0715] border border-[#e4bf88]/15 px-2.5 py-0.5 rounded-full uppercase">
                {post.readTime}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );

  const updateTarotLimitState = () => {
    if (typeof window !== "undefined") {
      const todayStr = new Date().toLocaleDateString('en-US');
      const localData = localStorage.getItem("lyth_tarot_limit");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed.date === todayStr) {
            const remaining = Math.max(0, 2 - parsed.count);
            setDrawLimit({ canDraw: parsed.count < 2, remaining });
            return;
          }
        } catch (e) {}
      }
      setDrawLimit({ canDraw: true, remaining: 2 });
    }
  };

  const recordTarotDraw = () => {
    if (typeof window !== "undefined") {
      const todayStr = new Date().toLocaleDateString('en-US');
      const localData = localStorage.getItem("lyth_tarot_limit");
      let count = 1;
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed.date === todayStr) {
            count = parsed.count + 1;
          }
        } catch (e) {}
      }
      localStorage.setItem("lyth_tarot_limit", JSON.stringify({ date: todayStr, count }));
      updateTarotLimitState();
    }
  };

  const shuffleTarot = () => {
    const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
    setShuffledTarotDeck(shuffled);
    setSelectedTarot(null);
    setIsTarotFlipped(false);
    setSelectedTarotIndex(null);
  };

  const handleDrawTarot = async (cardIndex: number) => {
    if (!drawLimit.canDraw) {
      alert("✦ Trực giác tinh tú khuyên em: Hôm nay em đã rút đủ 2 lá bài rồi. Hãy chiêm nghiệm sâu sắc lời thì thầm của số mệnh và quay lại vào ngày mai nhé!");
      return;
    }

    const randomCard = majorArcanaTarotDeck[Math.floor(Math.random() * majorArcanaTarotDeck.length)];
    setSelectedTarotIndex(cardIndex);
    recordTarotDraw();

    const apiKey = geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to static meanings
      const fallbackDeck = [...tarotDeck];
      const staticCard = fallbackDeck.find(c => c.englishName === randomCard.englishName) || fallbackDeck[Math.floor(Math.random() * fallbackDeck.length)];
      
      setSelectedTarot({
        ...staticCard,
        name: randomCard.name,
        englishName: randomCard.englishName,
        image: randomCard.image,
        glowColor: randomCard.glowColor
      });
      setIsTarotFlipped(true);
      return;
    }

    setIsGeneratingReading(true);
    setIsTarotFlipped(true);
    
    setSelectedTarot({
      id: randomCard.englishName.toLowerCase().replace(" ", "_"),
      name: randomCard.name,
      englishName: randomCard.englishName,
      image: randomCard.image,
      glowColor: randomCard.glowColor,
      meaning: {
        love: "Đang liên kết luân xa...",
        career: "Đang giải mã sự nghiệp...",
        spirit: "Đang khai mở nhận thức..."
      },
      advice: "Đang truyền tải lời khuyên..."
    });

    try {
      let chartContext = "";
      if (birthChartData) {
        chartContext = `
Thông tin bản đồ sao bản mệnh (Big Three & Các Hành Tinh):
- Cung Mặt Trời: ${birthChartData.interpretations.sun.sign}
- Cung Mặt Trăng: ${birthChartData.interpretations.moon.sign}
- Cung Mọc: ${birthChartData.interpretations.asc.sign}
Các tọa độ hành tinh khác:
${birthChartData.planets.map((p: any) => `- Sao ${p.name}: Cung ${p.sign} (Nhà ${p.house})`).join("\n")}
`;
      }

      const seasonName = currentSeason?.vietnameseName || "Song Tử";
      const prompt = `Bạn là "An Yên Astrologer", một nhà chiêm tinh học và độc bài Tarot vô cùng thông thái, thấu cảm, nói tiếng Việt truyền cảm hứng và nhẹ nhàng. 
Hãy giải nghĩa lá bài Tarot sau đây cho người dùng dựa trên thông tin bản đồ sao cá nhân của họ.

Thông tin người dùng:
- Họ tên: ${birthName || "An Yên"}
- Ngày sinh: ${birthDate}
- Giờ sinh: ${birthTime}
- Nơi sinh: ${birthLocation}
- Cung hoàng đạo mùa sinh: Mùa ${seasonName}${chartContext ? `\n${chartContext}` : ""}

Lá bài đã rút: ${randomCard.name} (${randomCard.englishName})

Yêu cầu đầu ra: Hãy trả về duy nhất một đối tượng JSON chuẩn (không chứa mã markdown, không bọc trong \`\`\`json) có cấu trúc sau:
{
  "name": "${randomCard.name}",
  "englishName": "${randomCard.englishName}",
  "image": "${randomCard.image}",
  "glowColor": "${randomCard.glowColor}",
  "meaning": {
    "love": "Lời giải nghĩa chi tiết, thấu cảm khoảng 2-3 câu về Tình duyên & Kết nối dựa theo lá bài Tarot đã rút và bản đồ sao cá nhân của họ, xưng hô thân thương là 'em' và gọi tên '${birthName || "An Yên"}'.",
    "career": "Lời giải nghĩa chi tiết, sâu sắc khoảng 2-3 câu về Sự nghiệp & Định hướng của họ dựa theo lá bài Tarot và bản đồ sao cá nhân.",
    "spirit": "Lời giải nghĩa chi tiết khoảng 2-3 câu về Tâm hồn & Nhận thức linh hồn dựa theo lá bài Tarot và bản đồ sao cá nhân."
  },
  "advice": "Lời khuyên chân thành, truyền cảm hứng khoảng 2 câu từ An Yên Astrologer dành riêng cho họ ngày hôm nay."
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) throw new Error("Gemini API call failed");
      const resData = await response.json();
      
      const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Invalid response from Gemini API");
      
      const parsedReading = JSON.parse(text);
      setSelectedTarot({
        id: randomCard.englishName.toLowerCase().replace(" ", "_"),
        name: parsedReading.name || randomCard.name,
        englishName: parsedReading.englishName || randomCard.englishName,
        image: parsedReading.image || randomCard.image,
        glowColor: parsedReading.glowColor || randomCard.glowColor,
        meaning: {
          love: parsedReading.meaning?.love || "",
          career: parsedReading.meaning?.career || "",
          spirit: parsedReading.meaning?.spirit || ""
        },
        advice: parsedReading.advice || ""
      });
    } catch (error) {
      console.error("❌ Error generating Gemini Tarot reading:", error);
      const fallbackDeck = [...tarotDeck];
      const staticCard = fallbackDeck.find(c => c.englishName === randomCard.englishName) || fallbackDeck[0];
      setSelectedTarot({
        ...staticCard,
        name: randomCard.name,
        englishName: randomCard.englishName,
        image: randomCard.image,
        glowColor: randomCard.glowColor
      });
    } finally {
      setIsGeneratingReading(false);
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      cosmicAudio.stop();
      setIsMusicPlaying(false);
    } else {
      cosmicAudio.start();
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    loadData();
    shuffleTarot();
    setCurrentSeason(getCurrentZodiacSeason());
    setCurrentMoon(getCurrentMoonPhase());
    updateTarotLimitState();
    
    // Load custom API key from localStorage if present
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("lyth_gemini_api_key");
      if (storedKey) setGeminiApiKey(storedKey);
    }
    
    return () => {
      cosmicAudio.stop();
    };
  }, []);

  // Full-screen Notification Permission Gate Overlay
  const renderPermissionGate = () => {
    const isUnsupported = permissionStatus === "unsupported";
    const isDenied = permissionStatus === "denied";
    const isLoading = permissionStatus === "loading";

    return (
      <motion.div
        key="permission-gate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#12100e] flex flex-col items-center justify-center p-6 text-center select-none"
      >
        {/* Soft glowing background nebulas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#e4bf88]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full blur-[100px] bg-[#a9b388]/5 pointer-events-none" />

        <div className="relative flex flex-col items-center max-w-sm px-6 gap-6 z-10">
          {/* Logo with pulsating celestial ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#e4bf88]/30 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border border-dotted border-[#e4bf88]/20 animate-spin-slow reverse" />
            <div className="w-16 h-16 rounded-full border border-[#e4bf88]/30 flex items-center justify-center bg-[#0a0715]/60 backdrop-blur-md overflow-hidden shadow-[0_0_25px_rgba(228,191,136,0.2)] animate-pulse">
              <Image
                src="/app_icon.jpg"
                alt="Lyth Logo"
                width={48}
                height={48}
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.35em] text-[#e4bf88] font-montserrat uppercase font-bold">
              ✦ Lyth Cosmic Gate ✦
            </span>
            <h2 className="text-xl sm:text-2xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase leading-snug">
              {isUnsupported ? "Thêm Vào Màn Hình Chính" : "Kích Hoạt Thông Điệp"}
            </h2>
            <div className="w-12 h-[1.5px] bg-[#e4bf88]/40 mx-auto mt-2" />
          </div>

          {/* Core instruction text */}
          <div className="text-xs leading-relaxed text-[#dfd9cd] font-montserrat font-light px-2">
            {isUnsupported ? (
              <div className="flex flex-col gap-3 text-justify sm:text-center">
                <p>
                  Để bắt đầu nhận thông điệp chiêm tinh ngày mới và sử dụng Lyth, em vui lòng thêm ứng dụng vào Màn hình chính (PWA):
                </p>
                <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex flex-col gap-2 text-left">
                  <p className="flex gap-2"><strong className="text-[#e4bf88]">1.</strong> Nhấn nút <strong>Chia sẻ (Share)</strong> trên trình duyệt Safari.</p>
                  <p className="flex gap-2"><strong className="text-[#e4bf88]">2.</strong> Cuộn xuống và chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.</p>
                  <p className="flex gap-2"><strong className="text-[#e4bf88]">3.</strong> Mở ứng dụng từ Màn hình chính để kích hoạt.</p>
                </div>
              </div>
            ) : isDenied ? (
              <div className="flex flex-col gap-3 text-center">
                <p className="text-red-400/90 font-medium">
                  Quyền thông báo đang bị tắt trên thiết bị của em.
                </p>
                <p>
                  Lyth cần quyền này để gửi thông điệp ngày mới. Vui lòng vào <strong>Cài đặt trình duyệt / Cài đặt thiết bị</strong> để bật lại quyền thông báo cho trang web này em nhé!
                </p>
              </div>
            ) : (
              <p>
                Chào mừng em đến với Lyth. Để tiếp nhận thông điệp linh hồn mỗi ngày và bắt đầu hành trình chiêm tinh, em vui lòng kích hoạt quyền nhận thông báo của thiết bị nhé.
              </p>
            )}
          </div>

          {/* Action button */}
          {!isUnsupported && !isDenied && (
            <button
              onClick={requestPermission}
              disabled={isLoading}
              className="mt-2 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#b8996a] to-[#e4bf88] text-[#050409] font-montserrat font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_22px_rgba(228,191,136,0.3)] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Kích Hoạt Nhận Tin
                </>
              )}
            </button>
          )}

          {/* Refresh / Retry options */}
          {(isUnsupported || isDenied) && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs text-[#eae3d2] hover:bg-white/10 transition-all font-montserrat font-semibold cursor-pointer"
            >
              Thử Lại / Tải Lại Trang
            </button>
          )}

        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* 1. Immersive Space starfield and nebula canvas */}
      <CosmicBackground />

      <AnimatePresence mode="wait">
        {loading ? (
          // Astrological Loader (Dark Premium theme)
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 bg-[#12100e] flex flex-col items-center justify-center animate-fade-in"
          >
            {/* Soft gold loader background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#e4bf88]/10 blur-[130px] rounded-full" />

            <div className="relative flex flex-col items-center max-w-sm px-8 text-center select-none">
              
              {/* Outer Celestial Compass Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-36 h-36 rounded-full border border-dashed border-[#e4bf88]/30 flex items-center justify-center relative"
              >
                {/* Zodiac node dots reflecting premium gold and earth colors */}
                <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#e4bf88] shadow-[0_0_12px_rgba(228,191,136,0.6)]" />
                <div className="absolute bottom-0 w-2 h-2 rounded-full bg-[#a9b388]" />
                <div className="absolute left-0 w-2 h-2 rounded-full bg-[#b8996a]" />
                <div className="absolute right-0 w-2 h-2 rounded-full bg-[#e4bf88]" />

                {/* Mid Concentric Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-28 h-28 rounded-full border border-[#e4bf88]/15 flex items-center justify-center"
                >
                  {/* Astrological Astrolabe center displaying native App Icon */}
                  <div className="w-16 h-16 rounded-full border border-[#e4bf88]/20 flex items-center justify-center bg-[#0a0715]/40 backdrop-blur-md relative overflow-hidden shadow-[0_0_20px_rgba(228,191,136,0.15)]">
                    <Image
                      src="/app_icon.jpg"
                      alt="Lyth Astrologer Loading"
                      width={48}
                      height={48}
                      priority
                      className="rounded-full object-cover scale-110 opacity-90 animate-pulse"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Loader Subtitles */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-col items-center"
              >
                <h2 className="text-sm font-lora tracking-[0.3em] text-[#e4bf88] uppercase font-bold text-glow-gold">
                  AN YÊN ASTROLOGER
                </h2>
                
                {/* Glowing Text Phase info */}
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 0.8, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  className="text-[11px] tracking-[0.1em] font-montserrat text-[#dfd9cd] font-light mt-3 h-6"
                >
                  {loadingText}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ) : permissionStatus !== "granted" ? (
          renderPermissionGate()
        ) : (
          // Main Dashboard Panel (Dark Premium theme)
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col justify-between bg-transparent"
          >
            {/* Header section */}
            <header className="w-full px-6 py-4 md:py-6 md:px-12 flex flex-col md:flex-row items-center justify-between border-b border-[#e4bf88]/15 bg-glass-dark/45 backdrop-blur-md z-20 gap-4 md:gap-0">
              
              {/* Row container for Mobile Logo & Mobile User Panel */}
              <div className="flex w-full md:w-auto items-center justify-between">
                {/* Logo displaying native App Icon */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#e4bf88]/30 shadow-[0_4px_12px_rgba(228,191,136,0.15)]">
                    <Image
                      src="/app_icon.jpg"
                      alt="Lyth App Icon"
                      width={36}
                      height={36}
                      priority
                      className="object-cover w-full h-full scale-105"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-lora tracking-[0.2em] font-bold text-[#eae3d2]">
                      LYTH
                    </span>
                    <span className="text-[8px] tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
                      AN YÊN ASTROLOGER
                    </span>
                  </div>
                </div>

                {/* Mobile User Panel info (Hidden on Desktop) */}
                <div className="flex md:hidden items-center gap-2.5">
                  <NotificationBell />
                  <button 
                    onClick={toggleMusic}
                    aria-label="Toggle cosmic ambient music"
                    className={`p-2 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center relative overflow-hidden ${
                      isMusicPlaying 
                        ? 'bg-[#e4bf88]/20 border-[#e4bf88]/50 text-[#e4bf88] shadow-[0_0_12px_rgba(228,191,136,0.3)]' 
                        : 'bg-white/5 border-white/10 text-[#dfd9cd] hover:text-[#eae3d2] hover:border-white/20'
                    }`}
                  >
                    {isMusicPlaying ? (
                      <div className="flex items-end gap-[2px] h-3.5 px-0.5">
                        <span className="w-[2px] bg-[#e4bf88] rounded-full animate-soundwave-1" />
                        <span className="w-[2px] bg-[#e4bf88] rounded-full animate-soundwave-2" />
                        <span className="w-[2px] bg-[#e4bf88] rounded-full animate-soundwave-3" />
                      </div>
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    onClick={loadData}
                    aria-label="Refresh horoscope readings"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#e4bf88]/30 text-[#dfd9cd] hover:text-[#eae3d2] transition-all duration-300 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#e4bf88]' : ''}`} />
                  </button>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="Go to welcome cover"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#e4bf88]/30 text-[#dfd9cd] hover:text-[#eae3d2] transition-all duration-300 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#e4bf88]" />
                  </button>
                </div>
              </div>

              {/* Lịch Nhật - Nguyệt Tinh Tú (Celestial Sun & Moon Status Pill) */}
              {currentSeason && currentMoon ? (
                <div className="relative z-30">
                  <button
                    onClick={() => setShowStellarDropdown(!showStellarDropdown)}
                    className={`flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-[#262118]/75 border transition-all duration-300 shadow-md cursor-pointer select-none group ${
                      showStellarDropdown 
                        ? 'border-[#e4bf88] bg-[#332b20]/90 shadow-[0_0_15px_rgba(228,191,136,0.25)]' 
                        : 'border-[#e4bf88]/20 hover:border-[#e4bf88]/50 hover:bg-[#332b20]/40'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs text-[#e4bf88] filter drop-shadow-[0_0_4px_rgba(228,191,136,0.3)] animate-pulse">{currentSeason.glyph}</span>
                      <span className="text-[10px] sm:text-xs font-montserrat font-semibold text-[#eae3d2] tracking-wider group-hover:text-[#e4bf88] transition-colors">
                        Mùa {currentSeason.vietnameseName}
                      </span>
                    </span>
                    <span className="w-[1px] h-3.5 bg-[#e4bf88]/25" />
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs filter drop-shadow-[0_0_4px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">{currentMoon.glyph}</span>
                      <span className="text-[10px] sm:text-xs font-montserrat text-[#dfd9cd] group-hover:text-[#eae3d2] transition-colors">
                        Pha Trăng: {currentMoon.name.split(" ")[0]}
                      </span>
                    </span>
                    <span className="text-[9px] text-[#e4bf88] transition-transform duration-300 group-hover:translate-y-[1px]">
                      {showStellarDropdown ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Elegant Floating Glassmorphic Dropdown Panel */}
                  <AnimatePresence>
                    {showStellarDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute top-12 left-1/2 -translate-x-1/2 w-[310px] sm:w-[350px] bg-[#2b241b]/95 backdrop-blur-2xl border border-[#e4bf88]/30 rounded-3xl p-5.5 shadow-[0_20px_50px_rgba(0,0,0,0.6),_0_0_20px_rgba(228,191,136,0.1)] flex flex-col gap-4 text-left pointer-events-auto"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#e4bf88]/3 to-transparent rounded-3xl pointer-events-none" />
                        
                        {/* Dropdown Header */}
                        <div className="flex items-center justify-between border-b border-[#e4bf88]/15 pb-3 z-10 select-none">
                          <div className="flex items-center gap-1.5">
                            <Sparkle className="w-3.5 h-3.5 text-[#e4bf88] fill-[#e4bf88] animate-pulse" />
                            <span className="text-[10.5px] tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
                              Lịch Nhật - Nguyệt Hôm Nay
                            </span>
                          </div>
                          <span className="text-[9.5px] font-montserrat font-bold bg-[#eae3d2]/5 border border-[#e4bf88]/20 px-2 py-0.5 rounded text-[#eae3d2]">
                            {new Date().toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        {/* Dropdown Content */}
                        <div className="flex flex-col gap-4.5 z-10">
                          {/* Zodiac Season Section */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl filter drop-shadow-[0_1px_6px_rgba(228,191,136,0.4)]">{currentSeason.glyph}</span>
                              <h4 className="text-xs tracking-wider text-[#e4bf88] font-montserrat uppercase font-bold">
                                Mùa {currentSeason.vietnameseName} ({currentSeason.name})
                              </h4>
                            </div>
                            <p className="text-[11.5px] leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify pl-1">
                              {currentSeason.vibe}
                            </p>
                          </div>

                          <div className="w-full h-[1px] bg-[#e4bf88]/10" />

                          {/* Moon Phase Section */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl filter drop-shadow-[0_1px_6px_rgba(255,255,255,0.25)]">{currentMoon.glyph}</span>
                              <h4 className="text-xs tracking-wider text-[#eae3d2] font-montserrat uppercase font-bold">
                                {currentMoon.name}
                              </h4>
                            </div>
                            <p className="text-[11.5px] leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify pl-1">
                              {currentMoon.desc}
                            </p>
                          </div>

                          {/* Astro Tip of the Day Card */}
                          <div className="bg-[#e4bf88]/6 border border-[#e4bf88]/25 p-3.5 rounded-2xl flex flex-col gap-1">
                            <h5 className="text-[10px] tracking-[0.2em] text-[#e4bf88] font-montserrat uppercase font-bold flex items-center gap-1 select-none">
                              <Star className="w-3 h-3 text-[#e4bf88] fill-[#e4bf88] animate-pulse" />
                              Lời Khuyên Cát Tường
                            </h5>
                            <p className="text-[11px] leading-relaxed text-[#eae3d2] font-montserrat font-light italic text-justify">
                              "{currentMoon.advice}"
                            </p>
                          </div>
                        </div>

                        {/* Close Dropdown Overlay Button */}
                        <button
                          onClick={() => setShowStellarDropdown(false)}
                          className="w-full mt-1.5 py-2.5 rounded-xl border border-[#e4bf88]/20 bg-white/5 hover:bg-[#e4bf88]/10 text-center text-[10px] tracking-widest text-[#eae3d2] hover:text-white font-montserrat uppercase font-semibold transition-all duration-300 cursor-pointer shadow-sm"
                        >
                          Đóng Chiêm Nghiệm
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="w-32 h-8 rounded-full bg-glass-dark border border-[#e4bf88]/10 animate-pulse" />
              )}

              {/* Desktop User Panel info (Hidden on Mobile) */}
              <div className="hidden md:flex items-center gap-3.5">
                <NotificationBell />
                {/* Music Wave Player */}
                <button 
                  onClick={toggleMusic}
                  className={`flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-300 group shadow-md ${
                    isMusicPlaying 
                      ? 'bg-[#e4bf88]/20 border-[#e4bf88]/50 text-[#e4bf88] shadow-[0_0_15px_rgba(228,191,136,0.25)]' 
                      : 'bg-glass-dark border-[#e4bf88]/20 text-[#dfd9cd] hover:border-[#e4bf88]/35 hover:text-[#eae3d2]'
                  }`}
                >
                  {isMusicPlaying ? (
                    <>
                      <div className="flex items-end gap-[2px] h-3.5">
                        <span className="w-[2px] bg-[#e4bf88] rounded-full animate-soundwave-1" />
                        <span className="w-[2px] bg-[#e4bf88] rounded-full animate-soundwave-2" />
                        <span className="w-[2px] bg-[#e4bf88] rounded-full animate-soundwave-3" />
                      </div>
                      <span className="text-[10px] tracking-wider font-montserrat uppercase font-semibold">Tần Số Vũ Trụ</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#dfd9cd] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] tracking-wider font-montserrat uppercase font-semibold">Tần Số Vũ Trụ Off</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={loadData}
                  aria-label="Refresh horoscope readings"
                  className="p-2 rounded-full bg-glass-dark border border-[#e4bf88]/20 text-[#dfd9cd] hover:text-[#eae3d2] hover:border-[#e4bf88]/35 transition-all duration-300 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#e4bf88]' : ''}`} />
                </button>
                
                <div 
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex items-center gap-2 bg-glass-dark border border-[#e4bf88]/20 px-4 py-1.5 rounded-full text-xs cursor-pointer hover:border-[#e4bf88]/35 hover:bg-[#eae3d2]/5 transition-all duration-300 group shadow-md"
                >
                  <Compass className="w-3.5 h-3.5 text-[#e4bf88] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] tracking-wider text-[#eae3d2] font-montserrat uppercase font-semibold">
                    Cổng Vũ Trụ
                  </span>
                </div>
              </div>
            </header>

            {/* Dashboard Contents */}
            <main className="flex-1 flex flex-col items-center justify-start py-6 pb-28 md:py-10 md:pb-10 z-10 w-full max-w-5xl mx-auto px-3 sm:px-4 gap-16 md:gap-20">
              {activeTab === "messages" && (
                <>
                  {/* HERO INTRO SECTION: TAP TO UNVEIL ORACLE */}
              <section className="w-full min-h-[85vh] flex flex-col items-center justify-center text-center select-none px-4 py-8 relative">
                {/* Decorative glowing backdrops */}
                <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#e4bf88]/5 to-transparent blur-[100px] pointer-events-none" />

                {/* Main floating circle app logo */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 1.2 }}
                  className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#e4bf88]/30 shadow-[0_15px_45px_rgba(228,191,136,0.15)] mb-8 flex items-center justify-center p-1.5 bg-glass-dark"
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src="/app_icon.jpg"
                      alt="Lyth Logo"
                      width={128}
                      height={128}
                      priority
                      className="object-cover w-full h-full scale-105"
                    />
                  </div>
                  {/* Floating particles or decorative ring */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#e4bf88]/25 animate-spin-slow pointer-events-none" />
                </motion.div>

                {/* Mystic Branding Header */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="flex flex-col items-center max-w-lg"
                >
                  <span className="text-[10px] tracking-[0.4em] text-[#e4bf88] font-montserrat uppercase font-bold mb-2">
                    An Yên Astrologer • Lyth
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-lora font-bold text-[#eae3d2] leading-tight tracking-wide uppercase">
                    Lời Thì Thầm Của Những Vì Sao
                  </h1>
                  <p className="text-xs sm:text-sm text-[#dfd9cd] font-montserrat font-light tracking-wide mt-3 max-w-sm leading-relaxed">
                    Vũ trụ bao la chứa đựng những thông điệp cát tường dành riêng cho bạn. Hãy tĩnh tâm và đón nhận.
                  </p>
                </motion.div>

                {/* THE BIG, BEAUTIFUL, FLASHING BOUNCING ORACLE BUTTON WITH MYSTICAL GOLD AURA */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="mt-16 z-20 relative flex flex-col items-center"
                >
                  {/* 1. Large shimmering celestial gold nebula glow behind button */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.25, 1],
                      opacity: [0.3, 0.65, 0.3],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full bg-gradient-to-r from-[#e4bf88]/15 via-[#b8996a]/25 to-transparent blur-[50px] pointer-events-none -z-10"
                  />

                  {/* 2. Concentric spinning thin gold astrolabe lines behind the button */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] rounded-full border border-dashed border-[#e4bf88]/20 -z-10 flex items-center justify-center pointer-events-none"
                  >
                    <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-[#e4bf88]" />
                    <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#e4bf88]" />
                  </motion.div>
                  
                  {/* 3. The actual bouncing & pulsing Button container */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <button
                      onClick={() => messageSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                      className="relative px-8 py-4.5 sm:px-11 sm:py-5.5 rounded-full bg-[#0a0715]/75 border-2 border-[#e4bf88]/40 text-[#eae3d2] font-montserrat font-bold text-xs tracking-[0.25em] uppercase cursor-pointer hover:bg-[#120f22] hover:border-[#e4bf88] hover:scale-105 transition-all duration-300 shadow-[0_15px_45px_rgba(0,0,0,0.5),_inset_0_4px_12px_rgba(255,255,255,0.05)] hover:shadow-[0_20px_55px_rgba(228,191,136,0.25)] group flex flex-col items-center gap-2 select-none overflow-hidden"
                    >
                      {/* Gold light sweep shimmer effect across the button */}
                      <span className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine-slow pointer-events-none" />

                      {/* Continuous double ring pulsing underlay */}
                      <span className="absolute -inset-1 rounded-full border border-[#e4bf88]/30 animate-ping opacity-50 pointer-events-none" />
                      <span className="absolute -inset-3 rounded-full border border-[#e4bf88]/15 animate-pulse opacity-40 pointer-events-none" />
                      
                      <div className="flex items-center gap-3 z-10">
                        {/* Glowing Starburst */}
                        <motion.div
                          animate={{ scale: [1, 1.25, 1], rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Star className="w-3.5 h-3.5 text-[#e4bf88] fill-[#e4bf88]" />
                        </motion.div>

                        <span className="text-glow-gold relative font-bold tracking-[0.22em] text-[#eae3d2] text-[10.5px] sm:text-xs">
                          Xem Thông Điệp Hôm Nay
                        </span>

                        <motion.div
                          animate={{ scale: [1, 1.25, 1], rotate: -360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Star className="w-3.5 h-3.5 text-[#e4bf88] fill-[#e4bf88]" />
                        </motion.div>
                      </div>

                      {/* Downward bouncing arrow */}
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 -rotate-90 text-[#e4bf88] animate-bounce stroke-[2] mt-0.5 z-10" />
                    </button>
                  </motion.div>
                </motion.div>
              </section>

              {/* SECTION 1: DÙNG ĐỂ HIỂN THỊ DỮ LIỆU ĐANG CHỌN */}
              <section ref={messageSectionRef} className="w-full flex flex-col items-center justify-center min-h-[75vh] pt-20">
                {/* Dynamic Celestial Alignments Heading */}
                <div className="text-center mb-4 px-4 select-none">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Star className="w-3 h-3 text-[#e4bf88] fill-[#e4bf88] animate-pulse" />
                      <span className="text-[10px] tracking-[0.35em] text-[#e4bf88] font-montserrat uppercase font-bold">
                        Daily Message Oracle
                      </span>
                      <Star className="w-3 h-3 text-[#e4bf88] fill-[#e4bf88] animate-pulse" />
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl font-lora font-bold text-glow-gold tracking-widest text-[#eae3d2] uppercase">
                      Thông Điệp Vũ Trụ
                    </h1>
                    
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#e4bf88]/30 to-transparent mt-3.5" />
                  </motion.div>
                </div>

                {/* Dynamic Card Carousel (Core Feature) */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                  className="w-full flex items-center justify-center"
                >
                  <StellarCarousel messages={messages} />
                </motion.div>

                {/* WIDGET 1: TRẢI BÀI TAROT CỔ HỌC */}
                <div className="w-full flex flex-col items-center justify-start mt-20 px-4 border-t border-[#e4bf88]/15 pt-20">
                  <div className="text-center mb-10 select-none">
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <Sparkle className="w-3.5 h-3.5 text-[#e4bf88] fill-[#e4bf88] animate-pulse" />
                      <span className="text-[10px] tracking-[0.35em] text-[#e4bf88] font-montserrat uppercase font-bold">
                        Mystical Tarot Reading
                      </span>
                      <Sparkle className="w-3.5 h-3.5 text-[#e4bf88] fill-[#e4bf88] animate-pulse" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase">
                      Trải Bài Tarot Cổ Học
                    </h2>
                    <p className="text-xs text-[#dfd9cd] font-lora italic tracking-wider mt-2.5 max-w-md mx-auto">
                      "Tĩnh tâm và rút một lá bài ngẫu nhiên để xem thông điệp của linh hồn dành cho em ngày hôm nay."
                    </p>
                    <div className="mt-3.5 select-none">
                      {drawLimit.remaining === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-[10px] font-medium font-montserrat text-red-400 tracking-wider">
                          ✦ Hôm nay em đã dùng hết 2/2 lượt rút bài. Hãy quay lại vào ngày mai nhé!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4bf88]/30 bg-[#e4bf88]/5 text-[10px] font-medium font-montserrat text-[#e4bf88] tracking-wider animate-pulse">
                          ✦ Hôm nay em còn: {drawLimit.remaining}/2 lượt rút bài cát tường
                        </span>
                      )}
                    </div>
                    <div className="w-16 h-[1.5px] bg-[#e4bf88]/30 mx-auto mt-4" />
                  </div>

                  {/* Cards grid */}
                  <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-12">
                    {!isTarotFlipped ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        {[0, 1, 2].map((idx) => (
                          <motion.div
                            key={idx}
                            whileHover={drawLimit.canDraw ? { y: -12, scale: 1.05 } : {}}
                            whileTap={drawLimit.canDraw ? { scale: 0.95 } : {}}
                            onClick={() => {
                              handleDrawTarot(idx);
                            }}
                            className={`w-[140px] h-[220px] sm:w-[160px] sm:h-[260px] rounded-2xl border-2 transition-all duration-300 bg-gradient-to-b from-[#1b152d] to-[#0a0715] shadow-[0_12px_28px_rgba(0,0,0,0.6)] flex flex-col items-center justify-between p-4 relative overflow-hidden group ${
                              drawLimit.canDraw 
                                ? "border-[#e4bf88]/30 cursor-pointer" 
                                : "border-[#e4bf88]/10 cursor-not-allowed opacity-40 grayscale"
                            }`}
                          >
                            {/* Card Back details (Magical Astrolabe frame) */}
                            <div className="absolute inset-2 rounded-xl border border-[#e4bf88]/20 flex flex-col items-center justify-between py-6">
                              <div className="text-[10px] tracking-widest text-[#e4bf88]/50 font-montserrat">LYTH</div>
                              <div className="w-14 h-14 rounded-full border border-dashed border-[#e4bf88]/20 flex items-center justify-center animate-spin-slow">
                                <span className="text-xl text-[#e4bf88]/40 font-lora">♏</span>
                              </div>
                              <div className="text-[10px] tracking-widest text-[#e4bf88]/50 font-montserrat">TAROT</div>
                            </div>
                            {/* Shimmer effect */}
                            {drawLimit.canDraw && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center gap-8">
                        {/* 3D Flipped Card */}
                        <motion.div
                          initial={{ rotateY: 180, scale: 0.8, opacity: 0 }}
                          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="w-[180px] h-[290px] sm:w-[200px] sm:h-[320px] rounded-2xl border-2 border-[#e4bf88] bg-[#120f22] shadow-[0_15px_45px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-5 relative overflow-hidden"
                          style={{ 
                            boxShadow: `0 0 35px ${selectedTarot?.glowColor || 'rgba(228,191,136,0.2)'}`
                          }}
                        >
                          <div className="absolute inset-2 rounded-xl border border-[#e4bf88]/30 flex flex-col items-center justify-between py-6 z-10">
                            <span className="text-[9px] tracking-[0.25em] text-[#e4bf88] font-montserrat uppercase font-bold">
                              {selectedTarot?.englishName}
                            </span>
                            <span className="text-6xl sm:text-7xl filter drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]">
                              {selectedTarot?.image}
                            </span>
                            <span className="text-xs tracking-widest text-[#e4bf88] font-montserrat uppercase font-semibold">
                              AN YÊN TAROT
                            </span>
                          </div>
                          {/* Mystical glow underlay */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[45px] pointer-events-none opacity-50 bg-[#e4bf88]" />
                        </motion.div>

                        {/* Tarot Readings details */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="w-full bg-[#120e20]/80 backdrop-blur-md border border-[#e4bf88]/20 p-6 sm:p-8 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex flex-col gap-6 text-left"
                        >
                          <div className="text-center border-b border-[#e4bf88]/15 pb-4">
                            <h3 className="text-xl font-lora font-bold text-[#e4bf88]">
                              {selectedTarot?.name}
                            </h3>
                            <span className="text-[9px] tracking-widest text-[#dfd9cd] font-montserrat uppercase block mt-1">
                              Lá Bài Thông Điệp Ngày Hôm Nay
                            </span>
                          </div>

                          {isGeneratingReading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center select-none min-h-[300px]">
                              {/* Glowing spinning astrolabe */}
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 rounded-full border border-dashed border-[#e4bf88] flex items-center justify-center relative mb-6"
                              >
                                <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#e4bf88] shadow-[0_0_12px_rgba(228,191,136,0.8)]" />
                                <div className="w-14 h-14 rounded-full border border-[#e4bf88]/20 flex items-center justify-center bg-white/5">
                                  <Sparkle className="w-6 h-6 text-[#e4bf88] animate-pulse" />
                                </div>
                              </motion.div>
                              <h4 className="text-sm font-lora font-bold text-[#e4bf88] tracking-wide animate-pulse">
                                Đang Giao Thoa Năng Lượng Vũ Trụ...
                              </h4>
                              <p className="text-[11px] text-[#dfd9cd] font-lora italic mt-3 max-w-sm leading-relaxed px-4">
                                "Độc bài Tarot dựa theo ngày sinh <span className="text-[#e4bf88]">{birthDate}</span>, cung hoàng đạo và bản mệnh của <span className="text-[#e4bf88]">{birthName || "An Yên"}</span> qua Gemini AI..."
                              </p>
                              <div className="mt-5 flex gap-1.5 justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#e4bf88]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#e4bf88]/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#e4bf88]/80 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-5">
                              <div>
                                <h4 className="text-xs tracking-widest text-[#e4bf88] font-montserrat uppercase font-bold flex items-center gap-1.5">
                                  <Heart className="w-3.5 h-3.5 text-[#d97b6c] fill-[#d97b6c]" />
                                  Tình Duyên & Kết Nối (Love & Connection)
                                </h4>
                                <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light mt-2 text-justify">
                                  {selectedTarot?.meaning.love}
                                </p>
                              </div>

                              <div className="w-full h-[1px] bg-[#e4bf88]/10" />

                              <div>
                                <h4 className="text-xs tracking-widest text-[#e4bf88] font-montserrat uppercase font-bold flex items-center gap-1.5">
                                  <Compass className="w-3.5 h-3.5 text-[#e4bf88]" />
                                  Sự Nghiệp & Định Hướng (Career & Path)
                                </h4>
                                <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light mt-2 text-justify">
                                  {selectedTarot?.meaning.career}
                                </p>
                              </div>

                              <div className="w-full h-[1px] bg-[#e4bf88]/10" />

                              <div>
                                <h4 className="text-xs tracking-widest text-[#e4bf88] font-montserrat uppercase font-bold flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-[#a9b388]" />
                                  Tâm Hồn & Nhận Thức (Soul & Spirit)
                                </h4>
                                <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light mt-2 text-justify">
                                  {selectedTarot?.meaning.spirit}
                                </p>
                              </div>

                              <div className="w-full h-[1px] bg-[#e4bf88]/10" />

                              <div className="bg-white/5 border border-[#e4bf88]/20 p-4 rounded-xl">
                                <h4 className="text-xs tracking-widest text-[#e4bf88] font-montserrat uppercase font-bold flex items-center gap-1.5">
                                  <Star className="w-3.5 h-3.5 text-[#e4bf88] fill-[#e4bf88]" />
                                  Lời khuyên từ An Yên Astrologer
                                </h4>
                                <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light mt-2 text-justify italic">
                                  "{selectedTarot?.advice}"
                                </p>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={shuffleTarot}
                            className="mt-4 px-6 py-3 rounded-full bg-white/10 hover:bg-[#e4bf88]/10 border border-[#e4bf88]/30 text-[#eae3d2] hover:text-white transition-all duration-300 font-montserrat text-xs tracking-wider uppercase font-semibold cursor-pointer w-full text-center shadow-md hover:border-[#e4bf88]/50"
                          >
                            Xáo Bài & Rút Lại Lá Mới
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Gemini API Key Configuration Panel */}
                  <div className="w-full max-w-md flex flex-col items-center justify-center mt-10 relative z-10 select-none">
                    <button
                      onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-[#e4bf88]/10 border border-[#e4bf88]/20 hover:border-[#e4bf88]/40 text-[#dfd9cd] hover:text-white transition-all duration-300 font-montserrat text-[10px] tracking-wider uppercase cursor-pointer shadow-sm"
                    >
                      <Key className="w-3.5 h-3.5 text-[#e4bf88] animate-pulse" />
                      {showApiKeyInput ? "Đóng Cấu Hình AI" : "Cấu Hình Gemini API Key"}
                    </button>
                    
                    {showApiKeyInput && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-[#1a1714]/90 backdrop-blur-md border border-[#e4bf88]/20 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] mt-4 flex flex-col gap-3 text-left"
                      >
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] tracking-wider text-[#e4bf88] uppercase font-bold">
                            Nhập Gemini API Key Của Bạn
                          </label>
                          <p className="text-[10px] text-[#dfd9cd]/70 italic leading-normal">
                            Key được lưu an toàn tại trình duyệt của bạn (localStorage) và chỉ sử dụng trực tiếp để kết nối Gemini API.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={geminiApiKey}
                            onChange={(e) => {
                              setGeminiApiKey(e.target.value);
                              localStorage.setItem("lyth_gemini_api_key", e.target.value);
                            }}
                            placeholder="AIzaSy..."
                            className="flex-1 bg-white/5 border border-[#e4bf88]/30 rounded-xl px-4 py-2.5 text-xs text-[#eae3d2] focus:outline-none focus:border-[#e4bf88] transition-all"
                          />
                          {geminiApiKey && (
                            <button
                              onClick={() => {
                                setGeminiApiKey("");
                                localStorage.removeItem("lyth_gemini_api_key");
                              }}
                              className="px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs transition-all cursor-pointer font-montserrat"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                        <p className="text-[9px] text-[#dfd9cd]/50 leading-relaxed">
                          * Nếu không có API Key hoặc bị lỗi, hệ thống tự động sử dụng kho thông điệp Rider-Waite truyền thống được biên soạn sẵn từ An Yên Astrologer.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION: CELESTIAL GATEWAY (SCROLL REVEAL GATEWAY - MONOLITHIC SLIDING GATES) */}
              <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl border border-[#e4bf88]/20 bg-glass-dark shadow-[0_12px_45px_rgba(0,0,0,0.5)] my-10 select-none">
                
                {/* 1. Behind the gates: The Mystical Glowing Diamond Relic */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                  {/* Radial golden glow */}
                  <div className="absolute w-[250px] h-[250px] rounded-full bg-[#e4bf88]/10 blur-[80px]" />
                  
                  {/* Bobbing and spinning diamond */}
                  <motion.div
                    style={{ scale: relicScale, rotate: relicRotate }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-2xl border-2 border-[#e4bf88] bg-glass-dark flex items-center justify-center shadow-[0_0_40px_rgba(228,191,136,0.25)] relative overflow-hidden"
                  >
                    {/* Glowing Core */}
                    <div className="absolute w-6 h-6 rounded-full bg-[#e4bf88] animate-ping" />
                    <Compass className="w-10 h-10 text-[#e4bf88] stroke-[1.2]" />
                  </motion.div>
                  
                  <h3 className="text-sm font-lora tracking-[0.25em] font-bold text-[#eae3d2] mt-6 z-10 uppercase">
                    CỔNG VŨ TRỤ ĐÃ MỞ
                  </h3>
                  <span className="text-[9px] tracking-widest text-[#dfd9cd] font-montserrat uppercase mt-1.5">
                    Trí Tuệ Cát Tường Đang Khởi Sắc
                  </span>
                </div>

                {/* 2. Horizontal sliding gates */}
                {/* Left Gate */}
                <motion.div
                  style={{ x: leftGateX, willChange: "transform" }}
                  className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#0d091e] to-[#070512] border-r border-[#e4bf88]/20 flex items-center justify-end pr-8 z-10 shadow-[8px_0_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex flex-col items-center select-none text-right">
                    <span className="text-3xl font-lora text-[#e4bf88] font-semibold">♏</span>
                    <span className="text-[10px] tracking-widest text-[#dfd9cd] font-montserrat uppercase mt-1">AN YÊN</span>
                  </div>
                </motion.div>

                {/* Right Gate */}
                <motion.div
                  style={{ x: rightGateX, willChange: "transform" }}
                  className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#0d091e] to-[#070512] border-l border-[#e4bf88]/20 flex items-center justify-start pl-8 z-10 shadow-[-8px_0_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex flex-col items-center select-none text-left">
                    <span className="text-3xl font-lora text-[#e4bf88] font-semibold">♓</span>
                    <span className="text-[10px] tracking-widest text-[#dfd9cd] font-montserrat uppercase mt-1">SỐ MỆNH</span>
                  </div>
                </motion.div>

                {/* Decorative golden overlay ring frame */}
                <div className="absolute inset-4 rounded-[20px] border border-[#e4bf88]/10 pointer-events-none z-20" />
              </section>

              {/* SECTION 2: CÁT TƯỜNG HÀNH TINH (TODAY'S TRANSITS) */}
              <section className="w-full flex flex-col items-center justify-start mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center mb-8 select-none"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Compass className="w-4 h-4 text-[#e4bf88] animate-spin-slow" />
                    <span className="text-[10px] tracking-[0.3em] text-[#e4bf88] font-montserrat uppercase font-bold">
                      Stellar Alignments
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase">
                    Cát Tường Hành Tinh
                  </h2>
                  <p className="text-[10px] text-[#dfd9cd] font-montserrat tracking-widest mt-1 uppercase">
                    Góc Chiếu Chiêm Tinh Hôm Nay
                  </p>
                  <div className="w-12 h-[1px] bg-[#e4bf88]/30 mx-auto mt-3" />
                </motion.div>

                {/* Transit cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-2">
                  {[
                    {
                      aspect: "☉ ☌ ♂",
                      title: "Mặt Trời Trùng Tụ Sao Hỏa",
                      type: "Trùng Tụ • Lửa Quyết Tâm",
                      desc: "Nguồn năng lượng hành động bùng nổ mạnh mẽ. Đây là thời điểm vàng để thực thi các quyết định táo bạo hoặc khởi động kế hoạch mới.",
                      intensity: 95,
                      color: "from-[#d97b6c] to-[#e4bf88]"
                    },
                    {
                      aspect: "☽ △ ♄",
                      title: "Mặt Trăng Tam Hợp Sao Thổ",
                      type: "Tam Hợp • Nền Tảng Bình Yên",
                      desc: "Cảm xúc lắng dịu mang lại sự điềm tĩnh sâu sắc. Tâm trí trở nên kiên nhẫn hơn, vô cùng thích hợp để định hình mục tiêu dài lâu.",
                      intensity: 88,
                      color: "from-[#a9b388] to-[#b89f8a]"
                    },
                    {
                      aspect: "☿ ⚹ ♆",
                      title: "Sao Thủy Lục Hợp Sao Hải Vương",
                      type: "Lục Hợp • Trực Giác Bay Bổng",
                      desc: "Trực giác nhạy bén gia tăng vượt bậc. Ý tưởng sáng tạo của bạn được chắp cánh, thích hợp chiêm nghiệm tâm hồn và thiền định.",
                      intensity: 74,
                      color: "from-[#e4bf88] to-[#a9b388]"
                    }
                  ].map((transit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
                      whileHover={{ y: -5 }}
                      className="bg-glass-dark border border-[#e4bf88]/20 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between group transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-xl font-lora text-[#e4bf88] font-bold tracking-wider">
                            {transit.aspect}
                          </span>
                          <span className="text-[9px] font-bold text-[#e4bf88] tracking-widest bg-[#0a0715]/60 px-2.5 py-0.5 rounded-full border border-[#e4bf88]/20 uppercase font-montserrat">
                            Cực Kỳ Mạnh
                          </span>
                        </div>
                        <h3 className="text-sm font-lora font-bold text-[#eae3d2] mb-1 leading-snug group-hover:text-[#e4bf88] transition-colors">
                          {transit.title}
                        </h3>
                        <span className="text-[9px] tracking-wider text-[#dfd9cd] font-montserrat font-medium block mb-2.5 uppercase">
                          {transit.type}
                        </span>
                        <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify">
                          {transit.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-[#e4bf88]/10">
                        <div className="flex items-center justify-between text-[10px] font-montserrat mb-1.5">
                          <span className="text-[#dfd9cd] font-light">Cường độ góc chiếu</span>
                          <strong className="text-[#eae3d2] font-bold">{transit.intensity}%</strong>
                        </div>
                        <div className="w-full h-1 bg-[#0a0715]/60 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${transit.color} rounded-full`} style={{ width: `${transit.intensity}%` }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* SECTION 3: NHẬT KÝ TINH TÚ (STELLAR JOURNAL) */}
              <section className="w-full flex flex-col items-center justify-start mt-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center mb-8 select-none"
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Star className="w-3.5 h-3.5 text-[#e4bf88] fill-[#e4bf88]" />
                    <span className="text-[10px] tracking-[0.3em] text-[#e4bf88] font-montserrat uppercase font-bold">
                      Stellar Wisdom
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-lora font-bold text-[#eae3d2] tracking-wide uppercase">
                    Nhật Ký Tinh Tú
                  </h2>
                  <p className="text-[10px] text-[#dfd9cd] font-montserrat tracking-widest mt-1 uppercase">
                    Chiêm nghiệm & Trí tuệ Cổ xưa
                  </p>
                  <div className="w-12 h-[1px] bg-[#e4bf88]/30 mx-auto mt-3" />
                </motion.div>

                {/* Journal Feed */}
                <div className="flex flex-col gap-6 w-full px-2">
                  {[
                    {
                      date: "19 THÁNG 5, 2026 • BÀI VIẾT NỔI BẬT",
                      title: "Nghệ Thuật Sống Chậm Giữa Mùa Sao Thủy Đi Lùi (Mercury Retrograde)",
                      excerpt: "Khi Sao Thủy stations đi lùi tại cung Khí, vũ trụ đang gửi tín hiệu nhắc nhở chúng ta dừng lại và nhìn nhận lại chặng đường cũ. Đây không phải thời gian để hoảng loạn, mà là cơ hội vàng để sửa chữa, tái lập mục tiêu và học cách kiên nhẫn với chính mình...",
                      readTime: "Đọc 5 phút"
                    },
                    {
                      date: "18 THÁNG 5, 2026 • TRI THỨC MẶT TRĂNG",
                      title: "Chu Kỳ 29.5 Ngày Của Mặt Trăng Và Sự Chuyển Hóa Cảm Xúc Nội Tâm",
                      excerpt: "Từ kỳ Trăng Non tĩnh lặng cho đến đêm Trăng Tròn rực rỡ, thế giới nội tâm của chúng ta luôn trôi theo nhịp điệu thủy triều của vệ tinh tự nhiên này. Thấu hiểu dòng chảy của trăng giúp bạn chủ động ôm ấp xúc cảm và đón nhận sự bình an thực sự...",
                      readTime: "Đọc 4 phút"
                    }
                  ].map((post, idx) => (
                    <motion.article
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
                      whileHover={{ scale: 1.008 }}
                      className="bg-glass-dark border border-[#e4bf88]/20 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <span className="text-[9px] tracking-wider text-[#e4bf88] font-montserrat font-bold block mb-1.5">
                          {post.date}
                        </span>
                        <h3 className="text-base font-lora font-bold text-[#eae3d2] mb-2 leading-snug group-hover:text-[#e4bf88] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-[#eae3d2] font-montserrat font-light text-justify md:pr-8">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 self-start md:self-center shrink-0">
                        <span className="text-[10px] tracking-wider text-[#dfd9cd] font-montserrat uppercase font-semibold group-hover:text-[#eae3d2] transition-colors">
                          Xem thêm
                        </span>
                        <span className="text-[9px] text-[#e4bf88] font-montserrat font-bold bg-[#0a0715]/60 border border-[#e4bf88]/20 px-2.5 py-0.5 rounded-full uppercase">
                          {post.readTime}
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
                </>
              )}

              {activeTab === "charts" && renderChartsTab()}
              {activeTab === "cosmos" && renderCosmosTab()}
              {activeTab === "guidance" && renderGuidanceTab()}
              {activeTab === "journal" && renderJournalTab()}

              {/* ASCEND BACK TO COSMOS (SCROLL TO TOP BUTTON) */}
              <div className="w-full flex items-center justify-center my-8 z-20">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="px-8 py-3 rounded-full bg-glass-dark border border-[#e4bf88]/20 text-[#dfd9cd] hover:text-[#eae3d2] hover:bg-[#eae3d2]/5 hover:border-[#e4bf88]/50 hover:shadow-[0_0_25px_rgba(228,191,136,0.2)] transition-all duration-300 backdrop-blur-md text-xs font-montserrat tracking-[0.25em] uppercase font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-4 h-4 rotate-90 text-[#e4bf88] animate-bounce" />
                  Bay Về Vũ Trụ
                </button>
              </div>

            </main>

            {/* Bottom Section Spacer */}
            <footer className="w-full h-32 flex flex-col justify-end items-center pb-24 z-20">
              <span className="text-[9px] tracking-[0.25em] text-[#dfd9cd] font-montserrat pointer-events-none uppercase">
                © {new Date().getFullYear()} Lyth Astrology • Driven by Stellar Alignments
              </span>
            </footer>

            {/* Premium minimalist bottom navigation bar */}
            <CosmicNavbar activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
