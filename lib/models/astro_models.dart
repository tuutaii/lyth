// ─────────────────────────────────────────────
//  LYTH — Data Models
// ─────────────────────────────────────────────

import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

// ──────────────────────────────────────────────
//  Zodiac Sign
// ──────────────────────────────────────────────
enum ZodiacElement { fire, earth, air, water }

enum ZodiacSign {
  aries,
  taurus,
  gemini,
  cancer,
  leo,
  virgo,
  libra,
  scorpio,
  sagittarius,
  capricorn,
  aquarius,
  pisces,
}

extension ZodiacSignExtension on ZodiacSign {
  String get displayName {
    const names = [
      'Bạch Dương',
      'Kim Ngưu',
      'Song Tử',
      'Cự Giải',
      'Sư Tử',
      'Xử Nữ',
      'Thiên Bình',
      'Bọ Cạp',
      'Nhân Mã',
      'Ma Kết',
      'Bảo Bình',
      'Song Ngư',
    ];
    return names[index];
  }

  String get symbol {
    const symbols = [
      '♈',
      '♉',
      '♊',
      '♋',
      '♌',
      '♍',
      '♎',
      '♏',
      '♐',
      '♑',
      '♒',
      '♓'
    ];
    return symbols[index];
  }

  ZodiacElement get element {
    const elements = [
      ZodiacElement.fire,
      ZodiacElement.earth,
      ZodiacElement.air,
      ZodiacElement.water,
      ZodiacElement.fire,
      ZodiacElement.earth,
      ZodiacElement.air,
      ZodiacElement.water,
      ZodiacElement.fire,
      ZodiacElement.earth,
      ZodiacElement.air,
      ZodiacElement.water,
    ];
    return elements[index];
  }

  Color get elementColor {
    switch (element) {
      case ZodiacElement.fire:
        return AppColors.fireLight;
      case ZodiacElement.earth:
        return AppColors.earthLight;
      case ZodiacElement.air:
        return AppColors.airLight;
      case ZodiacElement.water:
        return AppColors.waterLight;
    }
  }

  String get elementName {
    switch (element) {
      case ZodiacElement.fire:
        return 'Lửa';
      case ZodiacElement.earth:
        return 'Đất';
      case ZodiacElement.air:
        return 'Khí';
      case ZodiacElement.water:
        return 'Nước';
    }
  }

  String get dateRange {
    const ranges = [
      '21 Mar – 19 Apr',
      '20 Apr – 20 May',
      '21 May – 20 Jun',
      '21 Jun – 22 Jul',
      '23 Jul – 22 Aug',
      '23 Aug – 22 Sep',
      '23 Sep – 22 Oct',
      '23 Oct – 21 Nov',
      '22 Nov – 21 Dec',
      '22 Dec – 19 Jan',
      '20 Jan – 18 Feb',
      '19 Feb – 20 Mar',
    ];
    return ranges[index];
  }

  String get rulingPlanet {
    const planets = [
      'Sao Hỏa',
      'Sao Kim',
      'Sao Thủy',
      'Mặt Trăng',
      'Mặt Trời',
      'Sao Thủy',
      'Sao Kim',
      'Diêm Vương',
      'Mộc Tinh',
      'Thổ Tinh',
      'Thiên Vương',
      'Hải Vương',
    ];
    return planets[index];
  }
}

// ──────────────────────────────────────────────
//  Planet Position
// ──────────────────────────────────────────────
class PlanetPosition {
  final String planet;
  final String emoji;
  final ZodiacSign sign;
  final String house;
  final bool isRetrograde;

  const PlanetPosition({
    required this.planet,
    required this.emoji,
    required this.sign,
    required this.house,
    this.isRetrograde = false,
  });
}

// ──────────────────────────────────────────────
//  Life Area Score
// ──────────────────────────────────────────────
class LifeAreaScore {
  final String area;
  final String emoji;
  final double score; // 0.0 → 1.0
  final String shortInsight;

  const LifeAreaScore({
    required this.area,
    required this.emoji,
    required this.score,
    required this.shortInsight,
  });
}

// ──────────────────────────────────────────────
//  Daily Transit
// ──────────────────────────────────────────────
class DailyTransit {
  final String planetFrom;
  final String planetTo;
  final String aspect; // e.g. "Tam hợp", "Xung khắc"
  final String description;
  final bool isFavorable;

  const DailyTransit({
    required this.planetFrom,
    required this.planetTo,
    required this.aspect,
    required this.description,
    required this.isFavorable,
  });
}

// ──────────────────────────────────────────────
//  User Profile (sample data)
// ──────────────────────────────────────────────
class UserAstroProfile {
  final String name;
  final ZodiacSign sunSign;
  final ZodiacSign moonSign;
  final ZodiacSign risingSign;
  final DateTime birthDate;
  final String birthCity;
  final String dailyMantra;
  final List<PlanetPosition> planetPositions;
  final List<LifeAreaScore> lifeAreas;
  final List<DailyTransit> dailyTransits;
  String dailyInsightHeader;
  String dailyInsightBody;
  String dailyInsightCategory;
  List<String> adviceDos;
  List<String> adviceDonts;

