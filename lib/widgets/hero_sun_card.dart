import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../theme/app_theme.dart';
import '../models/astro_models.dart';

// ─────────────────────────────────────────────
//  Hero Sun Card — Top section of dashboard
// ─────────────────────────────────────────────
class HeroSunCard extends StatefulWidget {
  final UserAstroProfile profile;

  const HeroSunCard({super.key, required this.profile});

  @override
  State<HeroSunCard> createState() => _HeroSunCardState();
}

class _HeroSunCardState extends State<HeroSunCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _rotateController;

  @override
  void initState() {
    super.initState();
    _rotateController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 40),
    )..repeat();
  }

  @override
  void dispose() {
    _rotateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sign = widget.profile.sunSign;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.xl,
        AppSpacing.lg,
        AppSpacing.lg,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            sign.elementColor.withValues(alpha: 0.9),
            AppColors.earthBeige.withValues(alpha: 0.6),
            AppColors.background,
          ],
          stops: const [0.0, 0.55, 1.0],
        ),
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(
          color: AppColors.goldAccent.withValues(alpha: 0.20),
          width: 1,
        ),
        boxShadow: AppShadows.cardMedium,
      ),
      child: Stack(
        children: [
          // Decorative rotating ring (background)
          Positioned(
            right: -20,
            top: -20,
            child: AnimatedBuilder(
              animation: _rotateController,
              builder: (_, child) => Transform.rotate(
                angle: _rotateController.value * 2 * math.pi,
                child: child,
              ),
              child: const _AstroRing(size: 140),
            ),
          ),
          // Content
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting + date
              Row(
                children: [
                  Text(
                    _greeting(),
                    style: AppTextStyles.labelMedium,
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Container(
                    width: 4,
                    height: 4,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.goldAccent,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Text(
                    _formattedDate(),
                    style: AppTextStyles.labelMedium,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.sm),

              // User name
              Text(
                widget.profile.name,
                style: AppTextStyles.displayMedium,
              ),

              const SizedBox(height: AppSpacing.md),

              // Sun sign badge
              Row(
                children: [
                  _SignBadge(
                    symbol: sign.symbol,
                    name: sign.displayName,
                    subtitle: 'Mặt Trời · ${sign.rulingPlanet}',
                    color: sign.elementColor,
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  _SignBadge(
                    symbol: widget.profile.moonSign.symbol,
                    name: widget.profile.moonSign.displayName,
                    subtitle: 'Mặt Trăng',
                    color: AppColors.waterLight,
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  _SignBadge(
                    symbol: widget.profile.risingSign.symbol,
                    name: widget.profile.risingSign.displayName,
                    subtitle: 'Mọc',
                    color: AppColors.airLight,
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.lg),
              const Divider(color: AppColors.divider, height: 1),
              const SizedBox(height: AppSpacing.md),

              // Daily mantra
              Text(
                widget.profile.dailyMantra,
                style: AppTextStyles.quote,
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 5)  return 'Khuya rồi nhé 🌙';
    if (hour < 12) return 'Chào buổi sáng ☀️';
    if (hour < 18) return 'Buổi chiều an lành 🌿';
    return 'Buổi tối nhẹ nhàng 🌙';
  }

  String _formattedDate() {
    final now = DateTime.now();
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
    ];
    return '${now.day} ${months[now.month - 1]}, ${now.year}';
  }
}

class _SignBadge extends StatelessWidget {
  final String symbol;
  final String name;
  final String subtitle;
  final Color color;

  const _SignBadge({
    required this.symbol,
    required this.name,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(
          color: AppColors.goldAccent.withValues(alpha: 0.25),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Text(symbol, style: const TextStyle(fontSize: 20)),
          const SizedBox(height: 2),
          Text(name, style: AppTextStyles.caption.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          )),
          Text(subtitle, style: AppTextStyles.caption),
        ],
      ),
    );
  }
}

/// Decorative thin-stroke rotating SVG-like ring
class _AstroRing extends StatelessWidget {
  final double size;

  const _AstroRing({required this.size});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: _RingPainter(),
    );
  }
}

class _RingPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    final paint = Paint()
      ..color = AppColors.goldAccent.withValues(alpha: 0.18)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // Outer ring
    canvas.drawCircle(center, radius - 4, paint);

    // Inner dashed ring
    paint.color = AppColors.goldAccent.withValues(alpha: 0.10);
    canvas.drawCircle(center, radius * 0.72, paint);

    // Tick marks
    paint
      ..color = AppColors.goldAccent.withValues(alpha: 0.30)
      ..strokeWidth = 1.0;

    for (var i = 0; i < 12; i++) {
      final angle = (i / 12) * 2 * math.pi - math.pi / 2;
      final outer = Offset(
        center.dx + (radius - 4) * math.cos(angle),
        center.dy + (radius - 4) * math.sin(angle),
      );
      final inner = Offset(
        center.dx + (radius - 12) * math.cos(angle),
        center.dy + (radius - 12) * math.sin(angle),
      );
      canvas.drawLine(inner, outer, paint);
    }
  }

  @override
  bool shouldRepaint(_) => false;
}
