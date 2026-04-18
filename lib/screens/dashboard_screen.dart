import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../theme/app_theme.dart';
import '../models/astro_models.dart';
import '../models/user_model.dart';
import '../models/daily_message.dart';
import '../services/auth_service.dart';
import '../services/firestore_service.dart';
import '../services/astrology_api_service.dart';
import '../services/astro_data_mapper.dart';
import '../services/gemini_service.dart';
import 'package:shimmer/shimmer.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  double _scrollOffset = 0;
  late AnimationController _contentFadeController;

  @override
  void initState() {
    super.initState();
    _contentFadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _scrollController.addListener(() {
      if (mounted) setState(() => _scrollOffset = _scrollController.offset);
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _contentFadeController.dispose();
    super.dispose();
  }

  // ── Fetch dữ liệu & Xử lý Cache ──────────────────────────────

  Future<UserAstroProfile> _fetchAstroData(
      UserModel user, DateTime date) async {
    final apiService = AstrologyApiService();
    final firestoreService = FirestoreService();
    final dateStr = date.toString().split(' ')[0];

    DailyMessage? firebaseMessage;
    Map<String, dynamic>? cachedAiData;

    try {
      firebaseMessage = await firestoreService.getDailyMessage(dateStr);
      if (firebaseMessage == null) {
        cachedAiData =
            await firestoreService.getUserDailyInsight(user.uid, dateStr);
      }
    } catch (e) {
      debugPrint('⚠️ Firestore error: $e');
    }

    if (firebaseMessage == null && cachedAiData != null) {
      final profile = AstroDataMapper.mapNASADataToProfile(
          user: user, sunLon: 0, moonLon: 0, firebaseMessage: null);
      profile.dailyInsightHeader = cachedAiData['header'] ?? '';
      profile.dailyInsightBody = cachedAiData['body'] ?? '';
      profile.dailyInsightCategory =
          (cachedAiData['category'] ?? "IDENTITY").toString().toUpperCase();
      if (cachedAiData['dos'] != null) {
        profile.adviceDos = List<String>.from(cachedAiData['dos']);
      }
      if (cachedAiData['donts'] != null) {
        profile.adviceDonts = List<String>.from(cachedAiData['donts']);
      }
      _contentFadeController.forward(from: 0.0);
      return profile;
    }

    final lat = user.latitude ?? 21.0285;
    final lng = user.longitude ?? 105.8542;

    try {
      final results = await Future.wait([
        apiService.getEclipticLongitude(
            planetId: "10", lat: lat, lng: lng, date: date),
        apiService.getEclipticLongitude(
            planetId: "301", lat: lat, lng: lng, date: date),
        apiService.getEclipticLongitude(
            planetId: "199", lat: lat, lng: lng, date: date),
        apiService.getEclipticLongitude(
            planetId: "299", lat: lat, lng: lng, date: date),
        apiService.getEclipticLongitude(
            planetId: "499", lat: lat, lng: lng, date: date),
        apiService.getEclipticLongitude(
            planetId: "599", lat: lat, lng: lng, date: date),
        apiService.getEclipticLongitude(
            planetId: "699", lat: lat, lng: lng, date: date),
      ]);

      final planetData = {
        'Sun': results[0] ?? 0.0,
        'Moon': results[1] ?? 0.0,
        'Mercury': results[2] ?? 0.0,
        'Venus': results[3] ?? 0.0,
        'Mars': results[4] ?? 0.0,
        'Jupiter': results[5] ?? 0.0,
        'Saturn': results[6] ?? 0.0,
      };

      Map<String, dynamic>? aiData;
      if (firebaseMessage == null) {
        aiData = await GeminiService()
            .generateDailyInsightJSON(user: user, planets: planetData);
        if (aiData != null) {
          await FirebaseFirestore.instance
              .collection('users')
              .doc(user.uid)
              .collection('daily_insights')
              .doc(dateStr)
              .set({
            'header': aiData['header'],
            'body': aiData['body'],
            'category': aiData['category'],
            'dos': aiData['dos'],
            'donts': aiData['donts'],
            'is_ai_generated': true,
            'created_at': FieldValue.serverTimestamp(),
          }, SetOptions(merge: true));
        }
      }

      final profile = AstroDataMapper.mapNASADataToProfile(
          user: user,
          sunLon: planetData['Sun']!,
          moonLon: planetData['Moon']!,
          firebaseMessage: firebaseMessage);
      if (aiData != null) {
        profile.dailyInsightHeader = aiData['header'] ?? '';
        profile.dailyInsightBody = aiData['body'] ?? '';
        profile.dailyInsightCategory =
            (aiData['category'] ?? "IDENTITY").toString().toUpperCase();
        if (aiData['dos'] != null) {
          profile.adviceDos = List<String>.from(aiData['dos']);
        }
        if (aiData['donts'] != null) {
          profile.adviceDonts = List<String>.from(aiData['donts']);
        }
      }
      _contentFadeController.forward(from: 0.0);
      return profile;
    } catch (e) {
      return UserAstroProfile.sample;
    }
  }

  UserAstroProfile? _cachedProfile;
  UserModel? _lastUser;
  DateTime _selectedDate = DateTime.now();
  final Map<String, Future<UserAstroProfile>> _astroFutures = {};

  Future<UserAstroProfile> _getAstroFuture(UserModel user) {
    final dateKey = _selectedDate.toString().split(' ')[0];
    if (_lastUser?.uid != user.uid || !_astroFutures.containsKey(dateKey)) {
      _lastUser = user;
      _astroFutures[dateKey] = _fetchAstroData(user, _selectedDate);
    }
    return _astroFutures[dateKey]!;
  }

  @override
  Widget build(BuildContext context) {
    final authUser = AuthService().currentFirebaseUser;
    if (authUser == null) {
      return const Scaffold(body: Center(child: Text('Chưa đăng nhập')));
    }

    return StreamBuilder<UserModel?>(
      stream: FirestoreService().userStream(authUser.uid),
      builder: (context, userSnapshot) {
        final userData = userSnapshot.data;
        if (userData == null && _cachedProfile == null) {
          return const Scaffold(
              body: Center(
                  child: CircularProgressIndicator(color: AppColors.sageMoss)));
        }

        final future = userData != null
            ? _getAstroFuture(userData)
            : Future.value(_cachedProfile ?? UserAstroProfile.sample);

        return FutureBuilder<UserAstroProfile>(
          future: future,
          builder: (context, astroSnapshot) {
            if (astroSnapshot.hasData) _cachedProfile = astroSnapshot.data;
            final profile = _cachedProfile ?? UserAstroProfile.sample;
            final isLoading =
                astroSnapshot.connectionState == ConnectionState.waiting;
            final appBarOpacity = (_scrollOffset / 60).clamp(0.0, 1.0);

            return Scaffold(
              backgroundColor: AppColors.background,
              body: Stack(
                children: [
                  // 1. Rich Artistic Aura Background
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          center: const Alignment(0.7, -0.4),
                          radius: 1.5,
                          colors: [
                            AppColors.surfaceSubtle.withValues(alpha: 0.5),
                            AppColors.background,
                          ],
                        ),
                      ),
                    ),
                  ),
                  Positioned.fill(
                    child: Opacity(
                      opacity: 0.3,
                      child: CustomPaint(painter: AuraPainter()),
                    ),
                  ),

                  // 2. Main Scroll Content
                  Padding(
                    padding: const EdgeInsets.only(top: 180),
                    child: CustomScrollView(
                      controller: _scrollController,
                      physics: const BouncingScrollPhysics(),
                      slivers: [
                        SliverToBoxAdapter(
                          child: FadeTransition(
                            opacity: _contentFadeController,
                            child: SlideTransition(
                              position: Tween<Offset>(
                                      begin: const Offset(0, 0.05),
                                      end: Offset.zero)
                                  .animate(CurvedAnimation(
                                      parent: _contentFadeController,
                                      curve: Curves.easeOutCirc)),
                              child:
                                  _buildDailyInsightSection(profile, isLoading),
                            ),
                          ),
                        ),
                        const SliverToBoxAdapter(child: SizedBox(height: 120)),
                      ],
                    ),
                  ),

                  // 3. Fixed Elegant Header
                  Positioned(
                      top: 0,
                      left: 0,
                      right: 0,
                      child: _buildAppBar(appBarOpacity)),

                  Positioned(
                    top: 60,
                    left: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.lg, vertical: 12),
                      decoration: BoxDecoration(
                        color: AppColors.background
                            .withValues(alpha: appBarOpacity * 0.9),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildDateSelector(),
                          _buildAvatar(userData),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              bottomNavigationBar: _buildBottomNav(),
              floatingActionButton: FloatingActionButton(
                onPressed: () => _showAskAstrologer(context),
                backgroundColor: AppColors.goldAccent,
                elevation: 6,
                shape: const CircleBorder(),
                child: const Icon(Icons.auto_awesome_rounded,
                    color: Colors.white, size: 28),
              ),
            );
          },
        );
      },
    );
  }

  // ── Premium UI Components ────────────────────────────────────

  Widget _buildDateSelector() {
    final now = DateTime.now();
    final List<DateTime> displayDates =
        List.generate(5, (i) => now.add(Duration(days: i - 1)));
    final weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(width: 12, height: 1, color: AppColors.goldDeep),
            const SizedBox(width: 8),
            Text(
              _selectedDate.day == now.day ? 'HÔM NAY' : 'DỰ BÁO',
              style: AppTextStyles.titleSmall.copyWith(
                  color: AppColors.goldDeep, letterSpacing: 2.0, fontSize: 9),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: displayDates.map((d) {
            final isSelected = d.day == _selectedDate.day;
            final isToday = d.day == now.day;
            return GestureDetector(
              onTap: () {
                if (!isSelected) {
                  setState(() {
                    _selectedDate = d;
                    _cachedProfile = null;
                  });
                }
              },
              child: Padding(
                padding: const EdgeInsets.only(right: 20),
                child: Column(
                  children: [
                    Text(
                      weekDays[d.weekday % 7],
                      style: AppTextStyles.titleSmall.copyWith(
                        color: isSelected
                            ? AppColors.textPrimary
                            : AppColors.textMuted,
                        fontSize: 10,
                        fontWeight:
                            isSelected ? FontWeight.w700 : FontWeight.w400,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${d.day}',
                      style: GoogleFonts.lora(
                        fontSize: 16,
                        color: isSelected
                            ? AppColors.textPrimary
                            : (isToday
                                ? AppColors.sageMoss
                                : AppColors.textMuted),
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 4),
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      width: isSelected ? 4 : 0,
                      height: 4,
                      decoration: const BoxDecoration(
                          color: AppColors.goldDeep, shape: BoxShape.circle),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildDailyInsightSection(UserAstroProfile profile, bool isLoading) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isLoading)
            _buildShimmerContent()
          else
            _buildInsightHeader(profile),
          const SizedBox(height: 40),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                  child: _buildAdviceColumn(
                      'Lời khuyên', profile.adviceDos, isLoading,
                      isPositive: true)),
              Container(
                  width: 1,
                  height: 100,
                  color: AppColors.divider.withValues(alpha: 0.5)),
              const SizedBox(width: 20),
              Expanded(
                  child: _buildAdviceColumn(
                      'Lưu ý', profile.adviceDonts, isLoading,
                      isPositive: false)),
            ],
          ),
          const SizedBox(height: 50),
          _buildAstrologicalContext(profile),
        ],
      ),
    );
  }

  Widget _buildInsightHeader(UserAstroProfile profile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'YOUR DAY AT A GLANCE — ${profile.dailyInsightCategory.toUpperCase()}',
          style: AppTextStyles.titleSmall.copyWith(
              color: AppColors.goldDeep, letterSpacing: 1.5, fontSize: 10),
        ),
        const SizedBox(height: 16),
        Text(
          profile.dailyInsightHeader,
          style: GoogleFonts.lora(
              fontSize: 34,
              fontWeight: FontWeight.w500,
              color: AppColors.textPrimary,
              height: 1.2),
        ),
        const SizedBox(height: 32),
        Stack(
          children: [
            Positioned(
                left: 0,
                top: 0,
                child: Icon(Icons.format_quote_rounded,
                    color: AppColors.goldAccent.withValues(alpha: 0.2),
                    size: 40)),
            Padding(
              padding: const EdgeInsets.only(left: 20, top: 10),
              child: Text(
                profile.dailyInsightBody,
                style: GoogleFonts.lora(
                    fontSize: 19,
                    color: AppColors.textPrimary.withValues(alpha: 0.9),
                    height: 1.8),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildAdviceColumn(String title, List<String> items, bool isLoading,
      {required bool isPositive}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title.toUpperCase(),
            style: AppTextStyles.titleSmall.copyWith(
                color: AppColors.textMuted, letterSpacing: 2.0, fontSize: 9)),
        const SizedBox(height: 20),
        if (isLoading)
          _buildShimmerList()
        else
          ...items.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(
                  item,
                  style: GoogleFonts.lora(
                      fontSize: 15,
                      color: AppColors.textPrimary,
                      height: 1.5,
                      fontWeight: FontWeight.w400),
                ),
              )),
      ],
    );
  }

  Widget _buildAstrologicalContext(UserAstroProfile profile) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.divider.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.auto_awesome,
                  size: 14, color: AppColors.goldDeep),
              const SizedBox(width: 12),
              Text('HÀNH TINH HIỆN TẠI',
                  style: AppTextStyles.titleSmall
                      .copyWith(letterSpacing: 2.0, fontSize: 9)),
              const SizedBox(width: 12),
              const Icon(Icons.auto_awesome,
                  size: 14, color: AppColors.goldDeep),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Năng lượng hôm nay được dẫn dắt bởi sự kết hợp giữa ${profile.sunSign.name} và ${profile.moonSign.name}.',
            textAlign: TextAlign.center,
            style:
                AppTextStyles.bodyMedium.copyWith(fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }

  // ── Shell Components ─────────────────────────────────────────

  PreferredSizeWidget _buildAppBar(double opacity) {
    const h = kToolbarHeight + 40;
    return PreferredSize(
      preferredSize: const Size.fromHeight(h),
      child: AnimatedContainer(
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
        child: Text('LYTH',
            style: GoogleFonts.montserrat(
                letterSpacing: 6,
                fontWeight: FontWeight.w300,
                fontSize: 16,
                color: AppColors.textPrimary)),
      ),
    );
  }

  Widget _buildAvatar(UserModel? user) {
    return Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
          shape: BoxShape.circle,
          border:
              Border.all(color: AppColors.goldAccent.withValues(alpha: 0.3))),
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
            shape: BoxShape.circle,
            image: user?.photoUrl != null
                ? DecorationImage(
                    image: NetworkImage(user!.photoUrl!), fit: BoxFit.cover)
                : null),
        child: user?.photoUrl == null
            ? const Icon(Icons.person_outline,
                size: 20, color: AppColors.earthTaupe)
            : null,
      ),
    );
  }

  Widget _buildShimmerContent() {
    return Shimmer.fromColors(
        baseColor: Colors.grey[200]!,
        highlightColor: Colors.white,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(width: 100, height: 10, color: Colors.white),
          const SizedBox(height: 16),
          Container(width: 250, height: 32, color: Colors.white),
          const SizedBox(height: 32),
          Container(width: double.infinity, height: 80, color: Colors.white)
        ]));
  }

  Widget _buildShimmerList() {
    return Shimmer.fromColors(
        baseColor: Colors.grey[200]!,
        highlightColor: Colors.white,
        child: Column(
            children: List.generate(
                3,
                (i) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Container(
                        width: double.infinity,
                        height: 14,
                        color: Colors.white)))));
  }

  Widget _buildBottomNav() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
          color: AppColors.background,
          border: Border(
              top: BorderSide(
                  color: AppColors.divider.withValues(alpha: 0.5),
                  width: 0.5))),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(Icons.auto_awesome_mosaic_outlined, 'Home', true),
          _buildNavItem(Icons.explore_outlined, 'Sky', false),
          _buildNavItem(Icons.favorite_border_rounded, 'Love', false),
          _buildNavItem(Icons.person_outline_rounded, 'Me', false),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool active) =>
      Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon,
            color: active ? AppColors.goldDeep : AppColors.textMuted, size: 22),
        const SizedBox(height: 6),
        Text(label,
            style: TextStyle(
                color: active ? AppColors.textPrimary : AppColors.textMuted,
                fontSize: 9,
                fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                letterSpacing: 0.5))
      ]);

  void _showAskAstrologer(BuildContext context) {
    showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (context) => Container(
            height: 450,
            decoration: const BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.vertical(top: Radius.circular(40))),
            padding: const EdgeInsets.all(40),
            child: Column(children: [
              Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                      color: AppColors.divider,
                      borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: 40),
              Text('HỎI LYTH',
                  style: GoogleFonts.montserrat(
                      letterSpacing: 4, fontWeight: FontWeight.w500)),
              const SizedBox(height: 20),
              Text('Lời nhắn từ vũ trụ hôm nay khiến bạn tò mò điều gì?',
                  textAlign: TextAlign.center, style: AppTextStyles.bodyLarge)
            ])));
  }
}

class AuraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = RadialGradient(
        colors: [
          AppColors.sageMoss.withValues(alpha: 0.1),
          Colors.transparent,
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawCircle(
        Offset(size.width * 0.2, size.height * 0.1), size.width * 0.4, paint);

    final paint2 = Paint()
      ..shader = RadialGradient(
        colors: [
          AppColors.goldAccent.withValues(alpha: 0.08),
          Colors.transparent,
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawCircle(
        Offset(size.width * 0.8, size.height * 0.5), size.width * 0.6, paint2);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
