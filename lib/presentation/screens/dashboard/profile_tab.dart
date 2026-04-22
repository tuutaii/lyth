import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';
import 'package:lyth_astrology/data/models/astro_models.dart';
import 'package:lyth_astrology/data/models/user_model.dart';
import 'package:lyth_astrology/data/services/auth_service.dart';
import 'package:lyth_astrology/data/services/notification_service.dart';

class ProfileTab extends StatelessWidget {
  final UserModel? user;
  final UserAstroProfile profile;
  final ScrollController? scrollController;

  const ProfileTab({
    super.key,
    required this.user,
    required this.profile,
    this.scrollController,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      controller: scrollController,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(0, 100, 0, 100),
      child: Column(
        children: [
          // 1. Dấu ấn cốt lõi (The Core)
          _buildSectionTitle(AppStrings.coreTitle, AppStrings.coreSubtitle),
          const SizedBox(height: 24),
          _buildCoreSignSection(profile),

          const SizedBox(height: 64),

          // 2. La bàn nội tâm (Psychological Insight)
          _buildSectionTitle(
              AppStrings.compassTitle, AppStrings.compassSubtitle),
          const SizedBox(height: 24),
          _buildInnerCompassSection(),

          const SizedBox(height: 64),

          // 3. Tọa độ bản mệnh (Technical Data)
          _buildTechnicalDataSection(
            user,
            () async {
              await NotificationService().testNotification();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(AppStrings.notifScheduledMsg),
                    backgroundColor: Color(0xFF5C5240),
                    duration: Duration(seconds: 2),
                  ),
                );
              }
            },
          ),

          // 4. Đăng xuất (Logout)
          const SizedBox(height: 40),
          _buildLogoutButton(context),

          const SizedBox(height: 64),

          // 5. Lời đề tặng (Dedication)
          _buildHeartfeltFooter(),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, String subtitle) {
    return Column(
      children: [
        Text(subtitle,
            style: GoogleFonts.philosopher(
                fontSize: 10,
                letterSpacing: 6,
                color: AppColors.goldDeep,
                fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(title,
            style: GoogleFonts.philosopher(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                color: AppColors.textPrimary)),
        const SizedBox(height: 16),
        Container(width: 40, height: 1.5, color: AppColors.divider),
      ],
    );
  }

  Widget _buildCoreSignSection(UserAstroProfile profile) {
    return Column(
      children: [
        _buildCoreCard(
            AppStrings.signSun,
            'KIM NGƯU',
            'TAURUS',
            '☀️',
            '"Sự kiên định là sức mạnh, nhưng cũng là cái lồng khiến bạn khó dịch chuyển. Em sinh ra để xây dựng những giá trị bền vững, không phải để loay hoay trong nỗi sợ thay đổi."',
            AppColors.fireLight),
        _buildCoreCard(
            AppStrings.signMoon,
            'BỌ CẠP',
            'SCORPIO',
            '🌙',
            '"Bề ngoài là sự bình tĩnh của Kim Ngưu, nhưng bên trong em là những cơn sóng ngầm dữ dội của Bọ Cạp. Em không cần sự công nhận từ bên ngoài, em cần sự thấu hiểu từ sâu thẳm."',
            AppColors.waterLight),
        _buildCoreCard(
            AppStrings.signRising,
            'CỰ GIẢI',
            'CANCER',
            '🌅',
            '"Cách thế giới nhìn em là sự dịu dàng và che chở, nhưng em chỉ mở lòng với những ai thực sự kiên trì."',
            AppColors.airLight),
      ],
    );
  }

  Widget _buildCoreCard(String label, String sign, String engSign, String emoji,
      String text, Color accent) {
    return Container(
      margin:
          const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: 12),
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: accent.withValues(alpha: 0.15)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 32)),
              const SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label,
                      style: GoogleFonts.montserrat(
                          fontSize: 9,
                          letterSpacing: 4,
                          fontWeight: FontWeight.bold,
                          color: accent)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text(sign,
                          style: GoogleFonts.philosopher(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary)),
                      Text(' / $engSign',
                          style: GoogleFonts.philosopher(
                              fontSize: 14, color: AppColors.textMuted)),
                    ],
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(text,
              style: GoogleFonts.cormorantGaramond(
                  fontSize: 20,
                  height: 1.4,
                  fontWeight: FontWeight.w600,
                  fontStyle: FontStyle.italic,
                  color: AppColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildInnerCompassSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      child: Column(
        children: [
          _buildInsightItem(AppStrings.energyTitle,
              'Bạn đang ở trong một hành trình học cách buông bỏ những thứ vốn đã mục nát.'),
          _buildInsightItem(AppStrings.weaknessTitle,
              'Bướng bỉnh là kẻ thù lớn nhất của lòng kiên trì. Đừng nhầm lẫn giữa việc giữ vững mục tiêu và việc cố chấp với quá khứ.'),
          _buildInsightItem(AppStrings.missionTitle,
              'Tìm kiếm sự an toàn từ chính mình, thay vì xây dựng nó từ những mảnh ghép vay mượn.'),
        ],
      ),
    );
  }

