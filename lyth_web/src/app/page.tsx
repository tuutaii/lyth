"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import CosmicBackground from "@/components/CosmicBackground";
import StellarCarousel from "@/components/StellarCarousel";
import CosmicNavbar from "@/components/CosmicNavbar";
import { fetchDailyMessages, DailyMessage } from "@/lib/firebase-mock";
import { Star, User, Compass, RefreshCw, ChevronLeft, Sparkles, BookOpen, Sun, Activity, Zap, ShieldAlert, Layers } from "lucide-react";
import * as NatalData from "@/lib/natal-data";

export default function Home() {
  const [messages, setMessages] = useState<DailyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Calibrating cosmic alignment...");
  const [selectedZodiac, setSelectedZodiac] = useState("Scorpio");
  const [activeTab, setActiveTab] = useState("messages");

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

  const renderChartsTab = () => (
    <div className="w-full flex flex-col items-center justify-start gap-12 mt-4 px-2">
      {/* Tab Header */}
      <div className="text-center select-none">
        <span className="text-[10px] tracking-[0.35em] text-[#b8996a] font-montserrat uppercase font-bold">
          Natal Chart Map
        </span>
        <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#2c2520] tracking-wide uppercase mt-1">
          Bản Đồ Hành Tinh
        </h2>
        <p className="text-xs text-[#7a7265] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
          "Mỗi hành tinh mang một nguồn năng lượng riêng, định hình tính cách và những khía cạnh khác nhau trong cuộc sống của em."
        </p>
        <div className="w-16 h-[1.5px] bg-[#d2b48c]/40 mx-auto mt-4" />
      </div>

      {/* Nhân tố mạnh (Strong Factors) */}
      <div className="w-full flex flex-col items-start justify-start gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#b8996a]" />
          <h3 className="text-xs tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
            Nhân Tố Mạnh Nhất
          </h3>
        </div>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          {NatalData.strongFactors.map((factor, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white/80 border border-[#d2b48c]/20 p-5 rounded-2xl shadow-[0_4px_18px_rgba(184,153,106,0.06)] flex flex-col items-center text-center justify-between group transition-all duration-300"
            >
              <div>
                <span className="text-[10px] text-[#b8996a] tracking-wider block mb-1">{factor.rank}</span>
                <h4 className="text-base font-lora font-bold text-[#2c2520] leading-snug">{factor.name}</h4>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-montserrat font-bold text-[#b8996a] tracking-tight">{factor.score}</span>
                <span className="text-[10px] text-[#7a7265] font-semibold block uppercase tracking-widest mt-1">Điểm</span>
              </div>
            </motion.div>
          ))}
        </div>
        <span className="text-[11px] text-[#7a7265] font-lora italic mt-2 opacity-80">
          ✦ Đây là những hành tinh có tầm ảnh hưởng lớn nhất đến bản sắc và năng lượng của em.
        </span>
      </div>

      {/* Planets grid */}
      <div className="w-full flex flex-col items-start justify-start gap-4 mt-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#b8996a] animate-spin-slow" />
          <h3 className="text-xs tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
            Dấu Ấn 10 Hành Tinh Bản Mệnh
          </h3>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(NatalData.planets).map(([key, planet], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (idx % 2) * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="bg-white/80 border border-[#d2b48c]/20 p-6 rounded-3xl shadow-[0_4px_22px_rgba(184,153,106,0.05)] transition-all duration-300 flex flex-col gap-3 group relative overflow-hidden"
            >
              {/* Subtle light gold overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d2b48c]/3 to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(184,153,106,0.2)]">{planet.icon}</span>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-lora font-bold text-[#2c2520] leading-snug">{planet.name}</h4>
                    <span className="text-[10px] tracking-widest text-[#b8996a] font-montserrat uppercase font-semibold mt-0.5">
                      Cung {planet.sign}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-[#d2b48c]/15 my-1" />

              <h5 className="text-sm font-lora font-bold text-[#2c2520] tracking-wide leading-snug">
                {planet.short_desc}
              </h5>
              <p className="text-xs leading-relaxed text-[#5c5240] font-montserrat font-light text-justify">
                {planet.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCosmosTab = () => (
    <div className="w-full flex flex-col items-center justify-start gap-12 mt-4 px-2">
      {/* Tab Header */}
      <div className="text-center select-none">
        <span className="text-[10px] tracking-[0.35em] text-[#b8996a] font-montserrat uppercase font-bold">
          Spiritual Journey
        </span>
        <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#2c2520] tracking-wide uppercase mt-1">
          Hành Trình Linh Hồn
        </h2>
        <p className="text-xs text-[#7a7265] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
          "Những góc chiếu đặc biệt và các điểm nút hoàng đạo tiết lộ bài học nghiệp quả và định hướng phát triển sâu thẳm bên trong em."
        </p>
        <div className="w-16 h-[1.5px] bg-[#d2b48c]/40 mx-auto mt-4" />
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
            className="bg-white/80 border border-[#d2b48c]/20 p-6 rounded-3xl shadow-[0_4px_22px_rgba(184,153,106,0.05)] transition-all duration-300 flex flex-col items-center text-center gap-3 relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-full bg-[#f5eedc] border border-[#d2b48c]/20 flex items-center justify-center text-3xl shadow-sm">
              {journey.icon}
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-[9px] tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
                {journey.subtitle}
              </span>
              <h4 className="text-lg font-lora font-bold text-[#2c2520] uppercase mt-1">
                {journey.title}
              </h4>
            </div>
            <div className="w-12 h-[1px] bg-[#d2b48c]/20 my-1" />
            <p className="text-xs leading-relaxed text-[#5c5240] font-montserrat font-light">
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
            <Zap className="w-4 h-4 text-[#b8996a]" />
            <h3 className="text-xs tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
              Dòng Chảy Nguyên Tố
            </h3>
          </div>
          {Object.entries(NatalData.elementBalance).map(([name, item]) => (
            <div key={name} className="bg-white/80 border border-[#d2b48c]/20 p-5 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5eedc] flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-montserrat font-bold text-[#2c2520] uppercase tracking-wide">
                    Nguyên tố {name}
                  </h4>
                  <span className={`text-[10px] font-montserrat font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.status === "Mạnh" ? "bg-[#a9b388]/20 text-[#5c6245]" : "bg-[#d97b6c]/20 text-[#a34436]"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#5c5240] font-montserrat font-light mt-2 text-justify">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modality */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#b8996a]" />
            <h3 className="text-xs tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
              Bản Sắc Tính Chất
            </h3>
          </div>
          {Object.entries(NatalData.modalityBalance).map(([name, item]) => (
            <div key={name} className="bg-white/80 border border-[#d2b48c]/20 p-5 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5eedc] flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-montserrat font-bold text-[#2c2520] uppercase tracking-wide">
                    Tính chất {name}
                  </h4>
                  <span className={`text-[10px] font-montserrat font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.status === "Mạnh" ? "bg-[#a9b388]/20 text-[#5c6245]" : "bg-[#d97b6c]/20 text-[#a34436]"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[#5c5240] font-montserrat font-light mt-2 text-justify">
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
    
    return (
      <div className="w-full flex flex-col items-center justify-start gap-12 mt-4 px-2">
        {/* Tab Header */}
        <div className="text-center select-none">
          <span className="text-[10px] tracking-[0.35em] text-[#b8996a] font-montserrat uppercase font-bold">
            Guidance & Identity
          </span>
          <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#2c2520] tracking-wide uppercase mt-1">
            Căn Tính & Định Mệnh
          </h2>
          <p className="text-xs text-[#7a7265] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
            "✦ Hãy cung cấp giờ sinh chính xác để Tài cho em thêm thông tin nha!"
          </p>
          <div className="w-16 h-[1.5px] bg-[#d2b48c]/40 mx-auto mt-4" />
        </div>

        {/* Numerology & MBTI grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Numerology */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white/80 border border-[#d2b48c]/20 p-8 rounded-3xl shadow-[0_4px_22px_rgba(184,153,106,0.05)] transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d2b48c]/3 to-transparent pointer-events-none" />
            <h3 className="text-[10px] tracking-[0.3em] text-[#b8996a] font-montserrat uppercase font-bold">
              Numerology
            </h3>
            <span className="text-7xl font-lora font-bold text-[#b8996a] filter drop-shadow-[0_4px_12px_rgba(184,153,106,0.3)]">
              8
            </span>
            <span className="text-xs tracking-[0.25em] text-[#2c2520] font-montserrat font-bold uppercase mt-1">
              Con Số Chủ Đạo
            </span>
            <p className="text-xs leading-relaxed text-[#5c5240] font-montserrat font-light text-justify mt-2">
              Con số của sự cân bằng và khả năng hiện thực hóa mọi ước mơ. Sự kết hợp giữa năng lượng Kim Ngưu vững chãi và con số 8 đầy quyền năng giúp em làm chủ được vận mệnh, tạo nên những giá trị bền vững từ chính bản lĩnh và nội lực phi thường của mình.
            </p>
          </motion.div>

          {/* MBTI */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white/80 border border-[#d2b48c]/20 p-8 rounded-3xl shadow-[0_4px_22px_rgba(184,153,106,0.05)] transition-all duration-300 flex flex-col items-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#d2b48c]/3 to-transparent pointer-events-none" />
            <h3 className="text-[10px] tracking-[0.3em] text-[#b8996a] font-montserrat uppercase font-bold">
              Astrological Personality Profile
            </h3>
            <span className="text-5xl font-lora font-bold text-[#b8996a] tracking-[0.1em] filter drop-shadow-[0_4px_12px_rgba(184,153,106,0.3)] mt-2">
              {mbti.mbti}
            </span>
            <span className="text-xs tracking-[0.25em] text-[#2c2520] font-montserrat font-bold uppercase mt-1">
              {mbti.title}
            </span>
            <p className="text-xs leading-relaxed text-[#5c5240] font-montserrat font-light mt-1">
              {mbti.desc}
            </p>
            <div className="w-full h-[1px] bg-[#d2b48c]/15 my-1" />
            <div className="w-full flex flex-col gap-3 text-left">
              <div className="flex items-start gap-2">
                <Star className="w-3.5 h-3.5 text-[#b8996a] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-[#5c5240] font-montserrat">
                  <strong className="text-[#2c2520] font-semibold">Điểm mạnh:</strong> {mbti.strength}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Sun className="w-3.5 h-3.5 text-[#b8996a] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-[#5c5240] font-montserrat">
                  <strong className="text-[#2c2520] font-semibold">Lời khuyên:</strong> {mbti.advice}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Life Indicators */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#b8996a]" />
            <h3 className="text-xs tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
              Chỉ Số Sinh Tồn (Life Indicators)
            </h3>
          </div>
          <div className="w-full flex flex-col gap-4">
            {NatalData.lifeIndices.map((index, idx) => (
              <div key={idx} className="bg-white/80 border border-[#d2b48c]/20 p-5 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-lora font-bold text-[#2c2520]">
                    {index.title}
                  </h4>
                  <span className="text-xs text-[#b8996a]">{index.rank}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-montserrat font-bold text-[#b8996a] w-14 shrink-0">
                    {index.score}%
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#f5eedc] overflow-hidden">
                    <div className="h-full bg-[#b8996a] rounded-full" style={{ width: `${index.score}%` }} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-[#7a7265] font-montserrat font-light mt-1">
                  {index.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Soul Resonance */}
        <div className="w-full flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#b8996a]" />
            <h3 className="text-xs tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
              Giao Thoa Tâm Hồn (Soul Resonance)
            </h3>
          </div>
          <div className="bg-[#f5eedc]/60 border border-[#d2b48c]/35 p-6 rounded-3xl flex flex-col items-center text-center gap-4 w-full">
            <div className="flex items-center justify-center gap-6">
              <span className="bg-white border border-[#d2b48c]/20 px-4 py-2 rounded-full font-montserrat font-bold text-xs text-[#2c2520] shadow-sm">
                Số chủ đạo 8
              </span>
              <ChevronLeft className="w-4 h-4 text-[#b8996a] rotate-180" />
              <span className="bg-white border border-[#d2b48c]/20 px-4 py-2 rounded-full font-montserrat font-bold text-xs text-[#2c2520] shadow-sm">
                Cung Cự Giải
              </span>
            </div>
            <div className="mt-1 flex flex-col items-center">
              <span className="text-lg font-lora font-bold text-[#b8996a]">
                Tương Hợp: 4/10
              </span>
              <span className="text-[#b8996a] text-sm mt-1">★★</span>
            </div>
            <p className="text-xs leading-relaxed text-[#5c5240] font-montserrat font-light max-w-2xl text-justify md:text-center mt-1">
              Có một sự lệch hướng rõ ràng giữa con đường bạn cảm thấy tự nhiên và sứ mệnh mà bạn cần theo đuổi. Những trở ngại hiện tại thực chất là dấu hiệu cho thấy bạn cần thay đổi và bước ra khỏi vùng an toàn để hoàn thiện chính mình.
            </p>
          </div>
        </div>

        {/* Technical Data */}
        <div className="w-full flex flex-col gap-4 mt-2 mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#b8996a]" />
            <h3 className="text-xs tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
              Tọa Độ Bản Mệnh (Technical Data)
            </h3>
          </div>
          <div className="bg-white/80 border border-[#d2b48c]/20 p-6 rounded-2xl flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between text-xs font-montserrat border-b border-[#d2b48c]/10 pb-2">
              <span className="text-[#7a7265]">Kinh độ, Vĩ độ</span>
              <span className="font-semibold text-[#2c2520]">10.28° N, 105.65° E (Lai Vung, Đồng Tháp)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-montserrat border-b border-[#d2b48c]/10 pb-2">
              <span className="text-[#7a7265]">Hệ thống nhà (House System)</span>
              <span className="font-semibold text-[#2c2520]">Placidus</span>
            </div>
            <div className="flex items-center justify-between text-xs font-montserrat pb-1">
              <span className="text-[#7a7265]">Ngày sinh gốc</span>
              <span className="font-semibold text-[#2c2520]">10/05/2000 | 08:00 AM (GMT+7)</span>
            </div>
            <p className="text-[10px] text-[#ada89f] font-montserrat italic text-center mt-3 leading-relaxed">
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
        <span className="text-[10px] tracking-[0.35em] text-[#b8996a] font-montserrat uppercase font-bold">
          Stellar Wisdom Journal
        </span>
        <h2 className="text-2xl sm:text-3xl font-lora font-bold text-[#2c2520] tracking-wide uppercase mt-1">
          Nhật Ký Tinh Tú
        </h2>
        <p className="text-xs text-[#7a7265] font-lora italic tracking-wider mt-2.5 max-w-lg mx-auto">
          "Chiêm nghiệm tri thức cổ xưa về sự dịch chuyển tinh tú và chu kỳ của linh hồn."
        </p>
        <div className="w-16 h-[1.5px] bg-[#d2b48c]/40 mx-auto mt-4" />
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
            transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.008 }}
            className="bg-white/80 border border-[#d2b48c]/18 p-6 rounded-2xl shadow-[0_4px_20px_rgba(184,153,106,0.05)] cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
          >
            <div className="flex-1">
              <span className="text-[9px] tracking-wider text-[#b8996a] font-montserrat font-bold block mb-1.5">
                {post.date}
              </span>
              <h3 className="text-base font-lora font-bold text-[#2c2520] mb-2 leading-snug group-hover:text-[#b8996a] transition-colors">
                {post.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#4a4a4a] font-montserrat font-light text-justify md:pr-8">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-1.5 self-start md:self-center shrink-0">
              <span className="text-[10px] tracking-wider text-[#7a7265] font-montserrat uppercase font-semibold group-hover:text-[#2c2520] transition-colors">
                Xem thêm
              </span>
              <span className="text-[9px] text-[#b8996a] font-montserrat font-bold bg-[#f5eedc] border border-[#d2b48c]/15 px-2.5 py-0.5 rounded-full uppercase">
                {post.readTime}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    loadData();
  }, []);

  const zodiacSigns = [
    { name: "Scorpio", glyph: "♏" },
    { name: "Pisces", glyph: "♓" },
    { name: "Leo", glyph: "♌" },
    { name: "Gemini", glyph: "♊" },
    { name: "Taurus", glyph: "♉" }
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* 1. Immersive Space starfield and nebula canvas */}
      <CosmicBackground />

      <AnimatePresence mode="wait">
        {loading ? (
          // Astrological Loader (Cream Zen theme)
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 bg-[#F5EEDC] flex flex-col items-center justify-center animate-fade-in"
          >
            {/* Soft gold loader background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#d2b48c]/15 blur-[130px] rounded-full" />

            <div className="relative flex flex-col items-center max-w-sm px-8 text-center select-none">
              
              {/* Outer Celestial Compass Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-36 h-36 rounded-full border border-dashed border-[#d2b48c]/35 flex items-center justify-center relative"
              >
                {/* Zodiac node dots reflecting sand gold & earth colors */}
                <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#d2b48c] shadow-[0_0_12px_rgba(210,180,140,0.8)]" />
                <div className="absolute bottom-0 w-2 h-2 rounded-full bg-[#a9b388]" />
                <div className="absolute left-0 w-2 h-2 rounded-full bg-[#b89f8a]" />
                <div className="absolute right-0 w-2 h-2 rounded-full bg-[#d97b6c]" />

                {/* Mid Concentric Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-28 h-28 rounded-full border border-[#b89f8a]/15 flex items-center justify-center"
                >
                  {/* Astrological Astrolabe center displaying native App Icon */}
                  <div className="w-16 h-16 rounded-full border border-[#d2b48c]/25 flex items-center justify-center bg-white/40 backdrop-blur-md relative overflow-hidden shadow-[0_0_20px_rgba(184,153,106,0.15)]">
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
                <h2 className="text-sm font-lora tracking-[0.3em] text-[#b8996a] uppercase font-bold text-glow-gold">
                  AN YÊN ASTROLOGER
                </h2>
                
                {/* Glowing Text Phase info */}
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 0.8, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  className="text-[11px] tracking-[0.1em] font-montserrat text-[#7a7265] font-light mt-3 h-6"
                >
                  {loadingText}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Main Dashboard Panel (Cream Zen theme)
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col justify-between bg-transparent"
          >
            {/* Header section */}
            <header className="w-full px-6 py-4 md:py-6 md:px-12 flex flex-col md:flex-row items-center justify-between border-b border-[#e8e1d9]/60 z-20 gap-4 md:gap-0">
              
              {/* Row container for Mobile Logo & Mobile User Panel */}
              <div className="flex w-full md:w-auto items-center justify-between">
                {/* Logo displaying native App Icon */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#d2b48c]/35 shadow-[0_4px_12px_rgba(184,153,106,0.15)]">
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
                    <span className="text-base font-lora tracking-[0.2em] font-bold text-[#2c2520]">
                      LYTH
                    </span>
                    <span className="text-[8px] tracking-[0.25em] text-[#b8996a] font-montserrat uppercase font-bold">
                      AN YÊN ASTROLOGER
                    </span>
                  </div>
                </div>

                {/* Mobile User Panel info (Hidden on Desktop) */}
                <div className="flex md:hidden items-center gap-2">
                  <button 
                    onClick={loadData}
                    aria-label="Refresh horoscope readings"
                    className="p-2 rounded-full hover:bg-[#f5eedc]/50 border border-transparent hover:border-[#d2b48c]/20 text-[#7a7265] hover:text-[#2c2520] transition-all duration-300 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#b8996a]' : ''}`} />
                  </button>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="Go to welcome cover"
                    className="p-2 rounded-full hover:bg-[#f5eedc]/50 border border-transparent hover:border-[#d2b48c]/20 text-[#7a7265] hover:text-[#2c2520] transition-all duration-300 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#b8996a]" />
                  </button>
                </div>
              </div>

              {/* Zodiac Selector panel - Responsive (Mobile full-width horizontal swipe list, Desktop compact rounded pill) */}
              <div className="flex w-full md:w-auto overflow-x-auto scrollbar-none snap-x snap-mandatory gap-1 bg-white/80 border border-[#d2b48c]/20 p-1 rounded-full backdrop-blur-md">
                {zodiacSigns.map((zod) => (
                  <button
                    key={zod.name}
                    onClick={() => setSelectedZodiac(zod.name)}
                    className={`snap-center shrink-0 px-3 py-1.5 rounded-full text-xs font-montserrat transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      selectedZodiac === zod.name 
                        ? "bg-[#d2b48c]/30 text-[#2c2520] border border-[#d2b48c]/40 font-semibold shadow-sm" 
                        : "text-[#7a7265] hover:text-[#2c2520] border border-transparent"
                    }`}
                  >
                    <span>{zod.glyph}</span>
                    <span className="tracking-wide">{zod.name}</span>
                  </button>
                ))}
              </div>

              {/* Desktop User Panel info (Hidden on Mobile) */}
              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={loadData}
                  aria-label="Refresh horoscope readings"
                  className="p-2 rounded-full hover:bg-[#f5eedc]/50 border border-transparent hover:border-[#d2b48c]/20 text-[#7a7265] hover:text-[#2c2520] transition-all duration-300 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#b8996a]' : ''}`} />
                </button>
                <div 
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex items-center gap-2 bg-glass border border-[#d2b48c]/20 px-4 py-1.5 rounded-full text-xs cursor-pointer hover:border-[#d2b48c]/35 hover:bg-white transition-all duration-300 group shadow-md hover:shadow-gold-accent/5"
                >
                  <Compass className="w-3.5 h-3.5 text-[#b8996a] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] tracking-wider text-[#4a4a4a] font-montserrat uppercase font-semibold">
                    Cổng Vũ Trụ
                  </span>
                </div>
              </div>
            </header>

            {/* Dashboard Contents */}
            <main className="flex-1 flex flex-col items-center justify-start py-6 md:py-10 z-10 w-full max-w-5xl mx-auto px-4 gap-20">
              {activeTab === "messages" && (
                <>
                  {/* HERO INTRO SECTION: TAP TO UNVEIL ORACLE */}
              <section className="w-full min-h-[85vh] flex flex-col items-center justify-center text-center select-none px-4 py-8 relative">
                {/* Decorative glowing backdrops */}
                <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#d2b48c]/10 to-[#a9b388]/10 blur-[100px] pointer-events-none" />

                {/* Main floating circle app logo */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 1.2 }}
                  className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#d2b48c]/45 shadow-[0_15px_45px_rgba(184,153,106,0.22)] mb-8 flex items-center justify-center p-1.5 bg-white/70"
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
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#b8996a]/25 animate-spin-slow pointer-events-none" />
                </motion.div>

                {/* Mystic Branding Header */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="flex flex-col items-center max-w-lg"
                >
                  <span className="text-[10px] tracking-[0.4em] text-[#b8996a] font-montserrat uppercase font-bold mb-2">
                    An Yên Astrologer • Lyth
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-lora font-bold text-[#2c2520] leading-tight tracking-wide uppercase">
                    Lời Thì Thầm Của Những Vì Sao
                  </h1>
                  <p className="text-xs sm:text-sm text-[#7a7265] font-montserrat font-light tracking-wide mt-3 max-w-sm leading-relaxed">
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
                    className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full bg-gradient-to-r from-[#d2b48c]/25 via-[#e8c07e]/35 to-[#b8996a]/20 blur-[50px] pointer-events-none -z-10"
                  />

                  {/* 2. Concentric spinning thin gold astrolabe lines behind the button */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] rounded-full border border-dashed border-[#d2b48c]/30 -z-10 flex items-center justify-center pointer-events-none"
                  >
                    <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-[#d2b48c]" />
                    <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#a9b388]" />
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
                      className="relative px-8 py-4.5 sm:px-11 sm:py-5.5 rounded-full bg-white/90 border-2 border-[#d2b48c] text-[#2c2520] font-montserrat font-bold text-xs tracking-[0.25em] uppercase cursor-pointer hover:bg-white hover:border-[#b8996a] hover:scale-105 transition-all duration-300 shadow-[0_15px_45px_rgba(184,153,106,0.22),_inset_0_4px_12px_rgba(255,255,255,0.6)] hover:shadow-[0_20px_55px_rgba(184,153,106,0.35)] group flex flex-col items-center gap-2 select-none overflow-hidden"
                    >
                      {/* Gold light sweep shimmer effect across the button */}
                      <span className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 animate-shine-slow pointer-events-none" />

                      {/* Continuous double ring pulsing underlay */}
                      <span className="absolute -inset-1 rounded-full border border-[#d2b48c]/35 animate-ping opacity-50 pointer-events-none" />
                      <span className="absolute -inset-3 rounded-full border border-[#e8c07e]/15 animate-pulse opacity-40 pointer-events-none" />
                      
                      <div className="flex items-center gap-3 z-10">
                        {/* Glowing Starburst */}
                        <motion.div
                          animate={{ scale: [1, 1.25, 1], rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Star className="w-3.5 h-3.5 text-[#b8996a] fill-[#b8996a]" />
                        </motion.div>

                        <span className="text-glow-gold relative font-bold tracking-[0.22em] text-[#2c2520] text-[10.5px] sm:text-xs">
                          Xem Thông Điệp Hôm Nay
                        </span>

                        <motion.div
                          animate={{ scale: [1, 1.25, 1], rotate: -360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Star className="w-3.5 h-3.5 text-[#b8996a] fill-[#b8996a]" />
                        </motion.div>
                      </div>

                      {/* Downward bouncing arrow */}
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 -rotate-90 text-[#b8996a] animate-bounce stroke-[2] mt-0.5 z-10" />
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
                      <Star className="w-3 h-3 text-[#b8996a] fill-[#b8996a] animate-pulse" />
                      <span className="text-[10px] tracking-[0.35em] text-[#b8996a] font-montserrat uppercase font-bold">
                        Daily Message Oracle
                      </span>
                      <Star className="w-3 h-3 text-[#b8996a] fill-[#b8996a] animate-pulse" />
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl font-lora font-bold text-glow-gold tracking-widest text-[#2c2520] uppercase">
                      Thông Điệp Vũ Trụ
                    </h1>
                    
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d2b48c]/40 to-transparent mt-3.5" />
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
              </section>

              {/* SECTION: CELESTIAL GATEWAY (SCROLL REVEAL GATEWAY - MONOLITHIC SLIDING GATES) */}
              <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl border border-[#d2b48c]/20 bg-white/40 backdrop-blur-sm shadow-[inset_0_4px_30px_rgba(184,153,106,0.03)] my-10 select-none">
                
                {/* 1. Behind the gates: The Mystical Glowing Diamond Relic */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                  {/* Radial golden glow */}
                  <div className="absolute w-[250px] h-[250px] rounded-full bg-[#d2b48c]/15 blur-[80px]" />
                  
                  {/* Bobbing and spinning diamond */}
                  <motion.div
                    style={{ scale: relicScale, rotate: relicRotate }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-2xl border-2 border-[#b8996a] bg-white/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(184,153,106,0.3)] relative overflow-hidden"
                  >
                    {/* Glowing Core */}
                    <div className="absolute w-6 h-6 rounded-full bg-[#d2b48c] animate-ping" />
                    <Compass className="w-10 h-10 text-[#b8996a] stroke-[1.2]" />
                  </motion.div>
                  
                  <h3 className="text-sm font-lora tracking-[0.25em] font-bold text-[#2c2520] mt-6 z-10 uppercase">
                    CỔNG VŨ TRỤ ĐÃ MỞ
                  </h3>
                  <span className="text-[9px] tracking-widest text-[#7a7265] font-montserrat uppercase mt-1.5">
                    Trí Tuệ Cát Tường Đang Khởi Sắc
                  </span>
                </div>

                {/* 2. Horizontal sliding gates */}
                {/* Left Gate */}
                <motion.div
                  style={{ x: leftGateX, willChange: "transform" }}
                  className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#f5eedc] to-[#e8d5b7] border-r border-[#d2b48c]/35 flex items-center justify-end pr-8 z-10 shadow-[8px_0_30px_rgba(44,37,32,0.08)]"
                >
                  <div className="flex flex-col items-center select-none text-right">
                    <span className="text-3xl font-lora text-[#b8996a]/75 font-semibold">♏</span>
                    <span className="text-[10px] tracking-widest text-[#7a7265] font-montserrat uppercase mt-1">AN YÊN</span>
                  </div>
                </motion.div>

                {/* Right Gate */}
                <motion.div
                  style={{ x: rightGateX, willChange: "transform" }}
                  className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#f5eedc] to-[#e8d5b7] border-l border-[#d2b48c]/35 flex items-center justify-start pl-8 z-10 shadow-[-8px_0_30px_rgba(44,37,32,0.08)]"
                >
                  <div className="flex flex-col items-center select-none text-left">
                    <span className="text-3xl font-lora text-[#b8996a]/75 font-semibold">♓</span>
                    <span className="text-[10px] tracking-widest text-[#7a7265] font-montserrat uppercase mt-1">SỐ MỆNH</span>
                  </div>
                </motion.div>

                {/* Decorative golden overlay ring frame */}
                <div className="absolute inset-4 rounded-[20px] border border-[#d2b48c]/15 pointer-events-none z-20" />
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
                    <Compass className="w-4 h-4 text-[#b8996a] animate-spin-slow" />
                    <span className="text-[10px] tracking-[0.3em] text-[#b8996a] font-montserrat uppercase font-bold">
                      Stellar Alignments
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-lora font-bold text-[#2c2520] tracking-wide uppercase">
                    Cát Tường Hành Tinh
                  </h2>
                  <p className="text-[10px] text-[#7a7265] font-montserrat tracking-widest mt-1 uppercase">
                    Góc Chiếu Chiêm Tinh Hôm Nay
                  </p>
                  <div className="w-12 h-[1px] bg-[#d2b48c]/40 mx-auto mt-3" />
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
                      color: "from-[#d97b6c] to-[#b8996a]"
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
                      color: "from-[#d2b48c] to-[#a9b388]"
                    }
                  ].map((transit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
                      whileHover={{ y: -5 }}
                      className="bg-white/80 border border-[#d2b48c]/20 p-5 rounded-2xl shadow-[0_4px_18px_rgba(184,153,106,0.06)] flex flex-col justify-between group transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-xl font-lora text-[#b8996a] font-bold tracking-wider">
                            {transit.aspect}
                          </span>
                          <span className="text-[9px] font-bold text-[#b8996a] tracking-widest bg-[#f5eedc] px-2.5 py-0.5 rounded-full border border-[#d2b48c]/15 uppercase font-montserrat">
                            Cực Kỳ Mạnh
                          </span>
                        </div>
                        <h3 className="text-sm font-lora font-bold text-[#2c2520] mb-1 leading-snug group-hover:text-[#b8996a] transition-colors">
                          {transit.title}
                        </h3>
                        <span className="text-[9px] tracking-wider text-[#7a7265] font-montserrat font-medium block mb-2.5 uppercase">
                          {transit.type}
                        </span>
                        <p className="text-xs leading-relaxed text-[#4a4a4a] font-montserrat font-light text-justify">
                          {transit.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-[#e8e1d9]/60">
                        <div className="flex items-center justify-between text-[10px] font-montserrat mb-1.5">
                          <span className="text-[#7a7265] font-light">Cường độ góc chiếu</span>
                          <strong className="text-[#2c2520] font-bold">{transit.intensity}%</strong>
                        </div>
                        <div className="w-full h-1 bg-[#f5eedc] rounded-full overflow-hidden">
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
                    <Star className="w-3.5 h-3.5 text-[#b8996a] fill-[#b8996a]" />
                    <span className="text-[10px] tracking-[0.3em] text-[#b8996a] font-montserrat uppercase font-bold">
                      Stellar Wisdom
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-lora font-bold text-[#2c2520] tracking-wide uppercase">
                    Nhật Ký Tinh Tú
                  </h2>
                  <p className="text-[10px] text-[#7a7265] font-montserrat tracking-widest mt-1 uppercase">
                    Chiêm nghiệm & Trí tuệ Cổ xưa
                  </p>
                  <div className="w-12 h-[1px] bg-[#d2b48c]/40 mx-auto mt-3" />
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
                      className="bg-white/80 border border-[#d2b48c]/18 p-6 rounded-2xl shadow-[0_4px_20px_rgba(184,153,106,0.05)] cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
                    >
                      <div className="flex-1">
                        <span className="text-[9px] tracking-wider text-[#b8996a] font-montserrat font-bold block mb-1.5">
                          {post.date}
                        </span>
                        <h3 className="text-base font-lora font-bold text-[#2c2520] mb-2 leading-snug group-hover:text-[#b8996a] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-[#4a4a4a] font-montserrat font-light text-justify md:pr-8">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 self-start md:self-center shrink-0">
                        <span className="text-[10px] tracking-wider text-[#7a7265] font-montserrat uppercase font-semibold group-hover:text-[#2c2520] transition-colors">
                          Xem thêm
                        </span>
                        <span className="text-[9px] text-[#b8996a] font-montserrat font-bold bg-[#f5eedc] border border-[#d2b48c]/15 px-2.5 py-0.5 rounded-full uppercase">
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
                  className="px-8 py-3 rounded-full bg-white/80 border border-[#d2b48c]/25 text-[#4a4a4a] hover:text-[#2c2520] hover:bg-white hover:border-[#d2b48c]/45 hover:shadow-[0_0_20px_rgba(184,153,106,0.15)] transition-all duration-300 backdrop-blur-md text-xs font-montserrat tracking-[0.25em] uppercase font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-4 h-4 rotate-90 text-[#b8996a] animate-bounce" />
                  Bay Về Vũ Trụ
                </button>
              </div>

            </main>

            {/* Bottom Section Spacer */}
            <footer className="w-full h-32 flex flex-col justify-end items-center pb-24 z-20">
              <span className="text-[9px] tracking-[0.25em] text-[#ada89f] font-montserrat pointer-events-none uppercase">
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
