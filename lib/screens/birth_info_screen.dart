// ============================================================
// LYTH — Birth Info Screen
// Người dùng nhập ngày sinh / giờ sinh / nơi sinh
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/astrology_api_models.dart';
import '../models/user_model.dart';
import '../services/astrology_api_service.dart';
import '../services/auth_service.dart';
import '../services/firestore_service.dart';
import 'dashboard_screen.dart';

class BirthInfoScreen extends StatefulWidget {
  final UserModel user;

  const BirthInfoScreen({super.key, required this.user});

  @override
  State<BirthInfoScreen> createState() => _BirthInfoScreenState();
}

class _BirthInfoScreenState extends State<BirthInfoScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _dayCtrl = TextEditingController();
  final _monthCtrl = TextEditingController();
  final _yearCtrl = TextEditingController();
  final _hourCtrl = TextEditingController();
  final _minuteCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();

  bool _isLoading = false;
  String? _locationStatus;
  GeoLocation? _resolvedLocation;

  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _animCtrl.forward();

    // Hardcode ngày sinh & nơi sinh (Lai Vung)
    _dayCtrl.text = '10';
    _monthCtrl.text = '05';
    _yearCtrl.text = '2000';
    _hourCtrl.text = '08';
    _minuteCtrl.text = '30';
    _cityCtrl.text = 'Lai Vung';
    
    _resolvedLocation = const GeoLocation(
      latitude: 10.28701,
      longitude: 105.6617,
      timezone: 7.0,
      cityName: 'Lai Vung',
    );
    _locationStatus = '📍 10.2870, 105.6617 · GMT+7 (Lai Vung)';
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _dayCtrl.dispose();
    _monthCtrl.dispose();
    _yearCtrl.dispose();
    _hourCtrl.dispose();
    _minuteCtrl.dispose();
    _cityCtrl.dispose();
    super.dispose();
  }

  // ── Tìm tọa độ từ tên thành phố ─────────────────────────────

  Future<void> _resolveCity() async {
    final originalCity = _cityCtrl.text.trim();
    if (originalCity.isEmpty) return;

    setState(() {
      _locationStatus = 'Đang tìm tọa độ...';
      _resolvedLocation = null;
    });

    try {
      Map<String, dynamic>? rawLoc;
      try {
        rawLoc = await AstrologyApiService().getGeoLocation(originalCity);
      } catch (_) {
        // 2. Nếu thất bại, thử lấy phần cuối (thường là tỉnh/thành)
        final parts = originalCity.split(RegExp(r'[, ]+'));
        if (parts.length > 1) {
          final fallbackCity = parts.last;
          debugPrint('Thử tìm kiếm fallback với: $fallbackCity');
          rawLoc = await AstrologyApiService().getGeoLocation(fallbackCity);
        }
      }

      if (rawLoc != null) {
        final location = GeoLocation(
          latitude: rawLoc['latitude'],
          longitude: rawLoc['longitude'],
          timezone: rawLoc['timezone'],
          cityName: rawLoc['display_name'],
        );
        final foundLocation = location;
        setState(() {
          _resolvedLocation = foundLocation;
          _locationStatus =
              '📍 ${foundLocation.latitude.toStringAsFixed(4)}, ${foundLocation.longitude.toStringAsFixed(4)} · GMT+${foundLocation.timezone.toStringAsFixed(0)}';
        });
      } else {
        throw Exception('Location not found');
      }
    } catch (_) {
      // Dùng toạ độ mặc định Hà Nội nếu không tìm được
      setState(() {
        _resolvedLocation = const GeoLocation(
          latitude: 21.0285,
          longitude: 105.8542,
          timezone: 7.0,
          cityName: 'Hanoi',
        );
        _locationStatus = '📍 Không tìm thấy: Dùng tạm Hà Nội. Bạn có thể thử nhập tên Tỉnh (vd: Dong Thap)';
      });
    }
  }

  // ── Lưu và tiếp tục ─────────────────────────────────────────

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    // Nếu chưa resolve location thì dùng mặc định
    _resolvedLocation ??= const GeoLocation(
      latitude: 21.0285,
      longitude: 105.8542,
      timezone: 7.0,
      cityName: 'Hanoi',
    );

    setState(() => _isLoading = true);

    try {
      final authUser = AuthService().currentFirebaseUser;
      if (authUser != null) {
        await FirestoreService().updateBirthInfo(
          uid: authUser.uid,
          year: int.parse(_yearCtrl.text),
          month: int.parse(_monthCtrl.text),
          day: int.parse(_dayCtrl.text),
          hour: int.tryParse(_hourCtrl.text) ?? 12,
          minute: int.tryParse(_minuteCtrl.text) ?? 0,
          city: _cityCtrl.text.trim(),
          latitude: _resolvedLocation?.latitude ?? 21.0285,
          longitude: _resolvedLocation?.longitude ?? 105.8542,
          timezone: _resolvedLocation?.timezone ?? 7.0,
        );
      }

      if (!mounted) return;
      setState(() => _isLoading = false);

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const DashboardScreen()),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi lưu thông tin: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F4EF),
      body: SafeArea(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 40),
                  _buildHeader(),
                  const SizedBox(height: 36),
                  _buildSectionLabel('🗓️  Ngày sinh'),
                  const SizedBox(height: 12),
                  _buildDateRow(),
                  const SizedBox(height: 24),
                  _buildSectionLabel('⏰  Giờ sinh'),
                  const SizedBox(height: 12),
                  _buildTimeRow(),
                  const SizedBox(height: 8),
                  _buildTimeHint(),
                  const SizedBox(height: 24),
                  _buildSectionLabel('📍  Nơi sinh'),
                  const SizedBox(height: 12),
                  _buildCityField(),
                  if (_locationStatus != null) ...[
                    const SizedBox(height: 8),
                    _buildLocationStatus(),
                  ],
                  const SizedBox(height: 36),
                  _buildSubmitButton(),
                  const SizedBox(height: 16),
                  _buildSkipButton(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Thông tin\nngày sinh ✨',
          style: GoogleFonts.lora(
            fontSize: 30,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF2C2520),
            height: 1.3,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          'Để tính toán lá số chiêm tinh của bạn, chúng tôi cần ngày sinh, giờ sinh và nơi sinh chính xác.',
          style: GoogleFonts.montserrat(
            fontSize: 13.5,
            color: const Color(0xFF7A6E63),
            height: 1.6,
          ),
        ),
      ],
    );
  }

  Widget _buildSectionLabel(String label) {
    return Text(
      label,
      style: GoogleFonts.montserrat(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: const Color(0xFF5C5240),
        letterSpacing: 0.2,
      ),
    );
  }

  Widget _buildDateRow() {
    return Row(
      children: [
        Expanded(
          child: _buildSmallField(
            controller: _dayCtrl,
            label: 'Ngày',
            hint: '12',
            min: 1,
            max: 31,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildSmallField(
            controller: _monthCtrl,
            label: 'Tháng',
            hint: '10',
            min: 1,
            max: 12,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          flex: 2,
          child: _buildSmallField(
            controller: _yearCtrl,
            label: 'Năm',
            hint: '1997',
            min: 1900,
            max: DateTime.now().year,
            maxLength: 4,
          ),
        ),
      ],
    );
  }

  Widget _buildTimeRow() {
    return Row(
      children: [
        Expanded(
          child: _buildSmallField(
            controller: _hourCtrl,
            label: 'Giờ',
            hint: '08',
            min: 0,
            max: 23,
            required: false,
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 20),
          child: Text(
            '  :  ',
            style: GoogleFonts.lora(
              fontSize: 22,
              color: const Color(0xFF5C5240),
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        Expanded(
          child: _buildSmallField(
            controller: _minuteCtrl,
            label: 'Phút',
            hint: '30',
            min: 0,
            max: 59,
            required: false,
          ),
        ),
        const Spacer(),
        const Spacer(),
      ],
    );
  }

  Widget _buildTimeHint() {
    return Text(
      '✦ Giờ sinh càng chính xác, lá số càng đúng (đặc biệt Cung Mọc)',
      style: GoogleFonts.montserrat(
        fontSize: 12,
        color: const Color(0xFF9E8E7E),
        fontStyle: FontStyle.italic,
      ),
    );
  }

  Widget _buildSmallField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required int min,
    required int max,
    int maxLength = 2,
    bool required = true,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.montserrat(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF7A6E63),
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: TextInputType.number,
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly,
            LengthLimitingTextInputFormatter(maxLength),
          ],
          textAlign: TextAlign.center,
          style: GoogleFonts.montserrat(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF2C2520),
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: GoogleFonts.montserrat(
              fontSize: 14,
              color: const Color(0xFFBBAA9A),
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(vertical: 14),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFDDD5CA)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFDDD5CA)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide:
                  const BorderSide(color: Color(0xFF5C5240), width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE57373)),
            ),
            errorStyle: GoogleFonts.montserrat(fontSize: 10),
          ),
          validator: required
              ? (v) {
                  if (v == null || v.isEmpty) return 'Bắt buộc';
                  final n = int.tryParse(v);
                  if (n == null || n < min || n > max) return '$min–$max';
                  return null;
                }
              : null,
        ),
      ],
    );
  }

  Widget _buildCityField() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: TextFormField(
            controller: _cityCtrl,
            style: GoogleFonts.montserrat(
              fontSize: 15,
              color: const Color(0xFF2C2520),
            ),
            decoration: InputDecoration(
              hintText: 'VD: Hà Nội, Hồ Chí Minh, Đà Nẵng...',
              hintStyle: GoogleFonts.montserrat(
                fontSize: 13,
                color: const Color(0xFFBBAA9A),
              ),
              prefixIcon: const Icon(
                Icons.location_city_outlined,
                color: Color(0xFF9E8E7E),
                size: 20,
              ),
              filled: true,
              fillColor: Colors.white,
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFFDDD5CA)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFFDDD5CA)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide:
                    const BorderSide(color: Color(0xFF5C5240), width: 1.5),
              ),
            ),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Vui lòng nhập nơi sinh';
              return null;
            },
            onFieldSubmitted: (_) => _resolveCity(),
          ),
        ),
        const SizedBox(width: 10),
        Padding(
          padding: const EdgeInsets.only(top: 2),
          child: SizedBox(
            height: 52,
            child: ElevatedButton(
              onPressed: _resolveCity,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF5C5240),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
                padding: const EdgeInsets.symmetric(horizontal: 16),
              ),
              child: const Icon(Icons.search_rounded, size: 20),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLocationStatus() {
    final isError = _locationStatus!.startsWith('Đang');
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isError
            ? const Color(0xFFFFF8F0)
            : const Color(0xFFF0F7EE),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          if (isError)
            const SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          else
            const Icon(Icons.check_circle_outline,
                size: 14, color: Color(0xFF4CAF50)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              _locationStatus!,
              style: GoogleFonts.montserrat(
                fontSize: 12,
                color: const Color(0xFF5C5240),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _submit,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF5C5240),
          foregroundColor: const Color(0xFFF8F4EF),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          elevation: 0,
        ),
        child: _isLoading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  color: Color(0xFFF8F4EF),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Xem lá số của tôi',
                    style: GoogleFonts.montserrat(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.auto_awesome_rounded, size: 18),
                ],
              ),
      ),
    );
  }

  Widget _buildSkipButton() {
    return Center(
      child: TextButton(
        onPressed: () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const DashboardScreen()),
          );
        },
        child: Text(
          'Bỏ qua, nhập sau',
          style: GoogleFonts.montserrat(
            fontSize: 13,
            color: const Color(0xFF9E8E7E),
            decoration: TextDecoration.underline,
            decorationColor: const Color(0xFF9E8E7E),
          ),
        ),
      ),
    );
  }
}
