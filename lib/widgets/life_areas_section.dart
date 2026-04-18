import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/astro_models.dart';
import 'shared_widgets.dart';

// ─────────────────────────────────────────────
//  Life Area Grid Section
//  6 cards showing scores per life domain
// ─────────────────────────────────────────────

class LifeAreasSection extends StatelessWidget {
  final List<LifeAreaScore> areas;

  const LifeAreasSection({super.key, required this.areas});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionLabel(
          text: 'Năng lượng hôm nay',
          trailing: Text(
            'Chi tiết →',
            style: AppTextStyles.caption.copyWith(
              color: AppColors.goldDeep,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: AppSpacing.sm,
            mainAxisSpacing: AppSpacing.sm,
            childAspectRatio: 2.0,
          ),
          itemCount: areas.length,
          itemBuilder: (_, i) => _LifeAreaTile(area: areas[i], index: i),
        ),
      ],
    );
  }
}

class _LifeAreaTile extends StatelessWidget {
  final LifeAreaScore area;
  final int index;

  const _LifeAreaTile({required this.area, required this.index});

  Color get _tileColor {
    final colors = [
      AppColors.fireLight,
      AppColors.earthLight,
      AppColors.airLight,
      AppColors.waterLight,
      AppColors.surfaceElevated,
      AppColors.sageMossLight,
    ];
    return colors[index % colors.length];
  }

  @override
  Widget build(BuildContext context) {
    final percent = (area.score * 100).round();
    return AyCard(
      color: _tileColor.withValues(alpha: 0.45),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm + 2,
      ),
      shadow: AppShadows.cardSoft,
      border: Border.all(
        color: AppColors.goldAccent.withValues(alpha: 0.12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Text(area.emoji, style: const TextStyle(fontSize: 16)),
              const SizedBox(width: AppSpacing.xs),
              Expanded(
                child: Text(
                  area.area,
                  style: AppTextStyles.titleMedium.copyWith(fontSize: 12),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                '$percent%',
                style: AppTextStyles.labelMedium.copyWith(
                  color: AppColors.goldDeep,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          ScoreBar(
            value: area.score,
            color: _barColor(area.score),
            height: 3,
          ),
          Text(
            area.shortInsight,
            style: AppTextStyles.bodySmall,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Color _barColor(double score) {
    if (score >= 0.8) return AppColors.sageMoss;
    if (score >= 0.6) return AppColors.goldAccent;
    return AppColors.earthBrown;
  }
}
