import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lottie/lottie.dart';
import '../theme/app_theme.dart';
import 'auth_wrapper.dart'; // Giả định bạn có AuthWrapper để điều hướng

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
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
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 250,
              height: 250,
              child: Lottie.asset(
                'assets/jsons/Zodiac sign.json',
                repeat: true,
                reverse: false,
                animate: true,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'LYTH',
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
    );
  }
}
