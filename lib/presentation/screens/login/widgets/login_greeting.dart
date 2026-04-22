import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';

class LoginGreeting extends StatelessWidget {
  const LoginGreeting({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Logo nhỏ
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: const Color(0xFF5C5240),
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF5C5240).withValues(alpha: 0.25),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: Text(
            AppStrings.logoLetter,
            style: GoogleFonts.lora(
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: const Color(0xFFF8F4EF),
            ),
          ),
        ),

        const SizedBox(height: 32),

        // Lời chào
        Text(
          AppStrings.loginGreeting,
          style: GoogleFonts.lora(
            fontSize: 30,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF2C2520),
            height: 1.2,
          ),
        ),

        const SizedBox(height: 12),

        Text(
          AppStrings.loginSubtitle,
          style: GoogleFonts.montserrat(
            fontSize: 15,
            color: const Color(0xFF7A6E63),
            height: 1.6,
            fontWeight: FontWeight.w400,
          ),
        ),

        const SizedBox(height: 28),

        // Ngày hôm nay
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFFEDE7DC),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                size: 13,
                color: Color(0xFF7A6E63),
              ),
              const SizedBox(width: 6),
              Text(
                _todayLabel(),
                style: GoogleFonts.montserrat(
                  fontSize: 12,
                  color: const Color(0xFF5C5240),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _todayLabel() {
    final now = DateTime.now();
    final wd = AppStrings.weekdays[now.weekday - 1];
    final m = AppStrings.months[now.month - 1];
    return '$wd, ${now.day} $m ${now.year}';
  }
}
