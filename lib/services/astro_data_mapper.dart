// ============================================================
// LYTH — Astro Data Mapper
// Chuyển đổi dữ liệu từ API sang Models của UI
// ============================================================

import '../models/astro_models.dart';
import '../models/astrology_api_models.dart' as api;
import '../models/user_model.dart';
import '../models/daily_message.dart';

class AstroDataMapper {
  /// Chuyển đổi từ response của API sang profile hiển thị trên Dashboard
  static UserAstroProfile mapToProfile({
    required UserModel user,
    required api.WesternPlanetsResponse planets,
    required List<api.AspectInfo> dailyTransits,
    DailyMessage? firebaseMessage, // Ưu tiên: nội dung admin viết tay trên Firebase
  }) {
    final transits = dailyTransits.map((a) => DailyTransit(
          planetFrom: _translatePlanet(a.planet1),
          planetTo: _translatePlanet(a.planet2),
          aspect: _translateAspect(a.aspect),
          description: '${_translatePlanet(a.planet1)} tạo góc ${_translateAspect(a.aspect)} với ${_translatePlanet(a.planet2)}.',
          isFavorable: _isFavorable(a.aspect),
        )).toList();

    // Firebase message được ưu tiên hoàn toàn; nếu không có thì dùng logic tự động
    final insight = firebaseMessage != null
        ? _InsightData(
            header: firebaseMessage.header,
            body: firebaseMessage.body,
            dos: firebaseMessage.dos,
            donts: firebaseMessage.donts,
          )
        : _generateDetailedInsight(dailyTransits);

    return UserAstroProfile(
      name: user.displayName.isEmpty ? 'Huyền học' : user.displayName,
      sunSign: _mapSign(planets.sun?.currentSign ?? 1),
      moonSign: _mapSign(planets.moon?.currentSign ?? 1),
      risingSign: _mapSign(planets.ascendant?.currentSign ?? 1),
      birthDate: DateTime(
        user.birthYear ?? 2000,
        user.birthMonth ?? 1,
        user.birthDate ?? 1,
      ),
      birthCity: user.birthCity ?? 'Hà Nội',
      dailyMantra: _generateMantra(planets.moon?.currentSign ?? 1),
      planetPositions: planets.allPlanets.map((p) => PlanetPosition(
        planet: _translatePlanet(p.name),
        emoji: _planetEmoji(p.name),
        sign: _mapSign(p.currentSign),
        house: 'Cung ${_findHouse(p.fullDegree)}',
        isRetrograde: p.isRetrograde,
      )).toList(),
      lifeAreas: _generateLifeAreas(planets),
      dailyTransits: transits,
      dailyInsightHeader: insight.header,
      dailyInsightBody: insight.body,
      adviceDos: insight.dos,
      adviceDonts: insight.donts,
    );
  }

  /// Mapping dữ liệu từ NASA JPL
  static UserAstroProfile mapNASADataToProfile({
    required UserModel user,
    required double sunLon,
    required double moonLon,
    DailyMessage? firebaseMessage,
  }) {
    return UserAstroProfile(
      name: user.displayName.isEmpty ? 'Huyền học' : user.displayName,
      sunSign: mapDegreesToSign(sunLon),
      moonSign: mapDegreesToSign(moonLon),
      risingSign: ZodiacSign.aries, // NASA cần thêm logic để tính ASC
      birthDate: DateTime(
        user.birthYear ?? 2000,
        user.birthMonth ?? 1,
        user.birthDate ?? 1,
      ),
      birthCity: user.birthCity ?? 'Hà Nội',
      dailyMantra: _generateMantra(mapDegreesToSign(moonLon).index + 1),
      planetPositions: [
        PlanetPosition(
          planet: 'Mặt Trời',
          emoji: '☀️',
          sign: mapDegreesToSign(sunLon),
          house: 'Cung 1',
          isRetrograde: false,
        ),
        PlanetPosition(
          planet: 'Mặt Trăng',
          emoji: '🌙',
          sign: mapDegreesToSign(moonLon),
          house: 'Cung 1',
          isRetrograde: false,
        ),
      ],
      lifeAreas: [],
      dailyTransits: [],
      dailyInsightHeader: firebaseMessage?.header ?? 'Vũ trụ đang truyền tin...',
      dailyInsightBody: firebaseMessage?.body ?? 'NASA đã kết nối thành công. Thông điệp đang được giải mã.',
      adviceDos: firebaseMessage?.dos ?? [],
      adviceDonts: firebaseMessage?.donts ?? [],
    );
  }

  /// Public entry point cho AdminPrefetchService — sinh thông điệp từ danh
  /// sách transit mà không cần toàn bộ user profile.
  static ({String header, String body, List<String> dos, List<String> donts})
      generateInsightFromTransits(List<api.AspectInfo> transits) {
    final d = _generateDetailedInsight(transits);
    return (header: d.header, body: d.body, dos: d.dos, donts: d.donts);
  }

