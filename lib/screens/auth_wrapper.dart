import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/user_model.dart';
import '../services/firestore_service.dart';
import 'login_screen.dart';
import 'dashboard_screen.dart';
import 'birth_info_screen.dart';
import '../theme/app_theme.dart';

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  late Stream<User?> _authStateStream;
  Stream<UserModel?>? _userStream;
  String? _lastUid;

  @override
  void initState() {
    super.initState();
    _authStateStream = FirebaseAuth.instance.authStateChanges();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: _authStateStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            backgroundColor: AppColors.background,
            body: Center(
                child: CircularProgressIndicator(color: AppColors.goldDeep)),
          );
        }

        final user = snapshot.data;
        if (user != null) {
          // Chỉ tạo userStream mới nếu UID thay đổi
          if (_lastUid != user.uid) {
            _lastUid = user.uid;
            _userStream = FirestoreService().userStream(user.uid);
          }

          return StreamBuilder<UserModel?>(
            stream: _userStream,
            builder: (context, userSnapshot) {
              // Kiểm tra kỹ snapshot.hasData để tránh màn hình loading hiện lên vô ích khi reload
              if (userSnapshot.connectionState == ConnectionState.waiting && !userSnapshot.hasData) {
                return const Scaffold(
                  backgroundColor: AppColors.background,
                  body: Center(
                      child: CircularProgressIndicator(color: AppColors.goldDeep)),
                );
              }

              final userModel = userSnapshot.data;
              if (userModel != null && userModel.hasBirthInfo) {
                return const DashboardScreen();
              }

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
