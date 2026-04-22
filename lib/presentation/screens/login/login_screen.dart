// ============================================================
// LYTH — Login Screen (Single-user, password only)
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:lyth_astrology/presentation/blocs/auth/auth_bloc.dart';
import 'package:lyth_astrology/presentation/blocs/auth/auth_event.dart';
import 'package:lyth_astrology/presentation/blocs/auth/auth_state.dart';
import 'package:lyth_astrology/presentation/screens/dashboard_screen.dart';

import 'widgets/login_background.dart';
import 'widgets/login_greeting.dart';
import 'widgets/login_password_field.dart';
import 'widgets/login_error_message.dart';
import 'widgets/login_button.dart';
import 'widgets/login_footer.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AuthBloc(),
      child: const _LoginView(),
    );
  }
}

class _LoginView extends StatefulWidget {
  const _LoginView();

  @override
  State<_LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<_LoginView>
    with SingleTickerProviderStateMixin {
  static const _defaultEmail = 'ngocly002299@lyth.app';

  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool _obscurePassword = true;

  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _fadeAnim = CurvedAnimation(
      parent: _animCtrl,
      curve: const Interval(0.0, 0.8, curve: Curves.easeOut),
    );
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.12),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animCtrl,
      curve: const Interval(0.0, 0.8, curve: Curves.easeOut),
    ));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login(BuildContext context) {
    if (!_formKey.currentState!.validate()) return;
    
    context.read<AuthBloc>().add(
      AuthLoginRequested(
        email: _defaultEmail, 
        password: _passwordController.text
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F4EF),
      resizeToAvoidBottomInset: true,
      body: Stack(
        children: [
          LoginBackground(size: size),

          SafeArea(
            child: FadeTransition(
              opacity: _fadeAnim,
              child: SlideTransition(
                position: _slideAnim,
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Form(
                    key: _formKey,
                    child: BlocConsumer<AuthBloc, AuthState>(
                      listener: (context, state) {
                        if (state is AuthFailure) {
                          _passwordController.clear();
                        } else if (state is AuthSuccess) {
                          Navigator.pushReplacement(
                            context,
                            PageRouteBuilder(
                              pageBuilder: (_, __, ___) => const DashboardScreen(),
                              transitionsBuilder: (_, anim, __, child) =>
                                  FadeTransition(opacity: anim, child: child),
                              transitionDuration: const Duration(milliseconds: 500),
                            ),
                          );
                        }
                      },
                      builder: (context, state) {
                        final isLoading = state is AuthLoading;
                        String? errorMessage;
                        if (state is AuthFailure) {
                           errorMessage = state.errorMessage;
                        }

                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: size.height * 0.15),
                            const LoginGreeting(),
                            SizedBox(height: size.height * 0.08),
                            LoginPasswordField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              isLoading: isLoading,
                              onToggleObscure: () => setState(() => _obscurePassword = !_obscurePassword),
                              onSubmitted: (_) => _login(context),
                            ),
                            if (errorMessage != null) ...[
                              const SizedBox(height: 12),
                              LoginErrorMessage(message: errorMessage),
                            ],
                            const SizedBox(height: 32),
                            LoginButton(
                              isLoading: isLoading,
                              onPressed: () => _login(context),
                            ),
                            SizedBox(height: size.height * 0.15),
                            const LoginFooter(),
                            const SizedBox(height: 32),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