  static _InsightData _generateDetailedInsight(List<api.AspectInfo> transits) {
    if (transits.isEmpty) {
      return const _InsightData(
        header: 'Một ngày của sự tĩnh lặng và quan sát sâu sắc.',
        body: 'Bầu trời hôm nay không có quá nhiều biến động. Đây là thời điểm tuyệt vời để bạn quay vào bên trong, lắng nghe hơi thở và chuẩn bị cho những chu kỳ mới sắp tới.',
        dos: ['Thiền định', 'Uống nhiều nước', 'Đi ngủ sớm'],
        donts: ['Quyết định vội vàng', 'Lao lao vào việc mới'],
      );
    }

    // Ưu tiên các góc chiếu với Mặt Trời, Mặt Trăng hoặc các hành tinh cá nhân
    final bestAspect = transits.firstWhere(
      (a) => a.planet1.toLowerCase() == 'sun' || a.planet1.toLowerCase() == 'moon' || a.planet2.toLowerCase() == 'sun',
      orElse: () => transits.first,
    );

    final p1 = _translatePlanet(bestAspect.planet1);
    final p2 = _translatePlanet(bestAspect.planet2);
    final aspect = _translateAspect(bestAspect.aspect);

    String header = '';
    String body = '';
    List<String> dos = [];
    List<String> donts = [];

    if (_isFavorable(bestAspect.aspect)) {
      header = 'Năng lượng hài hòa từ $p1 và $p2 mang lại sự sáng tỏ.';
      body = 'Sự kết hợp giữa $p1 và $p2 thông qua góc $aspect đang tạo ra một dòng chảy thuận lợi. Bạn sẽ cảm thấy tự tin hơn trong việc thể hiện bản thân và kết nối với những người xung quanh. Hãy tận dụng thời điểm này để giải quyết các vấn đề còn tồn đọng.';
      dos = ['Ký kết hợp đồng', 'Bày tỏ tình cảm', 'Bắt đầu dự án mới'];
      donts = ['Chần chừ lo sợ', 'Bỏ lỡ cơ hội'];
    } else {
      header = 'Thử thách lòng kiên nhẫn khi $p1 gặp áp lực từ $p2.';
      body = 'Góc $aspect giữa $p1 và $p2 có thể mang tới một vài sự xáo trộn nhỏ trong suy nghĩ hoặc cảm xúc. Đừng để những phản ứng nhất thời chi phối hành động của bạn. Vũ trụ đang muốn bạn học cách giữ sự điềm tĩnh và thấu đáo hơn.';
      dos = ['Kiểm soát lời nói', 'Dành thời gian một mình', 'Hoàn thiện việc cũ'];
      donts = ['Tranh cãi gay gắt', 'Đầu tư mạo hiểm', 'Thức khuya'];
    }

    return _InsightData(header: header, body: body, dos: dos, donts: donts);
  }

  static ZodiacSign mapDegreesToSign(double degrees) {
    // 0-30: Aries, 30-60: Taurus, ... 
    // Đảm bảo wrap-around 360
    int index = (degrees / 30).floor() % 12;
    return ZodiacSign.values[index];
  }

  static ZodiacSign _mapSign(int signIndex) {
    if (signIndex < 1 || signIndex > 12) return ZodiacSign.aries;
    return ZodiacSign.values[signIndex - 1];
  }

  static String _translatePlanet(String name) {
    switch (name.toLowerCase()) {
      case 'sun': return 'Mặt Trời';
      case 'moon': return 'Mặt Trăng';
      case 'mercury': return 'Sao Thủy';
      case 'venus': return 'Sao Kim';
      case 'mars': return 'Sao Hỏa';
      case 'jupiter': return 'Mộc Tinh';
      case 'saturn': return 'Thổ Tinh';
      case 'uranus': return 'Thiên Vương';
      case 'neptune': return 'Hải Vương';
      case 'pluto': return 'Diêm Vương';
      case 'ascendant': return 'Cùng Mọc';
      default: return name;
    }
  }

  static String _planetEmoji(String name) {
    switch (name.toLowerCase()) {
      case 'sun': return '☀️';
      case 'moon': return '🌙';
      case 'mercury': return '☿️';
      case 'venus': return '♀️';
      case 'mars': return '♂️';
      case 'jupiter': return '♃';
      case 'saturn': return '♄';
      case 'uranus': return '♅';
      case 'neptune': return '♆';
      case 'pluto': return '♇';
      default: return '✦';
    }
  }

  static String _translateAspect(String aspect) {
    switch (aspect.toLowerCase()) {
      case 'conjunction': return 'Trùng tụ';
      case 'sextile': return 'Lục hợp';
      case 'square': return 'Vuông góc';
      case 'trine': return 'Tam hợp';
      case 'opposition': return 'Xung đối';
      default: return aspect;
    }
  }

  static bool _isFavorable(String aspect) {
    final a = aspect.toLowerCase();
    return a == 'trine' || a == 'sextile' || a == 'conjunction';
  }

  static String _findHouse(double degree) {
    return ((degree / 30).floor() + 1).toString();
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

  static List<LifeAreaScore> _generateLifeAreas(api.WesternPlanetsResponse planets) {
    return [
      const LifeAreaScore(area: 'Tình yêu', emoji: '🌸', score: 0.82, shortInsight: 'Năng lượng Kim tinh tươi mới'),
      const LifeAreaScore(area: 'Sự nghiệp', emoji: '🌿', score: 0.65, shortInsight: 'Thổ tinh yêu cầu sự kiên trì'),
      const LifeAreaScore(area: 'Sức khoẻ', emoji: '✦', score: 0.78, shortInsight: 'Ánh sáng Mặt trời dồi dào'),
      const LifeAreaScore(area: 'Tài chính', emoji: '💰', score: 0.70, shortInsight: 'Mộc tinh mang lại cơ hội'),
    ];
  }
}

class _InsightData {
  final String header;
  final String body;
  final List<String> dos;
  final List<String> donts;

  const _InsightData({
    required this.header,
    required this.body,
    required this.dos,
    required this.donts,
  });
}
