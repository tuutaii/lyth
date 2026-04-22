import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/natal_data.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

class SkyTab extends StatelessWidget {
  final ScrollController? scrollController;

  const SkyTab({super.key, this.scrollController});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final fontScale = (size.width / 375).clamp(0.85, 1.1);

    return SingleChildScrollView(
      controller: scrollController,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(24, 100, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Column(
              children: [
                Text(
                  'BẢN ĐỒ HÀNH TINH',
                  style: GoogleFonts.philosopher(
                    fontSize: 12 * fontScale,
                    letterSpacing: 4,
                    fontWeight: FontWeight.bold,
                    color: AppColors.goldDeep,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Dấu Ấn Năng Lượng',
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
                  'Mỗi hành tinh mang một nguồn năng lượng riêng, định hình tính cách và những khía cạnh khác nhau trong cuộc sống của em.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 16 * fontScale,
                    color: AppColors.textSecondary,
                    height: 1.5,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
          _buildDominantsSection(fontScale),
          const SizedBox(height: 48),
          ...NatalData.planets.values
              .map((planet) => _buildPlanetCard(planet, fontScale)),
        ],
      ),
    );
  }

  Widget _buildDominantsSection(double scale) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'NHÂN TỐ MẠNH',
          style: GoogleFonts.philosopher(
            fontSize: 14 * scale,
            letterSpacing: 3,
            fontWeight: FontWeight.bold,
            color: AppColors.goldDeep,
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 180 * scale,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: NatalData.strongFactors.length,
            itemBuilder: (context, index) {
              final factor = NatalData.strongFactors[index];
              return Container(
                width: 140 * scale,
                margin: const EdgeInsets.only(right: 16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surfaceSubtle,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                      color: AppColors.divider.withValues(alpha: 0.5)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      factor['name'] as String,
                      style: GoogleFonts.philosopher(
                        fontSize: 18 * scale,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      factor['rank'] as String,
                      style: TextStyle(
                          color: AppColors.goldDeep, fontSize: 12 * scale),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '${factor['score']}đ',
                      style: GoogleFonts.montserrat(
                        fontSize: 24 * scale,
                        fontWeight: FontWeight.bold,
                        color: AppColors.goldDeep,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 16),
        Text(
          '✦ Đây là những hành tinh có tầm ảnh hưởng lớn nhất đến bản sắc và năng lượng của em.',
          style: GoogleFonts.cormorantGaramond(
            fontSize: 16,
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.w600,
            color: AppColors.goldDeep.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }

  Widget _buildPlanetCard(Map<String, dynamic> planet, double scale) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: EdgeInsets.all(24 * scale),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.divider.withValues(alpha: 0.5)),
        boxShadow: AppShadows.cardSoft,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                planet['icon'] as String,
                style: TextStyle(fontSize: 28 * scale),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      planet['name'] as String,
                      style: GoogleFonts.philosopher(
                        fontSize: 20 * scale,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      planet['sign'] as String,
                      style: GoogleFonts.montserrat(
                        fontSize: 12 * scale,
                        letterSpacing: 2,
                        fontWeight: FontWeight.w600,
                        color: AppColors.goldDeep,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            planet['short_desc'] as String,
            style: GoogleFonts.cormorantGaramond(
              fontSize: 18 * scale,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            planet['detail'] as String,
            style: GoogleFonts.cormorantGaramond(
              fontSize: 16 * scale,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
