// ============================================================
// LYTH — Astro Data Mapper
// Chuyển đổi dữ liệu từ API sang Models của UI
// ============================================================

import 'package:lyth_astrology/data/models/astro_models.dart';
import 'package:lyth_astrology/data/models/user_model.dart';
import 'package:lyth_astrology/data/models/daily_message.dart';

class AstroDataMapper {
  /// Mapping dữ liệu từ NASA JPL với đầy đủ các hành tinh
  static UserAstroProfile mapNASADataToProfile({
    required UserModel user,
    required Map<String, double> planetLongitudes,
    DailyMessage? firebaseMessage,
  }) {
    // Tính cung hoàng đạo dự phòng từ ngày sinh để tránh lỗi mặc định Bạch Dương (0 độ)
    final fallbackSign = _calculateSunSignFromDate(
      user.birthMonth ?? 1, 
      user.birthDate ?? 1
    );

    final sunSign = planetLongitudes.containsKey('Sun') 
        ? mapDegreesToSign(planetLongitudes['Sun']!) 
        : fallbackSign;
        
    final moonSign = planetLongitudes.containsKey('Moon') 
        ? mapDegreesToSign(planetLongitudes['Moon']!) 
        : fallbackSign;

    // Tạm thời lấy Cung mọc (Rising Sign) bằng Sun Sign nếu chưa có logic tính ASC chuyên sâu
    final risingSign = fallbackSign;

    List<PlanetPosition> positions = [];
    final planetEmojis = {
      'Sun': '☀️',
      'Moon': '🌙',
      'Mercury': '☿️',
      'Venus': '♀️',
      'Mars': '♂️',
      'Jupiter': '♃',
      'Saturn': '♄'
    };
    final planetNamesMap = {
      'Sun': 'Mặt Trời',
      'Moon': 'Mặt Trăng',
      'Mercury': 'Sao Thủy',
      'Venus': 'Sao Kim',
      'Mars': 'Sao Hỏa',
      'Jupiter': 'Mộc Tinh',
      'Saturn': 'Thổ Tinh'
    };

    if (planetLongitudes.isEmpty) {
      // Tạo danh sách hành tinh giả lập dựa trên Sun Sign nếu hoàn toàn không có dữ liệu
      positions = planetNamesMap.keys.map((key) => PlanetPosition(
        planet: planetNamesMap[key]!,
        emoji: planetEmojis[key]!,
        sign: fallbackSign,
        house: '1',
      )).toList();
    } else {
      planetLongitudes.forEach((key, value) {
        final sign = mapDegreesToSign(value);
        int houseNum = (sign.index - risingSign.index + 12) % 12 + 1;

        positions.add(PlanetPosition(
          planet: planetNamesMap[key] ?? key,
          emoji: planetEmojis[key] ?? '🪐',
          sign: sign,
          house: '$houseNum',
        ));
      });
    }

    return UserAstroProfile(
      name: user.displayName.isEmpty ? 'Huyền học' : user.displayName,
      sunSign: sunSign,
      moonSign: moonSign,
      risingSign: risingSign,
      birthDate: DateTime(
        user.birthYear ?? 2000,
        user.birthMonth ?? 1,
        user.birthDate ?? 1,
      ),
      birthCity: user.birthCity ?? 'Hà Nội',
      dailyMantra: _generateMantra(moonSign.index + 1),
      planetPositions: positions,
      lifeAreas: [],
      dailyTransits: [],
      dailyInsightHeader:
          firebaseMessage?.header ?? 'Vũ trụ đang truyền tin...',
      dailyInsightBody:
          firebaseMessage?.body ?? 'Thông điệp đang được giải mã từ NASA.',
      dailyInsightCategory: firebaseMessage?.category ?? 'IDENTITY',
      adviceDos: firebaseMessage?.dos ?? [],
      adviceDonts: firebaseMessage?.donts ?? [],
      luckyColorName: firebaseMessage?.luckyColorName ?? '',
      luckyColorHex: firebaseMessage?.luckyColorHex ?? '',
      luckyColorMeaning: firebaseMessage?.luckyColorMeaning ?? '',
    );
  }

  static ZodiacSign _calculateSunSignFromDate(int month, int day) {
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return ZodiacSign.aries;
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return ZodiacSign.taurus;
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return ZodiacSign.gemini;
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return ZodiacSign.cancer;
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return ZodiacSign.leo;
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return ZodiacSign.virgo;
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return ZodiacSign.libra;
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return ZodiacSign.scorpio;
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return ZodiacSign.sagittarius;
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return ZodiacSign.capricorn;
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return ZodiacSign.aquarius;
    return ZodiacSign.pisces;
  }

  static ZodiacSign mapDegreesToSign(double degrees) {
    int index = (degrees / 30).floor() % 12;
    return ZodiacSign.values[index];
  }

  static String _generateMantra(int moonSign) {
    final mantras = [
      '"Sự bình yên không đến từ bên ngoài — nó nảy mầm từ khoảng lặng bên trong bạn."',
      '"Hãy tin tưởng vào nhịp điệu của vũ trụ, mọi thứ đang diễn ra đúng thời điểm."',
      '"Sức mạnh của bạn nằm ở khả năng thích nghi và mỉm cười trước những thay đổi."',
      '"Mỗi ngày là một món quà, hãy trân trọng hiện tại và lan tỏa yêu thương."',
    ];
    return mantras[moonSign % mantras.length];
  }
}
