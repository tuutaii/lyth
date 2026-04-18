import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

// ─────────────────────────────────────────────
//  Shared Reusable Widgets
// ─────────────────────────────────────────────

/// Elevated card with soft shadow and rounded corners
class AyCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? color;
  final double? borderRadius;
  final VoidCallback? onTap;
  final List<BoxShadow>? shadow;
  final Border? border;

  const AyCard({
    super.key,
    required this.child,
    this.padding,
    this.color,
    this.borderRadius,
    this.onTap,
    this.shadow,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    final radius = borderRadius ?? AppRadius.lg;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: color ?? AppColors.surfaceCard,
          borderRadius: BorderRadius.circular(radius),
          boxShadow: shadow ?? AppShadows.cardSoft,
          border: border,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(radius),
          child: Padding(
            padding: padding ?? const EdgeInsets.all(AppSpacing.md),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// Section header label (uppercase, muted)
class SectionLabel extends StatelessWidget {
  final String text;
  final Widget? trailing;

  const SectionLabel({super.key, required this.text, this.trailing});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(text.toUpperCase(), style: AppTextStyles.titleSmall),
        if (trailing != null) trailing!,
      ],
    );
  }
}

/// Small pill / tag chip
class AyChip extends StatelessWidget {
  final String label;
  final Color? backgroundColor;
  final Color? textColor;
  final Widget? leading;

  const AyChip({
    super.key,
    required this.label,
    this.backgroundColor,
    this.textColor,
    this.leading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.earthBeige,
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (leading != null) ...[leading!, const SizedBox(width: 4)],
          Text(
            label,
            style: AppTextStyles.caption.copyWith(
              color: textColor ?? AppColors.textSecondary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

/// Thin decorative gold divider
class GoldenDivider extends StatelessWidget {
  final double width;

  const GoldenDivider({super.key, this.width = 48});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 1,
      width: width,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.goldAccent.withValues(alpha: 0),
            AppColors.goldAccent,
            AppColors.goldAccent.withValues(alpha: 0),
          ],
        ),
      ),
    );
  }
}

/// Animated score bar
class ScoreBar extends StatefulWidget {
  final double value; // 0.0 – 1.0
  final Color? color;
  final double height;

  const ScoreBar({
    super.key,
    required this.value,
    this.color,
    this.height = 4,
  });

  @override
  State<ScoreBar> createState() => _ScoreBarState();
}

class _ScoreBarState extends State<ScoreBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    );
    // Start animation after a short delay for visual drama
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final barColor = widget.color ?? AppColors.sageMoss;
    return AnimatedBuilder(
      animation: _animation,
      builder: (_, __) => LayoutBuilder(
        builder: (context, constraints) {
          final maxWidth = constraints.maxWidth;
          final fillWidth = maxWidth * widget.value * _animation.value;
          return Stack(
            children: [
              // Track
              Container(
                height: widget.height,
                width: maxWidth,
                decoration: BoxDecoration(
                  color: AppColors.borderSubtle,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
              ),
              // Fill
              AnimatedContainer(
                duration: Duration.zero,
                height: widget.height,
                width: fillWidth.clamp(0, maxWidth),
                decoration: BoxDecoration(
                  color: barColor,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  boxShadow: [
                    BoxShadow(
                      color: barColor.withValues(alpha: 0.3),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

/// Floating action button with subtle gold glow
class AyFloatingButton extends StatefulWidget {
  final IconData icon;
  final VoidCallback? onPressed;

  const AyFloatingButton({super.key, required this.icon, this.onPressed});

  @override
  State<AyFloatingButton> createState() => _AyFloatingButtonState();
}

class _AyFloatingButtonState extends State<AyFloatingButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pulse;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _pulse = Tween<double>(begin: 0.9, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _pulse,
      child: GestureDetector(
        onTap: widget.onPressed,
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const RadialGradient(
              colors: [AppColors.goldLight, AppColors.goldAccent],
            ),
            boxShadow: AppShadows.glowGold,
          ),
          child: Icon(widget.icon, color: AppColors.textPrimary, size: 22),
        ),
      ),
    );
  }
}
