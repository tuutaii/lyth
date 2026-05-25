/**
 * Astrology Helpers & Web Audio API Ambient Synthesizer
 * Dành riêng cho ứng dụng Lyth Astrologer
 */

// ============================================================================
// 1. WEB AUDIO AMBIENT SYNTHESIZER (TẦN SỐ VŨ TRỤ)
// ============================================================================

class CosmicSynth {
  private audioCtx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private bellInterval: any = null;
  private isPlaying: boolean = false;

  public start() {
    if (this.isPlaying) return;
    
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.isPlaying = true;

      // 1. Tạo Drone nền trầm lắng (Tần số Trái đất OM - 136.1Hz)
      this.droneOsc = this.audioCtx.createOscillator();
      this.droneOsc.type = "sine";
      this.droneOsc.frequency.setValueAtTime(136.1, this.audioCtx.currentTime); // OM Frequency

      // Thêm chút rung động (modulator) tạo cảm giác bồng bềnh
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.audioCtx.currentTime); // LFO cực chậm
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(1.5, this.audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.droneOsc.frequency);
      lfo.start();

      // Bộ lọc thông thấp tạo âm thanh ấm áp, huyền bí như gió đêm
      this.filter = this.audioCtx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(280, this.audioCtx.currentTime);
      this.filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

      this.droneGain = this.audioCtx.createGain();
      this.droneGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);
      // Fade in dịu nhẹ tránh giật mình
      this.droneGain.gain.linearRampToValueAtTime(0.16, this.audioCtx.currentTime + 3);

      this.droneOsc.connect(this.filter);
      this.filter.connect(this.droneGain);
      this.droneGain.connect(this.audioCtx.destination);
      this.droneOsc.start();

      // 2. Tiếng Chuông Ngân Vang (Tibetan Bowl / Wind Chime) thỉnh thoảng vang lên
      this.scheduleBells();
    } catch (e) {
      console.error("Không khởi tạo được Web Audio API:", e);
    }
  }

  private scheduleBells() {
    if (!this.audioCtx) return;

    const playBell = () => {
      if (!this.audioCtx || this.audioCtx.state === "suspended") return;
      
      const bellOsc = this.audioCtx.createOscillator();
      const bellGain = this.audioCtx.createGain();
      
      // Chọn ngẫu nhiên tần số cao lấp lánh (Hợp âm Pentatonic)
      const frequencies = [528, 639, 741, 852, 963]; // Solfeggio frequencies
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      
      bellOsc.type = "sine";
      bellOsc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      bellGain.gain.setValueAtTime(0.0, this.audioCtx.currentTime);
      bellGain.gain.linearRampToValueAtTime(0.045, this.audioCtx.currentTime + 0.1);
      // Ngân dài từ từ giảm dần âm
      bellGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 6.0);
      
      // Thêm chút delay vang vọng
      const delay = this.audioCtx.createDelay();
      delay.delayTime.setValueAtTime(0.38, this.audioCtx.currentTime);
      const delayFeedback = this.audioCtx.createGain();
      delayFeedback.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      
      bellOsc.connect(bellGain);
      bellGain.connect(this.audioCtx.destination);
      
      // Kết nối delay tạo tiếng vang vọng xa xăm
      bellGain.connect(delay);
      delay.connect(delayFeedback);
      delayFeedback.connect(delay);
      delay.connect(this.audioCtx.destination);

      bellOsc.start();
      bellOsc.stop(this.audioCtx.currentTime + 6.5);
    };

    // Chuông đầu tiên ngân ngay
    playBell();

    // Mỗi 7-12 giây sẽ ngân một tiếng chuông ngẫu nhiên
    this.bellInterval = setInterval(() => {
      playBell();
    }, 7000 + Math.random() * 5000);
  }

  public stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    
    if (this.bellInterval) {
      clearInterval(this.bellInterval);
      this.bellInterval = null;
    }

    if (this.droneGain && this.audioCtx) {
      // Fade out nhẹ nhàng trong 1.5 giây
      this.droneGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, this.audioCtx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(0.0, this.audioCtx.currentTime + 1.5);
      
      setTimeout(() => {
        if (this.droneOsc) {
          try {
            this.droneOsc.stop();
          } catch(e) {}
          this.droneOsc.disconnect();
          this.droneOsc = null;
        }
        if (this.audioCtx) {
          this.audioCtx.close();
          this.audioCtx = null;
        }
      }, 1600);
    }
  }
}

