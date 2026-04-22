import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/natal_data.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

class LoveTab extends StatelessWidget {
  final ScrollController? scrollController;

  const LoveTab({super.key, this.scrollController});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final fontScale = (size.width / 375).clamp(0.85, 1.1);

    return SingleChildScrollView(
      controller: scrollController,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(24, 100, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            'HÀNH TRÌNH LINH HỒN',
            style: GoogleFonts.philosopher(
              fontSize: 12 * fontScale,
              letterSpacing: 4,
              fontWeight: FontWeight.bold,
              color: AppColors.goldDeep,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Chiều Sâu Cảm Xúc',
            textAlign: TextAlign.center,
            style: GoogleFonts.philosopher(
              fontSize: 28 * fontScale,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Container(width: 40, height: 1.5, color: AppColors.divider),
          const SizedBox(height: 24),
          Text(
            'Những góc chiếu đặc biệt và các điểm nút hoàng đạo tiết lộ bài học nghiệp quả và định hướng phát triển sâu thẳm bên trong em.',
            textAlign: TextAlign.center,
            style: GoogleFonts.cormorantGaramond(
              fontSize: 16 * fontScale,
              color: AppColors.textSecondary,
              height: 1.5,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: 40),
          ...NatalData.soulJourney
              .map((journey) => _buildJourneyCard(journey, fontScale)),
        ],
      ),
    );
  }

  Widget _buildJourneyCard(Map<String, dynamic> journey, double scale) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 24),
      padding: EdgeInsets.all(28 * scale),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: AppColors.divider.withValues(alpha: 0.5)),
        boxShadow: AppShadows.cardSoft,
      ),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(16 * scale),
            decoration: const BoxDecoration(
              color: AppColors.surfaceSubtle,
              shape: BoxShape.circle,
            ),
            child: Text(
              journey['icon'] as String,
              style: TextStyle(fontSize: 32 * scale),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            journey['subtitle'] as String,
            style: GoogleFonts.montserrat(
              fontSize: 10 * scale,
              letterSpacing: 3,
              fontWeight: FontWeight.bold,
              color: AppColors.goldDeep,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            journey['title'] as String,
            textAlign: TextAlign.center,
            style: GoogleFonts.philosopher(
              fontSize: 22 * scale,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            journey['content'] as String,
            textAlign: TextAlign.center,
            style: GoogleFonts.cormorantGaramond(
              fontSize: 17 * scale,
              height: 1.6,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
