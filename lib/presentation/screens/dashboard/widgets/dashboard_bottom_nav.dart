import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

class DashboardBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const DashboardBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          color: AppColors.background,
          border: Border(
              top: BorderSide(
                  color: AppColors.divider.withValues(alpha: 0.5),
                  width: 0.5))),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            _buildNavItem(Icons.auto_awesome_mosaic_outlined, 'Trang chủ', 0),
            _buildNavItem(Icons.explore_outlined, 'Vũ trụ', 1),
            _buildNavItem(Icons.favorite_border_rounded, 'Yêu Thích', 2),
            _buildNavItem(Icons.person_outline_rounded, 'Cá nhân', 3),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final active = currentIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => onTap(index),
        behavior: HitTestBehavior.opaque,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon,
                  color: active ? AppColors.goldDeep : AppColors.textMuted,
                  size: 24),
              const SizedBox(height: 6),
              Text(label,
                  style: GoogleFonts.philosopher(
                      color: active ? AppColors.goldDeep : AppColors.textMuted,
                      fontSize: 10,
                      letterSpacing: 0.5,
                      fontWeight: active ? FontWeight.w600 : FontWeight.w400)),
            ],
          ),
        ),
      ),
    );
  }
}