export const cosmicAudio = new CosmicSynth();


// ============================================================================
// 2. TRẢI BÀI TAROT CỔ HỌC (DAILY TAROT DATA)
// ============================================================================

export interface TarotCard {
  id: string;
  name: string;
  englishName: string;
  image: string;
  glowColor: string;
  meaning: {
    love: string;
    career: string;
    spirit: string;
  };
  advice: string;
}

export const tarotDeck: TarotCard[] = [
  {
    id: "the_sun",
    name: "Lá Bài Mặt Trời (The Sun)",
    englishName: "THE SUN",
    image: "🌞",
    glowColor: "rgba(255, 179, 0, 0.4)",
    meaning: {
      love: "Đầy ắp sự ấm áp, chân thành và vui vẻ. Nếu đang độc thân, bạn tỏa năng lượng thu hút cực kỳ mạnh mẽ. Nếu đã có đôi, mối quan hệ ngập tràn hạnh phúc và sự thấu hiểu sâu sắc.",
      career: "Thành công vang dội, sự nỗ lực bấy lâu nay của bạn đã bước ra ánh sáng và được công nhận xứng đáng. Mọi dự án mới đều có điềm cát tường chiếu rọi.",
      spirit: "Tâm hồn tràn ngập năng lượng tích cực, sự tự tin và sự sáng tỏ. Bạn tìm thấy niềm vui đích thực trong từng khoảnh khắc giản dị của cuộc sống."
    },
    advice: "Hãy tiếp tục lan tỏa sự ấm áp và năng lượng tích cực của mình. Đừng e ngại việc tỏa sáng và thể hiện bản thân!"
  },
  {
    id: "the_moon",
    name: "Lá Bài Mặt Trăng (The Moon)",
    englishName: "THE MOON",
    image: "🌙",
    glowColor: "rgba(106, 90, 205, 0.4)",
    meaning: {
      love: "Cảm xúc có phần nhạy cảm và mơ hồ. Có những bí mật hoặc suy tư thầm kín chưa được giãi bày. Hãy lắng nghe tiếng nói trực giác thay vì nghi ngờ vô cớ.",
      career: "Công việc có một số điểm chưa rõ ràng, hãy cẩn thận với những cam kết mập mờ. Đây không phải lúc để vội vã quyết định lớn, hãy quan sát kỹ lưỡng.",
      spirit: "Trực giác nhạy bén tuyệt vời. Khả năng kết nối tâm linh và chiêm bao vô cùng sống động. Hãy dành thời gian để thiền định hoặc viết nhật ký."
    },
    advice: "Đi qua màn đêm mù sương cần sự kiên nhẫn. Đừng hoảng sợ trước nỗi sợ vô hình, trực giác của bạn chính là ngọn hải đăng chỉ đường."
  },
  {
    id: "the_star",
    name: "Lá Bài Ngôi Sao (The Star)",
    englishName: "THE STAR",
    image: "⭐",
    glowColor: "rgba(0, 229, 255, 0.4)",
    meaning: {
      love: "Một điềm báo ngọt ngào về sự chữa lành và niềm hy vọng mới. Mối quan hệ được vun đắp bởi sự tin tưởng tuyệt đối và viễn cảnh tương lai tươi sáng.",
      career: "Cơ hội phục hồi, tái tạo nguồn cảm hứng sáng tạo dồi dào. Bạn có định hướng rõ ràng và được nâng đỡ vượt qua những thử thách khó khăn trước mắt.",
      spirit: "Sự bình yên sâu thẳm tràn về sau giông bão. Bạn cảm thấy có sự kết nối thần kỳ với thiên nhiên và dòng chảy chở che của số mệnh."
    },
    advice: "Hãy giữ vững niềm tin và hy vọng. Vũ trụ đang chữa lành tâm hồn bạn và dọn lối cho những điều tốt đẹp nhất sắp tới."
  },
  {
    id: "wheel_of_fortune",
    name: "Vòng Quay Số Phận (Wheel of Fortune)",
    englishName: "WHEEL OF FORTUNE",
    image: "☸️",
    glowColor: "rgba(184, 153, 106, 0.4)",
    meaning: {
      love: "Sự xoay vần của nhân duyên đưa tới những cuộc gặp gỡ định mệnh hoặc một bước ngoặt lớn trong tình cảm. Mọi thứ đang diễn ra đúng kế hoạch của vũ trụ.",
      career: "May mắn bất ngờ ập đến, sự thay đổi mang tính đột phá đang mở ra trước mắt. Hãy nhanh tay nắm bắt những lời mời gọi hay ý tưởng chợt lóe lên.",
      spirit: "Nhận thức sâu sắc về nghiệp quả và tính chu kỳ của cuộc sống. Sự buông bỏ những điều cũ kỹ giúp bạn đồng điệu với dòng quay tự nhiên."
    },
    advice: "Mọi thứ trên đời đều xoay vần, lúc thịnh lúc suy. Hãy hoan hỷ đón nhận sự thay đổi và kiên định với chiếc la bàn nội tâm của bạn."
  },
  {
    id: "the_lovers",
    name: "Lá Bài Tình Nhân (The Lovers)",
    englishName: "THE LOVERS",
    image: "💞",
    glowColor: "rgba(247, 140, 163, 0.4)",
    meaning: {
      love: "Kết nối tâm giao mãnh liệt, sự hòa hợp tuyệt đối từ thể xác lẫn linh hồn. Hai bạn nâng đỡ nhau và cảm nhận rõ nét vị ngọt ngào của tình yêu đích thực.",
      career: "Thời gian lý tưởng để hợp tác làm ăn, ký kết các dự án chung. Có những sự lựa chọn quan trọng đòi hỏi bạn phải cân nhắc bằng sự tử tế và đạo đức.",
      spirit: "Sự tích hợp tuyệt đẹp giữa các mặt đối lập bên trong bản ngã. Bạn học cách yêu thương bản thân trọn vẹn cả ưu lẫn khuyết điểm."
    },
    advice: "Hãy đưa ra quyết định dựa trên tiếng gọi đích thực của trái tim và sự chân thành. Kết nối sâu sắc luôn bắt đầu từ sự cởi mở."
  }
];


