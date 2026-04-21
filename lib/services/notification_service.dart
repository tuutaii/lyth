import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz_data;
import 'package:flutter/foundation.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'firestore_service.dart';
import '../models/daily_message.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  // GIỜ THÔNG BÁO MẶC ĐỊNH (Cậu có thể sửa ở đây để test)
  static const int notificationHour = 8;
  static const int notificationMinute = 0;

  Future<void> init() async {
    tz_data.initializeTimeZones();
    try {
      final timeZone = await FlutterTimezone.getLocalTimezone();
      final String timeZoneName = timeZone.identifier;
      debugPrint('NotificationService: Detected TimeZone: $timeZoneName');
      tz.setLocalLocation(tz.getLocation(timeZoneName));
      debugPrint(
          'NotificationService: tz.local is now set to: ${tz.local.name}');
    } catch (e) {
      debugPrint('NotificationService: ERROR getting local timezone: $e');
      // Fallback cho Việt Nam nếu lỗi
      tz.setLocalLocation(tz.getLocation('Asia/Ho_Chi_Minh'));
      debugPrint('NotificationService: Fallback to Asia/Ho_Chi_Minh');
    }

    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsDarwin =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initializationSettings =
        InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsDarwin,
    );

    await _notificationsPlugin.initialize(
      settings: initializationSettings,
      onDidReceiveNotificationResponse: (details) {
        debugPrint('Notification clicked: ${details.payload}');
      },
    );
    debugPrint('NotificationService: Initialized successfully');
    debugPrint('NotificationService: Current TimeZone: ${tz.local.name}');

    // Xin quyền cho iOS
    await requestPermissions();
  }

  Future<void> requestPermissions() async {
    final bool? result = await _notificationsPlugin
        .resolvePlatformSpecificImplementation<
            IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );
    debugPrint('NotificationService: iOS Permission granted: $result');
  }

  Future<void> scheduleDailyNotification() async {
    final scheduledDate =
        _nextInstanceOfTime(notificationHour, notificationMinute);
    final dateKey = DailyMessage.keyFromDate(scheduledDate);

    // Lấy nội dung từ Firebase
    String messageHeader = 'Thông điệp của em hôm nay';
    String messageBody =
        'Thông điệp tình yêu hôm nay đã sẵn sàng rồi nè. Vào xem nhé!';

    try {
      final dailyMessage = await FirestoreService().getDailyMessage(dateKey);
      if (dailyMessage != null && dailyMessage.header.isNotEmpty) {
        messageBody = dailyMessage.header;
      }
    } catch (e) {
      debugPrint(
          'NotificationService: Error fetching daily message for $dateKey: $e');
    }

    await _notificationsPlugin.zonedSchedule(
      id: 0,
      title: messageHeader,
      body: messageBody,
      scheduledDate: scheduledDate,
      notificationDetails: const NotificationDetails(
        android: AndroidNotificationDetails(
          'daily_astrology',
          'Thông báo hàng ngày',
          channelDescription: 'Nhắc nhở xem lá số buổi sáng',
          importance: Importance.max,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      matchDateTimeComponents: DateTimeComponents.time,
    );
    debugPrint(
        'NotificationService: Daily notification scheduled for $scheduledDate with content: $messageBody');
  }

  tz.TZDateTime _nextInstanceOfTime(int hour, int minute) {
    final tz.TZDateTime now = tz.TZDateTime.now(tz.local);
    tz.TZDateTime scheduledDate =
        tz.TZDateTime(tz.local, now.year, now.month, now.day, hour, minute);
    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }
    return scheduledDate;
  }

  // Hàm để cậu test nhanh thông báo (gửi sau 5 giây)
  Future<void> testNotification() async {
    final scheduledTime =
        tz.TZDateTime.now(tz.local).add(const Duration(seconds: 5));
    final dateKey = DailyMessage.todayKey;
    
    debugPrint('NotificationService: Scheduling test notification at $scheduledTime');
    
    // Lấy nội dung thực tế từ Firebase
    String messageHeader = 'Test Thông Báo Realtime ⚡';
    String messageBody = 'Đang lấy dữ liệu từ Firebase...';
    
    try {
      final dailyMessage = await FirestoreService().getTodayMessage();
      if (dailyMessage != null && dailyMessage.header.isNotEmpty) {
        messageHeader = 'Thông điệp (Test) 🌙';
        messageBody = dailyMessage.header;
      } else {
        messageBody = 'Không tìm thấy thông điệp cho ngày $dateKey trên Firebase.';
      }
    } catch (e) {
      messageBody = 'Lỗi Firebase: $e';
    }

    try {
      await _notificationsPlugin.zonedSchedule(
        id: 99,
        title: messageHeader,
        body: messageBody,
        scheduledDate: scheduledTime,
        notificationDetails: const NotificationDetails(
          android: AndroidNotificationDetails(
            'test_channel',
            'Test Channel',
            importance: Importance.max,
            priority: Priority.high,
          ),
          iOS: DarwinNotificationDetails(
            presentAlert: true,
            presentBadge: true,
            presentSound: true,
          ),
        ),
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      );
      debugPrint('NotificationService: Test notification scheduled with content: $messageBody');
    } catch (e) {
      debugPrint('NotificationService: ERROR scheduling notification: $e');
    }
  }
}
