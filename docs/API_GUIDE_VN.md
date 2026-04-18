# 🌙 Lyth — Hướng dẫn sử dụng API Chiêm tinh (Tiếng Việt)

> **Nguồn:** [freeastrologyapi.com](https://freeastrologyapi.com)  
> **Base URL:** `https://json.freeastrologyapi.com`  
> **Phương thức:** Tất cả đều là `POST`  
> **Xác thực:** Header `x-api-key: YOUR_API_KEY`

---

## 📌 Mục lục

1. [Western Planets — Vị trí hành tinh](#1-western-planets)
2. [Vedic Planets — Hành tinh theo Vệ Đà](#2-vedic-planets)
3. [Western Aspects — Góc hành tinh](#3-western-aspects)
4. [Western Houses — Các cung nhà](#4-western-houses)
5. [Sun Rise & Sun Set — Giờ mọc/lặn](#5-sun-rise--sun-set)
6. [Nakshatra Durations — Sao Nakshatra](#6-nakshatra-durations)
7. [Natal Wheel Chart — Biểu đồ tròn (Western)](#7-natal-wheel-chart)
8. [Horoscope Chart SVG — Biểu đồ Vệ Đà](#8-horoscope-chart-svg)
9. [Ashtakoot Score — Điểm tương hợp](#9-ashtakoot-score)
10. [Geo Location — Tọa độ thành phố](#10-geo-location)
11. [Tithi Durations — Lịch Âm (Tithi)](#11-tithi-durations)
12. [Good & Bad Times — Giờ tốt/xấu](#12-good--bad-times)
13. [Vimsottari Dasa — Chu kỳ hành tinh](#13-vimsottari-dasa)

---

## 1. Western Planets

**Endpoint:** `POST /western/planets`  
**Method trong Flutter:** `getWesternPlanets(BirthData birth)`

### ✨ Chức năng
Trả về vị trí chính xác của tất cả hành tinh trong hệ Mặt Trời tại thời điểm sinh ra, theo hệ thống **Chiêm tinh Phương Tây**. Đây là API quan trọng nhất và nên được gọi đầu tiên.

### 📦 Dữ liệu trả về
| Hành tinh | Tiếng Việt | Ý nghĩa |
|---|---|---|
| `Sun` | Mặt Trời | Cung hoàng đạo chính — bản sắc, bản ngã |
| `Moon` | Mặt Trăng | Cảm xúc nội tâm, cảm giác an toàn |
| `Ascendant` | Cung Mọc | Cách người khác nhìn nhận bạn |
| `Mars` | Hoả Tinh | Hành động, ý chí, năng lượng |
| `Mercury` | Thuỷ Tinh | Tư duy, giao tiếp, trí tuệ |
| `Jupiter` | Mộc Tinh | May mắn, mở rộng, triết lý |
| `Venus` | Kim Tinh | Tình yêu, cái đẹp, giá trị |
| `Saturn` | Thổ Tinh | Kỷ luật, bài học, trách nhiệm |
| `Uranus` | Thiên Vương Tinh | Đột phá, tự do, sáng tạo |
| `Neptune` | Hải Vương Tinh | Trực giác, mộng mơ, tâm linh |
| `Pluto` | Diêm Vương Tinh | Sự chuyển hoá, quyền lực ngầm |

### 📝 Ví dụ Response
```json
{
  "Sun": { "current_sign": 7, "normDegree": 15.3, "isRetro": "false" },
  "Moon": { "current_sign": 12, "normDegree": 22.1, "isRetro": "false" }
}
```
> `current_sign`: 1=Bạch Dương ... 12=Song Ngư  
> `isRetro`: Hành tinh có bị nghịch hành không

### 🖥️ Dùng ở đâu trong Lyth
- Hero Card → Hiển thị "Cung Mặt Trời", "Cung Mặt Trăng", "Cung Mọc"
- Planet Positions Section → Danh sách tất cả hành tinh

---

## 2. Vedic Planets

**Endpoint:** `POST /planets`  
**Method trong Flutter:** `getVedicPlanets(BirthData birth)`

### ✨ Chức năng
Giống API trên nhưng tính theo hệ thống **Chiêm tinh Vệ Đà (Ấn Độ)**. Dùng **Ayanamsha Lahiri** — bù trừ sai lệch ~24° giữa hệ nhiệt đới và hằng tinh. Kết quả thường khác ~1 cung so với Western.

> Ví dụ: Nếu Western cho bạn là Thiên Bình ♎, Vedic có thể cho là Xử Nữ ♍.

### 🖥️ Dùng ở đâu trong Lyth
- Tab "Vedic" (tính năng tương lai)
- Daily Reading Card dựa trên Nakshatra

---

## 3. Western Aspects

**Endpoint:** `POST /western/aspects`  
**Method trong Flutter:** `getWesternAspects(BirthData data)`

### ✨ Chức năng
Trả về danh sách các **góc hình thành giữa các hành tinh** vào ngày/giờ cụ thể. Aspect là "góc nhìn" giữa các hành tinh, quyết định chúng tương tác với nhau như thế nào (hài hoà hay căng thẳng).

### 📦 Các loại Aspect phổ biến
| Tên | Góc | Tính chất |
|---|---|---|
| **Conjunction** | 0° | Hợp nhất, khuếch đại mạnh |
| **Sextile** | 60° | Cơ hội, thuận lợi nhẹ |
| **Square** | 90° | Căng thẳng, thách thức |
| **Trine** | 120° | Hài hòa, thuận lợi mạnh |
| **Opposition** | 180° | Đối lập, cân bằng |

### 💡 Cách dùng
Gọi API này với **ngày hôm nay** (không phải ngày sinh) để biết các góc hành tinh đang diễn ra hiện tại.

### 🖥️ Dùng ở đâu trong Lyth
- Daily Transits Section → "Hôm nay Sao Hoả vuông Mặt Trăng..."

---

## 4. Western Houses

**Endpoint:** `POST /western/houses`  
**Method trong Flutter:** `getWesternHouses(BirthData birth)`

### ✨ Chức năng
Tính toán **12 cung nhà (Houses)** trong lá số của người dùng. Mỗi cung nhà đại diện cho một lĩnh vực cuộc sống. Cung dấu (sign) nằm trong mỗi nhà ảnh hưởng đến lĩnh vực đó.

### 📦 12 Cung Nhà
| Nhà | Lĩnh vực | Liên kết với |
|---|---|---|
| House 1 | Bản thân, ngoại hình | Ascendant |
| House 2 | Tiền bạc, tài sản | Kim Ngưu |
| House 3 | Giao tiếp, anh em | Song Tử |
| House 4 | Gia đình, quê hương | Cự Giải |
| House 5 | Tình yêu, sáng tạo, con cái | Sư Tử |
| House 6 | Sức khoẻ, công việc hàng ngày | Xử Nữ |
| House 7 | Hôn nhân, đối tác | Thiên Bình |
| House 8 | Chuyển hoá, tài sản chung | Bọ Cạp |
| House 9 | Triết lý, du lịch xa | Nhân Mã |
| House 10 | Sự nghiệp, danh tiếng | Ma Kết |
| House 11 | Bạn bè, cộng đồng, ước mơ | Bảo Bình |
| House 12 | Tiềm thức, bí ẩn, tâm linh | Song Ngư |

### 🖥️ Dùng ở đâu trong Lyth
- Life Areas Section → Điểm % cho từng lĩnh vực (Tình yêu, Sự nghiệp, Sức khoẻ...)

---

## 5. Sun Rise & Sun Set

**Endpoint:** `POST /getsunriseandset`  
**Method trong Flutter:** `getSunMoonTimings(...)`

### ✨ Chức năng
Trả về giờ chính xác của **mặt trời mọc, mặt trời lặn, mặt trăng mọc, mặt trăng lặn** trong ngày, tại một vị trí địa lý cụ thể.

### 📦 Dữ liệu trả về
| Field | Mô tả |
|---|---|
| `Sunrise` | Giờ mặt trời mọc |
| `Sunset` | Giờ mặt trời lặn |
| `Moonrise` | Giờ mặt trăng mọc |
| `Moonset` | Giờ mặt trăng lặn |

### 🖥️ Dùng ở đâu trong Lyth
- Moon Phase Card → Hiển thị "🌅 05:32 — 🌙 18:47"

---

## 6. Nakshatra Durations

**Endpoint:** `POST /nakshatra-durations`  
**Method trong Flutter:** `getNakshatraDurations(...)`

### ✨ Chức năng
Trả về thông tin **Sao Nakshatra** (27 chòm sao Mặt Trăng trong chiêm tinh Vệ Đà) đang hoạt động trong ngày. Nakshatra ảnh hưởng đến tính chất năng lượng của ngày — tương tự "ngày lành/ngày dữ" trong văn hoá Á Đông.

### 📦 27 Nakshatra chính
Ashwini, Bharani, Krittika, Rohini, Mrigashira, Ardra, Punarvasu, Pushya, Ashlesha, Magha, Purva Phalguni, Uttara Phalguni, Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshtha, Mula, Purva Ashadha, Uttara Ashadha, Shravana, Dhanishtha, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, Revati

### 🖥️ Dùng ở đâu trong Lyth
- Daily Reading Card → "Sao hôm nay: Rohini ✦ (07:23 – 08:15 ngày mai)"

---

## 7. Natal Wheel Chart

**Endpoint:** `POST /western/natal-wheel-chart`  
**Method trong Flutter:** `getNatalWheelChartSvg(BirthData birth)`

### ✨ Chức năng
Tạo ra **biểu đồ horoscope dạng vòng tròn** (wheel chart) theo hệ Western, trả về dưới dạng mã **SVG**. Hiển thị tất cả 12 cung, 12 nhà và vị trí các hành tinh.

### 💡 Cách dùng trong Flutter
```dart
// Render bằng flutter_svg
SvgPicture.string(svgString)
```

### 🖥️ Dùng ở đâu trong Lyth
- Màn hình "Chart" (Phase 2) → Biểu đồ lá số tương tác

---

## 8. Horoscope Chart SVG

**Endpoint:** `POST /horoscope-chart-svg-code`  
**Method trong Flutter:** `getVedicChartSvg(BirthData birth)`

### ✨ Chức năng
Tạo ra **biểu đồ Kundli (lá số Vệ Đà)** dạng SVG, hỗ trợ cả phong cách **Nam Ấn** và **Bắc Ấn**. Có thể tùy chỉnh màu sắc, font chữ, ẩn/hiện thông tin.

### ⚙️ Tùy chỉnh nổi bật
```json
"chart_config": {
  "chart_style": "south_india",     // south_india / north_india
  "chart_background_color": "#FEF6EE",
  "planet_name_font_color": "#BC412B",
  "native_name": "Ngọc Lý"
}
```

### 🖥️ Dùng ở đâu trong Lyth
- Màn hình "Vedic Chart" (Phase 3+)

---

## 9. Ashtakoot Score

**Endpoint:** `POST /ashtakoot-score`  
**Method trong Flutter:** `getAshtakootScore(person1, person2)`

### ✨ Chức năng
Tính **điểm tương hợp** giữa 2 người theo hệ thống **Ashtakoot** của chiêm tinh Vệ Đà. Phân tích 8 yếu tố tương thích, tổng điểm tối đa là **36 điểm**.

### 📦 8 Yếu tố Ashtakoot
| Yếu tố | Tối đa | Ý nghĩa |
|---|---|---|
| Varna | 1 | Mức độ tâm linh |
| Vashya | 2 | Sự hút kéo lẫn nhau |
| Tara | 3 | Sức khoẻ & thịnh vượng |
| Yoni | 4 | Hoà hợp sinh lý |
| Graha Maitri | 5 | Sự tương đồng tâm lý |
| Gana | 6 | Tính khí & bản năng |
| Bhakoot | 7 | Tình cảm & gia đình |
| Nadi | 8 | Sức khoẻ di truyền |

### 📊 Thang đánh giá
| Điểm | Đánh giá |
|---|---|
| < 18 | Không nên kết hôn |
| 18 – 24 | Tương hợp trung bình |
| 24 – 32 | Tương hợp tốt |
| 32 – 36 | Tương hợp xuất sắc |

### 🖥️ Dùng ở đâu trong Lyth
- Screen "Tương hợp" → Nhập ngày sinh 2 người → Hiện điểm & phân tích

---

## 10. Geo Location

**Endpoint:** `POST /geo-details`  
**Method trong Flutter:** `getGeoLocation(city, country)`

### ✨ Chức năng
Chuyển đổi **tên thành phố** thành **tọa độ địa lý** (latitude, longitude) và **múi giờ**. Giúp người dùng không cần tự nhập tọa độ thủ công.

### 📝 Ví dụ
```
Input:  city="Hanoi", country="Vietnam"
Output: latitude=21.0285, longitude=105.8542, timezone=7.0
```

### 🖥️ Dùng ở đâu trong Lyth
- Màn hình Profile/Onboarding → "Bạn sinh ở đâu?" → Tự động điền tọa độ

---

## 11. Tithi Durations

**Endpoint:** `POST /tithi-durations`  
**Method trong Flutter:** `getTithiDurations(...)`

### ✨ Chức năng
Trả về **Tithi** (ngày âm lịch theo chiêm tinh Vệ Đà) hiện tại. Có 30 Tithi trong một tháng âm lịch, mỗi Tithi mang năng lượng và ý nghĩa riêng. Tương tự khái niệm "ngày mùng, ngày rằm" nhưng chi tiết hơn.

### 📦 Một số Tithi đặc biệt
| Tithi | Tên | Ý nghĩa |
|---|---|---|
| 1 | Pratipada | Khởi đầu mới |
| 5 | Panchami | Ngày của tri thức (Saraswati) |
| 11 | Ekadashi | Thanh tịnh, nhịn ăn tâm linh |
| 14 | Chaturdashi | Năng lượng Shiva |
| 15 | Purnima | Rằm — viên mãn |
| 30 | Amavasya | Mồng 1 — âm khí mạnh |

### 🖥️ Dùng ở đâu trong Lyth
- Daily Reading Card → "Hôm nay: Ekadashi — ngày tốt để thiền định"

---

## 12. Good & Bad Times

**Endpoint:** `POST /good-bad-times`  
**Method trong Flutter:** `getGoodBadTimes(...)`

### ✨ Chức năng
Tính toán các **khung giờ tốt và xấu** trong ngày theo chiêm tinh Vệ Đà. Bao gồm các khoảng thời gian như Rahu Kalam, Yama Gandam, Gulika (giờ xấu) và Abhijit Muhurat, Amrit Kaal (giờ tốt).

### 📦 Các mốc thời gian trả về
| Mốc | Loại | Ý nghĩa |
|---|---|---|
| **Rahu Kalam** | ❌ Xấu | Giờ của Rahu, tránh khởi sự việc mới |
| **Yama Gandam** | ❌ Xấu | Giờ Yama (thần chết), không tốt |
| **Gulika Kalam** | ❌ Xấu | Giờ Gulika, không thuận |
| **Abhijit Muhurat** | ✅ Tốt | Giờ hoàng kim giữa trưa |
| **Amrit Kaal** | ✅ Tốt | Giờ "nước trường sinh" |
| **Brahma Muhurat** | ✅ Tốt | ~4h30 sáng, tốt nhất để thiền, học |

### 🖥️ Dùng ở đâu trong Lyth
- Daily Reading Card → Timeline "Giờ tốt hôm nay" / "Tránh lúc này"
- Notification thông báo "Abhijit Muhurat bắt đầu lúc 11:52"

---

## 13. Vimsottari Dasa

**Endpoint:** `POST /vimsottari/maha-dasas`  
**Method trong Flutter:** `getMahaDasas(BirthData birth)`

### ✨ Chức năng
Tính toán **Maha Dasa** — chu kỳ hành tinh cai quản cuộc đời theo hệ Vimsottari. Mỗi người trải qua 9 Dasa (kỳ) liên tiếp, mỗi kỳ kéo dài nhiều năm và được cai quản bởi một hành tinh khác nhau.

### 📦 9 Dasa và thời gian
| Hành tinh | Số năm Dasa |
|---|---|
| Ketu | 7 năm |
| Venus | 20 năm |
| Sun | 6 năm |
| Moon | 10 năm |
| Mars | 7 năm |
| Rahu | 18 năm |
| Jupiter | 16 năm |
| Saturn | 19 năm |
| Mercury | 17 năm |

> Tổng: 120 năm — một vòng đời đầy đủ

### 💡 Ý nghĩa
- Dasa của **Venus**: Giai đoạn tình yêu, nghệ thuật, sung túc nở rộ
- Dasa của **Saturn**: Giai đoạn thử thách, học bài học karma
- Dasa của **Jupiter**: Giai đoạn tâm linh, phát triển, may mắn lớn

### 🖥️ Dùng ở đâu trong Lyth
- Màn hình "Dasa & Bhukti" (Phase 3+) → "Bạn đang trong Dasa của Sao Thổ (2022–2041)"

---

## 🗺️ Sơ đồ tổng quan

```
                    ┌─────────────────────────────┐
                    │      LYTH Dashboard          │
                    └────────────┬────────────────┘
                                 │
          ┌───────────────┬──────┴──────┬───────────────┐
          │               │             │               │
   ┌──────▼──────┐ ┌──────▼──────┐ ┌───▼────┐ ┌───────▼──────┐
   │  Hero Card  │ │Daily Transits│ │Life    │ │Moon Phase    │
   │             │ │             │ │Areas   │ │Card          │
   │ /western/   │ │ /western/   │ │        │ │              │
   │  planets    │ │  aspects    │ │/western│ │/getsunsrise  │
   └─────────────┘ └─────────────┘ │/houses │ │  andset      │
                                   └────────┘ └──────────────┘
          │               │
   ┌──────▼──────┐ ┌──────▼────────────────┐
   │Daily Reading│ │   Profile Setup        │
   │             │ │                        │
   │/nakshatra-  │ │ /geo-details           │
   │ durations   │ │ /tithi-durations       │
   │/good-bad-   │ │                        │
   │  times      │ └────────────────────────┘
   └─────────────┘

   Phase 2+:
   /western/natal-wheel-chart  → Chart Screen
   /horoscope-chart-svg-code   → Vedic Chart Screen
   /ashtakoot-score            → Compatibility Screen
   /vimsottari/maha-dasas      → Dasa Screen
```

---

## ⚡ Thứ tự gọi API khi mở app

```
1. User đăng nhập → lấy thông tin ngày sinh từ Firestore
2. getGeoLocation() → chuyển tên thành phố → lat/lng
3. getWesternPlanets() → lấy Sun/Moon/Ascendant → Hero Card
4. getSunMoonTimings() → lấy giờ mọc/lặn → Moon Phase Card
5. getWesternAspects() → transits hôm nay → Daily Transits
6. getGoodBadTimes() → giờ tốt/xấu → Daily Reading
7. getNakshatraDurations() → sao hôm nay → Daily Reading
8. getWesternHouses() → 12 nhà → Life Areas (có thể cache)
```

> 💡 **Tip tối ưu:** Cache kết quả `getWesternPlanets()` và `getWesternHouses()` vào Firestore — chúng chỉ cần gọi 1 lần vì dựa trên ngày sinh (không thay đổi). Chỉ gọi lại khi người dùng cập nhật thông tin sinh.

---

*Tài liệu này được tạo tự động cho dự án Lyth — Cập nhật lần cuối: 04/2026*