// ============================================================================
// 3. THUẬT TOÁN SO HỢP CUNG HOÀNG ĐẠO (COMPATIBILITY LOGIC)
// ============================================================================

export interface ZodiacSign {
  name: string;
  vietnameseName: string;
  glyph: string;
  element: "Lửa" | "Đất" | "Khí" | "Nước";
}

export const zodiacList: ZodiacSign[] = [
  { name: "Aries", vietnameseName: "Bạch Dương", glyph: "♈", element: "Lửa" },
  { name: "Taurus", vietnameseName: "Kim Ngưu", glyph: "♉", element: "Đất" },
  { name: "Gemini", vietnameseName: "Song Tử", glyph: "♊", element: "Khí" },
  { name: "Cancer", vietnameseName: "Cự Giải", glyph: "♋", element: "Nước" },
  { name: "Leo", vietnameseName: "Sư Tử", glyph: "♌", element: "Lửa" },
  { name: "Virgo", vietnameseName: "Xử Nữ", glyph: "♍", element: "Đất" },
  { name: "Libra", vietnameseName: "Thiên Bình", glyph: "♎", element: "Khí" },
  { name: "Scorpio", vietnameseName: "Bọ Cạp", glyph: "♏", element: "Nước" },
  { name: "Sagittarius", vietnameseName: "Nhân Mã", glyph: "♐", element: "Lửa" },
  { name: "Capricorn", vietnameseName: "Ma Kết", glyph: "♑", element: "Đất" },
  { name: "Aquarius", vietnameseName: "Bảo Bình", glyph: "♒", element: "Khí" },
  { name: "Pisces", vietnameseName: "Song Ngư", glyph: "♓", element: "Nước" }
];

