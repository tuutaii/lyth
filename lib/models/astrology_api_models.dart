// ============================================================
// LYTH — Astrology API Models
// Based on freeastrologyapi.com Postman Collection
// ============================================================

// ── Birth Data ───────────────────────────────────────────────

class BirthData {
  final int year;
  final int month;
  final int date;
  final int hours;
  final int minutes;
  final int seconds;
  final double latitude;
  final double longitude;
  final double timezone;

  const BirthData({
    required this.year,
    required this.month,
    required this.date,
    required this.hours,
    required this.minutes,
    this.seconds = 0,
    required this.latitude,
    required this.longitude,
    required this.timezone,
  });

  Map<String, dynamic> toJsonWestern() => {
        'year': year,
        'month': month,
        'date': date,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds,
        'latitude': latitude,
        'longitude': longitude,
        'timezone': timezone,
        'config': {
          'observation_point': 'topocentric',
          'ayanamsha': 'tropical',
          'language': 'en',
        },
      };

  Map<String, dynamic> toJsonVedic() => {
        'year': year,
        'month': month,
        'date': date,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds,
        'latitude': latitude,
        'longitude': longitude,
        'timezone': timezone,
        'config': {
          'observation_point': 'topocentric',
          'ayanamsha': 'lahiri',
        },
      };
}

// ── Planet ───────────────────────────────────────────────────

class PlanetInfo {
  final String name;
  final double fullDegree;
  final double normDegree;
  final bool isRetrograde;
  final int currentSign;

  const PlanetInfo({
    required this.name,
    required this.fullDegree,
    required this.normDegree,
    required this.isRetrograde,
    required this.currentSign,
  });

  factory PlanetInfo.fromMap(String name, Map<String, dynamic> map) {
    return PlanetInfo(
      name: name,
      fullDegree: (map['fullDegree'] as num?)?.toDouble() ?? 0.0,
      normDegree: (map['normDegree'] as num?)?.toDouble() ?? 0.0,
      isRetrograde: map['isRetro']?.toString() == 'true',
      currentSign: (map['current_sign'] as num?)?.toInt() ?? 0,
    );
  }

  /// Vietnamese zodiac sign name
  String get signName => _signNames[currentSign] ?? 'Unknown';

  /// Zodiac sign emoji
  String get signEmoji => _signEmojis[currentSign] ?? '✦';

  static const Map<int, String> _signNames = {
    1: 'Bạch Dương',
    2: 'Kim Ngưu',
    3: 'Song Tử',
    4: 'Cự Giải',
    5: 'Sư Tử',
    6: 'Xử Nữ',
    7: 'Thiên Bình',
    8: 'Bọ Cạp',
    9: 'Nhân Mã',
    10: 'Ma Kết',
    11: 'Bảo Bình',
    12: 'Song Ngư',
  };

  static const Map<int, String> _signEmojis = {
    1: '♈',
    2: '♉',
    3: '♊',
    4: '♋',
    5: '♌',
    6: '♍',
    7: '♎',
    8: '♏',
    9: '♐',
    10: '♑',
    11: '♒',
    12: '♓',
  };
}

// ── Western Planets Response ──────────────────────────────────

class WesternPlanetsResponse {
  final PlanetInfo? sun;
  final PlanetInfo? moon;
  final PlanetInfo? ascendant;
  final PlanetInfo? mars;
  final PlanetInfo? mercury;
  final PlanetInfo? jupiter;
  final PlanetInfo? venus;
  final PlanetInfo? saturn;
  final PlanetInfo? uranus;
  final PlanetInfo? neptune;
  final PlanetInfo? pluto;
  final List<PlanetInfo> allPlanets;

  const WesternPlanetsResponse({
    this.sun,
    this.moon,
    this.ascendant,
    this.mars,
    this.mercury,
    this.jupiter,
    this.venus,
    this.saturn,
    this.uranus,
    this.neptune,
    this.pluto,
    required this.allPlanets,
  });

  factory WesternPlanetsResponse.fromJson(Map<String, dynamic> json) {
    // API returns output[1] as named map: { "Sun": {...}, "Moon": {...}, ... }
    final output = json['output'] as List?;
    final namedMap = (output != null && output.length > 1 && output[1] is Map)
        ? output[1] as Map<String, dynamic>?
        : null;

    PlanetInfo? parse(String key) {
      final value = namedMap?[key]; 
      if (value is Map<String, dynamic>) {
        return PlanetInfo.fromMap(key, value);
      }
      return null;
    }

    final all = <PlanetInfo>[];
    if (namedMap != null) {
      for (final entry in namedMap.entries) {
        final val = entry.value;
        if (val is Map<String, dynamic>) {
          if (val.containsKey('current_sign')) {
            all.add(PlanetInfo.fromMap(entry.key, val));
          }
        }
      }
    }

    return WesternPlanetsResponse(
      sun: parse('Sun'),
      moon: parse('Moon'),
      ascendant: parse('Ascendant'),
      mars: parse('Mars'),
      mercury: parse('Mercury'),
      jupiter: parse('Jupiter'),
      venus: parse('Venus'),
      saturn: parse('Saturn'),
      uranus: parse('Uranus'),
      neptune: parse('Neptune'),
      pluto: parse('Pluto'),
      allPlanets: all,
    );
  }
}

