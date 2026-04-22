import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lottie/lottie.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';
import 'package:lyth_astrology/presentation/screens/auth_wrapper.dart';
import 'package:lyth_astrology/presentation/screens/login/widgets/login_background.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Sử dụng immersiveSticky để ẩn hoàn toàn các thanh hệ thống, ép ảnh tràn hết màn hình
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
    _navigateToNext();
  }

  void _navigateToNext() async {
    // Hiển thị splash trong 3 giây
    await Future.delayed(const Duration(milliseconds: 3000));
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const AuthWrapper()),
      );
    }
  }

  @override
  void dispose() {
    // Trả lại chế độ hiển thị bình thường khi thoát khỏi splash
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual,
        overlays: SystemUiOverlay.values);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(padding: EdgeInsets.zero),
      child: Material(
        color: Colors.white,
        child: Stack(
          children: [
            LoginBackground(size: MediaQuery.of(context).size),
            // Content
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 250,
                    height: 250,
                    child: Lottie.asset(
                      AppStrings.splashGiftUrl,
                      repeat: true,
                      reverse: false,
                      animate: true,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    AppStrings.appTitle,
                    style: GoogleFonts.philosopher(
                      letterSpacing: 10,
                      fontWeight: FontWeight.w600,
                      fontSize: 24,
                      color: AppColors.goldDeep,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
