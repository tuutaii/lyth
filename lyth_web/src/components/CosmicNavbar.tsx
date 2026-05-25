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
      {/* Sleek Floating Glassmorphic Container (Dark Premium Theme) */}
      <nav className="relative flex items-center justify-between p-2 rounded-full bg-[#0f0b1e]/75 backdrop-blur-xl border border-[#e4bf88]/20 shadow-[0_15px_35px_rgba(0,0,0,0.4)] overflow-hidden">
        
        {/* Glow behind navbar tabs */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e4bf88]/5 via-[#a9b388]/3 to-[#b8996a]/5 pointer-events-none" />

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
              {/* Layout Animation Pill for Active State (Dark Gold Accent) */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-glow"
                  className="absolute inset-0 bg-gradient-to-b from-[#e4bf88]/20 to-[#e4bf88]/5 rounded-full border border-[#e4bf88]/30 shadow-[0_4px_12px_rgba(228,191,136,0.15)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Layout Animation Pill for Hover State */}
              {isHovered && !isActive && (
                <motion.div
                  layoutId="hover-nav-glow"
                  className="absolute inset-0 bg-white/5 rounded-full border border-white/5"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon Container with glowing active effect */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all duration-300 ${
                    isActive 
                      ? "text-[#e4bf88] drop-shadow-[0_1px_4px_rgba(228,191,136,0.3)] scale-110" 
                      : isHovered 
                        ? "text-[#eae3d2] scale-105" 
                        : "text-[#dfd9cd]"
                  }`}
                />
                
                {/* Text Label */}
                <span
                  className={`text-[8px] sm:text-[9px] font-montserrat tracking-[0.2em] font-semibold transition-all duration-300 ${
                    isActive 
                      ? "text-[#eae3d2] font-bold" 
                      : isHovered 
                        ? "text-[#eae3d2]" 
                        : "text-[#dfd9cd]"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Glowing active indicator dot at the very bottom */}
              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-[#e4bf88] shadow-[0_0_8px_rgba(228,191,136,0.8)]"
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
