// ============================================================
// LYTH — Birth Info Screen
// Người dùng nhập ngày sinh / giờ sinh / nơi sinh
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/data/models/user_model.dart';
import 'package:lyth_astrology/data/services/astrology_api_service.dart';
import 'package:lyth_astrology/presentation/blocs/birth_info/birth_info_bloc.dart';
import 'package:lyth_astrology/presentation/blocs/birth_info/birth_info_event.dart';
import 'package:lyth_astrology/presentation/blocs/birth_info/birth_info_state.dart';
import 'package:lyth_astrology/presentation/screens/dashboard_screen.dart';
import 'package:lyth_astrology/data/services/auth_service.dart';

class BirthInfoScreen extends StatelessWidget {
  final UserModel user;

  const BirthInfoScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => BirthInfoBloc(),
      child: _BirthInfoView(user: user),
    );
  }
}

class _BirthInfoView extends StatefulWidget {
  final UserModel user;

  const _BirthInfoView({required this.user});

  @override
  State<_BirthInfoView> createState() => _BirthInfoViewState();
}

class _BirthInfoViewState extends State<_BirthInfoView>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _dayCtrl = TextEditingController();
  final _monthCtrl = TextEditingController();
  final _yearCtrl = TextEditingController();
  final _hourCtrl = TextEditingController();
  final _minuteCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();

  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;

  // Local state to keep track across bloc states
  GeoLocation? _currentResolvedLocation;
  String? _currentLocationStatus;

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

    _currentResolvedLocation = const GeoLocation(
      latitude: 10.28701,
      longitude: 105.6617,
      timezone: 7.0,
      cityName: 'Lai Vung',
    );
    _currentLocationStatus = '📍 10.2870, 105.6617 · GMT+7 (Lai Vung)';
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

  void _resolveCity(BuildContext context) {
    if (_cityCtrl.text.trim().isEmpty) return;
    context
        .read<BirthInfoBloc>()
        .add(ResolveCityRequested(_cityCtrl.text.trim()));
  }

  void _submit(BuildContext context) {
    if (!_formKey.currentState!.validate()) return;

    final authUser = AuthService().currentFirebaseUser;
    if (authUser == null) return;

    // Nếu chưa resolve location thì dùng mặc định (đã được lưu ở local _currentResolvedLocation)
    final loc = _currentResolvedLocation ??
        const GeoLocation(
          latitude: 10.28701,
          longitude: 105.6617,
          timezone: 7.0,
          cityName: 'Lai Vung',
        );

    context.read<BirthInfoBloc>().add(SubmitBirthInfoRequested(
          uid: authUser.uid,
          year: int.parse(_yearCtrl.text),
          month: int.parse(_monthCtrl.text),
          day: int.parse(_dayCtrl.text),
          hour: int.tryParse(_hourCtrl.text) ?? 12,
          minute: int.tryParse(_minuteCtrl.text) ?? 0,
          city: _cityCtrl.text.trim(),
          latitude: loc.latitude,
          longitude: loc.longitude,
          timezone: loc.timezone,
        ));
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
              child: BlocConsumer<BirthInfoBloc, BirthInfoState>(
                listener: (context, state) {
                  if (state is BirthInfoSubmitSuccess) {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const DashboardScreen()),
                    );
                  } else if (state is BirthInfoSubmitFailure) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(state.errorMessage)),
                    );
                  }

                  // Update local references for UI stability
                  if (state is BirthInfoLocationSuccess) {
                    _currentResolvedLocation = state.location;
                    _currentLocationStatus = state.statusMessage;
                  } else if (state is BirthInfoLocationFailure) {
                    _currentResolvedLocation = state.fallbackLocation;
                    _currentLocationStatus = state.errorMessage;
                  }
                },
                builder: (context, state) {
                  bool isLoading = state is BirthInfoSubmitLoading;
                  bool isLocationLoading = state is BirthInfoLocationLoading;

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 40),
                      _buildHeader(),
                      const SizedBox(height: 36),
                      _buildSectionLabel(AppStrings.dateLabel),
                      const SizedBox(height: 12),
                      _buildDateRow(),
                      const SizedBox(height: 24),
                      _buildSectionLabel(AppStrings.timeLabel),
                      const SizedBox(height: 12),
                      _buildTimeRow(),
                      const SizedBox(height: 8),
                      _buildTimeHint(),
                      const SizedBox(height: 24),
                      _buildSectionLabel(AppStrings.placeLabel),
                      const SizedBox(height: 12),
                      _buildCityField(context),
                      if (_currentLocationStatus != null ||
                          isLocationLoading) ...[
                        const SizedBox(height: 8),
                        _buildLocationStatus(isLocationLoading),
                      ],
                      const SizedBox(height: 36),
                      _buildSubmitButton(context, isLoading),
                      const SizedBox(height: 16),
                      _buildSkipButton(),
                      const SizedBox(height: 40),
                    ],
                  );
                },
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
          AppStrings.birthInfoHeader,
          style: GoogleFonts.lora(
            fontSize: 30,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF2C2520),
            height: 1.3,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          AppStrings.birthInfoSubtitle,
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
            label: AppStrings.dayLabel,
            hint: '12',
            min: 1,
            max: 31,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildSmallField(
            controller: _monthCtrl,
            label: AppStrings.monthLabel,
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
            label: AppStrings.yearLabel,
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
            label: AppStrings.hourLabel,
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
            label: AppStrings.minLabel,
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
      AppStrings.timeHintText,
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
                  if (v == null || v.isEmpty) return AppStrings.requiredError;
                  final n = int.tryParse(v);
                  if (n == null || n < min || n > max) return '$min–$max';
                  return null;
                }
              : null,
        ),
      ],
    );
  }

  Widget _buildCityField(BuildContext context) {
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
              hintText: AppStrings.cityHint,
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
              if (v == null || v.trim().isEmpty) {
                return AppStrings.cityRequiredError;
              }
              return null;
            },
            onFieldSubmitted: (_) => _resolveCity(context),
          ),
        ),
        const SizedBox(width: 10),
        Padding(
          padding: const EdgeInsets.only(top: 2),
          child: SizedBox(
            height: 52,
            child: ElevatedButton(
              onPressed: () => _resolveCity(context),
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

  Widget _buildLocationStatus(bool isError) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isError ? const Color(0xFFFFF8F0) : const Color(0xFFF0F7EE),
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
              isError
                  ? AppStrings.locatingStatus
                  : (_currentLocationStatus ?? ''),
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

  Widget _buildSubmitButton(BuildContext context, bool isLoading) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        onPressed: isLoading ? null : () => _submit(context),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF5C5240),
          foregroundColor: const Color(0xFFF8F4EF),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          elevation: 0,
        ),
        child: isLoading
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
                    AppStrings.btnSubmitBirthInfo,
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
          AppStrings.btnSkip,
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
