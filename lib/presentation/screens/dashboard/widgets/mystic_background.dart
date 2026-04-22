import 'dart:math';
import 'package:flutter/material.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

class MysticBackground extends StatelessWidget {
  const MysticBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Hình nền AI tạo
        Positioned.fill(
          child: Opacity(
            opacity: 0.3,
            child: Image.asset(
              AppStrings.bgUrl,
              fit: BoxFit.cover,
            ),
          ),
        ),
        // Lớp phủ màu mờ ảo nhẹ nhàng từ AuraPainter
        Positioned.fill(
          child: CustomPaint(
            painter: AuraPainter(),
          ),
        ),
      ],
    );
  }
}

class AuraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final auraPaint = Paint()
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 80);

    canvas.drawCircle(
      Offset(size.width * 0.8, size.height * 0.1),
      size.width * 0.4,
      auraPaint..color = AppColors.goldDeep.withValues(alpha: 0.12),
    );

    canvas.drawCircle(
      Offset(size.width * 0.2, size.height * 0.7),
      size.width * 0.5,
      auraPaint..color = AppColors.sageMoss.withValues(alpha: 0.1),
    );

    final linePaint = Paint()
      ..color = AppColors.goldDeep.withValues(alpha: 0.25)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.4;

    final center = Offset(size.width * 0.5, size.height * 0.4);

    canvas.drawCircle(center, size.width * 0.8, linePaint);
    canvas.drawCircle(center, size.width * 0.78,
        linePaint..color = AppColors.goldDeep.withValues(alpha: 0.1));

    for (var i = 0; i < 24; i++) {
      final angle = (i * 15) * (3.14159 / 180);
      final isMainAxis = i % 6 == 0;
      final lengthMultiplier = isMainAxis ? 0.85 : 0.82;

      final start = Offset(
        center.dx + (size.width * 0.75) * cos(angle),
        center.dy + (size.width * 0.75) * sin(angle),
      );
      final end = Offset(
        center.dx + (size.width * lengthMultiplier) * cos(angle),
        center.dy + (size.width * lengthMultiplier) * sin(angle),
      );
      canvas.drawLine(
          start,
          end,
          linePaint
            ..color =
                AppColors.goldDeep.withValues(alpha: isMainAxis ? 0.2 : 0.1));
    }

    final starPaint = Paint()
      ..color = AppColors.goldDeep.withValues(alpha: 0.4);
    final stars = [
      Offset(size.width * 0.1, size.height * 0.15),
      Offset(size.width * 0.9, size.height * 0.3),
      Offset(size.width * 0.2, size.height * 0.8),
      Offset(size.width * 0.8, size.height * 0.9),
      Offset(size.width * 0.5, size.height * 0.05),
    ];

    for (var star in stars) {
      canvas.drawCircle(star, 1.5, starPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
