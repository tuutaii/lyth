// ============================================================
// LYTH — Daily Message Model
// Cấu trúc: Firestore /daily_messages/{YYYY-MM-DD}
// ============================================================

class DailyMessage {
  /// Định danh ngày theo format YYYY-MM-DD, cũng là document ID trên Firestore
  final String dateKey;

  /// Tiêu đề ngắn gọn, trình bày to bằng font Lora
  final String header;

  /// Nội dung diễn giải chi tiết hơn
  final String body;

  /// Danh sách việc nên làm hôm nay
  final List<String> dos;

  /// Danh sách việc nên tránh hôm nay
  final List<String> donts;

  /// Nguồn gốc: 'manual' (admin viết tay) hoặc 'auto' (fallback)
  final String source;

  const DailyMessage({
    required this.dateKey,
    required this.header,
    required this.body,
    this.dos = const [],
    this.donts = const [],
    this.source = 'manual',
  });

  /// Key format: YYYY-MM-DD
  static String keyFromDate(DateTime date) =>
      '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';

  static String get todayKey => keyFromDate(DateTime.now());

  factory DailyMessage.fromFirestore(String dateKey, Map<String, dynamic> data) {
    return DailyMessage(
      dateKey: dateKey,
      header: data['header'] as String? ?? '',
      body: data['body'] as String? ?? '',
      dos: (data['dos'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      donts: (data['donts'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      source: data['source'] as String? ?? 'manual',
    );
  }

  Map<String, dynamic> toFirestore() => {
        'header': header,
        'body': body,
        'dos': dos,
        'donts': donts,
        'source': source,
        'updatedAt': DateTime.now().toIso8601String(),
      };
}