export function getCompatibility(sign1: string, sign2: string) {
  const z1 = zodiacList.find(z => z.name === sign1) || zodiacList[0];
  const z2 = zodiacList.find(z => z.name === sign2) || zodiacList[1];

  let score = 50;
  let analysis = "";
  let stars = 3;

  // Thuật toán dựa trên nguyên tố hoàng đạo
  if (z1.element === z2.element) {
    score = 85 + Math.floor(Math.random() * 11); // 85% - 95%
    stars = 5;
    analysis = `Hai tâm hồn đồng điệu thuộc nguyên tố ${z1.element}. Mối liên kết giữa ${z1.vietnameseName} và ${z2.vietnameseName} cực kỳ tự nhiên, bền vững. Các bạn dễ dàng thấu hiểu đối phương mà không cần nhiều lời giải thích, tạo nên một bến đỗ bình yên đích thực.`;
  } else if (
    (z1.element === "Lửa" && z2.element === "Khí") ||
    (z1.element === "Khí" && z2.element === "Lửa")
  ) {
    score = 78 + Math.floor(Math.random() * 11); // 78% - 88%
    stars = 4.5;
    analysis = `Lửa cần Gió (Khí) để bùng cháy mãnh liệt. Sự tương tác giữa ${z1.vietnameseName} và ${z2.vietnameseName} luôn tràn ngập năng lượng, sự sáng tạo và nguồn cảm hứng bất tận. Các bạn cổ vũ ước mơ của nhau và không bao giờ cảm thấy nhàm chán.`;
  } else if (
    (z1.element === "Đất" && z2.element === "Nước") ||
    (z1.element === "Nước" && z2.element === "Đất")
  ) {
    score = 80 + Math.floor(Math.random() * 11); // 80% - 90%
    stars = 4.5;
    analysis = `Nước làm mềm Đất, Đất định hình và chở che Nước. Mối quan hệ giữa ${z1.vietnameseName} và ${z2.vietnameseName} là sự kết hợp tuyệt mỹ giữa sự lãng mạn sâu sắc và tính thực tế vững vàng. Các bạn bổ khuyết cho nhau, dệt nên sợi dây tình cảm cực kỳ gắn kết.`;
  } else if (
    (z1.element === "Lửa" && z2.element === "Nước") ||
    (z1.element === "Nước" && z2.element === "Lửa")
  ) {
    score = 35 + Math.floor(Math.random() * 16); // 35% - 50%
    stars = 2;
    analysis = `Sự kết hợp đầy thử thách giữa Lửa và Nước. Sự nồng nhiệt của Bạch Dương/Sư Tử dễ bị dập tắt bởi sự trầm mặc của Cự Giải/Song Ngư, hoặc ngược lại, Nước dễ bị bốc hơi vì nhiệt lượng quá lớn. Tuy nhiên, nếu biết lắng nghe và kiềm chế bản ngã, các bạn sẽ tạo nên một sự cân bằng tuyệt vời.`;
  } else if (
    (z1.element === "Đất" && z2.element === "Khí") ||
    (z1.element === "Khí" && z2.element === "Đất")
  ) {
    score = 42 + Math.floor(Math.random() * 16); // 42% - 58%
    stars = 2.5;
    analysis = `Đất thực tế, Khí (Gió) tự do bay bổng. Cặp đôi này có thể gặp khó khăn trong việc tìm tiếng nói chung: một người muốn vững vàng xây đắp, người kia muốn phiêu lưu tự tại. Cần học cách tôn trọng lối sống khác biệt để gìn giữ hạnh phúc lâu bền.`;
  } else {
    // Đất + Lửa hoặc Nước + Khí
    score = 55 + Math.floor(Math.random() * 16); // 55% - 70%
    stars = 3;
    analysis = `Mối quan hệ ở mức khá hòa hợp. Mặc dù có những điểm khác biệt lớn trong cách biểu đạt cảm xúc, ${z1.vietnameseName} và ${z2.vietnameseName} vẫn tìm thấy lực hút mạnh mẽ nhờ vào tính tò mò và khao khát bổ sung những mảnh ghép còn thiếu của bản thân.`;
  }

  return { score, stars, analysis };
}


