import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_theme.dart';

class SkyTab extends StatelessWidget {
  const SkyTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.auto_awesome_rounded,
              size: 64, color: AppColors.goldDeep),
          const SizedBox(height: 24),
          Text('BẢN ĐỒ BẦU TRỜI',
              style: GoogleFonts.philosopher(
                  fontSize: 18,
                  letterSpacing: 4,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary)),
          const SizedBox(height: 12),
          Text('Tính năng đang được vũ trụ giải mã...',
              style: GoogleFonts.cormorantGaramond(
                  fontSize: 16, color: AppColors.textMuted)),
        ],
      ),
    );
  }
}
