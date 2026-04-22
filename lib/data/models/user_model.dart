// ============================================================
// LYTH — User Model
// ============================================================

class UserModel {
  final String uid;
  final String email;
  final String displayName;
  final String? photoUrl;

  // Birth info (for astrology API)
  final int? birthYear;
  final int? birthMonth;
  final int? birthDate;
  final int? birthHour;
  final int? birthMinute;
  final String? birthCity;
  final String? birthCountry;
  final double? latitude;
  final double? longitude;
  final double? timezone;

  const UserModel({
    required this.uid,
    required this.email,
    this.displayName = '',
    this.photoUrl,
    this.birthYear,
    this.birthMonth,
    this.birthDate,
    this.birthHour,
    this.birthMinute,
    this.birthCity,
    this.birthCountry,
    this.latitude,
    this.longitude,
    this.timezone,
  });

  /// Kiểm tra user đã nhập đủ thông tin ngày sinh chưa
  bool get hasBirthInfo =>
      birthYear != null &&
      birthMonth != null &&
      birthDate != null &&
      latitude != null &&
      longitude != null;

  UserModel copyWith({
    String? displayName,
    int? birthYear,
    int? birthMonth,
    int? birthDate,
    int? birthHour,
    int? birthMinute,
    String? birthCity,
    String? birthCountry,
    double? latitude,
    double? longitude,
    double? timezone,
    String? photoUrl,
  }) {
    return UserModel(
      uid: uid,
      email: email,
      displayName: displayName ?? this.displayName,
      photoUrl: photoUrl ?? this.photoUrl,
      birthYear: birthYear ?? this.birthYear,
      birthMonth: birthMonth ?? this.birthMonth,
      birthDate: birthDate ?? this.birthDate,
      birthHour: birthHour ?? this.birthHour,
      birthMinute: birthMinute ?? this.birthMinute,
      birthCity: birthCity ?? this.birthCity,
      birthCountry: birthCountry ?? this.birthCountry,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      timezone: timezone ?? this.timezone,
    );
  }

  Map<String, dynamic> toFirestore() => {
        'uid': uid,
        'email': email,
        'displayName': displayName,
        'photoUrl': photoUrl,
        'birthYear': birthYear,
        'birthMonth': birthMonth,
        'birthDate': birthDate,
        'birthHour': birthHour,
        'birthMinute': birthMinute,
        'birthCity': birthCity,
        'birthCountry': birthCountry,
        'latitude': latitude,
        'longitude': longitude,
        'timezone': timezone,
        'updatedAt': DateTime.now().toIso8601String(),
      };

  factory UserModel.fromFirestore(Map<String, dynamic> data, {String? id}) => UserModel(
        uid: id ?? data['uid'] as String? ?? '',
        email: data['email'] as String? ?? '',
        displayName: data['displayName'] as String? ?? '',
        photoUrl: data['photoUrl'] as String?,
        birthYear: data['birthYear'] as int?,
        birthMonth: data['birthMonth'] as int?,
        birthDate: data['birthDate'] as int?,
        birthHour: data['birthHour'] as int?,
        birthMinute: data['birthMinute'] as int?,
        birthCity: data['birthCity'] as String?,
        birthCountry: data['birthCountry'] as String?,
        latitude: (data['latitude'] as num?)?.toDouble(),
        longitude: (data['longitude'] as num?)?.toDouble(),
        timezone: (data['timezone'] as num?)?.toDouble(),
      );
}