// ============================================================================
// 4. LOGIC TÍNH BẢN ĐỒ SAO BẢN MỆNH CÁ NHÂN (BIRTH CHART LOGIC)
// ============================================================================

export interface PlanetPosition {
  name: string;
  icon: string;
  sign: string;
  angle: number; // Góc trên vòng tròn chiêm tinh (0-360)
  house: number;
}

export function calculateBirthChart(name: string, date: string, time: string, location: string) {
  // Hàm băm đơn giản từ chuỗi thông tin để tạo tọa độ giả lập nhưng đồng nhất
  const hashString = `${name}-${date}-${time}-${location}`;
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    hash = hashString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const getHashVal = (seed: number, min: number, max: number) => {
    const val = Math.abs(Math.sin(hash + seed));
    return Math.floor(val * (max - min + 1)) + min;
  };

  // Tính Cung Mặt Trời dựa vào ngày tháng sinh
  const birthDate = new Date(date);
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  let sunSign = "Scorpio";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sunSign = "Aries";
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sunSign = "Taurus";
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sunSign = "Gemini";
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sunSign = "Cancer";
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunSign = "Leo";
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunSign = "Virgo";
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunSign = "Libra";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunSign = "Scorpio";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunSign = "Sagittarius";
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sunSign = "Capricorn";
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sunSign = "Aquarius";
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sunSign = "Pisces";

  const sunZodiac = zodiacList.find(z => z.name === sunSign) || zodiacList[0];

  // Tính Cung Mọc giả lập dựa theo giờ sinh (giờ sinh ảnh hưởng cực lớn đến Cung Mọc)
  const hour = parseInt(time.split(":")[0]) || 8;
  // Mỗi 2 tiếng sẽ dịch chuyển 1 cung hoàng đạo, bắt đầu từ Cung Mặt Trời lúc bình minh (6 AM)
  const indexShift = Math.floor((hour - 6 + 24) % 24 / 2);
  const sunSignIdx = zodiacList.findIndex(z => z.name === sunSign);
  const ascSignIdx = (sunSignIdx + indexShift + 12) % 12;
  const ascSign = zodiacList[ascSignIdx];

  // Tính Cung Mặt Trăng giả lập ổn định
  const moonSignIdx = (sunSignIdx + getHashVal(7, 2, 9)) % 12;
  const moonSign = zodiacList[moonSignIdx];

  // Khởi tạo các tọa độ hành tinh trên vòng tròn hoàng đạo
  const planets: PlanetPosition[] = [
    { name: "Mặt Trời", icon: "☉", sign: sunZodiac.vietnameseName, angle: getHashVal(1, 0, 360), house: getHashVal(11, 1, 12) },
    { name: "Mặt Trăng", icon: "☽", sign: moonSign.vietnameseName, angle: getHashVal(2, 0, 360), house: getHashVal(12, 1, 12) },
    { name: "Sao Thủy", icon: "☿", sign: zodiacList[(sunSignIdx + getHashVal(3, -1, 1) + 12) % 12].vietnameseName, angle: getHashVal(3, 0, 360), house: getHashVal(13, 1, 12) },
    { name: "Sao Kim", icon: "♀", sign: zodiacList[(sunSignIdx + getHashVal(4, -2, 2) + 12) % 12].vietnameseName, angle: getHashVal(4, 0, 360), house: getHashVal(14, 1, 12) },
    { name: "Sao Hỏa", icon: "♂", sign: zodiacList[getHashVal(5, 0, 11)].vietnameseName, angle: getHashVal(5, 0, 360), house: getHashVal(15, 1, 12) },
    { name: "Sao Mộc", icon: "♃", sign: zodiacList[getHashVal(6, 0, 11)].vietnameseName, angle: getHashVal(6, 0, 360), house: getHashVal(16, 1, 12) },
    { name: "Sao Thổ", icon: "♄", sign: zodiacList[getHashVal(7, 0, 11)].vietnameseName, angle: getHashVal(7, 0, 360), house: getHashVal(17, 1, 12) }
  ];

  // Tạo lời luận giải tiếng Việt chi tiết cho Tam Trụ Bản Mệnh (Big Three)
  const interpretations = {
    sun: {
      sign: sunZodiac.vietnameseName,
      glyph: sunZodiac.glyph,
      title: `Cung Mặt Trời trong ${sunZodiac.vietnameseName}`,
      desc: `Mặt Trời tượng trưng cho cái tôi cốt lõi, ý chí sống và bản sắc thực sự của bạn. Với Mặt Trời nằm tại cung ${sunZodiac.vietnameseName}, bạn mang trong mình năng lượng đặc trưng của nhóm nguyên tố ${sunZodiac.element}. Bạn thể hiện bản thân một cách đầy kiêu hãnh và có xu hướng hành động để khẳng định giá trị riêng của mình trong cuộc đời.`
    },
    moon: {
      sign: moonSign.vietnameseName,
      glyph: moonSign.glyph,
      title: `Cung Mặt Trăng trong ${moonSign.vietnameseName}`,
      desc: `Mặt Trăng phản ánh thế giới cảm xúc nội tâm, những phản ứng vô thức và cách bạn tìm kiếm sự an toàn tinh thần. Khi Mặt Trăng ngụ tại ${moonSign.vietnameseName}, thế giới tình cảm của bạn cực kỳ phong phú và nhạy cảm. Bạn nuôi dưỡng tâm hồn bằng những kết nối chân thành và sâu sắc, luôn trân quý sự ấm áp và bình yên trong không gian riêng tư.`
    },
    asc: {
      sign: ascSign.vietnameseName,
      glyph: ascSign.glyph,
      title: `Cung Mọc tại ${ascSign.vietnameseName} (Ascendant)`,
      desc: `Cung Mọc (bình minh lúc bạn chào đời) đại diện cho lăng kính bạn nhìn ra thế giới và chiếc mặt nạ xã hội bạn khoác lên khi giao tiếp với mọi người xung quanh. Với Cung Mọc ${ascSign.vietnameseName}, ấn tượng đầu tiên bạn tạo nên cho người khác là sự vững chãi, cuốn hút và vô cùng tinh tế. Bạn đối diện với thử thách cuộc sống bằng phong thái tự tin và bản lĩnh riêng biệt.`
    }
  };

  return {
    sunSign: sunZodiac.vietnameseName,
    moonSign: moonSign.vietnameseName,
    ascSign: ascSign.vietnameseName,
    planets,
    interpretations
  };
}

