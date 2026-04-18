// ============================================================
// Lyth Astrology — Main Entry Point
// ============================================================

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/birth_info_screen.dart';
import 'models/user_model.dart';
import 'services/auth_service.dart';
import 'services/firestore_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // Tạo tài khoản mẫu Ngọc Lý nếu chưa tồn tại
  await AuthService().ensureDefaultUserExists();

  runApp(const LythApp());
}

class LythApp extends StatelessWidget {
  const LythApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Lyth Astrology',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const AuthGate(),
    );
  }
}

/// AuthGate — Theo dõi trạng thái đăng nhập
/// → Đã login: DashboardScreen
/// → Chưa login: LoginScreen
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const _SplashScreen();
        }

        final user = snapshot.data;
        if (user != null) {
          return StreamBuilder<UserModel?>(
            stream: FirestoreService().userStream(user.uid),
            builder: (context, userSnapshot) {
              if (userSnapshot.connectionState == ConnectionState.waiting) {
                return const _SplashScreen();
              }

              final userModel = userSnapshot.data;
              if (userModel != null && userModel.hasBirthInfo) {
                return const DashboardScreen();
              }

              // Nếu chưa có thông tin ngày sinh hoặc user model chưa tồn tại
              return BirthInfoScreen(
                user: userModel ?? UserModel(uid: user.uid, email: user.email ?? ''),
              );
            },
          );
        }

        return const LoginScreen();
      },
    );
  }
}

/// Splash screen trong lúc kiểm tra Auth
class _SplashScreen extends StatelessWidget {
  const _SplashScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFFF8F4EF),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '🌙',
              style: TextStyle(fontSize: 48),
            ),
            SizedBox(height: 16),
            CircularProgressIndicator(
              color: Color(0xFF5C5240),
              strokeWidth: 2.5,
            ),
          ],
        ),
      ),
    );
  }
}
