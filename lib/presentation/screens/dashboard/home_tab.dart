import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:shimmer/shimmer.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';
import 'package:lyth_astrology/data/models/astro_models.dart';
import 'package:lyth_astrology/presentation/blocs/dashboard/dashboard_bloc.dart';
import 'package:lyth_astrology/presentation/blocs/dashboard/dashboard_event.dart';
import 'package:lyth_astrology/presentation/blocs/dashboard/dashboard_state.dart';

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
    return RefreshIndicator(
      onRefresh: () async {
        if (isLoading) {
          debugPrint('');
        }
        final bloc = context.read<DashboardBloc>();
        bloc.add(const DashboardRefreshRequested());
        // Chờ cho đến khi state không còn là Loading nữa
        await bloc.stream.firstWhere((state) => state is! DashboardLoading);
      },
      color: AppColors.goldDeep,
      backgroundColor: AppColors.pureWhite.withValues(alpha: 0.9),
      displacement:
          160, // Hiển thị phía dưới AppBar và DateSelector (tổng cộng ~140px)
      child: CustomScrollView(
        controller: scrollController,
        physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics()),
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
      ),
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
                child: _buildGlassCard(
                  AppStrings.dos,
                  profile.adviceDos,
                  Icons.star_border_purple500_rounded,
                  AppColors.sageMoss,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildGlassCard(
                  AppStrings.donts,
                  profile.adviceDonts,
                  Icons.info_outline_rounded,
                  AppColors.earthTaupe,
                ),
              ),
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
                  color: AppColors.pureWhite,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2.5,
                      fontSize: 11)),
            ),
            const Spacer(),
            Text(
              AppStrings.from,
              style: GoogleFonts.montserrat(
                fontSize: 8,
                letterSpacing: 2,
                color: AppColors.textMuted,
              ),
            ),
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
        color: AppColors.pureWhite.withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(28),
        border:
            Border.all(color: AppColors.pureWhite.withValues(alpha: 0.6), width: 1.5),
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
    LuckyColorInfo luckyInfo;

    // Ưu tiên lấy từ Firebase nếu có
    if (profile.luckyColorHex.isNotEmpty && profile.luckyColorName.isNotEmpty) {
      Color firebaseColor;
      try {
        final hex = profile.luckyColorHex.replaceAll('#', '');
        firebaseColor = Color(int.parse('FF$hex', radix: 16));
      } catch (e) {
        firebaseColor = AppColors.goldDeep; // Fallback nếu mã màu sai
      }

      luckyInfo = LuckyColorInfo(
        profile.luckyColorName,
        firebaseColor,
        profile.luckyColorMeaning.isNotEmpty
            ? profile.luckyColorMeaning
            : AppStrings.defaultLuckyMeaning,
      );
    } else {
      // Dùng logic tự động dựa trên Moon Sign
      luckyInfo = profile.moonSign.luckyColorInfo;
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
            child:
                const Icon(Icons.auto_awesome, color: AppColors.pureWhite, size: 20),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppStrings.luckyColor,
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

  Widget _buildShimmerContent() {
    return Shimmer.fromColors(
      baseColor: AppColors.shimmerBase,
      highlightColor: AppColors.shimmerHighlight,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(width: 80, height: 12, color: AppColors.pureWhite),
          const SizedBox(height: 16),
          Container(width: 250, height: 32, color: AppColors.pureWhite),
          const SizedBox(height: 24),
          Container(width: double.infinity, height: 100, color: AppColors.pureWhite),
        ],
      ),
    );
  }
}
