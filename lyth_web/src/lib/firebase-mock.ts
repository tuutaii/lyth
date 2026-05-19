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

const mockDailyMessages: DailyMessage[] = [
  {
    id: "stellar-wisdom-1",
    date: "TODAY • MAY 19",
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
    id: "moon-phase-2",
    date: "YESTERDAY • MAY 18",
    sign: "PISCES",
    glyph: "♓",
    category: "MOON PHASE",
    title: "New Moon conjunct Neptune: Mystic Veil",
    message: "The veil between the visible world and the spiritual realm is exceptionally thin tonight. With the moon resting beside Neptune, trust your intuition over logic. Your dreams are speaking a language of symbols; keep a journal close and record the whisperings of your subconscious before dawn.",
    energyScore: 85,
    focus: "Intuition & Dreamweaving",
    celestialAspect: "New Moon conjunct Neptune",
    colorTheme: "from-[#a9b388] via-[#cdd5b5] to-[#d2b48c]",
    glowColor: "rgba(169, 179, 136, 0.4)"
  },
  {
    id: "alignment-3",
    date: "TOMORROW • MAY 20",
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
    date: "UPCOMING • MAY 21",
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
  },
  {
    id: "stellar-wisdom-5",
    date: "PREVIOUS • MAY 17",
    sign: "TAURUS",
    glyph: "♉",
    category: "ALIGNMENT",
    title: "Venus Sextile Saturn: Sacred Grounding",
    message: "A beautiful alignment between Venus and Saturn brings stable, beautiful energy to your foundations. Love, relationships, and creative pursuits find solid ground. Take a moment to nurture what is real, establish firm boundaries, and honor the slow-growing roots of your long-term dreams.",
    energyScore: 81,
    focus: "Commitment & Stability",
    celestialAspect: "Venus in Taurus Sextile Saturn",
    colorTheme: "from-[#b89f8a] via-[#d2b48c] to-[#f5eedc]",
    glowColor: "rgba(184, 159, 138, 0.4)"
  }
];

export async function fetchDailyMessages(): Promise<DailyMessage[]> {
  // Simulate network latency like fetching from Firebase
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockDailyMessages;
}
