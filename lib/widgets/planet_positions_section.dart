import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/astro_models.dart';
import 'shared_widgets.dart';

// ─────────────────────────────────────────────
//  Planet Positions Section
//  Horizontal scrollable list of planet cards
// ─────────────────────────────────────────────

class PlanetPositionsSection extends StatelessWidget {
  final List<PlanetPosition> positions;

  const PlanetPositionsSection({super.key, required this.positions});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionLabel(text: 'Vị trí thiên thể'),
        const SizedBox(height: AppSpacing.md),
        SizedBox(
          height: 152,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 2),
            itemCount: positions.length,
            separatorBuilder: (_, __) =>
                const SizedBox(width: AppSpacing.sm),
            itemBuilder: (_, i) => _PlanetCard(position: positions[i]),
          ),
        ),
      ],
    );
  }
}

class _PlanetCard extends StatefulWidget {
  final PlanetPosition position;

  const _PlanetCard({required this.position});

  @override
  State<_PlanetCard> createState() => _PlanetCardState();
}

class _PlanetCardState extends State<_PlanetCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _hover;
  bool _hovering = false;

  @override
  void initState() {
    super.initState();
    _hover = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
  }

  @override
  void dispose() {
    _hover.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sign = widget.position.sign;
    return MouseRegion(
      onEnter: (_) {
        setState(() => _hovering = true);
        _hover.forward();
      },
      onExit: (_) {
        setState(() => _hovering = false);
        _hover.reverse();
      },
      child: AnimatedBuilder(
        animation: _hover,
        builder: (_, child) => Transform.translate(
          offset: Offset(0, -4 * _hover.value),
          child: child,
        ),
        child: AyCard(
          color: sign.elementColor.withValues(alpha: 0.40),
          padding: const EdgeInsets.all(AppSpacing.md),
          border: Border.all(
            color: _hovering
                ? AppColors.goldAccent.withValues(alpha: 0.4)
                : AppColors.goldAccent.withValues(alpha: 0.12),
            width: 1,
          ),
          child: SizedBox(
            width: 100,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Planet emoji + name
                Text(
                  widget.position.emoji,
                  style: const TextStyle(fontSize: 24),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  widget.position.planet,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textMuted,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 2),

                // Sign symbol + name
                Row(
                  children: [
                    Text(
                      sign.symbol,
                      style: AppTextStyles.titleMedium.copyWith(fontSize: 16),
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        sign.displayName,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),

                const Spacer(),

                // House + retrograde
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.goldLight.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(AppRadius.full),
                      ),
                      child: Text(
                        widget.position.house,
                        style: AppTextStyles.caption,
                      ),
                    ),
                    if (widget.position.isRetrograde) ...[
                      const SizedBox(width: 4),
                      Text(
                        'Rx',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.earthBrown,
                          fontWeight: FontWeight.w700,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
