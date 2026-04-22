import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/core/constants/natal_data.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';
import 'package:lyth_astrology/data/models/astro_models.dart';
import 'package:lyth_astrology/data/models/user_model.dart';
import 'package:lyth_astrology/data/services/auth_service.dart';

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
    final size = MediaQuery.of(context).size;
    final double screenWidth = size.width;
    // Tỉ lệ scale font dựa trên màn hình tiêu chuẩn (375px)
    final double fontScale = (screenWidth / 375).clamp(0.85, 1.1);

    return SingleChildScrollView(
      controller: scrollController,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(0, 100, 0, 29),
      child: Column(
        children: [
          // Birth time reminder at the top
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Text(
              '✦ Hãy cung cấp giờ sinh chính xác để Tài cho em thêm thông tin nha!',
              textAlign: TextAlign.center,
              style: GoogleFonts.cormorantGaramond(
                fontSize: 16 * fontScale,
                fontStyle: FontStyle.italic,
                fontWeight: FontWeight.w600,
                color: AppColors.goldDeep.withValues(alpha: 0.8),
              ),
            ),
          ),
          const SizedBox(height: 32),

          // 1. Chỉ số định mệnh (Numerology - Số 8)
          _buildSectionTitle("CHỈ SỐ ĐỊNH MỆNH", "NUMEROLOGY", fontScale),
          const SizedBox(height: 24),
          _buildNumerologySection(fontScale),

          const SizedBox(height: 48),

          // 2. Chỉ số cuộc sống (Life Indicators)
          _buildSectionTitle("CHỈ SỐ SINH TỒN", "LIFE INDICATORS", fontScale),
          const SizedBox(height: 24),
          _buildLifeIndicesSection(fontScale),

          const SizedBox(height: 48),

          // 3. Hồ sơ tính cách (MBTI)
          _buildSectionTitle(
              "CĂN TÍNH CHIÊM TINH", "PERSONALITY PROFILE", fontScale),
          const SizedBox(height: 24),
          _buildMBTISection(fontScale),

          const SizedBox(height: 48),

          // 4. Sự đồng điệu tâm hồn (Soul Resonance)
          _buildSectionTitle(
              "GIAO THOA TÂM HỒN", "SOUL RESONANCE", fontScale),
          const SizedBox(height: 24),
          _buildSoulResonanceSection(fontScale),

          const SizedBox(height: 48),

          // 5. Tọa độ bản mệnh (Technical Data)
          _buildSectionTitle("TỌA ĐỘ BẢN MỆNH", "TECHNICAL DATA", fontScale),
          const SizedBox(height: 24),
          _buildTechnicalDataSection(user, fontScale),

          const SizedBox(height: 34),

          // 3. Lời đề tặng (Dedication)
          _buildHeartfeltFooter(fontScale),

          // 4. Đăng xuất (Logout)
          const SizedBox(height: 10),
          _buildLogoutButton(context, fontScale),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, String subtitle, double scale) {
    return Column(
      children: [
        Text(subtitle,
            style: GoogleFonts.philosopher(
                fontSize: 10 * scale,
                letterSpacing: 6,
                color: AppColors.goldDeep,
                fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(title,
            style: GoogleFonts.philosopher(
                fontSize: 24 * scale,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                color: AppColors.textPrimary)),
        const SizedBox(height: 16),
        Container(width: 40, height: 1.5, color: AppColors.divider),
      ],
    );
  }

  Widget _buildNumerologySection(double scale) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      padding: EdgeInsets.all(32 * scale),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: AppColors.divider.withValues(alpha: 0.5)),
        boxShadow: AppShadows.cardSoft,
      ),
      child: Column(
        children: [
          Text('8',
              style: GoogleFonts.philosopher(
                  fontSize: 80 * scale,
                  fontWeight: FontWeight.bold,
                  color: AppColors.goldDeep)),
          Text('CON SỐ CHỦ ĐẠO',
              style: GoogleFonts.montserrat(
                  fontSize: 12 * scale,
                  letterSpacing: 4,
                  fontWeight: FontWeight.bold,
                  color: AppColors.goldDeep.withValues(alpha: 0.7))),
          const SizedBox(height: 24),
          Text(
            'Con số của sự cân bằng và khả năng hiện thực hóa mọi ước mơ. Sự kết hợp giữa năng lượng Kim Ngưu vững chãi và con số 8 đầy quyền năng giúp em làm chủ được vận mệnh, tạo nên những giá trị bền vững từ chính bản lĩnh và nội lực phi thường của mình.',
            textAlign: TextAlign.center,
            style: GoogleFonts.cormorantGaramond(
                fontSize: 18 * scale,
                height: 1.5,
                color: AppColors.textPrimary,
                fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }

  Widget _buildTechnicalDataSection(UserModel? user, double scale) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(40 * scale),
      decoration: BoxDecoration(
        color: AppColors.surfaceSubtle,
        border: Border(
            top: BorderSide(color: AppColors.divider.withValues(alpha: 0.3))),
      ),
      child: Column(
        children: [
          _buildTechnicalRow(AppStrings.technicalTitle,
              '10.28° N, 105.65° E (Lai Vung, Đồng Tháp)', scale),
          _buildTechnicalRow('Hệ thống nhà', 'Placidus', scale),
          _buildTechnicalRow(
              'Ngày sinh gốc', '10/05/2000 | 08:00 AM (GMT+7)', scale),
          const SizedBox(height: 15),
          Text(AppStrings.technicalInfo,
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                  fontSize: 10 * scale,
                  height: 1.6,
                  fontStyle: FontStyle.italic,
                  color: AppColors.textMuted)),
        ],
      ),
    );
  }

  Widget _buildTechnicalRow(String label, String value, double scale) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: GoogleFonts.barlowCondensed(
                  fontSize: 14 * scale,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary.withValues(alpha: 0.7))),
          Flexible(
            child: Text(value,
                textAlign: TextAlign.right,
                style: GoogleFonts.barlowCondensed(
                    fontSize: 14 * scale,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary)),
          ),
        ],
      ),
    );
  }

  Widget _buildLifeIndicesSection(double scale) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      child: Column(
        children: NatalData.lifeIndices.map((index) {
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.pureWhite,
              borderRadius: BorderRadius.circular(24),
              border:
                  Border.all(color: AppColors.divider.withValues(alpha: 0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      index['title'] as String,
                      style: GoogleFonts.philosopher(
                        fontSize: 16 * scale,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      index['rank'] as String,
                      style: TextStyle(
                          color: AppColors.goldDeep, fontSize: 12 * scale),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text(
                      '${index['score']}%',
                      style: GoogleFonts.montserrat(
                        fontSize: 24 * scale,
                        fontWeight: FontWeight.bold,
                        color: AppColors.goldDeep,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: LinearProgressIndicator(
                          value: (index['score'] as double) / 100,
                          backgroundColor: AppColors.surfaceSubtle,
                          color: AppColors.goldDeep,
                          minHeight: 8,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  index['meaning'] as String,
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 15 * scale,
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildMBTISection(double scale) {
    const mbti = NatalData.personalityProfile;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      padding: EdgeInsets.all(32 * scale),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppColors.divider.withValues(alpha: 0.5)),
        boxShadow: AppShadows.cardSoft,
      ),
      child: Column(
        children: [
          Text(
            mbti['mbti'] as String,
            style: GoogleFonts.philosopher(
              fontSize: 48 * scale,
              fontWeight: FontWeight.bold,
              color: AppColors.goldDeep,
              letterSpacing: 8,
            ),
          ),
          Text(
            (mbti['title'] as String).toUpperCase(),
            style: GoogleFonts.montserrat(
              fontSize: 12 * scale,
              letterSpacing: 2,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            mbti['desc'] as String,
            textAlign: TextAlign.center,
            style: GoogleFonts.cormorantGaramond(
              fontSize: 17 * scale,
              height: 1.5,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Divider(color: AppColors.divider.withValues(alpha: 0.5)),
          const SizedBox(height: 16),
          _buildMBTIInfoRow(Icons.star_rounded, 'Điểm mạnh',
              mbti['strength'] as String, scale),
          const SizedBox(height: 12),
          _buildMBTIInfoRow(Icons.lightbulb_rounded, 'Lời khuyên',
              mbti['advice'] as String, scale),
        ],
      ),
    );
  }

  Widget _buildMBTIInfoRow(
      IconData icon, String label, String value, double scale) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20 * scale, color: AppColors.goldDeep),
        const SizedBox(width: 12),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: GoogleFonts.cormorantGaramond(
                fontSize: 15 * scale,
                color: AppColors.textSecondary,
                height: 1.4,
              ),
              children: [
                TextSpan(
                  text: '$label: ',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary),
                ),
                TextSpan(text: value),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSoulResonanceSection(double scale) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      padding: EdgeInsets.all(32 * scale),
      decoration: BoxDecoration(
        color: AppColors.surfaceSubtle,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppColors.goldDeep.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildResonanceBadge('Số 8', scale),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Icon(Icons.sync_alt_rounded,
                    color: AppColors.goldDeep, size: 24 * scale),
              ),
              _buildResonanceBadge('Cự Giải', scale),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            'Tương hợp: 4/10',
            style: GoogleFonts.philosopher(
              fontSize: 20 * scale,
              fontWeight: FontWeight.bold,
              color: AppColors.goldDeep,
            ),
          ),
          const SizedBox(height: 8),
          Text('★★',
              style:
                  TextStyle(color: AppColors.goldDeep, fontSize: 16 * scale)),
          const SizedBox(height: 16),
          Text(
            'Có một sự lệch hướng rõ ràng giữa con đường bạn cảm thấy tự nhiên và sứ mệnh mà bạn cần theo đuổi. Những trở ngại hiện tại thực chất là dấu hiệu cho thấy bạn cần thay đổi và bước ra khỏi vùng an toàn để hoàn thiện chính mình.',
            textAlign: TextAlign.center,
            style: GoogleFonts.cormorantGaramond(
              fontSize: 16 * scale,
              height: 1.5,
              color: AppColors.textPrimary,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResonanceBadge(String text, double scale) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(100),
        boxShadow: AppShadows.cardSoft,
      ),
      child: Text(
        text,
        style: GoogleFonts.montserrat(
          fontSize: 12 * scale,
          fontWeight: FontWeight.bold,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context, double scale) {
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
                          color: AppColors.error, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          );

          if (confirm == true) {
            await AuthService().signOut();
          }
        },
        icon: Icon(Icons.logout_rounded, size: 16 * scale),
        label: Text(
          AppStrings.btnLogout,
          style: GoogleFonts.philosopher(
              fontSize: 13 * scale,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2),
        ),
        style: OutlinedButton.styleFrom(
          backgroundColor: AppColors.error,
          foregroundColor: AppColors.pureWhite,
          side: BorderSide(color: AppColors.divider.withValues(alpha: 0.5)),
          padding: EdgeInsets.symmetric(
              horizontal: 32 * scale, vertical: 16 * scale),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
        ),
      ),
    );
  }

  Widget _buildHeartfeltFooter(double scale) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 10),
      child: Column(
        children: [
          Icon(Icons.favorite_rounded,
              size: 14 * scale, color: AppColors.goldDeep),
          const SizedBox(height: 10),
          Text(
            AppStrings.heartfeltFooter,
            textAlign: TextAlign.center,
            style: GoogleFonts.philosopher(
                fontSize: 12 * scale,
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
