import 'dart:convert';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../models/astro_models.dart';
import '../services/astro_data_mapper.dart';

class GeminiService {
  final String _apiKey = "AIzaSyDJfa9G-uroJCdQ_nbCXKec-Zt-qJnFtWI";
  late final GenerativeModel _model;

  GeminiService() {
    _model = GenerativeModel(
      model: 'gemini-3-flash-preview',
      apiKey: _apiKey,
      generationConfig: GenerationConfig(
        temperature: 0.65, // Giảm thêm một chút để tăng tính chính xác
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048, // Tăng mạnh để không bao giờ bị cụt
      ),
      safetySettings: [
        SafetySetting(HarmCategory.harassment, HarmBlockThreshold.none),
        SafetySetting(HarmCategory.hateSpeech, HarmBlockThreshold.none),
        SafetySetting(HarmCategory.sexuallyExplicit, HarmBlockThreshold.none),
        SafetySetting(HarmCategory.dangerousContent, HarmBlockThreshold.none),
      ],
    );
  }

  Future<Map<String, dynamic>?> generateDailyInsightJSON({
    required UserModel user,
    required Map<String, double> planets,
  }) async {
    final userSunSign =
        _calculateUserSunSign(user.birthMonth ?? 1, user.birthDate ?? 1);

    String planetContext = planets.entries.map((e) {
      final sign = AstroDataMapper.mapDegreesToSign(e.value);
      return "- ${e.key}: ${sign.name.toUpperCase()} (Sign: ${sign.name})";
    }).join('\n');

    final prompt = """
      Hãy đóng vai Lyth - một tri kỷ chiêm tinh dịu dàng. Hãy viết một lời nhắn súc tích cho người bạn có Sun Sign là ${userSunSign.name.toUpperCase()}.

      Yêu cầu:
      - Header: Dưới 7 từ, như thông báo điện thoại.
      - Body: 2 câu ngắn, sâu sắc, vỗ về.
      - Dos/Donts: Mỗi mục 3 ý cực ngắn.

      Dữ liệu hành tinh hôm nay:
      $planetContext

      CHỈ TRẢ VỀ DỮ LIỆU ĐỊNH DẠNG JSON THEO MẪU NÀY:
      {
        "header": "Dòng tiêu đề súc tích",
        "category": "CAREER/LOVE/SELF",
        "body": "Nội dung tâm tình ngắn.",
        "dos": ["Việc nên 1", "Việc nên 2", "Việc nên 3"],
        "donts": ["Việc tránh 1", "Việc tránh 2", "Việc tránh 3"]
      }
    """;

    try {
      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);
      var text = response.text?.trim() ?? "{}";

      // Khử các ký tự lạ nếu AI bọc Markdown
      if (text.startsWith('```json')) {
        text = text.replaceFirst('```json', '').replaceFirst('```', '').trim();
      }

      debugPrint('✨ RAW Gemini Clean Response: $text');
      return jsonDecode(text) as Map<String, dynamic>;
    } catch (e) {
      debugPrint("❌ Gemini Final Error: $e");
      return null;
    }
  }

  ZodiacSign _calculateUserSunSign(int month, int day) {
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
      return ZodiacSign.aries;
    }
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
      return ZodiacSign.taurus;
    }
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
      return ZodiacSign.gemini;
    }
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
      return ZodiacSign.cancer;
    }
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
      return ZodiacSign.leo;
    }
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
      return ZodiacSign.virgo;
    }
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
      return ZodiacSign.libra;
    }
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
      return ZodiacSign.scorpio;
    }
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
      return ZodiacSign.sagittarius;
    }
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
      return ZodiacSign.capricorn;
    }
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
      return ZodiacSign.aquarius;
    }
    return ZodiacSign.pisces;
  }
}