  Widget _buildInsightItem(String category, String content) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
      decoration: BoxDecoration(
        border: Border(
            left: BorderSide(
                color: AppColors.goldDeep.withValues(alpha: 0.4), width: 3)),
        color: AppColors.surfaceSubtle.withValues(alpha: 0.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(category,
              style: GoogleFonts.philosopher(
                  fontSize: 15,
                  letterSpacing: 2,
                  fontWeight: FontWeight.bold,
                  color: AppColors.goldDeep)),
          const SizedBox(height: 12),
          Text(content,
              style: GoogleFonts.cormorantGaramond(
                  fontSize: 18,
                  height: 1.4,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildTechnicalDataSection(UserModel? user, VoidCallback ontab) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: AppColors.surfaceSubtle,
        border: Border(
            top: BorderSide(color: AppColors.divider.withValues(alpha: 0.3))),
      ),
      child: Column(
        children: [
          _buildTechnicalRow(AppStrings.technicalTitle,
              '10.28° N, 105.65° E (Lai Vung, Đồng Tháp)'),
          _buildTechnicalRow('Hệ thống nhà', 'Placidus'),
          _buildTechnicalRow('Ngày sinh gốc', '10/05/2000 | 08:00 AM (GMT+7)'),
          const SizedBox(height: 15),
          Text(AppStrings.technicalInfo,
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                  fontSize: 10,
                  height: 1.6,
                  fontStyle: FontStyle.italic,
                  color: AppColors.textMuted)),
          const SizedBox(height: 24),
          // Nút Test Notification (Tạm thời để cậu kiểm tra)
          TextButton.icon(
            onPressed: ontab,
            icon: const Icon(Icons.notification_add_outlined, size: 14),
            label: Text(
              AppStrings.btnTestNotif,
              style: GoogleFonts.barlowCondensed(
                  fontSize: 11, fontWeight: FontWeight.w700),
            ),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.goldDeep,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(
                    color: AppColors.goldDeep.withValues(alpha: 0.3)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTechnicalRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: GoogleFonts.barlowCondensed(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary.withValues(alpha: 0.7))),
          Text(value,
              style: GoogleFonts.barlowCondensed(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return Center(
      child: OutlinedButton.icon(
        onPressed: () async {
          // Hiển thị dialog xác nhận nếu cần, hoặc logout luôn
          final confirm = await showDialog<bool>(
            context: context,
            builder: (context) => AlertDialog(
              backgroundColor: AppColors.background,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24)),
              title: Text('Xác nhận đăng xuất',
                  style: GoogleFonts.philosopher(fontWeight: FontWeight.bold)),
              content: Text('Vũ trụ sẽ rất nhớ em. Em có chắc muốn đăng xuất?',
                  style: GoogleFonts.montserrat(fontSize: 14)),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  child: Text('Ở lại',
                      style: GoogleFonts.montserrat(
                          color: AppColors.textMuted,
                          fontWeight: FontWeight.w600)),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(context, true),
                  child: Text('Đăng xuất',
                      style: GoogleFonts.montserrat(
                          color: Colors.redAccent,
                          fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          );

          if (confirm == true) {
            await AuthService().signOut();
          }
        },
        icon: const Icon(Icons.logout_rounded, size: 16),
        label: Text(
          AppStrings.btnLogout,
          style: GoogleFonts.philosopher(
              fontSize: 13, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.textSecondary,
          side: BorderSide(color: AppColors.divider.withValues(alpha: 0.5)),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
        ),
      ),
    );
  }

  Widget _buildHeartfeltFooter() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 10),
      child: Column(
        children: [
          const Icon(Icons.favorite_rounded,
              size: 14, color: AppColors.goldDeep),
          const SizedBox(height: 20),
          Text(
            AppStrings.heartfeltFooter,
            textAlign: TextAlign.center,
            style: GoogleFonts.philosopher(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
                height: 2.0,
                color: AppColors.goldDeep),
          ),
        ],
      ),
    );
  }
}
