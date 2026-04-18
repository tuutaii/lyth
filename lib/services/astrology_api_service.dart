// ============================================================
// LYTH — Astrology API Service (NASA JPL VERSION)
// Tạm khóa các API thương mại, chuyển sang dùng NASA Horizons miễn phí.
// ============================================================

import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class AstrologyApiService {
  static final AstrologyApiService _instance = AstrologyApiService._internal();
  factory AstrologyApiService() => _instance;
  AstrologyApiService._internal();

  static const String _jplUrl = "https://ssd.jpl.nasa.gov/api/horizons.api";

  /* 
  --- TẠM KHÓA API CŨ ---
  static const String _baseUrl = "https://json.freeastrologyapi.com";
  ... 
  */

  /// Lấy dữ liệu kinh độ hoàng đạo (Ecliptic Longitude) từ NASA JPL Horizons.
  /// Trả về giá trị từ 0.0 đến 360.0 độ.
  /// Planet IDs mẫu: '10' (Sun), '299' (Venus), '499' (Mars), '199' (Mercury)
  Future<double?> getEclipticLongitude({
    required String planetId,
    required double lat,
    required double lng,
    DateTime? date,
  }) async {
    final targetDate = date ?? DateTime.now();
    final dateStr = "${targetDate.year}-${targetDate.month.toString().padLeft(2, '0')}-${targetDate.day.toString().padLeft(2, '0')}";
    final nextDay = targetDate.add(const Duration(days: 1));
    final stopStr = "${nextDay.year}-${nextDay.month.toString().padLeft(2, '0')}-${nextDay.day.toString().padLeft(2, '0')}";

    final uri = Uri.parse("$_jplUrl?"
        "format=json&"
        "COMMAND='$planetId'&"
        "OBJ_DATA='NO'&"
        "MAKE_EPHEM='YES'&"
        "EPHEM_TYPE='OBSERVER'&"
        "CENTER='coord@399'&" // Geocentric observer
        "COORD_TYPE='GEODETIC'&"
        "SITE_COORD='$lng,$lat,0'&" // Format của NASA là Lng, Lat, Alt
        "START_TIME='$dateStr'&"
        "STOP_TIME='$stopStr'&"
        "STEP_SIZE='1d'&"
        "QUANTITIES='31'"); // 31 = Observer-centered ecliptic lon. & lat.

    try {
      debugPrint('🚀 NASA Request: $planetId for $dateStr');
      final response = await http.get(uri);
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final resultText = data['result'] as String? ?? '';

        // NASA Table parser
        final regExp = RegExp(r"\$\$SOE([\s\S]*?)\$\$EOE");
        final match = regExp.firstMatch(resultText);
        
        if (match != null) {
          final line = match.group(1)!.trim().split('\n').first;
          // Tìm tất cả các số có dấu chấm thập phân trong dòng dữ liệu
          final matches = RegExp(r"[-+]?[0-9]*\.[0-9]+").allMatches(line).toList();
          
          if (matches.isNotEmpty) {
            // Số thập phân đầu tiên xuất hiện sau chuỗi ngày tháng chính là Kinh độ
            return double.tryParse(matches[0].group(0)!);
          }
        }
      }
    } catch (e) {
      debugPrint("❌ NASA API Error ($planetId): $e");
    }
    return null;
  }

  /// Tìm tọa độ từ tên thành phố sử dụng Nominatim (OpenStreetMap) - MIỄN PHÍ.
  Future<Map<String, dynamic>?> getGeoLocation(String city) async {
    final query = Uri.encodeComponent(city);
    final url = Uri.parse("https://nominatim.openstreetmap.org/search?q=$query&format=json&limit=1");

    try {
      final response = await http.get(url, headers: {
        'User-Agent': 'LythAstrologyApp/1.0', // Yêu cầu của Nominatim
      });

      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        if (data.isNotEmpty) {
          final first = data[0];
          return {
            "latitude": double.parse(first['lat']),
            "longitude": double.parse(first['lon']),
            "display_name": first['display_name'],
            "timezone": 7.0, // Mặc định cho VN, có thể tối ưu thêm sau
          };
        }
      }
    } catch (e) {
      debugPrint("Geocoding Error: $e");
    }
    return null;
  }
}

class AstrologyApiException implements Exception {
  final String message;
  final int? statusCode;

  const AstrologyApiException(this.message, {this.statusCode});

  @override
  String toString() => 'AstrologyApiException: $message';
}
