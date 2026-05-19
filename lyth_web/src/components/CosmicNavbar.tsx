"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Compass, Sparkles, BookOpen, Sun } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { id: "messages", label: "MESSAGES", icon: MessageSquare },
  { id: "charts", label: "CHARTS", icon: Compass },
  { id: "cosmos", label: "COSMOS", icon: Sparkles },
  { id: "journal", label: "JOURNAL", icon: BookOpen },
  { id: "guidance", label: "GUIDANCE", icon: Sun },
];

interface CosmicNavbarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function CosmicNavbar({ activeTab, onTabChange }: CosmicNavbarProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[580px] px-2">
      {/* Sleek Floating Glassmorphic Container (Light Zen Theme) */}
      <nav className="relative flex items-center justify-between p-2 rounded-full bg-white/82 backdrop-blur-xl border border-[#d2b48c]/25 shadow-[0_15px_35px_rgba(184,153,106,0.12),_0_0_20px_rgba(210,180,140,0.06)] overflow-hidden">
        
        {/* Glow behind navbar tabs */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#d2b48c]/5 via-[#a9b388]/5 to-[#b89f8a]/5 pointer-events-none" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHovered = hoveredTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-full flex-1 transition-all duration-300 focus:outline-none cursor-pointer"
            >
              {/* Layout Animation Pill for Active State (Zen Gold Accent) */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-glow"
                  className="absolute inset-0 bg-gradient-to-b from-[#d2b48c]/25 to-[#f5eedc]/10 rounded-full border border-[#d2b48c]/40 shadow-[0_4px_12px_rgba(210,180,140,0.18),_inset_0_0_8px_rgba(255,255,255,0.8)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Layout Animation Pill for Hover State */}
              {isHovered && !isActive && (
                <motion.div
                  layoutId="hover-nav-glow"
                  className="absolute inset-0 bg-[#f5eedc]/45 rounded-full border border-[#d2b48c]/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon Container with glowing active effect */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${
                    isActive 
                      ? "text-[#5c5240] drop-shadow-[0_1px_4px_rgba(184,153,106,0.3)] scale-110" 
                      : isHovered 
                        ? "text-[#2c2520] scale-105" 
                        : "text-[#7a7265]"
                  }`}
                />
                
                {/* Text Label */}
                <span
                  className={`text-[8px] sm:text-[9px] font-montserrat tracking-[0.2em] font-semibold transition-all duration-300 ${
                    isActive 
                      ? "text-[#2c2520] font-bold" 
                      : isHovered 
                        ? "text-[#5c5240]" 
                        : "text-[#ada89f]"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Glowing active indicator dot at the very bottom */}
              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-[#b8996a] shadow-[0_0_8px_rgba(184,153,106,0.8)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
