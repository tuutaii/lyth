"use client";

import React, { useEffect, useRef } from "react";

interface CelestialElement {
  type: 
    | "eye" 
    | "sunburst" 
    | "moon" 
    | "constellation" 
    | "spark" 
    | "comet" 
    | "clock" 
    | "saturn" 
    | "hands" 
    | "serif1111" 
    | "crystals" 
    | "archway" 
    | "moonface" 
    | "sunface"
    | "celestial_vine"
    | "mushroom";
  x: number; // relative width (0 to 1)
  y: number; // absolute height in canvas coordinate space (0 to 3500px)
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  parallax: number; // parallax scrolling multiplier (e.g. 0.2 to 0.8)
  constellationPoints?: { x: number; y: number }[]; // for constellations
  vx?: number;
  vy?: number;
  isNeon?: boolean;
  colorTheme?: "pink" | "purple" | "teal"; // for mushrooms
  vineLength?: number; // for hanging vines
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let elements: CelestialElement[] = [];
    const worldHeight = 3600; // total scrollable universe depth

    // High performance scroll tracking variable
    let currentScrollYVal = 0;
    const handleScroll = () => {
      currentScrollYVal = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    currentScrollYVal = window.scrollY;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (elements.length === 0) {
        initCelestialElements();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    // Premium Gold Foil Palette for Dark Cosmic theme
    const palette = {
      goldAccent: "rgba(244, 226, 198, 0.75)", // Lấp lánh hơn
      goldDeep: "rgba(228, 191, 136, 0.85)",   // Vàng lá rực rỡ
      goldDeepMuted: "rgba(228, 191, 136, 0.24)",
      sage: "rgba(199, 209, 166, 0.65)",
      brown: "rgba(224, 199, 178, 0.6)",
      charcoal: "rgba(182, 172, 154, 0.7)",    // Tăng độ sáng để hiển thị trên nền tối
      darkSpark: "rgba(228, 191, 136, 0.35)",  // Đom đóm lấp lánh
    };

    const initCelestialElements = () => {
      elements = [];

      // ==========================================
      // SECTION 1: HIGH CELESTIAL SPACE (y: 0 to 800)
      // ==========================================
      
      // "11:11" Classical gold text
      elements.push({
        type: "serif1111",
        x: 0.5,
        y: 110,
        size: 32,
        rotation: 0,
        rotationSpeed: 0,
        color: palette.goldDeep,
        parallax: 0.15,
      });

      // Saturn in the upper celestial zone
      elements.push({
        type: "saturn",
        x: 0.28,
        y: 320,
        size: 32,
        rotation: Math.PI / 8,
        rotationSpeed: 0.0002,
        color: palette.goldDeep,
        parallax: 0.26,
      });

      // Serene Moon face
      elements.push({
        type: "moonface",
        x: 0.5,
        y: 650,
        size: 45,
        rotation: -Math.PI / 12,
        rotationSpeed: 0.00015,
        color: palette.goldDeep,
        parallax: 0.15,
      });

      // Astrological Clocks
      elements.push({
        type: "clock",
        x: 0.5,
        y: 450,
        size: Math.min(canvas.width, 360) * 0.5,
        rotation: Math.random() * Math.PI,
        rotationSpeed: 0.0003,
        color: palette.goldDeepMuted,
        parallax: 0.15,
      });

      // ==========================================
      // SECTION 2: THE TRANSITION ZONE (y: 800 to 1800)
      // ==========================================
      
      // Archway with climbing stairs
      elements.push({
        type: "archway",
        x: 0.85,
        y: 950,
        size: 65,
        rotation: 0,
        rotationSpeed: 0,
        color: palette.goldDeep,
        parallax: 0.2,
      });

      // Elegant crystal cluster
      elements.push({
        type: "crystals",
        x: 0.84,
        y: 1300,
        size: 26,
        rotation: 0,
        rotationSpeed: 0.0001,
        color: palette.goldDeep,
        parallax: 0.25,
      });

      // Astrological Clock 2
      elements.push({
        type: "clock",
        x: 0.8,
        y: 1100,
        size: Math.min(canvas.width, 300) * 0.45,
        rotation: Math.random() * Math.PI,
        rotationSpeed: -0.0002,
        color: palette.goldDeepMuted,
        parallax: 0.18,
      });

      // Reaching Hands
      elements.push({
        type: "hands",
        x: 0.5,
        y: 1650,
        size: 32,
        rotation: 0,
        rotationSpeed: 0,
        color: palette.goldDeep,
        parallax: 0.32,
      });

      // HANGING CELESTIAL VINES / STARDUST STRINGS
      const vinePositions = [
        { x: 0.15, y: 750, len: 140 },
        { x: 0.22, y: 820, len: 200 },
        { x: 0.35, y: 780, len: 110 },
        { x: 0.72, y: 800, len: 150 },
        { x: 0.88, y: 840, len: 220 },
        { x: 0.65, y: 1200, len: 160 },
        { x: 0.12, y: 1350, len: 180 },
        { x: 0.92, y: 1400, len: 210 },
      ];
      vinePositions.forEach((vp) => {
        elements.push({
          type: "celestial_vine",
          x: vp.x,
          y: vp.y,
          size: 0,
          rotation: 0,
          rotationSpeed: 0,
          color: "rgba(210, 180, 140, 0.6)",
          parallax: 0.25,
          vineLength: vp.len,
        });
      });

      // ==========================================
      // SECTION 3: MYSTICAL FOREST FLOOR (y: 1800 to 3500)
      // ==========================================
      
      // Detailed Sun with serene face
      elements.push({
        type: "sunface",
        x: 0.72,
        y: 1950,
        size: 55,
        rotation: 0,
        rotationSpeed: 0.0004,
        color: palette.goldDeep,
        parallax: 0.22,
      });

      // Astrological Clock 3
      elements.push({
        type: "clock",
        x: 0.2,
        y: 2150,
        size: Math.min(canvas.width, 300) * 0.48,
        rotation: Math.random() * Math.PI,
        rotationSpeed: 0.0004,
        color: palette.goldDeepMuted,
        parallax: 0.16,
      });

      // MAGICAL GLOWING MUSHROOMS
      const mushroomPositions = [
        { x: 0.18, y: 2450, size: 48, theme: "pink" as const },
        { x: 0.12, y: 2520, size: 65, theme: "pink" as const },
        { x: 0.28, y: 2480, size: 40, theme: "purple" as const },
        { x: 0.82, y: 2420, size: 52, theme: "purple" as const },
        { x: 0.88, y: 2490, size: 70, theme: "pink" as const },
        { x: 0.74, y: 2460, size: 44, theme: "teal" as const },
        { x: 0.15, y: 3100, size: 50, theme: "purple" as const },
        { x: 0.24, y: 3150, size: 75, theme: "pink" as const },
        { x: 0.78, y: 3080, size: 55, theme: "pink" as const },
        { x: 0.85, y: 3120, size: 80, theme: "purple" as const },
        { x: 0.42, y: 3250, size: 42, theme: "teal" as const },
      ];
      mushroomPositions.forEach((mp) => {
        elements.push({
          type: "mushroom",
          x: mp.x,
          y: mp.y,
          size: mp.size,
          rotation: 0,
          rotationSpeed: 0,
          color: "rgba(217, 123, 108, 0.8)",
          parallax: 0.35,
          colorTheme: mp.theme,
        });
      });

      // Third eyes
      const eyePositions = [
        { x: 0.15, y: 250 },
        { x: 0.85, y: 650 },
        { x: 0.5, y: 1050 },
        { x: 0.2, y: 1450 },
        { x: 0.78, y: 1850 },
        { x: 0.45, y: 2150 },
      ];
      eyePositions.forEach((pos) => {
        elements.push({
          type: "eye",
          x: pos.x,
          y: pos.y,
          size: 24,
          rotation: 0,
          rotationSpeed: 0,
          color: palette.goldDeep,
          parallax: 0.35 + Math.random() * 0.05,
        });
      });

      // Sunbursts
      const sunburstPositions = [
        { x: 0.78, y: 150 },
        { x: 0.22, y: 780 },
        { x: 0.82, y: 1250 },
        { x: 0.12, y: 1650 },
        { x: 0.55, y: 2000 },
      ];
      sunburstPositions.forEach((pos) => {
        elements.push({
          type: "sunburst",
          x: pos.x,
          y: pos.y,
          size: 40,
          rotation: Math.random() * Math.PI,
          rotationSpeed: 0.0008,
          color: palette.goldDeep,
          parallax: 0.25 + Math.random() * 0.05,
        });
      });

      // Crescent moons
      const moonPositions = [
        { x: 0.48, y: 100 },
        { x: 0.34, y: 550 },
        { x: 0.72, y: 920 },
        { x: 0.25, y: 1350 },
        { x: 0.85, y: 1700 },
        { x: 0.15, y: 2050 },
      ];
      moonPositions.forEach((pos) => {
        elements.push({
          type: "moon",
          x: pos.x,
          y: pos.y,
          size: 16,
          rotation: Math.PI * 0.3,
          rotationSpeed: 0,
          color: palette.goldDeep,
          parallax: 0.4 + Math.random() * 0.05,
        });
      });

      // Constellations
      const constellations = [
        { x: 0.22, y: 180, points: [{ x: 0, y: 0 }, { x: 45, y: 15 }, { x: 75, y: 40 }, { x: 120, y: 45 }, { x: 145, y: 75 }, { x: 120, y: 105 }, { x: 75, y: 95 }, { x: 45, y: 70 }, { x: 0, y: 0 }] },
        { x: 0.78, y: 450, points: [{ x: 0, y: 0 }, { x: 25, y: -25 }, { x: 50, y: 5 }, { x: 80, y: -30 }, { x: 105, y: 10 }] },
        { x: 0.15, y: 950, points: [{ x: 0, y: 0 }, { x: 60, y: 5 }, { x: 30, y: 50 }, { x: 0, y: 95 }, { x: 60, y: 90 }, { x: 30, y: 50 }, { x: 0, y: 0 }] },
        { x: 0.82, y: 1550, points: [{ x: 0, y: 0 }, { x: 40, y: -20 }, { x: 80, y: -40 }, { x: 40, y: -20 }, { x: 20, y: 30 }, { x: 60, y: -70 }] },
        { x: 0.25, y: 1950, points: [{ x: 0, y: 0 }, { x: 75, y: 0 }, { x: 80, y: 70 }, { x: 5, y: 65 }, { x: 0, y: 0 }] },
      ];
      constellations.forEach((c) => {
        elements.push({
          type: "constellation",
          x: c.x,
          y: c.y,
          size: 1,
          rotation: 0,
          rotationSpeed: 0,
          color: palette.goldDeep,
          parallax: 0.28,
          constellationPoints: c.points,
        });
      });

      // Shooting stars / Comets
      const comets = [
        { x: 0.65, y: 200 },
        { x: 0.26, y: 700 },
        { x: 0.72, y: 1300 },
        { x: 0.18, y: 1700 },
        { x: 0.85, y: 2100 },
      ];
      comets.forEach((c) => {
        elements.push({
          type: "comet",
          x: c.x,
          y: c.y,
          size: 16,
          rotation: Math.PI / 4,
          rotationSpeed: 0,
          color: palette.goldDeep,
          parallax: 0.5,
        });
      });

      // Sparkling star sparks (Gold and Earth Charcoal)
      for (let i = 0; i < 120; i++) {
        const isDark = Math.random() < 0.25;
        elements.push({
          type: "spark",
          x: Math.random(),
          y: Math.random() * worldHeight,
          size: Math.random() * 4.5 + 2.5,
          rotation: Math.random() * Math.PI,
          rotationSpeed: Math.random() * 0.005 + 0.002,
          color: isDark ? palette.darkSpark : palette.goldDeep,
          parallax: Math.random() * 0.3 + 0.35,
        });
      }

      // Neon fireflies / magical spores
      const neonColors = [
        "rgba(247, 140, 163, 0.85)",   // Neon Mystic Pink
        "rgba(218, 115, 237, 0.85)",   // Neon Glowing Purple
        "rgba(169, 179, 136, 0.85)",   // Neon Sage Gold
        "rgba(210, 180, 140, 0.85)",   // Neon Sand Gold
      ];
      for (let i = 0; i < 110; i++) {
        const randColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        elements.push({
          type: "spark",
          x: Math.random(),
          y: Math.random() * worldHeight,
          size: Math.random() * 3.8 + 2.0,
          rotation: Math.random() * Math.PI,
          rotationSpeed: Math.random() * 0.008 + 0.003,
          color: randColor,
          parallax: Math.random() * 0.25 + 0.35,
          vx: (Math.random() - 0.5) * 0.0007,
          vy: (Math.random() - 0.5) * 0.35,
          isNeon: true,
        });
      }
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    resizeCanvas();

    // Canvas Draw Helpers
    const drawSparkStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, 0, size, 0);
      c.quadraticCurveTo(0, 0, 0, size);
      c.quadraticCurveTo(0, 0, -size, 0);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawThirdEye = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.strokeStyle = col;
      c.lineWidth = 1;
      
      c.beginPath();
      c.moveTo(x - size, y);
      c.quadraticCurveTo(x, y - size * 0.52, x + size, y);
      c.quadraticCurveTo(x, y + size * 0.52, x - size, y);
      c.stroke();

      c.beginPath();
      c.arc(x, y, size * 0.28, 0, Math.PI * 2);
      c.fillStyle = "rgba(92, 82, 64, 0.55)";
      c.fill();
      c.stroke();

      c.beginPath();
      c.arc(x, y, size * 0.12, 0, Math.PI * 2);
      c.fillStyle = "rgba(44, 37, 32, 0.95)";
      c.fill();

      c.beginPath();
      c.moveTo(x, y - size * 0.52);
      c.lineTo(x, y - size * 0.52 - 3);
      c.moveTo(x - size * 0.4, y - size * 0.44);
      c.lineTo(x - size * 0.4 - 1.5, y - size * 0.44 - 2.5);
      c.moveTo(x + size * 0.4, y - size * 0.44);
      c.lineTo(x + size * 0.4 + 1.5, y - size * 0.44 - 2.5);
      c.stroke();

      c.restore();
    };

    const drawSunburst = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.strokeStyle = col;
      c.lineWidth = 0.85;

      c.beginPath();
      c.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      c.fillStyle = "rgba(210, 180, 140, 0.25)";
      c.fill();
      c.stroke();

      const rayCount = 14;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i * Math.PI * 2) / rayCount;
        const isLong = i % 2 === 0;
        const start = size * 0.18;
        const end = size * (isLong ? 0.75 : 0.45);
        c.beginPath();
        c.moveTo(Math.cos(angle) * start, Math.sin(angle) * start);
        c.lineTo(Math.cos(angle) * end, Math.sin(angle) * end);
        c.stroke();
      }
      c.restore();
    };

    const drawHandCrescent = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.fillStyle = col;
      
      c.beginPath();
      c.arc(x, y, size, -Math.PI / 2, Math.PI / 2);
      c.quadraticCurveTo(x + size * 0.38, y + size, x + size * 0.38, y - size);
      c.closePath();
      c.fill();
      
      c.restore();
    };

    const drawComet = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.rotate(Math.PI / 6);
      c.strokeStyle = col;
      c.lineWidth = 0.9;

      c.beginPath();
      c.arc(0, 0, size * 0.3, 0, Math.PI * 2);
      c.fillStyle = "rgba(210, 180, 140, 0.35)";
      c.fill();
      c.stroke();

      c.beginPath();
      c.moveTo(-size * 0.3, 0);
      c.quadraticCurveTo(-size * 0.9, -size * 0.15, -size * 1.5, -size * 0.3);
      c.moveTo(-size * 0.3, 0);
      c.quadraticCurveTo(-size * 1.1, 0, -size * 1.7, 0);
      c.moveTo(-size * 0.3, 0);
      c.quadraticCurveTo(-size * 0.9, size * 0.15, -size * 1.5, size * 0.3);
      c.stroke();

      c.restore();
    };

    const drawStellarClock = (c: CanvasRenderingContext2D, x: number, y: number, radius: number, angle: number, col: string) => {
      c.save();
      c.strokeStyle = col;
      c.lineWidth = 0.8;

      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(x, y, radius * 0.88, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(x, y, radius * 0.52, 0, Math.PI * 2);
      c.stroke();

      c.save();
      c.translate(x, y);
      c.rotate(angle);
      
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -radius * 0.78);
      c.strokeStyle = "rgba(184, 153, 106, 0.22)";
      c.lineWidth = 1.2;
      c.stroke();

      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(radius * 0.48, radius * 0.25);
      c.strokeStyle = "rgba(169, 179, 136, 0.22)";
      c.stroke();

      for (let i = 0; i < 24; i++) {
        const r = (i * Math.PI * 2) / 24;
        const tickLength = i % 2 === 0 ? 8 : 4;
        c.beginPath();
        c.moveTo(Math.cos(r) * (radius * 0.88), Math.sin(r) * (radius * 0.88));
        c.lineTo(Math.cos(r) * (radius * 0.88 + tickLength), Math.sin(r) * (radius * 0.88 + tickLength));
        c.stroke();
      }
      c.restore();
      c.restore();
    };

    const drawSerif1111 = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.fillStyle = col;
      c.font = `italic 300 ${size}px "Cormorant Garamond", "Lora", "Georgia", serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("11:11", x, y);
      
      c.strokeStyle = "rgba(184, 153, 106, 0.28)";
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(x - size * 1.5, y);
      c.lineTo(x - size * 0.8, y);
      c.moveTo(x + size * 0.8, y);
      c.lineTo(x + size * 1.5, y);
      c.stroke();
      c.restore();
    };

    const drawSaturn = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.strokeStyle = col;
      c.lineWidth = 0.95;

      c.save();
      c.beginPath();
      c.ellipse(0, 0, size * 1.55, size * 0.42, -Math.PI / 10, Math.PI, Math.PI * 2);
      c.stroke();
      c.restore();

      c.beginPath();
      c.arc(0, 0, size * 0.88, 0, Math.PI * 2);
      c.fillStyle = "rgba(245, 238, 220, 0.95)";
      c.fill();
      c.stroke();

      c.save();
      c.beginPath();
      c.ellipse(0, 0, size * 1.55, size * 0.42, -Math.PI / 10, 0, Math.PI);
      c.stroke();
      c.restore();

      c.save();
      c.beginPath();
      c.ellipse(0, 0, size * 1.25, size * 0.34, -Math.PI / 10, 0, Math.PI * 2);
      c.stroke();
      c.restore();

      c.restore();
    };

    const drawCelestialArchway = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.strokeStyle = col;
      c.lineWidth = 0.9;

      c.beginPath();
      c.moveTo(-size * 0.5, size * 0.9);
      c.lineTo(-size * 0.5, 0);
      c.arc(0, 0, size * 0.5, Math.PI, 0, false);
      c.lineTo(size * 0.5, size * 0.9);
      c.stroke();

      c.beginPath();
      c.moveTo(-size * 0.44, size * 0.9);
      c.lineTo(-size * 0.44, 0);
      c.arc(0, 0, size * 0.44, Math.PI, 0, false);
      c.lineTo(size * 0.44, size * 0.9);
      c.stroke();

      const steps = 4;
      const stepW = size * 0.65;
      const stepH = size * 0.14;
      for (let i = 0; i < steps; i++) {
        const w = stepW - i * (size * 0.11);
        const sx = -w * 0.5;
        const sy = size * 0.85 - i * stepH;
        
        c.beginPath();
        c.rect(sx, sy, w, -stepH);
        c.stroke();
      }

      c.save();
      c.beginPath();
      c.arc(0, 0, size * 0.44, Math.PI, 0, false);
      c.clip();
      
      c.beginPath();
      c.arc(0, size * 0.22, size * 0.15, 0, Math.PI * 2);
      c.fillStyle = "rgba(210, 180, 140, 0.15)";
      c.fill();
      c.stroke();
      
      const rayCount = 10;
      for (let i = 0; i < rayCount; i++) {
        const r = (i * Math.PI) / (rayCount - 1);
        c.beginPath();
        c.moveTo(Math.cos(r) * (size * 0.18), size * 0.22 - Math.sin(r) * (size * 0.18));
        c.lineTo(Math.cos(r) * (size * 0.42), size * 0.22 - Math.sin(r) * (size * 0.42));
        c.stroke();
      }
      c.restore();

      c.restore();
    };

    const drawMoonFace = (c: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.strokeStyle = col;
      c.lineWidth = 0.95;

      c.beginPath();
      c.arc(0, 0, size, -Math.PI / 2, Math.PI / 2);
      c.bezierCurveTo(size * 0.28, size * 0.72, size * 0.28, -size * 0.72, 0, -Math.PI / 2);
      c.closePath();
      c.stroke();

      c.beginPath();
      c.arc(size * 0.22, -size * 0.18, size * 0.08, 0, Math.PI, false);
      c.stroke();

      c.beginPath();
      c.moveTo(size * 0.2, size * 0.24);
      c.lineTo(size * 0.28, size * 0.27);
      c.stroke();

      const rayCount = 16;
      for (let i = 0; i < rayCount; i++) {
        const r = (i * Math.PI * 1.2) / rayCount - Math.PI * 0.6;
        const len = i % 2 === 0 ? 18 : 10;
        c.beginPath();
        c.moveTo(Math.cos(r) * (size * 1.08), Math.sin(r) * (size * 1.08));
        c.lineTo(Math.cos(r) * (size * 1.08 + len), Math.sin(r) * (size * 1.08 + len));
        c.stroke();
      }

      c.restore();
    };

    const drawCrystalCluster = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.strokeStyle = col;
      c.lineWidth = 0.88;
      
      const drawPrism = (cx: number, cy: number, w: number, h: number, rot: number) => {
        c.save();
        c.translate(cx, cy);
        c.rotate(rot);
        
        c.beginPath();
        c.moveTo(0, -h * 0.5);
        c.lineTo(w * 0.5, -h * 0.2);
        c.lineTo(w * 0.5, h * 0.5);
        c.lineTo(-w * 0.5, h * 0.5);
        c.lineTo(-w * 0.5, -h * 0.2);
        c.closePath();
        c.stroke();
        
        c.beginPath();
        c.moveTo(0, -h * 0.5);
        c.lineTo(0, h * 0.5);
        c.moveTo(-w * 0.5, -h * 0.2);
        c.lineTo(0, -h * 0.05);
        c.lineTo(w * 0.5, -h * 0.2);
        c.stroke();
        
        c.restore();
      };

      drawPrism(0, 0, size * 0.65, size * 1.6, -Math.PI / 12);
      drawPrism(-size * 0.45, size * 0.25, size * 0.45, size * 1.1, -Math.PI / 5);
      drawPrism(size * 0.52, size * 0.15, size * 0.38, size * 0.9, Math.PI / 8);

      c.restore();
    };

    const drawReachingHands = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.strokeStyle = col;
      c.lineWidth = 0.92;

      c.save();
      c.translate(-size * 0.2, 0);
      c.beginPath();
      c.moveTo(-size * 1.4, size * 0.5);
      c.quadraticCurveTo(-size * 0.7, -size * 0.2, -size * 0.2, -size * 0.08);
      c.quadraticCurveTo(-size * 0.05, -size * 0.15, 0, -size * 0.05);
      c.moveTo(-size * 0.35, -size * 0.1);
      c.quadraticCurveTo(-size * 0.18, -size * 0.28, -size * 0.04, -size * 0.32);
      c.stroke();
      c.restore();

      c.save();
      c.translate(size * 0.2, 0);
      c.beginPath();
      c.moveTo(size * 1.4, -size * 0.5);
      c.quadraticCurveTo(size * 0.7, size * 0.2, size * 0.2, size * 0.08);
      c.quadraticCurveTo(size * 0.05, size * 0.15, 0, size * 0.05);
      c.moveTo(size * 0.35, size * 0.1);
      c.quadraticCurveTo(size * 0.18, size * 0.28, size * 0.04, size * 0.32);
      c.stroke();
      c.restore();

      drawSparkStar(c, 0, 0, size * 0.22, 0, col);
      drawSparkStar(c, -size * 0.18, size * 0.12, size * 0.12, Math.PI / 4, col);
      drawSparkStar(c, size * 0.18, -size * 0.12, size * 0.12, -Math.PI / 4, col);

      c.restore();
    };

    const drawClassicalSunWithFace = (c: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number, col: string) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.strokeStyle = col;
      c.lineWidth = 0.95;

      const rayCount = 16;
      for (let i = 0; i < rayCount; i++) {
        const r = (i * Math.PI * 2) / rayCount;
        const cos = Math.cos(r);
        const sin = Math.sin(r);
        
        c.beginPath();
        if (i % 2 === 0) {
          c.moveTo(cos * size, sin * size);
          c.lineTo(cos * size * 1.5, sin * size * 1.5);
          c.stroke();
        } else {
          c.moveTo(cos * size, sin * size);
          const ctrlX1 = Math.cos(r + 0.15) * size * 1.25;
          const ctrlY1 = Math.sin(r + 0.15) * size * 1.25;
          const ctrlX2 = Math.cos(r - 0.15) * size * 1.35;
          const ctrlY2 = Math.sin(r - 0.15) * size * 1.35;
          const endX = cos * size * 1.58;
          const endY = sin * size * 1.58;
          c.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
          c.stroke();
        }
      }

      c.beginPath();
      c.arc(0, 0, size, 0, Math.PI * 2);
      c.fillStyle = "rgba(245, 238, 220, 0.95)";
      c.fill();
      c.stroke();

      c.beginPath();
      c.arc(-size * 0.35, -size * 0.1, size * 0.12, 0, Math.PI, false);
      c.arc(size * 0.35, -size * 0.1, size * 0.12, 0, Math.PI, false);
      c.stroke();

      c.beginPath();
      c.moveTo(0, -size * 0.05);
      c.quadraticCurveTo(-size * 0.14, size * 0.18, 0, size * 0.22);
      c.stroke();

      c.beginPath();
      c.arc(0, size * 0.38, size * 0.14, 0, Math.PI, false);
      c.stroke();

      c.restore();
    };

    // ==========================================
    // NEW MYSTICAL FOREST DETAILED DRAWING HELPERS
    // ==========================================

    const drawCelestialVine = (c: CanvasRenderingContext2D, x: number, y: number, length: number, col: string, time: number) => {
      c.save();
      c.strokeStyle = col;
      c.lineWidth = 0.8;
      
      c.beginPath();
      c.moveTo(x, y);
      
      let currentX = x;
      let currentY = y;
      const segments = 10;
      const segLength = length / segments;
      const swayOffset = Math.sin(time * 0.0006 + x) * 10;
      
      for (let i = 1; i <= segments; i++) {
        const ratio = i / segments;
        const segmentSway = Math.sin(time * 0.0008 + x + ratio * Math.PI) * swayOffset * ratio;
        const nextY = y + i * segLength;
        const nextX = x + segmentSway;
        
        c.lineTo(nextX, nextY);
        
        if (i % 3 === 0) {
          c.save();
          c.beginPath();
          c.arc(nextX, nextY, 1.8, 0, Math.PI * 2);
          c.fillStyle = "rgba(210, 180, 140, 0.75)";
          c.shadowBlur = 6;
          c.shadowColor = "rgba(210, 180, 140, 0.8)";
          c.fill();
          c.restore();
        }
        
        currentX = nextX;
        currentY = nextY;
      }
      c.stroke();
      
      c.beginPath();
      c.arc(currentX, currentY, 3.2, 0, Math.PI * 2);
      c.fillStyle = "rgba(255, 238, 200, 0.95)";
      c.shadowBlur = 10;
      c.shadowColor = col;
      c.fill();
      
      c.restore();
    };

    const drawGlowingMushroom = (
      c: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      size: number, 
      theme: "pink" | "purple" | "teal", 
      time: number
    ) => {
      c.save();
      c.translate(x, y);
      
      const breathe = Math.sin(time * 0.001 + x) * 0.06;
      const scale = 1 + breathe;
      c.scale(scale, scale);
      
      // 1. Mushroom stalk (cream gold)
      c.beginPath();
      c.moveTo(-size * 0.1, 0);
      c.quadraticCurveTo(-size * 0.07, -size * 0.4, -size * 0.07, -size * 0.7);
      c.lineTo(size * 0.07, -size * 0.7);
      c.quadraticCurveTo(size * 0.07, -size * 0.4, size * 0.1, 0);
      c.closePath();
      c.fillStyle = "rgba(245, 238, 220, 0.9)";
      c.strokeStyle = "rgba(184, 153, 106, 0.45)";
      c.lineWidth = 0.8;
      c.fill();
      c.stroke();
      
      // 2. Mushroom cap
      c.beginPath();
      c.moveTo(-size * 0.45, -size * 0.68);
      c.quadraticCurveTo(0, -size * 1.3, size * 0.45, -size * 0.68);
      c.quadraticCurveTo(size * 0.18, -size * 0.62, 0, -size * 0.65);
      c.quadraticCurveTo(-size * 0.18, -size * 0.62, -size * 0.45, -size * 0.68);
      c.closePath();
      
      let capGrad = c.createRadialGradient(0, -size * 0.9, size * 0.05, 0, -size * 0.7, size * 0.5);
      let glowColor = "rgba(217, 123, 108, 0.75)";
      
      if (theme === "purple") {
        capGrad.addColorStop(0, "#e9d5bf");
        capGrad.addColorStop(0.5, "#ac88b8");
        capGrad.addColorStop(1, "#664080");
        glowColor = "rgba(172, 136, 184, 0.85)";
      } else if (theme === "pink") {
        capGrad.addColorStop(0, "#fdd5c7");
        capGrad.addColorStop(0.5, "#d97b6c");
        capGrad.addColorStop(1, "#a34436");
        glowColor = "rgba(217, 123, 108, 0.85)";
      } else { // teal
        capGrad.addColorStop(0, "#e8eedc");
        capGrad.addColorStop(0.5, "#a9b388");
        capGrad.addColorStop(1, "#5c6245");
        glowColor = "rgba(169, 179, 136, 0.8)";
      }
      
      c.fillStyle = capGrad;
      c.shadowBlur = 20 * (1 + breathe * 0.5);
      c.shadowColor = glowColor;
      c.fill();
      c.shadowBlur = 0; // reset
      c.stroke();
      
      // spots
      c.fillStyle = "rgba(255, 255, 255, 0.75)";
      c.beginPath();
      c.arc(-size * 0.15, -size * 0.95, 1.8, 0, Math.PI * 2);
      c.arc(size * 0.15, -size * 0.98, 2.2, 0, Math.PI * 2);
      c.arc(0, -size * 1.08, 1.5, 0, Math.PI * 2);
      c.arc(-size * 0.24, -size * 0.82, 1.8, 0, Math.PI * 2);
      c.arc(size * 0.24, -size * 0.82, 1.8, 0, Math.PI * 2);
      c.fill();
      
      c.restore();
    };

    const drawPerspectivePath = (c: CanvasRenderingContext2D, yBase: number, scrollY: number, parallax: number) => {
      c.save();
      const currentY = yBase - scrollY * parallax;
      if (currentY > canvas.height + 250 || currentY < -250) {
        c.restore();
        return;
      }
      
      c.strokeStyle = "rgba(184, 153, 106, 0.22)";
      c.lineWidth = 1;
      
      const stoneCount = 10;
      for (let i = 0; i < stoneCount; i++) {
        const ratio = i / stoneCount;
        const scale = Math.pow(1.3, stoneCount - i) * 0.18;
        const stoneW = 160 * scale;
        const stoneH = 40 * scale;
        
        // winding curvy center path line
        const sx = canvas.width * 0.5 + Math.sin(ratio * Math.PI * 0.6) * 55;
        const sy = currentY + ratio * 260;
        
        c.save();
        c.translate(sx, sy);
        c.beginPath();
        c.ellipse(0, 0, stoneW * 0.5, stoneH * 0.5, Math.sin(i * 15) * 0.08, 0, Math.PI * 2);
        
        const stoneGrad = c.createLinearGradient(0, -stoneH * 0.5, 0, stoneH * 0.5);
        stoneGrad.addColorStop(0, "rgba(245, 238, 220, 0.9)");
        stoneGrad.addColorStop(1, "rgba(210, 180, 140, 0.85)");
        c.fillStyle = stoneGrad;
        c.shadowBlur = 6;
        c.shadowColor = "rgba(44, 37, 32, 0.05)";
        c.fill();
        c.stroke();
        c.restore();
      }
      
      c.restore();
    };

    const drawGnarledTreeFrame = (
      c: CanvasRenderingContext2D, 
      isLeft: boolean, 
      yBase: number, 
      height: number, 
      scrollY: number, 
      parallax: number,
      time: number
    ) => {
      c.save();
      const currentY = yBase - scrollY * parallax;
      if (currentY > canvas.height + 300 || currentY < -300) {
        c.restore();
        return;
      }

      // Dynamic tree shift: trees gently open up to reveal the magical path as user scrolls deep!
      const scrollThreshold = 1800;
      const maxScrollShift = Math.min(180, Math.max(0, (scrollY - scrollThreshold) * 0.16));
      const shiftX = isLeft ? -maxScrollShift : maxScrollShift;

      c.fillStyle = "rgba(18, 14, 12, 0.98)"; // Mystical deep gnarled bark dark carbon
      c.strokeStyle = "rgba(228, 191, 136, 0.32)"; // Gold details
      c.lineWidth = 1;
      c.shadowBlur = 35;
      c.shadowColor = "rgba(0, 0, 0, 0.85)";

      c.beginPath();
      if (isLeft) {
        c.moveTo(-40 + shiftX, currentY);
        c.lineTo(-40 + shiftX, currentY + height);
        
        // Gnarled curves on Left Tree
        c.quadraticCurveTo(80 + shiftX, currentY + height * 0.8, 50 + shiftX, currentY + height * 0.6);
        c.quadraticCurveTo(120 + shiftX, currentY + height * 0.4, 30 + shiftX, currentY + height * 0.25);
        c.quadraticCurveTo(70 + shiftX, currentY + height * 0.1, -40 + shiftX, currentY);
      } else {
        c.moveTo(canvas.width + 40 + shiftX, currentY);
        c.lineTo(canvas.width + 40 + shiftX, currentY + height);
        
        // Gnarled curves on Right Tree
        c.quadraticCurveTo(canvas.width - 80 + shiftX, currentY + height * 0.8, canvas.width - 50 + shiftX, currentY + height * 0.6);
        c.quadraticCurveTo(canvas.width - 120 + shiftX, currentY + height * 0.4, canvas.width - 30 + shiftX, currentY + height * 0.25);
        c.quadraticCurveTo(canvas.width - 70 + shiftX, currentY + height * 0.1, canvas.width + 40 + shiftX, currentY);
      }
      c.closePath();
      c.fill();
      c.stroke();
      
      // Draw detailed branch lines wrapping around
      c.beginPath();
      if (isLeft) {
        c.moveTo(20 + shiftX, currentY + height * 0.55);
        c.quadraticCurveTo(90 + shiftX, currentY + height * 0.45, 140 + shiftX, currentY + height * 0.48);
        c.moveTo(35 + shiftX, currentY + height * 0.3);
        c.quadraticCurveTo(110 + shiftX, currentY + height * 0.2, 130 + shiftX, currentY + height * 0.18);
      } else {
        c.moveTo(canvas.width - 20 + shiftX, currentY + height * 0.55);
        c.quadraticCurveTo(canvas.width - 90 + shiftX, currentY - height * 0.45, canvas.width - 140 + shiftX, currentY + height * 0.48);
        c.moveTo(canvas.width - 35 + shiftX, currentY + height * 0.3);
        c.quadraticCurveTo(canvas.width - 110 + shiftX, currentY + height * 0.2, canvas.width - 130 + shiftX, currentY + height * 0.18);
      }
      c.strokeStyle = "rgba(18, 14, 12, 0.98)";
      c.lineWidth = 14;
      c.stroke();
      c.lineWidth = 1;
      c.strokeStyle = "rgba(228, 191, 136, 0.32)";
      c.stroke();

      // Hanging stardust vines from branches!
      const vineCount = 3;
      const vineSway = Math.sin(time * 0.0005) * 8;
      for (let i = 0; i < vineCount; i++) {
        c.save();
        const vx = isLeft 
          ? (40 + i * 40 + shiftX) + vineSway 
          : (canvas.width - 40 - i * 40 + shiftX) + vineSway;
        const vy = currentY + height * (0.42 + i * 0.06);
        drawCelestialVine(c, vx, vy, 110 + i * 30, "rgba(244, 226, 198, 0.55)", time + i * 300);
        c.restore();
      }

      c.restore();
    };

    // MAGICAL GOD RAYS / LIGHT SHAFTS (Matching reference image light rays)
    const drawGodRays = (c: CanvasRenderingContext2D, scrollY: number, time: number) => {
      c.save();
      // Glows stronger as we scroll deeper into the magical forest
      const startFadeY = 1600;
      const opacity = Math.min(1, Math.max(0, (scrollY - startFadeY) / 500)) * 0.38;
      if (opacity <= 0) {
        c.restore();
        return;
      }

      c.globalAlpha = opacity;
      
      const rayCount = 4;
      const speed = time * 0.0002;
      for (let i = 0; i < rayCount; i++) {
        const xOffset = Math.sin(speed + i * 1.5) * 60;
        const width = 140 + i * 50 + Math.cos(speed + i) * 30;
        
        const grad = c.createLinearGradient(
          canvas.width * 0.25 + xOffset, 0,
          canvas.width * 0.05 + xOffset * 1.6, canvas.height
        );
        // Soft mystic blue/teal and gold glowing rays matching photo
        grad.addColorStop(0, "rgba(164, 224, 255, 0.25)");
        grad.addColorStop(0.5, "rgba(209, 185, 255, 0.12)");
        grad.addColorStop(1, "rgba(255, 230, 240, 0)");

        c.fillStyle = grad;
        c.beginPath();
        c.moveTo(canvas.width * 0.2 + xOffset - width * 0.5, 0);
        c.lineTo(canvas.width * 0.2 + xOffset + width * 0.5, 0);
        c.lineTo(canvas.width * 0.05 + xOffset * 1.6 + width * 2.2, canvas.height);
        c.lineTo(canvas.width * 0.05 + xOffset * 1.6 - width * 2.2, canvas.height);
        c.closePath();
        c.fill();
      }
      c.restore();
    };

    const drawMountainRidge = (
      c: CanvasRenderingContext2D,
      yBase: number,
      amplitude: number,
      frequency: number,
      fillColor: string,
      strokeColor: string,
      scrollY: number,
      parallax: number,
      time: number
    ) => {
      c.save();
      c.beginPath();
      
      const currentY = yBase - scrollY * parallax;
      if (currentY > canvas.height + 300 || currentY < -300) {
        c.restore();
        return;
      }

      c.moveTo(0, canvas.height + 100);
      
      const breeze = Math.sin(time * 0.00025 + yBase) * 20;
      const breathing = Math.sin(time * 0.0004 + yBase) * 4.5;

      for (let x = 0; x <= canvas.width + 10; x += 15) {
        const windX = x + breeze;
        const yOffset = Math.sin(windX * frequency) * amplitude + Math.cos(windX * frequency * 0.4) * (amplitude * 0.35);
        c.lineTo(x, currentY + yOffset + breathing);
      }
      
      c.lineTo(canvas.width + 10, canvas.height + 100);
      c.closePath();
      
      c.fillStyle = fillColor;
      c.fill();
      c.strokeStyle = strokeColor;
      c.lineWidth = 1.25;
      c.stroke();
      c.restore();
    };

    const drawMysticalOceanWaves = (
      c: CanvasRenderingContext2D,
      yBase: number,
      waveHeight: number,
      waveLength: number,
      strokeColor: string,
      scrollY: number,
      parallax: number,
      time: number
    ) => {
      c.save();
      c.strokeStyle = strokeColor;
      c.lineWidth = 0.9;
      
      const currentY = yBase - scrollY * parallax;
      if (currentY > canvas.height + 250 || currentY < -250) {
        c.restore();
        return;
      }

      for (let row = 0; row < 3; row++) {
        c.beginPath();
        const rowY = currentY + row * 38;
        
        for (let x = -40; x <= canvas.width + 40; x += 25) {
          const waveOffset = Math.sin((x * 0.012) + (time * 0.0028) + (row * 1.5)) * waveHeight;
          if (x === -40) {
            c.moveTo(x, rowY + waveOffset);
          } else {
            c.quadraticCurveTo(x - 12, rowY + waveOffset * 1.4, x, rowY + waveOffset);
          }
        }
        c.stroke();
      }
      c.restore();
    };

    const drawGiantCosmicSun = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      angle: number,
      col: string
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.strokeStyle = col;
      c.lineWidth = 0.75;

      const rayCount = 48;
      for (let i = 0; i < rayCount; i++) {
        const r = (i * Math.PI * 2) / rayCount;
        const len = i % 4 === 0 ? 30 : i % 2 === 0 ? 15 : 8;
        c.beginPath();
        c.moveTo(Math.cos(r) * radius, Math.sin(r) * radius);
        c.lineTo(Math.cos(r) * (radius + len), Math.sin(r) * (radius + len));
        c.stroke();
      }

      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
      c.fillStyle = "rgba(210, 180, 140, 0.15)";
      c.fill();
      c.stroke();
      
      c.restore();
    };

    // HIGH PERFORMANCE RENDER LOOP
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const currentScrollY = currentScrollYVal;
      const time = performance.now();

      // 1. Draw Giant Cosmic Sun rising behind mountains (around y = 1450px)
      const sunAngle = time * 0.00012 + currentScrollY * 0.0003;
      const sunParallax = 0.22;
      const sunX = canvas.width * 0.72 + mouse.x * (sunParallax * 30);
      const sunY = 720 - currentScrollY * sunParallax + mouse.y * (sunParallax * 30);
      const sunPulse = Math.sin(time * 0.0008) * 0.04;
      const sunRadius = Math.min(canvas.width, 220) * 0.5 * (1 + sunPulse);
      drawGiantCosmicSun(ctx, sunX, sunY, sunRadius, sunAngle, "rgba(210, 180, 140, 0.42)");

      // 2. Draw 3-layer Mountain Ridges
      drawMountainRidge(ctx, 820, 55, 0.0035, "rgba(245, 238, 220, 0.75)", "rgba(210, 180, 140, 0.35)", currentScrollY, 0.18, time);
      drawMountainRidge(ctx, 900, 65, 0.0048, "rgba(243, 235, 224, 0.85)", "rgba(210, 180, 140, 0.48)", currentScrollY, 0.3, time);
      drawMountainRidge(ctx, 1000, 80, 0.0028, "rgba(235, 220, 200, 0.95)", "rgba(184, 153, 106, 0.65)", currentScrollY, 0.42, time);

      // Draw Atmospheric God Rays / Light Shafts inside the transition to forest
      drawGodRays(ctx, currentScrollY, time);

      // 3. Draw Perspective Stone Stepping Pathway leading down to the magical forest
      drawPerspectivePath(ctx, 2450, currentScrollY, 0.45);
      drawPerspectivePath(ctx, 3100, currentScrollY, 0.45);

      // 4. Draw Stars & Celestial forest elements (mushrooms, vines, third eyes, clocks)
      elements.forEach((el) => {
        if (el.vx !== undefined && el.vy !== undefined) {
          if (el.isNeon) {
            // Neon Fireflies mouse repulsion physics
            const mouseDrift = el.parallax * 30;
            const screenX = el.x * canvas.width + mouse.x * mouseDrift;
            const screenY = el.y - currentScrollY * el.parallax + mouse.y * mouseDrift;
            
            const realMouseX = (mouse.targetX + 0.5) * canvas.width;
            const realMouseY = (mouse.targetY + 0.5) * canvas.height;
            
            const dx = screenX - realMouseX;
            const dy = screenY - realMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const forceRadius = 160;
            
            if (dist < forceRadius) {
              const force = (forceRadius - dist) / forceRadius;
              const angle = Math.atan2(dy, dx);
              // Push particles away from mouse
              el.vx += Math.cos(angle) * force * 0.0006;
              el.vy += Math.sin(angle) * force * 0.0006;
            }
            
            // Soft friction
            el.vx *= 0.93;
            el.vy *= 0.93;
            
            // Speed limiter
            const speed = Math.sqrt(el.vx * el.vx + el.vy * el.vy);
            const maxSpeed = 0.0016;
            if (speed > maxSpeed) {
              el.vx = (el.vx / speed) * maxSpeed;
              el.vy = (el.vy / speed) * maxSpeed;
            }
            
            // Soft floating wave sway
            el.y += Math.sin(time * 0.0007 + el.x * 30) * 0.07;
          }

          el.x += el.vx;
          el.y += el.vy;
          if (el.x < 0) el.x = 1;
          if (el.x > 1) el.x = 0;
          if (el.y < 0) el.y = worldHeight;
          if (el.y > worldHeight) el.y = 0;
        }

        el.rotation += el.rotationSpeed;

        const mouseDrift = el.parallax * 30;
        const screenX = el.x * canvas.width + mouse.x * mouseDrift;
        const screenY = el.y - currentScrollY * el.parallax + mouse.y * mouseDrift;

        if (screenY < -250 || screenY > canvas.height + 250) {
          return;
        }

        switch (el.type) {
          case "spark":
            if (el.isNeon) {
              const baseCol = el.color;
              const glowCol = baseCol.replace(/rgba\((\d+,\s*\d+,\s*\d+),\s*[\d.]+\)/, "rgba($1, 0.12)");
              const midCol = baseCol.replace(/rgba\((\d+,\s*\d+,\s*\d+),\s*[\d.]+\)/, "rgba($1, 0.42)");
              
              drawSparkStar(ctx, screenX, screenY, el.size * 2.2, el.rotation, glowCol);
              drawSparkStar(ctx, screenX, screenY, el.size * 1.4, el.rotation, midCol);
              drawSparkStar(ctx, screenX, screenY, el.size, el.rotation, baseCol);
            } else {
              drawSparkStar(ctx, screenX, screenY, el.size, el.rotation, el.color);
            }
            break;
          case "eye":
            drawThirdEye(ctx, screenX, screenY, el.size, el.color);
            break;
          case "sunburst":
            drawSunburst(ctx, screenX, screenY, el.size, el.rotation, el.color);
            break;
          case "moon":
            drawHandCrescent(ctx, screenX, screenY, el.size, el.color);
            break;
          case "comet":
            drawComet(ctx, screenX, screenY, el.size, el.color);
            break;
          case "clock":
            drawStellarClock(ctx, screenX, screenY, el.size, el.rotation, el.color);
            break;
          case "constellation":
            if (el.constellationPoints) {
              ctx.save();
              ctx.translate(screenX, screenY);
              ctx.strokeStyle = el.color;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              
              el.constellationPoints.forEach((pt, idx) => {
                if (idx === 0) {
                  ctx.moveTo(pt.x, pt.y);
                } else {
                  ctx.lineTo(pt.x, pt.y);
                }
              });
              ctx.stroke();

              el.constellationPoints.forEach((pt) => {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = palette.goldAccent;
                ctx.fill();
              });
              ctx.restore();
            }
            break;
          case "saturn":
            drawSaturn(ctx, screenX, screenY, el.size, el.color);
            break;
          case "hands":
            drawReachingHands(ctx, screenX, screenY, el.size, el.color);
            break;
          case "serif1111":
            drawSerif1111(ctx, screenX, screenY, el.size, el.color);
            break;
          case "crystals":
            drawCrystalCluster(ctx, screenX, screenY, el.size, el.color);
            break;
          case "archway":
            drawCelestialArchway(ctx, screenX, screenY, el.size, el.color);
            break;
          case "moonface":
            drawMoonFace(ctx, screenX, screenY, el.size, el.rotation, el.color);
            break;
          case "sunface":
            drawClassicalSunWithFace(ctx, screenX, screenY, el.size, el.rotation, el.color);
            break;
          case "celestial_vine":
            if (el.vineLength) {
              drawCelestialVine(ctx, screenX, screenY, el.vineLength, el.color, time);
            }
            break;
          case "mushroom":
            if (el.colorTheme) {
              drawGlowingMushroom(ctx, screenX, screenY, el.size, el.colorTheme, time);
            }
            break;
        }
      });

      // 5. Draw Silhouetted Gnarled Ancient Forest Trees framing left/right viewports in the forest zone
      drawGnarledTreeFrame(ctx, true, 2400, 750, currentScrollY, 0.45, time);
      drawGnarledTreeFrame(ctx, false, 2400, 750, currentScrollY, 0.45, time);
      drawGnarledTreeFrame(ctx, true, 3050, 750, currentScrollY, 0.45, time);
      drawGnarledTreeFrame(ctx, false, 3050, 750, currentScrollY, 0.45, time);

      // 6. Draw Mystical Ocean Waves at the ocean floor (y = 1050px to 1250px)
      drawMysticalOceanWaves(ctx, 1050, 8, 80, "rgba(184, 153, 106, 0.4)", currentScrollY, 0.48, time);
      drawMysticalOceanWaves(ctx, 1150, 10, 100, "rgba(169, 179, 136, 0.38)", currentScrollY, 0.52, time + 500);
      drawMysticalOceanWaves(ctx, 1250, 12, 120, "rgba(92, 82, 64, 0.35)", currentScrollY, 0.56, time + 1000);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#12100e]">
      {/* Hand-Drawn Astrology Tapestry Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-none" />

      {/* Nebula ambient forest champagne/sand-gold dust clouds - Perfect harmony with the gold-white canvas drawings */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.72]">
        {/* Celestial Warm Amber celestial nebula at top (y: 0 - 800) */}
        <div className="absolute top-[2%] left-[10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-tr from-[#2d2212]/55 via-[#18140c]/30 to-transparent blur-[120px]" />
        
        {/* Soft Glowing Bronze/Sand-Gold mist on transition (y: 800 - 1800) */}
        <div className="absolute top-[32%] right-[5%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-[#332916]/40 via-[#1a170f]/20 to-transparent blur-[130px]" />
        
        {/* Deep Mystical Sand-Gold & Champagne Bronze glow at the forest floor bottom (y: 1800 - 3500) */}
        <div className="absolute bottom-[22%] left-[2%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-tr from-[#3a2e19]/45 via-[#211a0f]/45 to-transparent blur-[140px]" />
        <div className="absolute bottom-[2%] right-[6%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-tl from-[#221c10]/35 via-[#14120a]/25 to-transparent blur-[125px]" />
      </div>

      {/* Premium Cinematic Vignette shade - slightly lighter for better readability and integration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(18,16,14,0.65) 100%)] pointer-events-none" />
    </div>
  );
}
