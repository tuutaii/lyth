import 'dart:math';

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

// Import các Tab đã tách riêng
import 'dashboard/home_tab.dart';
import 'dashboard/sky_tab.dart';
import 'dashboard/love_tab.dart';
import 'dashboard/profile_tab.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  double _scrollOffset = 0;
  int _currentIndex = 0;
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

  // ── Data Fetching Logic ──────────────────────────────────────

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
          user: user, planetLongitudes: {}, firebaseMessage: null);
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

    Map<String, double> planetData = {};

    if (firebaseMessage == null) {
      try {
        final planetIds = {
          'Sun': '10',
          'Moon': '301',
          'Mercury': '199',
          'Venus': '299',
          'Mars': '499',
          'Jupiter': '599',
          'Saturn': '699'
        };

        final results = await Future.wait(planetIds.entries.map((e) =>
            apiService.getEclipticLongitude(
                planetId: e.value, lat: lat, lng: lng, date: date)));

        int i = 0;
        for (var key in planetIds.keys) {
          planetData[key] = results[i++] ?? 0.0;
        }

        final aiData = await GeminiService()
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

          firebaseMessage = DailyMessage(
            dateKey: dateStr,
            header: aiData['header'] ?? '',
            body: aiData['body'] ?? '',
            dos: List<String>.from(aiData['dos'] ?? []),
            donts: List<String>.from(aiData['donts'] ?? []),
            category: aiData['category'] ?? 'General',
          );
        }
      } catch (e) {
        debugPrint('⚠️ NASA/Gemini error: $e');
      }
    }

    final profile = AstroDataMapper.mapNASADataToProfile(
        user: user,
        planetLongitudes: planetData,
        firebaseMessage: firebaseMessage);

    _contentFadeController.forward(from: 0.0);
    return profile;
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
                  child: CircularProgressIndicator(color: AppColors.goldDeep)));
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
            final dateSelectorOpacity =
                (1.0 - (_scrollOffset / 40)).clamp(0.0, 1.0);

            return Scaffold(
              backgroundColor: AppColors.background,
              body: Stack(
                children: [
                  const Positioned.fill(child: MysticBackground()),
                  _buildBody(userData, profile, isLoading),
                  // AppBar fixed at top
                  Positioned(
                      top: 0,
                      left: 0,
                      right: 0,
                      child: _buildAppBar(appBarOpacity)),
                  // Sticky Date Selector for Home Tab with fade-out effect
                  if (_currentIndex == 0)
                    Positioned(
                      top: 60,
                      left: 0,
                      right: 0,
                      child: Opacity(
                        opacity: dateSelectorOpacity,
                        child: IgnorePointer(
                          ignoring: dateSelectorOpacity < 0.1,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: AppSpacing.lg, vertical: 12),
                            decoration: BoxDecoration(
                                color: AppColors.background.withValues(
                                    alpha: (1.0 - appBarOpacity) * 0.9)),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                _buildDateSelector(),
                                _buildAvatar(userData)
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              bottomNavigationBar: _buildBottomNav(),
            );
          },
        );
      },
    );
  }

  Widget _buildBody(UserModel? user, UserAstroProfile profile, bool isLoading) {
    switch (_currentIndex) {
      case 0:
        return HomeTab(
          profile: profile,
          isLoading: isLoading,
          scrollController: _scrollController,
          contentFadeAnimation: _contentFadeController,
        );
      case 1:
        return const SkyTab();
      case 2:
        return const LoveTab();
      case 3:
        return ProfileTab(
          user: user,
          profile: profile,
          scrollController: _scrollController,
        );
      default:
        return HomeTab(
          profile: profile,
          isLoading: isLoading,
          scrollController: _scrollController,
          contentFadeAnimation: _contentFadeController,
        );
    }
  }

  // ── UI Components ──────────────────────────────────────────

  Widget _buildAppBar(double opacity) {
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
            style: GoogleFonts.philosopher(
                letterSpacing: 12,
                fontWeight: FontWeight.w600,
                fontSize: 20,
                color: AppColors.goldDeep)),
      ),
    );
  }

  Widget _buildDateSelector() {
    final now = DateTime.now();
    final List<DateTime> displayDates =
        List.generate(5, (i) => now.add(Duration(days: i - 1)));
    final weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(_selectedDate.day == now.day ? 'HÔM NAY' : 'DỰ BÁO',
            style: GoogleFonts.montserrat(
                color: AppColors.goldDeep,
                letterSpacing: 2.0,
                fontSize: 9,
                fontWeight: FontWeight.w700)),
        const SizedBox(height: 12),
        Row(
          children: displayDates.map((d) {
            final isSelected = d.day == _selectedDate.day;
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
                      style: GoogleFonts.montserrat(
                        fontSize: 8,
                        color: isSelected
                            ? AppColors.textPrimary
                            : AppColors.textMuted,
                        letterSpacing: 0.5,
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text('${d.day}',
                        style: GoogleFonts.lora(
                            fontSize: 16,
                            color: isSelected
                                ? AppColors.textPrimary
                                : AppColors.textMuted,
                            fontWeight: isSelected
                                ? FontWeight.w700
                                : FontWeight.w400)),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildAvatar(UserModel? user) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        image: user?.photoUrl != null
            ? DecorationImage(
                image: NetworkImage(user!.photoUrl!), fit: BoxFit.cover)
            : null,
        border: Border.all(color: AppColors.goldAccent.withValues(alpha: 0.3)),
      ),
      child: user?.photoUrl == null
          ? const Icon(Icons.person_outline,
              color: AppColors.goldAccent, size: 20)
          : null,
    );
  }

  Widget _buildBottomNav() {
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
    final active = _currentIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          if (_currentIndex != index) {
            setState(() {
              _currentIndex = index;
              _scrollOffset = 0; // Reset offset hien thi
            });
            // Cuon ve đầu trang cho tab mới
            if (_scrollController.hasClients) {
              _scrollController.jumpTo(0);
            }
          }
        },
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

class AuraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // 1. Lớp Aura nền (Gradients) - Giữ làm nhòe để tạo chiều sâu
    final auraPaint = Paint()
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 80);

    canvas.drawCircle(
      Offset(size.width * 0.8, size.height * 0.1),
      size.width * 0.4,
      auraPaint..color = AppColors.goldDeep.withValues(alpha: 0.12),
    );

    canvas.drawCircle(
      Offset(size.width * 0.2, size.height * 0.7),
      size.width * 0.5,
      auraPaint..color = AppColors.sageMoss.withValues(alpha: 0.1),
    );

    // 2. Chi tiết chiêm tinh (Astrology Details) - Nét mảnh và SẮC NÉT
    final linePaint = Paint()
      ..color = AppColors.goldDeep.withValues(alpha: 0.25)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.4; // Nét cực mảnh nhưng không nhòe

    final center = Offset(size.width * 0.5, size.height * 0.4);

    // Vòng tròn lớn bao quanh
    canvas.drawCircle(center, size.width * 0.8, linePaint);
    canvas.drawCircle(center, size.width * 0.78,
        linePaint..color = AppColors.goldDeep.withValues(alpha: 0.1));

    // Các đường gạch như la bàn thiên văn
    for (var i = 0; i < 24; i++) {
      final angle = (i * 15) * (3.14159 / 180);
      final isMainAxis = i % 6 == 0;
      final lengthMultiplier = isMainAxis ? 0.85 : 0.82;

      final start = Offset(
        center.dx + (size.width * 0.75) * cos(angle),
        center.dy + (size.width * 0.75) * sin(angle),
      );
      final end = Offset(
        center.dx + (size.width * lengthMultiplier) * cos(angle),
        center.dy + (size.width * lengthMultiplier) * sin(angle),
      );
      canvas.drawLine(
          start,
          end,
          linePaint
            ..color =
                AppColors.goldDeep.withValues(alpha: isMainAxis ? 0.2 : 0.1));
    }

    // 3. Những vì sao (Crisp Stars)
    final starPaint = Paint()
      ..color = AppColors.goldDeep.withValues(alpha: 0.4);
    final stars = [
      Offset(size.width * 0.1, size.height * 0.15),
      Offset(size.width * 0.9, size.height * 0.3),
      Offset(size.width * 0.2, size.height * 0.8),
      Offset(size.width * 0.8, size.height * 0.9),
      Offset(size.width * 0.5, size.height * 0.05),
    ];

    for (var star in stars) {
      canvas.drawCircle(star, 1.5, starPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MysticBackground extends StatelessWidget {
  const MysticBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Hình nền AI tạo
        Positioned.fill(
          child: Opacity(
            opacity: 0.3, // Rất mờ để tinh tế
            child: Image.asset(
              'assets/images/mystic_bg.png',
              fit: BoxFit.cover,
            ),
          ),
        ),
        // Lớp phủ màu mờ ảo nhẹ nhàng từ AuraPainter (giữ lại các vì sao và vòng tròn mờ)
        Positioned.fill(
          child: CustomPaint(
            painter: AuraPainter(),
          ),
        ),
      ],
    );
  }
}
