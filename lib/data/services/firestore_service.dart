import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:lyth_astrology/data/models/user_model.dart';
import 'package:lyth_astrology/data/models/daily_message.dart';

class FirestoreService {
  static final FirestoreService _instance = FirestoreService._internal();
  factory FirestoreService() => _instance;
  FirestoreService._internal();

  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // ── Collection References ──────────────────────────────────

  CollectionReference<Map<String, dynamic>> get _usersRef =>
      _db.collection('users');

  CollectionReference<Map<String, dynamic>> get _dailyMessagesRef =>
      _db.collection('daily_messages');

  // ── Users ──────────────────────────────────────────────────

  Future<void> saveUser(UserModel user) async {
    try {
      if (user.uid.isEmpty) throw ArgumentError('User UID cannot be empty');
      await _usersRef.doc(user.uid).set(
            user.toFirestore(),
            SetOptions(merge: true),
          );
    } catch (e) {
      debugPrint('Error saving user: $e');
      rethrow;
    }
  }

  Future<UserModel?> getUser(String uid) async {
    if (uid.isEmpty) return null;
    try {
      final doc = await _usersRef.doc(uid).get();
      if (doc.exists && doc.data() != null) {
        return UserModel.fromFirestore(doc.data()!, id: doc.id);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting user: $e');
      rethrow;
    }
  }

  Stream<UserModel?> userStream(String uid) {
    if (uid.isEmpty) return Stream.value(null);
    return _usersRef.doc(uid).snapshots().map((doc) {
      if (doc.exists && doc.data() != null) {
        return UserModel.fromFirestore(doc.data()!, id: doc.id);
      }
      return null;
    });
  }

  Future<void> updateBirthInfo({
    required String uid,
    required int year,
    required int month,
    required int day,
    required int hour,
    required int minute,
    required String city,
    required double latitude,
    required double longitude,
    required double timezone,
  }) async {
    if (uid.isEmpty) return;
    try {
      await _usersRef.doc(uid).set({
        'birthYear': year,
        'birthMonth': month,
        'birthDate': day,
        'birthHour': hour,
        'birthMinute': minute,
        'birthCity': city,
        'latitude': latitude,
        'longitude': longitude,
        'timezone': timezone,
        'hasBirthInfo': true,
        'updatedAt': DateTime.now().toIso8601String(),
      }, SetOptions(merge: true));
    } catch (e) {
      debugPrint('Error updating birth info: $e');
      rethrow;
    }
  }

  // ── Daily Messages ─────────────────────────────────────────

  Future<DailyMessage?> getDailyMessage(String dateKey) async {
    if (dateKey.isEmpty) return null;
    try {
      final doc = await _dailyMessagesRef.doc(dateKey).get();
      if (doc.exists && doc.data() != null) {
        return DailyMessage.fromFirestore(dateKey, doc.data()!);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting daily message for $dateKey: $e');
      return null;
    }
  }

  Future<void> saveDailyMessage(DailyMessage message) async {
    try {
      await _dailyMessagesRef
          .doc(message.dateKey)
          .set(message.toFirestore(), SetOptions(merge: true));
      debugPrint('✅ Saved daily message for ${message.dateKey}');
    } catch (e) {
      debugPrint('Error saving daily message: $e');
      rethrow;
    }
  }

  Future<DailyMessage?> getTodayMessage() =>
      getDailyMessage(DailyMessage.todayKey);

  Stream<DailyMessage?> todayMessageStream() {
    return _dailyMessagesRef.doc(DailyMessage.todayKey).snapshots().map((doc) {
      if (doc.exists && doc.data() != null) {
        return DailyMessage.fromFirestore(DailyMessage.todayKey, doc.data()!);
      }
      return null;
    });
  }

  // ── User Specific Daily Insights (AI Generated) ──────────

  Future<Map<String, dynamic>?> getUserDailyInsight(
      String uid, String dateKey) async {
    if (uid.isEmpty || dateKey.isEmpty) {
      debugPrint('⚠️ Cannot get insight: uid or dateKey is empty');
      return null;
    }
    try {
      final doc = await _usersRef
          .doc(uid)
          .collection('daily_insights')
          .doc(dateKey)
          .get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (e) {
      debugPrint('Error getting user daily insight: $e');
      return null;
    }
  }
}
