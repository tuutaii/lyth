// ============================================================
// LYTH — Auth Service (Firebase Email/Password)
// ============================================================

import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Stream theo dõi trạng thái đăng nhập
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // User hiện tại
  User? get currentFirebaseUser => _auth.currentUser;

  // ── Đăng nhập ────────────────────────────────────────────────

  Future<AuthResult> signIn(String email, String password) async {
    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      return AuthResult.success(credential.user);
    } on FirebaseAuthException catch (e) {
      return AuthResult.error(_mapFirebaseError(e.code));
    } catch (e) {
      return AuthResult.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  }

  // ── Đăng ký ──────────────────────────────────────────────────

  Future<AuthResult> signUp(String email, String password) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      return AuthResult.success(credential.user);
    } on FirebaseAuthException catch (e) {
      return AuthResult.error(_mapFirebaseError(e.code));
    } catch (e) {
      return AuthResult.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  }

  // ── Đăng xuất ────────────────────────────────────────────────

  Future<void> signOut() async {
    await _auth.signOut();
  }

  // ── Tạo user mẫu (Ngọc Lý) nếu chưa tồn tại ────────────────

  Future<void> ensureDefaultUserExists() async {
    const email = 'ngocly002299@lyth.app';
    const password = '002299@';

    // Thử tạo account — nếu đã tồn tại sẽ catch lỗi và bỏ qua
    try {
      await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      await _auth.signOut(); // Tạo xong thì sign out, để login flow xử lý
    } on FirebaseAuthException catch (e) {
      if (e.code == 'email-already-in-use') {
        // Account đã tồn tại, không cần làm gì
        return;
      }
      rethrow;
    }
  }

  // ── Map lỗi Firebase → Tiếng Việt ───────────────────────────

  String _mapFirebaseError(String code) {
    switch (code) {
      case 'user-not-found':
        return 'Không tìm thấy tài khoản này.';
      case 'wrong-password':
      case 'invalid-credential':
        return 'Email hoặc mật khẩu không đúng.';
      case 'invalid-email':
        return 'Định dạng email không hợp lệ.';
      case 'user-disabled':
        return 'Tài khoản này đã bị vô hiệu hoá.';
      case 'too-many-requests':
        return 'Quá nhiều lần thử. Vui lòng thử lại sau.';
      case 'email-already-in-use':
        return 'Email này đã được đăng ký.';
      case 'weak-password':
        return 'Mật khẩu quá yếu. Tối thiểu 6 ký tự.';
      default:
        return 'Đăng nhập thất bại. ($code)';
    }
  }
}

// ── Auth Result ───────────────────────────────────────────────

class AuthResult {
  final User? user;
  final String? errorMessage;
  final bool isSuccess;

  const AuthResult._({this.user, this.errorMessage, required this.isSuccess});

  factory AuthResult.success(User? user) =>
      AuthResult._(user: user, isSuccess: true);

  factory AuthResult.error(String message) =>
      AuthResult._(errorMessage: message, isSuccess: false);
}