// ============================================================================
// 5. CELESTIAL CURRENT STATE HELPERS (MÙA HOÀNG ĐẠO & PHA TRĂNG HIỆN TẠI)
// ============================================================================

export interface MoonPhaseInfo {
  name: string;
  glyph: string;
  age: number;
  desc: string;
  advice: string;
}

export function getCurrentZodiacSeason(date: Date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let signName = "Gemini"; // Default to current season if anything
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) signName = "Aries";
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) signName = "Taurus";
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) signName = "Gemini";
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) signName = "Cancer";
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) signName = "Leo";
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) signName = "Virgo";
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) signName = "Libra";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) signName = "Scorpio";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) signName = "Sagittarius";
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) signName = "Capricorn";
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) signName = "Aquarius";
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) signName = "Pisces";

  const zod = zodiacList.find(z => z.name === signName) || zodiacList[2];
  
  // Custom season advice based on zodiac season
  let seasonVibe = "";
  if (zod.name === "Aries") seasonVibe = "Mùa của sự khởi đầu mãnh liệt, năng lượng tiên phong và lòng can đảm chinh phục.";
  else if (zod.name === "Taurus") seasonVibe = "Mùa của sự vững chãi, nuôi dưỡng sự kiên nhẫn, tận hưởng giác quan và kết nối thiên nhiên.";
  else if (zod.name === "Gemini") seasonVibe = "Mùa của sự tò mò tri thức, kết nối giao tiếp linh hoạt và những luồng ý tưởng sáng tạo mới mẻ.";
  else if (zod.name === "Cancer") seasonVibe = "Mùa của tổ ấm cảm xúc, sự nhạy cảm trực giác và những cái ôm vỗ về linh hồn.";
  else if (zod.name === "Leo") seasonVibe = "Mùa của sự rực rỡ, tự tin thể hiện cái tôi sáng tạo và lan tỏa sự ấm áp của trái tim.";
  else if (zod.name === "Virgo") seasonVibe = "Mùa của sự tỉ mỉ, chăm sóc sức khỏe, thanh lọc cuộc sống và sắp xếp kế hoạch chu toàn.";
  else if (zod.name === "Libra") seasonVibe = "Mùa của sự hài hòa, tìm kiếm sự cân bằng trong các mối quan hệ và tôn vinh cái đẹp nghệ thuật.";
  else if (zod.name === "Scorpio") seasonVibe = "Mùa của sự chuyển hóa sâu sắc, trực giác tâm linh nhạy bén và đam mê mãnh liệt.";
  else if (zod.name === "Sagittarius") seasonVibe = "Mùa của những hành trình phiêu lưu, mở rộng thế giới quan và niềm tin lạc quan cát tường.";
  else if (zod.name === "Capricorn") seasonVibe = "Mùa của sự kỷ luật, kiến tạo nền tảng vững chắc và kiên trì chinh phục đỉnh cao sự nghiệp.";
  else if (zod.name === "Aquarius") seasonVibe = "Mùa của những lý tưởng đột phá, kết nối cộng đồng nhân đạo và tư duy độc lập.";
  else if (zod.name === "Pisces") seasonVibe = "Mùa của sự buông bỏ ngọt ngào, thấu cảm vô điều kiện, nghệ thuật và những giấc mơ nhiệm màu.";

  return {
    ...zod,
    vibe: seasonVibe
  };
}

