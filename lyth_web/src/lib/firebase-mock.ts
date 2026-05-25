import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";

export interface DailyMessage {
  id: string;
  date: string;
  sign: string;
  glyph: string;
  category: "TRANSIT" | "MOON PHASE" | "ALIGNMENT" | "STELLAR WISDOM" | "SOLSTICE";
  title: string;
  message: string;
  energyScore: number; // 0 to 100
  focus: string;
  celestialAspect: string;
  colorTheme: string; // Gradient class or custom HSL accent
  glowColor: string; // glow shadow color
}

export function getDynamicOffsetDate(offset: number): string {
  const target = new Date();
  target.setDate(target.getDate() + offset);
  const day = target.getDate();
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthStr = months[target.getMonth()];
  
  let label = "";
  if (offset === 0) label = "HÔM NAY";
  else if (offset === 1) label = "NGÀY MAI";
  else if (offset === 2) label = "2 NGÀY TỚI";
  
  return `${label} • ${monthStr} ${day}`;
}

export function getDynamicMockMessages(): DailyMessage[] {
  return [
    {
      id: "stellar-wisdom-1",
      date: getDynamicOffsetDate(0),
      sign: "SCORPIO",
      glyph: "♏",
      category: "TRANSIT",
      title: "Pluto Retrograde: The Deep Waters",
      message: "As Pluto turns its powerful gaze inward within your sector of transformation, the universe whispers a profound truth: what you let go of becomes the fertile soil for your rebirth. Do not fear the shadows; they contain the keys to your hidden light. Emerge with renewed clarity and claim your sovereign power.",
      energyScore: 92,
      focus: "Introspection & Rebirth",
      celestialAspect: "Pluto Retrograde in Scorpio",
      colorTheme: "from-[#d2b48c] via-[#b8996a] to-[#806640]",
      glowColor: "rgba(210, 180, 140, 0.45)"
    },
    {
      id: "alignment-3",
      date: getDynamicOffsetDate(1),
      sign: "LEO",
      glyph: "♌",
      category: "ALIGNMENT",
      title: "Sun Trine Mars: Radiance & Action",
      message: "A rush of cosmic fire fuels your ambition as the Sun matches Mars in a perfect aspect of pure vitality. It is time to step out of the shadows and let your unique light burn bright. Courage is not the absence of fear, but the absolute conviction that your path forward is worth the leap.",
      energyScore: 97,
      focus: "Courage & Creative Force",
      celestialAspect: "Sun Trine Mars in Fire Signs",
      colorTheme: "from-[#d97b6c] via-[#b8996a] to-[#d2b48c]",
      glowColor: "rgba(217, 123, 108, 0.4)"
    },
    {
      id: "solstice-4",
      date: getDynamicOffsetDate(2),
      sign: "GEMINI",
      glyph: "♊",
      category: "STELLAR WISDOM",
      title: "Mercury Direct: Mind Unbound",
      message: "Mercury's forward march in Gemini unleashes a cascade of communication. Misunderstandings melt away, replaced by sharp, lightning-fast clarity. Speak your truth, pitch your ideas, and let the winds of curiosity carry your voice to those waiting to receive your unique message.",
      energyScore: 78,
      focus: "Expression & Connection",
      celestialAspect: "Mercury stations Direct",
      colorTheme: "from-[#a9b388] via-[#9e9d89] to-[#b89f8a]",
      glowColor: "rgba(169, 179, 136, 0.35)"
    }
  ];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function formatDateKey(dateKey: string): string {
  const parts = dateKey.split("-");
  if (parts.length !== 3) return dateKey;
  
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthStr = months[monthIndex] || parts[1];
  
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  
  if (dateKey === todayStr) {
    return `TODAY • ${monthStr} ${day}`;
  } else if (dateKey === yesterdayStr) {
    return `YESTERDAY • ${monthStr} ${day}`;
  }
  return `${monthStr} ${day}`;
}

function mapCategory(cat: string): "TRANSIT" | "MOON PHASE" | "ALIGNMENT" | "STELLAR WISDOM" | "SOLSTICE" {
  const upper = (cat || "").toUpperCase();
  if (upper === "ENERGY") return "ALIGNMENT";
  if (upper === "LOVE") return "TRANSIT";
  if (upper === "IDENTITY") return "STELLAR WISDOM";
  if (upper === "MINDSET") return "MOON PHASE";
  
  if (["TRANSIT", "MOON PHASE", "ALIGNMENT", "STELLAR WISDOM", "SOLSTICE"].includes(upper)) {
    return upper as any;
  }
  return "STELLAR WISDOM";
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function mapColorTheme(cat: string, hex?: string): { theme: string; glow: string } {
  const upper = (cat || "").toUpperCase();
  
  if (hex && hex.startsWith('#')) {
    const rgb = hexToRgb(hex);
    const glow = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)` : "rgba(210, 180, 140, 0.45)";
    
    if (upper === "LOVE" || hex.toLowerCase().includes('red') || hex.toLowerCase().includes('pink')) {
      return {
        theme: "from-[#d97b6c] via-[#b8996a] to-[#d2b48c]",
        glow
      };
    }
    if (upper === "ENERGY" || hex.toLowerCase().includes('green')) {
      return {
        theme: "from-[#a9b388] via-[#cdd5b5] to-[#d2b48c]",
        glow
      };
    }
    if (upper === "MINDSET" || hex.toLowerCase().includes('blue')) {
      return {
        theme: "from-[#b89f8a] via-[#d2b48c] to-[#f5eedc]",
        glow
      };
    }
  }
  
  if (upper === "ENERGY" || upper === "ALIGNMENT") {
    return {
      theme: "from-[#a9b388] via-[#cdd5b5] to-[#d2b48c]",
      glow: "rgba(169, 179, 136, 0.4)"
    };
  }
  if (upper === "LOVE" || upper === "TRANSIT") {
    return {
      theme: "from-[#d97b6c] via-[#b8996a] to-[#d2b48c]",
      glow: "rgba(217, 123, 108, 0.4)"
    };
  }
  return {
    theme: "from-[#d2b48c] via-[#b8996a] to-[#806640]",
    glow: "rgba(210, 180, 140, 0.45)"
  };
}

export async function fetchDailyMessages(): Promise<DailyMessage[]> {
  try {
    const dailyMessagesRef = collection(db, "daily_messages");
    // Just fetch the latest documents (up to 20 to be safe and avoid long lists) without sorting.
    // This avoids requiring Firestore composite indexes!
    const q = query(dailyMessagesRef, limit(20));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn("⚠️ No daily messages found in Firestore. Falling back to mock data.");
      return getDynamicMockMessages();
    }
    
    // Sort documents by document ID (which is YYYY-MM-DD date key) descending in JavaScript memory
    const sortedDocs = [...querySnapshot.docs].sort((a, b) => b.id.localeCompare(a.id));
    
    // Take the 3 most recent documents from Firestore to represent the 3 days
    const recentDocs = sortedDocs.slice(0, 3);
    
    const messages: DailyMessage[] = [];
    
    const zodiacList = [
      { sign: "SCORPIO", glyph: "♏" },
      { sign: "PISCES", glyph: "♓" },
      { sign: "LEO", glyph: "♌" },
      { sign: "GEMINI", glyph: "♊" },
      { sign: "TAURUS", glyph: "♉" },
      { sign: "VIRGO", glyph: "♍" },
      { sign: "LIBRA", glyph: "♎" },
      { sign: "ARIES", glyph: "♈" }
    ];
    
    recentDocs.forEach((doc, idx) => {
      const data = doc.data();
      const dateKey = doc.id;
      
      const zodIndex = Math.abs(hashCode(dateKey)) % zodiacList.length;
      const zodiac = zodiacList[zodIndex];
      
      const { theme, glow } = mapColorTheme(data.category || "", data.luckyColorHex);
      
      messages.push({
        id: dateKey,
        date: getDynamicOffsetDate(idx),
        sign: zodiac.sign,
        glyph: zodiac.glyph,
        category: mapCategory(data.category || ""),
        title: data.header || "Stellar Alignment",
        message: data.body || "Vũ trụ đang gửi tín hiệu tốt lành tới bạn.",
        energyScore: 75 + (Math.abs(hashCode(dateKey)) % 25),
        focus: data.luckyColorName ? `Màu may mắn: ${data.luckyColorName}` : "Self-Wisdom",
        celestialAspect: data.luckyColorMeaning || "Cosmic Alignment",
        colorTheme: theme,
        glowColor: glow,
      });
    });
    
    return messages;
  } catch (error) {
    console.error("❌ Error fetching daily messages from Firestore:", error);
    console.warn("Falling back to mock data due to Firestore error.");
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getDynamicMockMessages();
  }
}
