import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shimmer/shimmer.dart';
import '../../theme/app_theme.dart';
import '../../models/astro_models.dart';

class HomeTab extends StatelessWidget {
  final UserAstroProfile profile;
  final bool isLoading;
  final ScrollController scrollController;
  final Animation<double> contentFadeAnimation;

  const HomeTab({
    super.key,
    required this.profile,
    required this.isLoading,
    required this.scrollController,
    required this.contentFadeAnimation,
  });

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      controller: scrollController,
      physics: const BouncingScrollPhysics(),
      slivers: [
        const SliverToBoxAdapter(
            child: SizedBox(
                height: 140)), // Khoảng không phía dưới AppBar/DateSelector
        SliverToBoxAdapter(
          child: FadeTransition(
            opacity: contentFadeAnimation,
            child: _buildDailyInsightSection(profile, isLoading),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 120)),
      ],
    );
  }

  Widget _buildDailyInsightSection(UserAstroProfile profile, bool isLoading) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isLoading)
            _buildShimmerContent()
          else
            _buildInsightHeader(profile),
          const SizedBox(height: 48),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                  child: _buildGlassCard('KHUYÊN DÙNG', profile.adviceDos,
                      Icons.star_border_purple500_rounded, AppColors.sageMoss)),
              const SizedBox(width: 16),
              Expanded(
                  child: _buildGlassCard('LƯU Ý ĐỪNG', profile.adviceDonts,
                      Icons.info_outline_rounded, AppColors.earthTaupe)),
            ],
          ),
          const SizedBox(height: 28),
          _buildLuckyColorCard(profile),
          const SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _buildInsightHeader(UserAstroProfile profile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 20),
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [
                  AppColors.goldDeep,
                  AppColors.goldAccent.withValues(alpha: 0.8)
                ]),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(profile.dailyInsightCategory.toUpperCase(),
                  style: GoogleFonts.cormorantGaramond(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2.5,
                      fontSize: 11)),
            ),
            const Spacer(),
            Text('FROM TUTAI',
                style: GoogleFonts.montserrat(
                    fontSize: 8, letterSpacing: 2, color: AppColors.textMuted)),
          ],
        ),
        const SizedBox(height: 24),
        Text(profile.dailyInsightHeader,
            style: GoogleFonts.philosopher(
                fontSize: 30,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
                height: 1.1)),
        const SizedBox(height: 40),
        Stack(
          children: [
            Positioned(
              bottom: -10,
              right: 0,
              child: Transform.rotate(
                angle: 3.14159, // Xoay ngược lại để làm dấu đóng ngoặc
                child: Icon(
                  Icons.format_quote_rounded,
                  size: 60,
                  color: AppColors.goldDeep.withValues(alpha: 0.1),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.only(left: 20),
              decoration: const BoxDecoration(
                  border: Border(
                      left: BorderSide(color: AppColors.goldDeep, width: 2))),
              child: Text(profile.dailyInsightBody,
                  style: GoogleFonts.philosopher(
                      fontSize: 17,
                      fontStyle: FontStyle.italic,
                      color: AppColors.textPrimary.withValues(alpha: 0.8),
                      height: 1.8)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildGlassCard(
      String title, List<String> items, IconData icon, Color accentColor) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(28),
        border:
            Border.all(color: Colors.white.withValues(alpha: 0.6), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: accentColor),
              const SizedBox(width: 8),
              Text(title,
                  style: GoogleFonts.montserrat(
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.0,
                      color: accentColor)),
            ],
          ),
          const SizedBox(height: 16),
          ...items.take(3).map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text('• $item',
                    style: GoogleFonts.cormorantGaramond(
                        fontSize: 15,
                        height: 1.2,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textPrimary)),
              )),
        ],
      ),
    );
  }

  Widget _buildLuckyColorCard(UserAstroProfile profile) {
    _LuckyColorInfo luckyInfo;
    
    // Ưu tiên lấy từ Firebase nếu có
    if (profile.luckyColorHex.isNotEmpty && profile.luckyColorName.isNotEmpty) {
      Color firebaseColor;
      try {
        final hex = profile.luckyColorHex.replaceAll('#', '');
        firebaseColor = Color(int.parse('FF$hex', radix: 16));
      } catch (e) {
        firebaseColor = AppColors.goldDeep; // Fallback nếu mã màu sai
      }
      
      luckyInfo = _LuckyColorInfo(
        profile.luckyColorName,
        firebaseColor,
        profile.luckyColorMeaning.isNotEmpty 
            ? profile.luckyColorMeaning 
            : 'Sắc màu mang lại năng lượng tích cực cho riêng em hôm nay.',
      );
    } else {
      // Dùng logic tự động dựa trên Moon Sign
      luckyInfo = _getLuckyColorInfo(profile.moonSign);
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      decoration: BoxDecoration(
        color: luckyInfo.color.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: luckyInfo.color.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: luckyInfo.color,
              boxShadow: [
                BoxShadow(
                  color: luckyInfo.color.withValues(alpha: 0.4),
                  blurRadius: 15,
                  spreadRadius: 2,
                )
              ],
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'SẮC MÀU MAY MẮN',
                  style: GoogleFonts.philosopher(
                      fontSize: 10,
                      letterSpacing: 2,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textMuted),
                ),
                const SizedBox(height: 4),
                Text(
                  luckyInfo.name,
                  style: GoogleFonts.philosopher(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary),
                ),
                Text(
                  luckyInfo.meaning,
                  style: GoogleFonts.philosopher(
                      fontSize: 12,
                      fontStyle: FontStyle.italic,
                      color: AppColors.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  _LuckyColorInfo _getLuckyColorInfo(ZodiacSign sign) {
    switch (sign) {
      case ZodiacSign.aries:
        return _LuckyColorInfo('Đỏ Hỏa Tinh', const Color(0xFFE53935), 'Khơi dậy đam mê và lòng can đảm.');
      case ZodiacSign.taurus:
        return _LuckyColorInfo('Xanh Lục Bảo', const Color(0xFF43A047), 'Sự ổn định, bình an và thịnh vượng.');
      case ZodiacSign.gemini:
        return _LuckyColorInfo('Vàng Ánh Dương', const Color(0xFFFFD600), 'Sự tươi mới và kết nối giao tiếp.');
      case ZodiacSign.cancer:
        return _LuckyColorInfo('Bạc Ánh Trăng', const Color(0xFFB0BEC5), 'Trực giác nhạy bén và sự vỗ về.');
      case ZodiacSign.leo:
        return _LuckyColorInfo('Vàng Hoàng Kim', const Color(0xFFFBC02D), 'Sự tự tin và tỏa sáng rực rỡ.');
      case ZodiacSign.virgo:
        return _LuckyColorInfo('Nâu Đất Ấm', const Color(0xFFA1887F), 'Sự tỉ mỉ, thấu đáo và thuần khiết.');
      case ZodiacSign.libra:
        return _LuckyColorInfo('Hồng Phấn', const Color(0xFFF48FB1), 'Sự cân bằng, duyên dáng và tình yêu.');
      case ZodiacSign.scorpio:
        return _LuckyColorInfo('Đỏ Rượu Vang', const Color(0xFF880E4F), 'Sức mạnh từ nội tâm và sự bí ẩn.');
      case ZodiacSign.sagittarius:
        return _LuckyColorInfo('Tím Hoàng Gia', const Color(0xFF7B1FA2), 'Tư duy phóng khoáng và sự tự do.');
      case ZodiacSign.capricorn:
        return _LuckyColorInfo('Xanh Than Biển', const Color(0xFF1A237E), 'Kỷ luật, kiên định và thành công.');
      case ZodiacSign.aquarius:
        return _LuckyColorInfo('Xanh Thiên Thanh', const Color(0xFF00B8D4), 'Ý tưởng độc bản và sự bứt phá.');
      case ZodiacSign.pisces:
        return _LuckyColorInfo('Tím Oải Hương', const Color(0xFFB39DDB), 'Sự chữa lành và những giấc mơ.');
    }
  }

  Widget _buildShimmerContent() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(width: 80, height: 12, color: Colors.white),
          const SizedBox(height: 16),
          Container(width: 250, height: 32, color: Colors.white),
          const SizedBox(height: 24),
          Container(width: double.infinity, height: 100, color: Colors.white),
        ],
      ),
    );
  }
}

class _LuckyColorInfo {
  final String name;
  final Color color;
  final String meaning;
  _LuckyColorInfo(this.name, this.color, this.meaning);
}