export function getCurrentMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  // Reference New Moon: Jan 6, 2000 18:14 UTC (947182440000 ms)
  const refNewMoon = 947182440000;
  const synodicMonth = 29.530588853;
  const oneDayMs = 1000 * 60 * 60 * 24;

  const diffMs = date.getTime() - refNewMoon;
  const diffDays = diffMs / oneDayMs;
  const age = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

  if (age < 1.0 || age >= 28.53) {
    return {
      name: "Trăng Non (New Moon)",
      glyph: "🌑",
      age,
      desc: "Thời điểm hoàn hảo để thiết lập ý nguyện mới, gieo mầm các kế hoạch và khởi đầu với một tâm thế trong trẻo nhất.",
      advice: "Hãy viết ra những mong ước của em cho chu kỳ mới này và tin tưởng gieo hạt."
    };
  } else if (age >= 1.0 && age < 6.38) {
    return {
      name: "Trăng Lưỡi Liềm Đầu Tháng (Waxing Crescent)",
      glyph: "🌒",
      age,
      desc: "Trăng Lưỡi Liềm thôi thúc ý chí hành động bước đầu. Đây là lúc năng lượng tích cực đang dần tích tụ để hiện thực hóa ước mơ.",
      advice: "Hãy tự tin tiến lên phía trước và thực hiện những bước đi nhỏ đầu tiên đầy dũng cảm."
    };
  } else if (age >= 6.38 && age < 8.38) {
    return {
      name: "Trăng Bán Nguyệt Đầu Tháng (First Quarter)",
      glyph: "🌓",
      age,
      desc: "Thời điểm của sự quyết đoán và vượt qua các trở ngại đầu tiên. Bản lĩnh của em đang được tôi luyện để vững vàng hơn.",
      advice: "Hãy giữ vững cam kết và kiên trì hành động bất chấp những thách thức tạm thời."
    };
  } else if (age >= 8.38 && age < 13.76) {
    return {
      name: "Trăng Khuyết Đầu Tháng (Waxing Gibbous)",
      glyph: "🌔",
      age,
      desc: "Trăng Khuyết Đầu Tháng mang năng lượng tích lũy mạnh mẽ bậc nhất. Mọi sự chuẩn bị của em đang dần hoàn thiện để chuẩn bị chín muồi.",
      advice: "Đây là lúc em cần chú ý vào các chi tiết nhỏ và chuẩn bị tinh thần gặt hái thành quả."
    };
  } else if (age >= 13.76 && age < 15.76) {
    return {
      name: "Trăng Tròn (Full Moon)",
      glyph: "🌕",
      age,
      desc: "Trăng Tròn rực rỡ là lúc năng lượng cảm xúc đạt đỉnh cao nhất. Thời điểm tuyệt vời để ăn mừng thành tựu, thắp sáng lòng biết ơn và buông bỏ những năng lượng cũ kỹ.",
      advice: "Hãy dành thời gian để biết ơn những gì đang có và thanh lọc những cảm xúc tiêu cực còn vương vấn."
    };
  } else if (age >= 15.76 && age < 21.14) {
    return {
      name: "Trăng Khuyết Cuối Tháng (Waning Gibbous)",
      glyph: "🌖",
      age,
      desc: "Thời gian thích hợp để chia sẻ thành quả, tri thức và suy ngẫm sâu sắc về những bài học kinh nghiệm trong chu kỳ vừa qua.",
      advice: "Hãy học cách sẻ chia giá trị với mọi người xung quanh và chiêm nghiệm lại chặng đường cũ."
    };
  } else if (age >= 21.14 && age < 23.14) {
    return {
      name: "Trăng Bán Nguyệt Cuối Tháng (Last Quarter)",
      glyph: "🌗",
      age,
      desc: "Thời điểm để thanh lọc, đánh giá lại các mối quan hệ hoặc công việc và dọn dẹp các chướng ngại vật trong tâm trí.",
      advice: "Hãy dũng cảm buông bỏ những thứ không còn phục vụ cho sự phát triển của linh hồn em."
    };
  } else {
    return {
      name: "Trăng Lưỡi Liềm Cuối Tháng (Waning Crescent)",
      glyph: "🌘",
      age,
      desc: "Trăng Lưỡi Liềm Cuối Tháng mời gọi sự tĩnh lặng sâu sắc, nghỉ ngơi và dưỡng sức để chuẩn bị bước vào một chu kỳ trăng mới.",
      advice: "Hãy ngủ ngon giấc, thiền định nhẹ nhàng và cho phép cơ thể được thư giãn tối đa."
    };
  }
}
