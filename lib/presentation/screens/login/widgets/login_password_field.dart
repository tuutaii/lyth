import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';
import 'package:lyth_astrology/core/theme/app_theme.dart';

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
            color: AppColors.textWarm,
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(height: 10),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          autofocus: false,
          enabled: !isLoading,
          style: GoogleFonts.montserrat(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: AppColors.textDark,
          ),
          onFieldSubmitted: onSubmitted,
          decoration: InputDecoration(
            hintText: AppStrings.pwdHint,
            hintStyle: GoogleFonts.montserrat(
              fontSize: 14,
              color: AppColors.textMutedLight,
              fontWeight: FontWeight.w400,
            ),
            prefixIcon: const Icon(
              Icons.lock_outline_rounded,
              color: AppColors.iconMuted,
              size: 20,
            ),
            suffixIcon: GestureDetector(
              onTap: onToggleObscure,
              child: Icon(
                obscureText
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
                color: AppColors.iconMuted,
                size: 20,
              ),
            ),
            filled: true,
            fillColor: AppColors.pureWhite,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppColors.textWarm, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppColors.error),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: AppColors.error, width: 2),
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
