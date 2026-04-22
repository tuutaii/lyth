import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lyth_astrology/data/services/auth_service.dart';

import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthService _authService = AuthService();

  AuthBloc() : super(AuthInitial()) {
    on<AuthLoginRequested>((event, emit) async {
      emit(AuthLoading());

      try {
        final result = await _authService.signIn(event.email, event.password);
        
        if (result.isSuccess) {
          emit(AuthSuccess());
        } else {
          emit(AuthFailure(result.errorMessage ?? 'Tài khoản hoặc mật khẩu không chính xác.'));
        }
      } catch (e) {
        emit(AuthFailure('Đã xảy ra lỗi hệ thống: ${e.toString()}'));
      }
    });
  }
}
