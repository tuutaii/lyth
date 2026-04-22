// ============================================================
// LYTH — Admin Prefetch Service
// Gọi API cho 30 ngày tới, sinh thông điệp tự động, lưu Firestore.
// source = 'auto' → admin biết cần review & chỉnh sửa thủ công.
// ============================================================

import 'package:flutter/foundation.dart';
import 'package:lyth_astrology/data/services/firestore_service.dart';
import 'package:lyth_astrology/data/models/daily_message.dart';

class AdminPrefetchService {
  static final AdminPrefetchService _instance =
      AdminPrefetchService._internal();
  factory AdminPrefetchService() => _instance;
  AdminPrefetchService._internal();

  final _firestoreService = FirestoreService();

  // Delay giữa mỗi API call để tránh rate-limit (tăng lên 5 giây cho an toàn)
  static const int _delaySeconds = 5;

  bool _isRunning = false;
  bool get isRunning => _isRunning;

  /// Prefetch dữ liệu cho [daysAhead] ngày kể từ hôm nay.
  Future<PrefetchResult> prefetchDays({
    int daysAhead = 30,
    bool skipExisting = true,
    void Function(int current, int total, String dateKey)? onProgress,
    void Function(String dateKey, String error)? onError,
  }) async {
    if (_isRunning) {
      return const PrefetchResult(
          successCount: 0,
          skipCount: 0,
          errorCount: 0,
          errors: ['Đang chạy rồi, vui lòng chờ.']);
    }

    _isRunning = true;
    int successCount = 0;
    int skipCount = 0;
    int errorCount = 0;
    final errors = <String>[];

    try {
      final today = DateTime.now();

      for (int i = 0; i < daysAhead; i++) {
        final targetDate = today.add(Duration(days: i));
        final dateKey = DailyMessage.keyFromDate(targetDate);

        onProgress?.call(i + 1, daysAhead, dateKey);

        if (skipExisting) {
          final existing = await _firestoreService.getDailyMessage(dateKey);
          if (existing != null) {
            debugPrint('⏭️  Bỏ qua $dateKey (đã tồn tại)');
            skipCount++;
            continue;
          }
        }

        bool daySuccess = false;
        int retries = 0;
        const int maxRetries = 2;

        while (!daySuccess && retries <= maxRetries) {
          try {
            // Logic prefetch dữ liệu NASA cho admin có thể tích hợp script sau
            
            // Tạm thời để placeholder vì NASA flow đã khóa API cũ
            const insight = (
              header: 'Hành trình khám phá cùng Lyth',
              body: 'Dữ liệu NASA đang được đồng bộ cho ngày này. Hãy chờ đón những thông điệp mới nhất.',
              dos: ['Tĩnh tâm', 'Lắng nghe'],
              donts: ['Vội vã']
            );

            final message = DailyMessage(
              dateKey: dateKey,
              header: insight.header,
              body: insight.body,
              dos: insight.dos,
              donts: insight.donts,
              source: 'auto',
            );

            await _firestoreService.saveDailyMessage(message);
            successCount++;
            daySuccess = true;
            debugPrint('✅ Saved $dateKey');
          } catch (e) {
            final errMsg = 'Lỗi $dateKey: $e';
            debugPrint('❌ $errMsg');
            errors.add(errMsg);
            errorCount++;
            onError?.call(dateKey, e.toString());
            break; 
          }
        }

        if (i < daysAhead - 1) {
          await Future.delayed(const Duration(seconds: _delaySeconds));
        }
      }
    } finally {
      _isRunning = false;
    }

    return PrefetchResult(
      successCount: successCount,
      skipCount: skipCount,
      errorCount: errorCount,
      errors: errors,
    );
  }
}

class PrefetchResult {
  final int successCount;
  final int skipCount;
  final int errorCount;
  final List<String> errors;

  const PrefetchResult({
    required this.successCount,
    required this.skipCount,
    required this.errorCount,
    required this.errors,
  });

  bool get hasErrors => errorCount > 0;
  int get totalProcessed => successCount + skipCount + errorCount;

  @override
  String toString() =>
      '✅ $successCount thành công · ⏭️ $skipCount bỏ qua · ❌ $errorCount lỗi';
}
