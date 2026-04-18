import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/astro_models.dart';
import 'shared_widgets.dart';

// ─────────────────────────────────────────────
//  Daily Transits Section
// ─────────────────────────────────────────────

class DailyTransitsSection extends StatelessWidget {
  final List<DailyTransit> transits;

  const DailyTransitsSection({super.key, required this.transits});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionLabel(text: 'Giao hội hôm nay'),
        const SizedBox(height: AppSpacing.md),
        ...transits.asMap().entries.map(
          (e) => Padding(
            padding: EdgeInsets.only(
              bottom: e.key < transits.length - 1 ? AppSpacing.sm : 0,
            ),
            child: _TransitCard(transit: e.value),
          ),
        ),
      ],
    );
  }
}

class _TransitCard extends StatelessWidget {
  final DailyTransit transit;

  const _TransitCard({required this.transit});

  @override
  Widget build(BuildContext context) {
    final isGood = transit.isFavorable;
    final accentColor =
        isGood ? AppColors.sageMoss : AppColors.earthBrown;
    final bgColor =
        isGood ? AppColors.earthLight.withValues(alpha: 0.35) : AppColors.fireLight.withValues(alpha: 0.3);

    return AyCard(
      color: bgColor,
      padding: const EdgeInsets.all(AppSpacing.md),
      border: Border.all(
        color: accentColor.withValues(alpha: 0.20),
        width: 1,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Indicator dot
          Padding(
            padding: const EdgeInsets.only(top: 3),
            child: Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: accentColor,
                boxShadow: [
                  BoxShadow(
                    color: accentColor.withValues(alpha: 0.4),
                    blurRadius: 6,
                    spreadRadius: 1,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.md),

          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Planets + aspect
                Row(
                  children: [
                    Text(
                      transit.planetFrom,
                      style: AppTextStyles.titleMedium.copyWith(fontSize: 12),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Text(
                        '·',
                        style: TextStyle(color: accentColor, fontSize: 16),
                      ),
                    ),
                    Text(
                      transit.aspect,
                      style: AppTextStyles.titleMedium.copyWith(
                        fontSize: 12,
                        color: accentColor,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Text(
                        '·',
                        style: TextStyle(color: accentColor, fontSize: 16),
                      ),
                    ),
                    Text(
                      transit.planetTo,
                      style: AppTextStyles.titleMedium.copyWith(fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.xs),

                // Description
                Text(
                  transit.description,
                  style: AppTextStyles.bodyMedium.copyWith(height: 1.55),
                ),
              ],
            ),
          ),

          // Favorable icon
          const SizedBox(width: AppSpacing.sm),
          Icon(
            isGood ? Icons.expand_less_rounded : Icons.expand_more_rounded,
            color: accentColor,
            size: 18,
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
//  Moon Phase Visualizer
// ─────────────────────────────────────────────

class MoonPhaseCard extends StatelessWidget {
  const MoonPhaseCard({super.key});

  @override
  Widget build(BuildContext context) {
    // Fixed demo: Bán nguyệt tăng dần (Waxing Gibbous ~75%)
    const phase = 'Trăng Lồi Tăng';
    const phaseEn = 'Waxing Gibbous';
    const message =
        'Thời điểm lý tưởng để dồn sức và hoàn thiện — '
        'ánh trăng đang lớn dần, hãy để năng lượng của bạn cùng lớn.';

    return AyCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      color: AppColors.waterLight,
      border: const Border.fromBorderSide(
        BorderSide(
          color: AppColors.goldAccent,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          // Moon graphic
          const SizedBox(
            width: 72,
            height: 72,
            child: CustomPaint(painter: _MoonPainter(illumination: 0.75)),
          ),
          const SizedBox(width: AppSpacing.lg),

          // Text
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Pha Trăng'.toUpperCase(),
                  style: AppTextStyles.titleSmall,
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(phase, style: AppTextStyles.titleLarge),
                Text(
                  phaseEn,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.goldDeep,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(message, style: AppTextStyles.bodyMedium),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MoonPainter extends CustomPainter {
  final double illumination; // 0.0 – 1.0

  const _MoonPainter({required this.illumination});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 2;

    // Shadow (dark side)
    final shadowPaint = Paint()
      ..color = AppColors.dustyOlive.withValues(alpha: 0.25)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, shadowPaint);

    // Lit side (crescent/gibbous)
    final litPaint = Paint()
      ..color = AppColors.goldLight
      ..style = PaintingStyle.fill;

    final path = Path();
    final r = radius;
    // Waxing: right side lit
    final shadowX = r * (1 - illumination * 2).clamp(-1.0, 1.0);
    path.addOval(Rect.fromCircle(center: center, radius: r));

    // Clip with an oval shifted horizontally to simulate illumination
    final clipPath = Path();
    clipPath.addOval(Rect.fromCenter(
      center: Offset(center.dx - shadowX * 0.5, center.dy),
      width: r * 2 * illumination + r,
      height: r * 2,
    ));

    final litPath = Path.combine(PathOperation.intersect, path, clipPath);
    canvas.drawPath(litPath, litPaint);

    // Thin stroke
    final strokePaint = Paint()
      ..color = AppColors.goldAccent.withValues(alpha: 0.50)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    canvas.drawCircle(center, radius, strokePaint);
  }

  @override
  bool shouldRepaint(_) => false;
}