// ── Aspect ───────────────────────────────────────────────────

class AspectInfo {
  final String planet1;
  final String planet2;
  final String aspect;
  final double orb;

  const AspectInfo({
    required this.planet1,
    required this.planet2,
    required this.aspect,
    required this.orb,
  });

  factory AspectInfo.fromJson(Map<String, dynamic> json) {
    return AspectInfo(
      planet1: json['planet1']?.toString() ?? '',
      planet2: json['planet2']?.toString() ?? '',
      aspect: json['aspect']?.toString() ?? '',
      orb: (json['orb'] as num?)?.toDouble() ?? 0.0,
    );
  }

  String get description => '$planet1 $aspect $planet2';
}

// ── Houses Response ───────────────────────────────────────────

class HouseInfo {
  final int houseNumber;
  final int sign;
  final double degree;

  const HouseInfo({
    required this.houseNumber,
    required this.sign,
    required this.degree,
  });
}

// ── Sun/Moon Rise & Set ───────────────────────────────────────

class SunMoonTimings {
  final String sunrise;
  final String sunset;
  final String? moonrise;
  final String? moonset;

  const SunMoonTimings({
    required this.sunrise,
    required this.sunset,
    this.moonrise,
    this.moonset,
  });

  factory SunMoonTimings.fromJson(Map<String, dynamic> json) {
    final rawOutput = json['output'];
    final output = (rawOutput is Map<String, dynamic>) ? rawOutput : <String, dynamic>{};
    return SunMoonTimings(
      sunrise: output['Sunrise']?.toString() ?? output['sunrise']?.toString() ?? '--:--',
      sunset: output['Sunset']?.toString() ?? output['sunset']?.toString() ?? '--:--',
      moonrise: output['Moonrise']?.toString() ?? output['moonrise']?.toString(),
      moonset: output['Moonset']?.toString() ?? output['moonset']?.toString(),
    );
  }
}

// ── Nakshatra ─────────────────────────────────────────────────

class NakshatraInfo {
  final String name;
  final String startTime;
  final String endTime;
  final int lord;

  const NakshatraInfo({
    required this.name,
    required this.startTime,
    required this.endTime,
    required this.lord,
  });

  factory NakshatraInfo.fromJson(Map<String, dynamic> json) {
    return NakshatraInfo(
      name: json['name']?.toString() ?? json['nakshatra']?.toString() ?? '',
      startTime: json['start_time']?.toString() ?? '',
      endTime: json['end_time']?.toString() ?? '',
      lord: (json['lord'] as num?)?.toInt() ?? 0,
    );
  }
}

// ── Geo Location ──────────────────────────────────────────────

class GeoLocation {
  final double latitude;
  final double longitude;
  final double timezone;
  final String cityName;

  const GeoLocation({
    required this.latitude,
    required this.longitude,
    required this.timezone,
    required this.cityName,
  });

  factory GeoLocation.fromJson(Map<String, dynamic> json) {
    final rawOutput = json['output'];
    final output = (rawOutput is Map<String, dynamic>) ? rawOutput : json;
    
    return GeoLocation(
      latitude: (output['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (output['longitude'] as num?)?.toDouble() ?? 0.0,
      timezone: (output['timezone'] as num?)?.toDouble() ?? 7.0,
      cityName: output['city']?.toString() ?? '',
    );
  }
}

// ── Ashtakoot (Compatibility) Score ──────────────────────────

class CompatibilityScore {
  final double totalScore;
  final double maxScore;
  final Map<String, double> details;

  const CompatibilityScore({
    required this.totalScore,
    required this.maxScore,
    required this.details,
  });

  double get percentage => (totalScore / maxScore) * 100;

  factory CompatibilityScore.fromJson(Map<String, dynamic> json) {
    final rawOutput = json['output'];
    final output = (rawOutput is Map<String, dynamic>) ? rawOutput : <String, dynamic>{};
    
    final details = <String, double>{};
    output.forEach((key, value) {
      if (value is num) details[key] = value.toDouble();
    });
    return CompatibilityScore(
      totalScore: (output['total_score'] as num?)?.toDouble() ?? 0.0,
      maxScore: 36.0,
      details: details,
    );
  }
}
