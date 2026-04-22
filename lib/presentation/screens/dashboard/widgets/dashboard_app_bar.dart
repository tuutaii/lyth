import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

class DashboardAppBar extends StatelessWidget implements PreferredSizeWidget {
  final double opacity;

  const DashboardAppBar({super.key, required this.opacity});

  @override
  Widget build(BuildContext context) {
    const h = kToolbarHeight + 40;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      height: h,
      padding: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: AppColors.background.withValues(alpha: opacity),
        border: Border(
            bottom: BorderSide(
                color: AppColors.divider.withValues(alpha: opacity * 0.5),
                width: 0.5)),
      ),
      alignment: Alignment.bottomCenter,
      child: Text(
        AppStrings.appTitle,
        style: GoogleFonts.philosopher(
          letterSpacing: 12,
          fontWeight: FontWeight.w600,
          fontSize: 20,
          color: AppColors.goldDeep,
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 40);
}
