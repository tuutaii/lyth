// ============================================================
// LYTH — Admin Prefetch Screen
// Màn hình ẩn chỉ dành cho admin để batch-generate 30 ngày.
// Truy cập: Cài đặt → nhấn giữ logo LYTH 3 giây
// ============================================================

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../services/admin_prefetch_service.dart';

class AdminPrefetchScreen extends StatefulWidget {
  const AdminPrefetchScreen({super.key});

  @override
  State<AdminPrefetchScreen> createState() => _AdminPrefetchScreenState();
}

class _AdminPrefetchScreenState extends State<AdminPrefetchScreen> {
  final _service = AdminPrefetchService();

  bool _isRunning = false;
  int _current = 0;
  int _total = 30;
  String _currentDateKey = '';
  final List<String> _log = [];
  PrefetchResult? _result;

  Future<void> _startPrefetch() async {
    if (_isRunning) return;
    setState(() {
      _isRunning = true;
      _current = 0;
      _log.clear();
      _result = null;
      _currentDateKey = '';
    });

    final result = await _service.prefetchDays(
      daysAhead: 30,
      skipExisting: true,
      onProgress: (current, total, dateKey) {
        if (mounted) {
          setState(() {
            _current = current;
            _total = total;
            _currentDateKey = dateKey;
            _log.add('🔄 [$current/$total] Đang xử lý $dateKey...');
          });
        }
      },
      onError: (dateKey, error) {
        if (mounted) {
          setState(() {
            _log.add('❌ $dateKey: $error');
          });
        }
      },
    );

    if (mounted) {
      setState(() {
        _isRunning = false;
        _result = result;
        _log.add('');
        _log.add('─────────────────────────');
        _log.add(result.toString());
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: Column(
          children: [
            Text(
              'ADMIN',
              style: AppTextStyles.titleSmall.copyWith(
                color: AppColors.goldDeep,
                letterSpacing: 4,
              ),
            ),
            Text(
              'Daily Message Prefetch',
              style: AppTextStyles.bodySmall.copyWith(color: AppColors.textMuted),
            ),
          ],
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: AppColors.textPrimary),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Info Card ──────────────────────────────────────
            _infoCard(),
            const SizedBox(height: AppSpacing.lg),

            // ── Progress ───────────────────────────────────────
            if (_isRunning || _result != null) ...[
              _progressSection(),
              const SizedBox(height: AppSpacing.lg),
            ],

            // ── Start Button ───────────────────────────────────
            _startButton(),
            const SizedBox(height: AppSpacing.xl),

            // ── Log output ─────────────────────────────────────
            if (_log.isNotEmpty) ...[
              Text(
                'LOG',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.goldDeep,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Expanded(child: _logView()),
            ],
          ],
        ),
      ),
    );
  }

  Widget _infoCard() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(AppRadius.xl),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.info_outline_rounded, color: AppColors.goldDeep, size: 16),
              const SizedBox(width: 8),
              Text(
                'Hướng dẫn',
                style: AppTextStyles.titleSmall.copyWith(
                  color: AppColors.textPrimary,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            '1. Nhấn "Bắt đầu" để gọi API cho 30 ngày tới.\n'
            '2. Delay 3 giây giữa mỗi ngày để tránh rate-limit (429).\n'
            '3. Các ngày đã có data sẽ tự động bỏ qua.\n'
            '4. Kết quả lưu Firestore với source = "auto".\n'
            '5. Vào Firebase Console để chỉnh sửa thủ công.',
            style: AppTextStyles.bodySmall.copyWith(height: 1.7),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Thời gian ước tính: ~${(30 * 3 / 60).ceil()} phút',
            style: AppTextStyles.caption.copyWith(
              color: AppColors.goldDeep,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _progressSection() {
    final progress = _total > 0 ? _current / _total : 0.0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              _isRunning ? 'Đang xử lý...' : 'Hoàn tất!',
              style: AppTextStyles.bodyMedium.copyWith(
                color: _isRunning ? AppColors.textPrimary : AppColors.sageMoss,
                fontWeight: FontWeight.w600,
              ),
            ),
            Text(
              '$_current / $_total',
              style: AppTextStyles.bodySmall,
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(AppRadius.full),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: AppColors.divider,
            color: AppColors.goldAccent,
            minHeight: 6,
          ),
        ),
        if (_isRunning && _currentDateKey.isNotEmpty) ...[
          const SizedBox(height: 6),
          Text(
            _currentDateKey,
            style: AppTextStyles.caption.copyWith(color: AppColors.textMuted),
          ),
        ],
        if (_result != null) ...[
          const SizedBox(height: 12),
          Row(
            children: [
              _resultChip('✅ ${_result!.successCount}', AppColors.sageMoss),
              const SizedBox(width: 8),
              _resultChip('⏭️ ${_result!.skipCount}', AppColors.earthBrown),
              const SizedBox(width: 8),
              _resultChip('❌ ${_result!.errorCount}', const Color(0xFFD97B6C)),
            ],
          ),
        ],
      ],
    );
  }

  Widget _resultChip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(AppRadius.full),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(label, style: AppTextStyles.caption.copyWith(color: color)),
    );
  }

  Widget _startButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isRunning ? null : _startPrefetch,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.goldAccent,
          disabledBackgroundColor: AppColors.earthTaupe,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.xl),
          ),
          elevation: 0,
        ),
        child: _isRunning
            ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Đang chạy... ($_current/$_total)',
                    style: GoogleFonts.montserrat(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              )
            : Text(
                _result != null ? 'Chạy lại' : 'Bắt đầu Prefetch 30 ngày',
                style: GoogleFonts.montserrat(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
      ),
    );
  }

  Widget _logView() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      padding: const EdgeInsets.all(AppSpacing.md),
      child: ListView.builder(
        itemCount: _log.length,
        reverse: false,
        itemBuilder: (context, i) => Text(
          _log[i],
          style: GoogleFonts.jetBrainsMono(
            fontSize: 11,
            color: _log[i].startsWith('❌')
                ? const Color(0xFFFF6B6B)
                : _log[i].startsWith('✅')
                    ? const Color(0xFF8BC34A)
                    : _log[i].startsWith('─')
                        ? const Color(0xFF666666)
                        : const Color(0xFFCCCCCC),
          ),
        ),
      ),
    );
  }
}
