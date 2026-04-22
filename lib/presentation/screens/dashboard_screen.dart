import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';
import 'package:lyth_astrology/data/models/astro_models.dart';
import 'package:lyth_astrology/data/models/user_model.dart';
import 'package:lyth_astrology/data/services/auth_service.dart';
import 'package:lyth_astrology/data/services/firestore_service.dart';

import 'package:lyth_astrology/presentation/blocs/dashboard/dashboard_bloc.dart';
import 'package:lyth_astrology/presentation/blocs/dashboard/dashboard_event.dart';
import 'package:lyth_astrology/presentation/blocs/dashboard/dashboard_state.dart';

import 'dashboard/home_tab.dart';
import 'dashboard/sky_tab.dart';
import 'dashboard/love_tab.dart';
import 'dashboard/profile_tab.dart';

import 'dashboard/widgets/mystic_background.dart';
import 'dashboard/widgets/dashboard_app_bar.dart';
import 'dashboard/widgets/dashboard_bottom_nav.dart';
import 'dashboard/widgets/date_selector.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

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
        if (userData == null) {
          return const Scaffold(
            backgroundColor: AppColors.background,
            body: Center(
                child: CircularProgressIndicator(color: AppColors.goldDeep)),
          );
        }

        return BlocProvider(
          create: (context) =>
              DashboardBloc()..add(DashboardInitRequested(userData)),
          child: const _DashboardView(),
        );
      },
    );
  }
}

class _DashboardView extends StatefulWidget {
  const _DashboardView();

  @override
  State<_DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends State<_DashboardView>
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

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<DashboardBloc, DashboardState>(
      listener: (context, state) {
        if (state is DashboardLoaded) {
          _contentFadeController.forward(from: 0.0);
        }
      },
      builder: (context, state) {
        final bool isLoading =
            state is DashboardLoading || state is DashboardInitial;
        final profile =
            state is DashboardLoaded ? state.profile : UserAstroProfile.sample;
        final userData = state.currentUser;

        final appBarOpacity = (_scrollOffset / 60).clamp(0.0, 1.0);
        final dateSelectorOpacity =
            (1.0 - (_scrollOffset / 40)).clamp(0.0, 1.0);

        return Scaffold(
          backgroundColor: AppColors.background,
          body: Stack(
            children: [
              const Positioned.fill(child: MysticBackground()),
              _buildBody(state.currentIndex, userData, profile, isLoading),

              // AppBar fixed at top
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: DashboardAppBar(opacity: appBarOpacity),
              ),

              // Sticky Date Selector for Home Tab with fade-out effect
              if (state.currentIndex == 0)
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
                        child: DateSelector(
                          selectedDate: state.selectedDate,
                          userData: userData,
                          onDateSelected: (newDate) {
                            context
                                .read<DashboardBloc>()
                                .add(DashboardDateChanged(newDate));
                          },
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
          bottomNavigationBar: DashboardBottomNav(
            currentIndex: state.currentIndex,
            onTap: (index) {
              if (state.currentIndex != index) {
                context.read<DashboardBloc>().add(DashboardTabChanged(index));
                setState(() {
                  _scrollOffset = 0;
                });
                if (_scrollController.hasClients) {
                  _scrollController.jumpTo(0);
                }
              }
            },
          ),
        );
      },
    );
  }

  Widget _buildBody(int currentIndex, UserModel? user, UserAstroProfile profile,
      bool isLoading) {
    if (isLoading && profile == UserAstroProfile.sample && currentIndex == 0) {
      // Chỉ khởi tạo giao diện rỗng mờ khi đang lấy dữ liệu đầu tiên
    }

    switch (currentIndex) {
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
}
