import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';

class LoginPasswordField extends StatelessWidget {
  final TextEditingController controller;
  final bool obscureText;
  final bool isLoading;
  final VoidCallback onToggleObscure;
  final Function(String) onSubmitted;

  const LoginPasswordField({
    super.key,
    required this.controller,
    required this.obscureText,
    required this.isLoading,
    required this.onToggleObscure,
    required this.onSubmitted,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppStrings.pwdLabel,
          style: GoogleFonts.montserrat(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF5C5240),
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(height: 10),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          autofocus: true,
          enabled: !isLoading,
          style: GoogleFonts.montserrat(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF2C2520),
          ),
          onFieldSubmitted: onSubmitted,
          decoration: InputDecoration(
            hintText: AppStrings.pwdHint,
            hintStyle: GoogleFonts.montserrat(
              fontSize: 14,
              color: const Color(0xFFBBAA9A),
              fontWeight: FontWeight.w400,
            ),
            prefixIcon: const Icon(
              Icons.lock_outline_rounded,
              color: Color(0xFF9E8E7E),
              size: 20,
            ),
            suffixIcon: GestureDetector(
              onTap: onToggleObscure,
              child: Icon(
                obscureText
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
                color: const Color(0xFF9E8E7E),
                size: 20,
              ),
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFDDD5CA)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFDDD5CA)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFF5C5240), width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFE57373)),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFE57373), width: 2),
            ),
          ),
          validator: (v) {
            if (v == null || v.isEmpty) return AppStrings.emptyPwdError;
            return null;
          },
        ),
      ],
    );
  }
}
