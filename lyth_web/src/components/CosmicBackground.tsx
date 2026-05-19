"use client";

import React, { useEffect, useRef, useState } from "react";

interface CelestialElement {
  type: "eye" | "sunburst" | "moon" | "constellation" | "spark" | "comet" | "clock" | "saturn" | "hands" | "serif1111" | "crystals" | "archway" | "moonface" | "sunface";
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

    // Sand Gold, Gold Deep, Sage Moss, Earth Brown, Muted Charcoal, Soft Peach
    const palette = {
      goldAccent: "rgba(210, 180, 140, 0.45)",
      goldDeep: "rgba(184, 153, 106, 0.55)",
      goldDeepMuted: "rgba(184, 153, 106, 0.18)",
      sage: "rgba(169, 179, 136, 0.5)",
      brown: "rgba(184, 159, 138, 0.45)",
      charcoal: "rgba(92, 82, 64, 0.6)",
      darkSpark: "rgba(44, 37, 32, 0.75)",
    };

    const initCelestialElements = () => {
      elements = [];

      // ==========================================
      // NEW CUSTOM ASTROLOGY FIGURES FROM USER'S REFERENCE IMAGE
      // ==========================================
      
      // A. "11:11" Classical gold text at the Hero section
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

      // B. Saturn (Thổ tinh) in the upper celestial zone
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

      // C. Archway with climbing stairs in the transition zone
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

      // D. Serene Moon face in the carousel backdrop zone
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

      // E. Elegant crystal cluster in the mountain backdrop zone
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

      // F. Mystical reaching hands in the mountain valley zone
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

      // G. Detailed hand-drawn Sun with serene face in the ocean floor zone
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

      // 1. Generate 3 slowly-spinning Astrological Geometrical Clocks
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
      elements.push({
        type: "clock",
        x: 0.2,
        y: 1850,
        size: Math.min(canvas.width, 300) * 0.48,
        rotation: Math.random() * Math.PI,
        rotationSpeed: 0.0004,
        color: palette.goldDeepMuted,
        parallax: 0.16,
      });

      // 2. Generate 10 hand-drawn third eyes
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
          parallax: 0.35 + Math.random() * 0.1,
        });
      });      // 3. Generate 10 sunbursts (shining suns)
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
          parallax: 0.25 + Math.random() * 0.1,
        });
      });

      // 4. Generate 12 hand-drawn crescent moons
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
          parallax: 0.4 + Math.random() * 0.1,
        });
      });

      // 5. Generate 8 unique beautiful constellations (hand-drawn outlines)
      const constellations = [
        // Ursa Major shape
        { x: 0.22, y: 180, points: [{ x: 0, y: 0 }, { x: 45, y: 15 }, { x: 75, y: 40 }, { x: 120, y: 45 }, { x: 145, y: 75 }, { x: 120, y: 105 }, { x: 75, y: 95 }, { x: 45, y: 70 }, { x: 0, y: 0 }] },
        // Cassiopeia W shape
        { x: 0.78, y: 450, points: [{ x: 0, y: 0 }, { x: 25, y: -25 }, { x: 50, y: 5 }, { x: 80, y: -30 }, { x: 105, y: 10 }] },
        // Orion-like hourglass
        { x: 0.15, y: 950, points: [{ x: 0, y: 0 }, { x: 60, y: 5 }, { x: 30, y: 50 }, { x: 0, y: 95 }, { x: 60, y: 90 }, { x: 30, y: 50 }, { x: 0, y: 0 }] },
        // Cygnus Cross
        { x: 0.82, y: 1550, points: [{ x: 0, y: 0 }, { x: 40, y: -20 }, { x: 80, y: -40 }, { x: 40, y: -20 }, { x: 20, y: 30 }, { x: 60, y: -70 }] },
        // Pegasus Square
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

      // 6. Generate 6 drawing style comets/shooting stars
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

      // 7. Generate 140 sparkling star sparks (Black and Gold)
      for (let i = 0; i < 140; i++) {
        const isDark = Math.random() < 0.25; // 25% are elegant black star sparks from photo!
        elements.push({
          type: "spark",
          x: Math.random(),
          y: Math.random() * worldHeight,
          size: Math.random() * 4.5 + 2.5,
          rotation: Math.random() * Math.PI,
          rotationSpeed: Math.random() * 0.005 + 0.002,
          color: isDark ? palette.darkSpark : palette.goldDeep,
          parallax: Math.random() * 0.35 + 0.35, // variable parallax for intense 3D scrolling depth!
        });
      }

      // 8. Generate 90 Moving Neon Floating Sparks (Fireflies / Cosmic energy dust)
      const neonColors = [
        "rgba(212, 175, 55, 0.85)",   // Neon Sand Gold
        "rgba(255, 179, 71, 0.85)",   // Neon Radiant Amber
        "rgba(169, 211, 158, 0.8)",    // Neon Emerald Sage
        "rgba(110, 211, 207, 0.8)",    // Neon Mystic Teal
      ];
      for (let i = 0; i < 90; i++) {
        const randColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        elements.push({
          type: "spark",
          x: Math.random(),
          y: Math.random() * worldHeight,
          size: Math.random() * 3.5 + 2.0,
          rotation: Math.random() * Math.PI,
          rotationSpeed: Math.random() * 0.008 + 0.003,
          color: randColor,
          parallax: Math.random() * 0.35 + 0.35,
          vx: (Math.random() - 0.5) * 0.0006, // horizontal drift speed
          vy: (Math.random() - 0.5) * 0.35,   // vertical drift in pixels/frame
          isNeon: true,
        });
      }
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    resizeCanvas();

    // Custom hand-drawn vector rendering functions
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
      
      // Outer eye lid lines
      c.beginPath();
      c.moveTo(x - size, y);
      c.quadraticCurveTo(x, y - size * 0.52, x + size, y);
      c.quadraticCurveTo(x, y + size * 0.52, x - size, y);
      c.stroke();

      // Iris (Muted brown-grey)
      c.beginPath();
      c.arc(x, y, size * 0.28, 0, Math.PI * 2);
      c.fillStyle = "rgba(92, 82, 64, 0.55)";
      c.fill();
      c.stroke();

      // Pupil (Charcoal dark)
      c.beginPath();
      c.arc(x, y, size * 0.12, 0, Math.PI * 2);
      c.fillStyle = "rgba(44, 37, 32, 0.95)";
      c.fill();

      // Tiny lashes (Minimal ticks)
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

      // Small central circle
      c.beginPath();
      c.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      c.fillStyle = "rgba(210, 180, 140, 0.25)";
      c.fill();
      c.stroke();

      // Rays
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
      
      // Hand drawn crescent shape
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
      c.rotate(Math.PI / 6); // elegant angle
      c.strokeStyle = col;
      c.lineWidth = 0.9;

      // Draw planet comet core head
      c.beginPath();
      c.arc(0, 0, size * 0.3, 0, Math.PI * 2);
      c.fillStyle = "rgba(210, 180, 140, 0.35)";
      c.fill();
      c.stroke();

      // 3 radiating hand-sketched tail lines
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

      // concentric astrolabe rings
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(x, y, radius * 0.88, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(x, y, radius * 0.52, 0, Math.PI * 2);
      c.stroke();

      // rotating pointers inside clock
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

      // Astrological dial ticks
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

    // Custom vector helpers for new Astrology figures from uploaded image:
    const drawSerif1111 = (c: CanvasRenderingContext2D, x: number, y: number, size: number, col: string) => {
      c.save();
      c.fillStyle = col;
      c.font = `italic 300 ${size}px "Cormorant Garamond", "Lora", "Georgia", serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("11:11", x, y);
      
      // Fine horizontal lines on sides of 11:11
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

      // Draw the tilted rings back segment
      c.save();
      c.beginPath();
      c.ellipse(0, 0, size * 1.55, size * 0.42, -Math.PI / 10, Math.PI, Math.PI * 2);
      c.stroke();
      c.restore();

      // Draw the sphere
      c.beginPath();
      c.arc(0, 0, size * 0.88, 0, Math.PI * 2);
      c.fillStyle = "rgba(245, 238, 220, 0.95)";
      c.fill();
      c.stroke();

      // Draw the tilted rings front segment (overlapping the planet)
      c.save();
      c.beginPath();
      c.ellipse(0, 0, size * 1.55, size * 0.42, -Math.PI / 10, 0, Math.PI);
      c.stroke();
      c.restore();

      // Concentric inner ring line
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

      // Outer Arch
      c.beginPath();
      c.moveTo(-size * 0.5, size * 0.9);
      c.lineTo(-size * 0.5, 0);
      c.arc(0, 0, size * 0.5, Math.PI, 0, false);
      c.lineTo(size * 0.5, size * 0.9);
      c.stroke();

      // Inner Arch line
      c.beginPath();
      c.moveTo(-size * 0.44, size * 0.9);
      c.lineTo(-size * 0.44, 0);
      c.arc(0, 0, size * 0.44, Math.PI, 0, false);
      c.lineTo(size * 0.44, size * 0.9);
      c.stroke();

      // Stairs climbing inside the archway
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

      // Sun rays inside the arch ceiling window
      c.save();
      c.beginPath();
      c.arc(0, 0, size * 0.44, Math.PI, 0, false);
      c.clip();
      
      // Draw tiny sun on horizon
      c.beginPath();
      c.arc(0, size * 0.22, size * 0.15, 0, Math.PI * 2);
      c.fillStyle = "rgba(210, 180, 140, 0.15)";
      c.fill();
      c.stroke();
      
      // Radiating sunrays
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

      // 1. Crescent outline path
      c.beginPath();
      c.arc(0, 0, size, -Math.PI / 2, Math.PI / 2);
      // Serene profile line
      c.bezierCurveTo(size * 0.28, size * 0.72, size * 0.28, -size * 0.72, 0, -Math.PI / 2);
      c.closePath();
      c.stroke();

      // 2. Serene face details inside moon
      // Closed curved eye
      c.beginPath();
      c.arc(size * 0.22, -size * 0.18, size * 0.08, 0, Math.PI, false);
      c.stroke();
      // Lip line
      c.beginPath();
      c.moveTo(size * 0.2, size * 0.24);
      c.lineTo(size * 0.28, size * 0.27);
      c.stroke();

      // Radiating geometric rays around the back of the crescent moon
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
        // Crystal diamond top prism path
        c.moveTo(0, -h * 0.5);
        c.lineTo(w * 0.5, -h * 0.2);
        c.lineTo(w * 0.5, h * 0.5);
        c.lineTo(-w * 0.5, h * 0.5);
        c.lineTo(-w * 0.5, -h * 0.2);
        c.closePath();
        c.stroke();
        
        // Inner facets to look 3D crystal
        c.beginPath();
        c.moveTo(0, -h * 0.5);
        c.lineTo(0, h * 0.5);
        c.moveTo(-w * 0.5, -h * 0.2);
        c.lineTo(0, -h * 0.05);
        c.lineTo(w * 0.5, -h * 0.2);
        c.stroke();
        
        c.restore();
      };

      // Draw three crystal prisms clustering elegantly
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

      // 1. Left hand reaching
      c.save();
      c.translate(-size * 0.2, 0);
      c.beginPath();
      c.moveTo(-size * 1.4, size * 0.5);
      c.quadraticCurveTo(-size * 0.7, -size * 0.2, -size * 0.2, -size * 0.08); // arm to palm
      c.quadraticCurveTo(-size * 0.05, -size * 0.15, 0, -size * 0.05); // index finger
      // thumb
      c.moveTo(-size * 0.35, -size * 0.1);
      c.quadraticCurveTo(-size * 0.18, -size * 0.28, -size * 0.04, -size * 0.32);
      c.stroke();
      c.restore();

      // 2. Right hand reaching
      c.save();
      c.translate(size * 0.2, 0);
      c.beginPath();
      c.moveTo(size * 1.4, -size * 0.5);
      c.quadraticCurveTo(size * 0.7, size * 0.2, size * 0.2, size * 0.08); // arm to palm
      c.quadraticCurveTo(size * 0.05, size * 0.15, 0, size * 0.05); // index finger
      // thumb
      c.moveTo(size * 0.35, size * 0.1);
      c.quadraticCurveTo(size * 0.18, size * 0.28, size * 0.04, size * 0.32);
      c.stroke();
      c.restore();

      // 3. Floating sparks between fingers
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

      // 1. Draw alternating straight rays and wavy flames
      const rayCount = 16;
      for (let i = 0; i < rayCount; i++) {
        const r = (i * Math.PI * 2) / rayCount;
        const cos = Math.cos(r);
        const sin = Math.sin(r);
        
        c.beginPath();
        if (i % 2 === 0) {
          // Straight geometric ray
          c.moveTo(cos * size, sin * size);
          c.lineTo(cos * size * 1.5, sin * size * 1.5);
          c.stroke();
        } else {
          // Wavy bezier flame
          c.moveTo(cos * size, sin * size);
          // wavy control points
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

      // 2. Core face circle
      c.beginPath();
      c.arc(0, 0, size, 0, Math.PI * 2);
      c.fillStyle = "rgba(245, 238, 220, 0.95)";
      c.fill();
      c.stroke();

      // 3. Sleeping eyes profile details
      c.beginPath();
      // left closed curved eye
      c.arc(-size * 0.35, -size * 0.1, size * 0.12, 0, Math.PI, false);
      // right closed curved eye
      c.arc(size * 0.35, -size * 0.1, size * 0.12, 0, Math.PI, false);
      c.stroke();

      // nose curve
      c.beginPath();
      c.moveTo(0, -size * 0.05);
      c.quadraticCurveTo(-size * 0.14, size * 0.18, 0, size * 0.22);
      c.stroke();

      // peaceful smiling lip curve
      c.beginPath();
      c.arc(0, size * 0.38, size * 0.14, 0, Math.PI, false);
      c.stroke();

      c.restore();
    };

    // Helper to draw layered, beautiful hand-sketched mountain ridges with breathing sways
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
      
      // Calculate curve points with slow time-dependent swaying breeze and breathing
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

    // Helper to draw elegant rippling waves at the ocean floor
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

      // Draw 3 layers of overlapping ocean wave rows with faster wind ripples
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

    // Helper to draw a giant, radiant ancient cosmic Sun rising behind mountains
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

      // Draw 48 geometric radiating ticks
      const rayCount = 48;
      for (let i = 0; i < rayCount; i++) {
        const r = (i * Math.PI * 2) / rayCount;
        const len = i % 4 === 0 ? 30 : i % 2 === 0 ? 15 : 8;
        c.beginPath();
        c.moveTo(Math.cos(r) * radius, Math.sin(r) * radius);
        c.lineTo(Math.cos(r) * (radius + len), Math.sin(r) * (radius + len));
        c.stroke();
      }

      // Concentric rings
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

    // The high-performance rendering loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const currentScrollY = currentScrollYVal;
      const time = performance.now();

      // 1. Draw Giant Cosmic Sun behind mountains (around y = 1450px) with continuous breathing pulse
      const sunAngle = time * 0.00015 + currentScrollY * 0.0003; // rotate continuously!
      const sunParallax = 0.22;
      const sunX = canvas.width * 0.72 + mouse.x * (sunParallax * 30);
      const sunY = 720 - currentScrollY * sunParallax + mouse.y * (sunParallax * 30);
      const sunPulse = Math.sin(time * 0.0008) * 0.04; // 4% scale pulsing size
      const sunRadius = Math.min(canvas.width, 220) * 0.5 * (1 + sunPulse);
      drawGiantCosmicSun(ctx, sunX, sunY, sunRadius, sunAngle, "rgba(210, 180, 140, 0.42)");

      // 2. Draw 3-layer Mountain Ridges with progressive scroll parallax and breeze sway
      // Far Mountain
      drawMountainRidge(
        ctx,
        820,
        55,
        0.0035,
        "rgba(245, 238, 220, 0.75)", // champagne filled
        "rgba(210, 180, 140, 0.35)", // gold outline
        currentScrollY,
        0.18,
        time
      );

      // Mid Mountain
      drawMountainRidge(
        ctx,
        900,
        65,
        0.0048,
        "rgba(243, 235, 224, 0.85)", 
        "rgba(210, 180, 140, 0.48)", 
        currentScrollY,
        0.3,
        time
      );

      // Near Mountain
      drawMountainRidge(
        ctx,
        1000,
        80,
        0.0028,
        "rgba(235, 220, 200, 0.95)", 
        "rgba(184, 153, 106, 0.65)", 
        currentScrollY,
        0.42,
        time
      );

      // 3. Draw Stars & Celestial elements (clocks, constellations, moons, third eyes)
      elements.forEach((el) => {
        // Continuous organic velocity drift for moving sparks
        if (el.vx !== undefined && el.vy !== undefined) {
          el.x += el.vx;
          el.y += el.vy;
          // Wrap around vertical space limits smoothly
          if (el.x < 0) el.x = 1;
          if (el.x > 1) el.x = 0;
          if (el.y < 0) el.y = worldHeight;
          if (el.y > worldHeight) el.y = 0;
        }

        el.rotation += el.rotationSpeed;

        const mouseDrift = el.parallax * 30;
        const screenX = el.x * canvas.width + mouse.x * mouseDrift;
        const screenY = el.y - currentScrollY * el.parallax + mouse.y * mouseDrift;

        if (screenY < -150 || screenY > canvas.height + 150) {
          return;
        }

        switch (el.type) {
          case "spark":
            if (el.isNeon) {
              const baseCol = el.color; // e.g. "rgba(255, 179, 71, 0.85)"
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

              // Draw elegant dots on joint points
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
        }
      });

      // 4. Draw Mystical Ocean Waves at the ocean floor (y = 1050px to 1250px)
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
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#F5EEDC]">
      {/* Hand-Drawn Astrology Tapestry Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-none" />

      {/* Nebula ambient dust clouds */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.25]">
        <div className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#e8d5b7]/20 to-transparent blur-[120px] animate-nebula-slow" />
        <div className="absolute top-[40%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-[#cdd5b5]/18 to-transparent blur-[130px] animate-nebula-slower" />
        <div className="absolute bottom-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-[#f2d7c1]/18 to-transparent blur-[110px] animate-nebula-slow" />
      </div>

      {/* Cosmic Vignette radial shade to create elegant paper texture vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(232,213,183,0.3) 100%)] pointer-events-none" />
    </div>
  );
}
