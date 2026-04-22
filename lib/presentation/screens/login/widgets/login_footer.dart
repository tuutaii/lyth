import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lyth_astrology/core/constants/app_strings.dart';

class LoginFooter extends StatelessWidget {
  const LoginFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        '🌙 ${AppStrings.appName}',
        style: GoogleFonts.lora(
          fontSize: 13,
          color: const Color(0xFFBBAA9A),
          fontStyle: FontStyle.italic,
        ),
      ),
    );
  }
}