  UserAstroProfile({
    required this.name,
    required this.sunSign,
    required this.moonSign,
    required this.risingSign,
    required this.birthDate,
    required this.birthCity,
    required this.dailyMantra,
    required this.planetPositions,
    required this.lifeAreas,
    required this.dailyTransits,
    this.dailyInsightHeader = '',
    this.dailyInsightBody = '',
    this.dailyInsightCategory = '',
    this.adviceDos = const [],
    this.adviceDonts = const [],
  });

  static UserAstroProfile get sample => UserAstroProfile(
        name: 'Ngọc Lý',
        sunSign: ZodiacSign.libra,
        moonSign: ZodiacSign.pisces,
        risingSign: ZodiacSign.gemini,
        birthDate: DateTime(1997, 10, 12),
        birthCity: 'Hà Nội',
        dailyMantra: '"Sự bình yên không đến từ bên ngoài — '
            'nó nảy mầm từ khoảng lặng bên trong bạn."',
        planetPositions: const [
          PlanetPosition(
              planet: 'Mặt Trời',
              emoji: '☀️',
              sign: ZodiacSign.libra,
              house: 'Cung 5'),
          PlanetPosition(
              planet: 'Mặt Trăng',
              emoji: '🌙',
              sign: ZodiacSign.pisces,
              house: 'Cung 10'),
          PlanetPosition(
              planet: 'Sao Thủy',
              emoji: '☿️',
              sign: ZodiacSign.scorpio,
              house: 'Cung 6',
              isRetrograde: true),
          PlanetPosition(
              planet: 'Sao Kim',
              emoji: '♀️',
              sign: ZodiacSign.libra,
              house: 'Cung 5'),
          PlanetPosition(
              planet: 'Sao Hỏa',
              emoji: '♂️',
              sign: ZodiacSign.sagittarius,
              house: 'Cung 7'),
          PlanetPosition(
              planet: 'Mộc Tinh',
              emoji: '♃',
              sign: ZodiacSign.aquarius,
              house: 'Cung 9'),
        ],
        lifeAreas: const [
          LifeAreaScore(
              area: 'Tình yêu',
              emoji: '🌸',
              score: 0.75,
              shortInsight: 'Cởi mở trái tim hơn'),
          LifeAreaScore(
              area: 'Sự nghiệp',
              emoji: '🌿',
              score: 0.58,
              shortInsight: 'Thời điểm gieo hạt'),
          LifeAreaScore(
              area: 'Sức khoẻ',
              emoji: '✦',
              score: 0.84,
              shortInsight: 'Năng lượng dồi dào'),
          LifeAreaScore(
              area: 'Bạn bè',
              emoji: '🌾',
              score: 0.62,
              shortInsight: 'Lắng nghe sâu hơn'),
          LifeAreaScore(
              area: 'Tự thân',
              emoji: '🍃',
              score: 0.70,
              shortInsight: 'Đang trưởng thành'),
          LifeAreaScore(
              area: 'Sáng tạo',
              emoji: '🌻',
              score: 0.90,
              shortInsight: 'Thăng hoa rực rỡ'),
        ],
        dailyTransits: const [
          DailyTransit(
            planetFrom: 'Mặt Trăng',
            planetTo: 'Sao Kim',
            aspect: 'Tam hợp',
            description:
                'Trực giác và cảm xúc hài hòa — lý tưởng để kết nối và bày tỏ.',
            isFavorable: true,
          ),
          DailyTransit(
            planetFrom: 'Sao Thủy',
            planetTo: 'Thổ Tinh',
            aspect: 'Xung chiếu',
            description:
                'Suy nghĩ có thể bị chậm lại. Hãy kiên nhẫn với quy trình.',
            isFavorable: false,
          ),
          DailyTransit(
            planetFrom: 'Mặt Trời',
            planetTo: 'Mộc Tinh',
            aspect: 'Lục hợp',
            description:
                'Vận may nhỏ xuất hiện trong lĩnh vực học thuật và du lịch.',
            isFavorable: true,
          ),
        ],
        dailyInsightHeader:
            'Bắt đầu ngày mới bằng việc hiểu rõ bạn là ai và bạn thực sự muốn gì.',
        dailyInsightBody:
            'Bạn đã đeo quá nhiều mặt nạ để làm hài lòng người khác đến nỗi quên mất gương mặt thật của mình. '
            'Cơn giận bạn cảm thấy không phải ở họ — mà là ở chính bạn. Đừng thích nghi nữa. Hãy bắt đầu quyết định. '
            'Sức mạnh của bạn nằm ở từ "Không".',
        adviceDos: ['Lắng nghe trực giác', 'Đi dạo nhẹ nhàng', 'Đọc sách'],
        adviceDonts: [
          'Quyết định vội vàng',
          'Tranh cãi vô ích',
          'Thức quá khuya'
        ],
      );
}
