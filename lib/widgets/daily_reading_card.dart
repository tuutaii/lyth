import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/astro_models.dart';
import 'shared_widgets.dart';

// ─────────────────────────────────────────────
//  Daily Reading Card  (full-width, immersive)
// ─────────────────────────────────────────────

class DailyReadingCard extends StatefulWidget {
  final ZodiacSign sign;

  const DailyReadingCard({super.key, required this.sign});

  @override
  State<DailyReadingCard> createState() => _DailyReadingCardState();
}

class _DailyReadingCardState extends State<DailyReadingCard>
    with SingleTickerProviderStateMixin {
  bool _expanded = false;
  late AnimationController _controller;
  late Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _fade = CurvedAnimation(parent: _controller, curve: Curves.easeIn);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() => _expanded = !_expanded);
    if (_expanded) {
      _controller.forward();
    } else {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SectionLabel(text: 'Thông điệp hôm nay'),
        const SizedBox(height: AppSpacing.md),
        AyCard(
          onTap: _toggle,
          padding: const EdgeInsets.all(AppSpacing.lg),
          color: AppColors.surfaceCard,
          border: Border.all(
            color: AppColors.goldAccent.withValues(alpha: 0.18),
            width: 1,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Text(
                    widget.sign.symbol,
                    style: const TextStyle(fontSize: 28),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Dành cho ${widget.sign.displayName}',
                          style: AppTextStyles.titleLarge,
                        ),
                        Text(
                          widget.sign.dateRange,
                          style: AppTextStyles.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  AnimatedRotation(
                    turns: _expanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 300),
                    child: const Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: AppSpacing.md),
              const Divider(color: AppColors.divider),
              const SizedBox(height: AppSpacing.md),

              // Short preview
              Text(
                'Hôm nay, ${widget.sign.displayName} được hỗ trợ bởi năng lượng '
                'của ${widget.sign.rulingPlanet}. Hãy chú ý đến những tín hiệu nhỏ '
                'trong cuộc sống — chúng mang thông điệp quan trọng...',
                style: AppTextStyles.bodyMedium,
                maxLines: _expanded ? null : 3,
                overflow: _expanded ? null : TextOverflow.ellipsis,
              ),

              // Expanded content
              if (_expanded) ...[
                const SizedBox(height: AppSpacing.md),
                FadeTransition(
                  opacity: _fade,
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _ReadingBlock(
                        title: '❤️  Tình cảm',
                        content:
                            'Venus đang ở gần Mặt Trời của bạn, tạo ra sự ấm áp và '
                            'cởi mở trong các mối quan hệ. Đây là lúc để nói ra những '
                            'điều bạn giữ trong lòng.',
                      ),
                      SizedBox(height: AppSpacing.md),
                      _ReadingBlock(
                        title: '🌿  Sự nghiệp',
                        content:
                            'Thổ Tinh đang tạo áp lực nhẹ lên cung nghề nghiệp của bạn. '
                            'Đây là lời nhắc nhở để xem xét lại kế hoạch dài hạn. '
                            'Sự kiên nhẫn là chìa khóa.',
                      ),
                      SizedBox(height: AppSpacing.md),
                      _ReadingBlock(
                        title: '✦  Tự thân',
                        content:
                            'Hãy dành thời gian để kết nối với bản thân hôm nay. '
                            'Một buổi đi bộ ngắn hoặc vài phút thiền định sẽ giúp '
                            'bạn trở lại trạng thái cân bằng.',
                      ),
                      SizedBox(height: AppSpacing.lg),
                      Center(child: GoldenDivider(width: 80)),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

class _ReadingBlock extends StatelessWidget {
  final String title;
  final String content;

  const _ReadingBlock({required this.title, required this.content});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated.withValues(alpha: 0.45),
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTextStyles.titleMedium.copyWith(fontSize: 13)),
          const SizedBox(height: AppSpacing.xs),
          Text(content, style: AppTextStyles.bodyMedium.copyWith(height: 1.65)),
        ],
      ),
    );
  }
}
