"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DailyMessage } from "@/lib/firebase-mock";
import { ChevronLeft, ChevronRight, Sparkles, Compass, Flame } from "lucide-react";

interface StellarCarouselProps {
  messages: DailyMessage[];
}

export default function StellarCarousel({ messages }: StellarCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % messages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleCardClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-6 px-4">
      {/* Concentric Astrological Clockwork behind the carousel controls spinning in opposite directions */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none select-none overflow-hidden opacity-[0.25] flex items-center justify-center">
        {/* Outer clockwise rotating gear */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] rounded-full border border-dashed border-[#e4bf88]/25 flex items-center justify-center"
        >
          {/* Tic marks and zodiac points */}
          <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#e4bf88]" />
          <div className="absolute bottom-0 w-2 h-2 rounded-full bg-[#a9b388]" />
          <div className="absolute left-0 w-2 h-2 rounded-full bg-[#b8996a]" />
          <div className="absolute right-0 w-2 h-2 rounded-full bg-[#e4bf88]" />
        </motion.div>

        {/* Inner counter-clockwise rotating gear */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-[#e4bf88]/15 flex items-center justify-center"
        >
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#d97b6c]" />
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-[#a9b388]" />
        </motion.div>
        
        {/* Even smaller rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] rounded-full border border-dotted border-[#e4bf88]/10"
        />
      </div>

      {/* Active Card Glowing Background Underlay */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[140px] opacity-25 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${messages[activeIndex]?.glowColor || 'rgba(228,191,136,0.35)'} 0%, transparent 70%)`
        }}
      />

      {/* Carousel Container */}
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] flex items-center justify-center overflow-visible">
        
        {/* Navigation Buttons (Desktop) */}
        <button
          onClick={handlePrev}
          aria-label="Previous card"
          className="absolute left-2 lg:left-12 z-40 p-3 rounded-full bg-glass-dark border border-[#e4bf88]/20 text-[#dfd9cd] hover:text-[#eae3d2] hover:bg-[#eae3d2]/5 hover:border-[#e4bf88]/35 transition-all duration-300 backdrop-blur-md opacity-0 md:opacity-100 group cursor-pointer shadow-md hover:shadow-gold-accent/10 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next card"
          className="absolute right-2 lg:right-12 z-40 p-3 rounded-full bg-glass-dark border border-[#e4bf88]/20 text-[#dfd9cd] hover:text-[#eae3d2] hover:bg-[#eae3d2]/5 hover:border-[#e4bf88]/35 transition-all duration-300 backdrop-blur-md opacity-0 md:opacity-100 group cursor-pointer shadow-md hover:shadow-gold-accent/10 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Cards Map */}
        <div className="relative w-full max-w-[92vw] sm:max-w-[420px] h-[480px] sm:h-[530px] flex items-center justify-center select-none"
             style={{ perspective: 1200, transformStyle: "preserve-3d" }}>
          {messages.map((message, i) => {
            // Calculate index difference in circular fashion
            let diff = i - activeIndex;
            
            // Adjust difference to wrap around smoothly
            if (diff < -1) {
              if (activeIndex === messages.length - 1 && i === 0) diff = 1;
            }
            if (diff > 1) {
              if (activeIndex === 0 && i === messages.length - 1) diff = -1;
            }

            const isActive = i === activeIndex;
            const isVisible = Math.abs(diff) <= 1;

            if (!isVisible) return null;

            // Framer motion variants with rotating Y and Z-depth for 3D stack perspective deck layout
            const variants = {
              center: {
                x: "0%",
                scale: 1,
                rotateY: 0,
                z: 0,
                opacity: 1,
                filter: "blur(0px)",
                zIndex: 30,
              },
              left: {
                x: isMobile ? "-34%" : "-58%",
                scale: isMobile ? 0.72 : 0.8,
                rotateY: isMobile ? 40 : 32,
                z: isMobile ? -160 : -120,
                opacity: 0.45,
                filter: "blur(2.5px)",
                zIndex: 20,
              },
              right: {
                x: isMobile ? "34%" : "58%",
                scale: isMobile ? 0.72 : 0.8,
                rotateY: isMobile ? -40 : -32,
                z: isMobile ? -160 : -120,
                opacity: 0.45,
                filter: "blur(2.5px)",
                zIndex: 20,
              }
            };

            const currentVariant = diff === 0 ? "center" : diff < 0 ? "left" : "right";

            return (
              <motion.div
                key={message.id}
                initial={currentVariant}
                animate={currentVariant}
                variants={variants}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                  mass: 0.8,
                }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                onClick={() => handleCardClick(i)}
                className={`absolute w-full h-full rounded-3xl p-1 bg-gradient-to-b ${
                  isActive 
                    ? `from-[#e4bf88]/35 via-transparent to-[#a9b388]/20` 
                    : `from-white/[0.02] to-transparent`
                } backdrop-blur-2xl transition-shadow duration-500 ${
                  isActive 
                    ? "cursor-grab active:cursor-grabbing shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]" 
                    : "cursor-pointer hover:shadow-md"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Internal Card Border Glow & Styling */}
                <div className={`w-full h-full rounded-[20px] bg-[#0c091e]/90 border backdrop-blur-md ${
                  isActive ? "border-[#e4bf88]/40" : "border-white/5"
                } p-6 flex flex-col justify-between overflow-hidden relative group`}>
                  
                  {/* Glyph Watermark background */}
                  <div className="absolute right-[-20px] top-[15%] text-[240px] font-lora font-extrabold text-[#e4bf88]/[0.025] pointer-events-none select-none">
                    {message.glyph}
                  </div>

                  {/* Glass shimmer sweep effect on active */}
                  {isActive && (
                    <div className="absolute inset-0 w-[200%] -translate-x-[100%] bg-gradient-to-r from-transparent via-[#e4bf88]/[0.05] to-transparent skew-x-12 group-hover:animate-[shimmer_2.5s_infinite] pointer-events-none" />
                  )}

                  {/* CARD HEADER */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] tracking-[0.25em] font-bold text-[#e4bf88] font-montserrat flex items-center gap-1.5 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e4bf88] animate-pulse" />
                      {message.category}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] text-[#dfd9cd] font-montserrat uppercase">
                      {message.date}
                    </span>
                  </div>

                  {/* GLYPH & ZODIAC TITLE */}
                  <div className="flex flex-col items-center justify-center text-center my-4 z-10">
                    {/* Big Zodiac Sign Glyph with floating motion */}
                    <motion.div
                      animate={isActive ? {
                        y: [0, -6, 0],
                      } : {}}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`text-5xl font-lora transition-all duration-500 ${
                        isActive 
                          ? "text-transparent bg-clip-text bg-gradient-to-b from-[#e4bf88] via-[#eae3d2] to-[#b8996a] drop-shadow-[0_2px_8px_rgba(228,191,136,0.25)]" 
                          : "text-[#dfd9cd]"
                      }`}
                    >
                      {message.glyph}
                    </motion.div>
                    <h2 className={`text-xs tracking-[0.3em] font-montserrat font-bold mt-2 transition-colors ${
                      isActive ? "text-[#eae3d2]" : "text-[#dfd9cd]"
                    }`}>
                      {message.sign}
                    </h2>
                  </div>

                  {/* CARD MAIN READING */}
                  <div className="flex-1 flex flex-col justify-center my-2 text-center px-2 z-10 overflow-y-auto">
                    <h3 className={`text-base font-lora font-bold tracking-wide mb-2.5 transition-colors leading-snug ${
                      isActive ? "text-[#eae3d2] text-glow-gold" : "text-[#dfd9cd]"
                    }`}>
                      {message.title}
                    </h3>
                    <p className={`text-xs leading-relaxed font-montserrat text-justify sm:text-center transition-colors font-light ${
                      isActive ? "text-[#eae3d2]" : "text-[#dfd9cd]"
                    }`}>
                      {message.message}
                    </p>
                  </div>

                  {/* CARD METADATA (FOOTER) */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3 z-10">
                    {/* Aspects Badges */}
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="text-[9px] tracking-wider bg-[#0a0715]/60 border border-[#e4bf88]/15 px-2.5 py-1 rounded-full text-[#eae3d2] font-montserrat flex items-center gap-1">
                        <Compass className="w-3 h-3 text-[#e4bf88]" />
                        {message.celestialAspect}
                      </span>
                    </div>

                    {/* Progress details */}
                    <div className="flex items-center justify-between text-[10px] font-montserrat mt-1">
                      <div className="flex items-center gap-1 text-[#dfd9cd]">
                        <Sparkles className="w-3.5 h-3.5 text-[#e4bf88]" />
                        <span>Focus: <strong className="text-[#eae3d2] font-semibold">{message.focus}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-[#dfd9cd]">
                        <Flame className="w-3.5 h-3.5 text-[#e4bf88]" />
                        <span>Alignment: <strong className="text-[#eae3d2] font-semibold">{message.energyScore}%</strong></span>
                      </div>
                    </div>

                    {/* Glowing Energy Intensity Bar */}
                    <div className="w-full h-1 bg-[#0a0715]/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isActive ? { width: `${message.energyScore}%` } : { width: "0%" }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className={`h-full bg-gradient-to-r ${message.colorTheme} rounded-full`}
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Slide Indicators / Navigation Dots */}
      <div className="flex items-center gap-2.5 mt-8 z-30">
        {messages.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              i === activeIndex 
                ? "w-8 bg-gradient-to-r from-[#e4bf88] to-[#a9b388] shadow-[0_0_10px_rgba(228,191,136,0.3)]" 
                : "w-2.5 bg-white/10 hover:bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
