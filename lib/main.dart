// ============================================================
// Lyth Astrology — Main Entry Point
// ============================================================

import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:lyth_astrology/l10n/app_localizations.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';
import 'package:lyth_astrology/data/services/auth_service.dart';
import 'package:lyth_astrology/data/services/notification_service.dart';

import 'package:lyth_astrology/presentation/screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // Khởi tạo thông báo
  final notificationService = NotificationService();
  await notificationService.init();
  await notificationService.scheduleDailyNotification();

  // Tạo tài khoản mẫu Ngọc Lý nếu chưa tồn tại
  await AuthService().ensureDefaultUserExists();

  runApp(const LythApp());
}

class LythApp extends StatelessWidget {
  const LythApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Lyth',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en'),
        Locale('vi'),
      ],
      home: const SplashScreen(),
    );
  }
}
