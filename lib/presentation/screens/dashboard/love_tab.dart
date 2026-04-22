import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

class LoveTab extends StatelessWidget {
  const LoveTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.favorite_outline_rounded,
              size: 64, color: AppColors.earthTaupe),
          const SizedBox(height: 24),
          Text(AppStrings.loveTitle,
              style: GoogleFonts.philosopher(
                  fontSize: 18,
                  letterSpacing: 4,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary)),
          const SizedBox(height: 12),
          Text(AppStrings.loveComingSoon,
              style: GoogleFonts.cormorantGaramond(
                  fontSize: 16, color: AppColors.textMuted)),
        ],
      ),
    );
  }
}
