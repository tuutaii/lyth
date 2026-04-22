import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// ─────────────────────────────────────────────
//  AN YÊN ASTROLOGER — Design System
//  Earth-tone palette · Lora + Montserrat
// ─────────────────────────────────────────────

class AppColors {
  AppColors._();

  // Backgrounds
  static const Color background = Color(0xFFFAF9F6); // Cream white
  static const Color surfaceCard = Color(0xFFFFFFFF); // Pure white cards
  static const Color surfaceElevated = Color(0xFFF5EEDC); // Warm beige
  static const Color surfaceSubtle = Color(0xFFEDE4E0); // Dusty blush

  // Primary earth tones
  static const Color earthBeige = Color(0xFFF5EEDC);
  static const Color earthTaupe = Color(0xFFD6C9B6);
  static const Color earthBrown = Color(0xFFB89F8A);

  // Secondary — sage & muted greens
  static const Color sageMoss = Color(0xFFA9B388);
  static const Color sageMossLight = Color(0xFFCDD5B5);
  static const Color dustyOlive = Color(0xFF9E9D89);

  // Accent — warm gold / sand
  static const Color goldAccent = Color(0xFFD2B48C);
  static const Color goldLight = Color(0xFFE8D5B7);
  static const Color goldDeep = Color(0xFFB8996A);

  // Text
  static const Color textPrimary = Color(0xFF4A4A4A); // Charcoal
  static const Color textSecondary = Color(0xFF7A7265); // Warm grey-brown
  static const Color textMuted = Color(0xFFADA89F); // Light muted
  static const Color textOnDark = Color(0xFFFAF9F6); // Cream on dark
  static const Color textDark = Color(0xFF2C2520); // Darker brown/charcoal
  static const Color textWarm = Color(0xFF5C5240); // Warm accent brown

  // Zodiac element tints (gentle, desaturated)
  static const Color fireLight = Color(0xFFF2D7C1); // Peach / fire
  static const Color earthLight = Color(0xFFD9E3C7); // Sage / earth
  static const Color airLight = Color(0xFFCCD9E0); // Blue-grey / air
  static const Color waterLight = Color(0xFFCDD0E3); // Lavender / water

  // Dividers / borders
  static const Color divider = Color(0xFFE8E1D9);
  static const Color borderSubtle = Color(0xFFF0EBE3);

  // Common UI
  static const Color pureWhite = Color(0xFFFFFFFF);
  static const Color shimmerBase = Color(0xFFE0E0E0);
  static const Color shimmerHighlight = Color(0xFFF5F5F5);
  static const Color error = Color(0xFFD97B6C);
  static const Color border = Color(0xFFDDD5CA);
  static const Color textMutedLight = Color(0xFFBBAA9A);
  static const Color iconMuted = Color(0xFF9E8E7E);
}

class AppTextStyles {
  AppTextStyles._();

  // ── Display / Hero
  static TextStyle get displayLarge => GoogleFonts.lora(
        fontSize: 32,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        height: 1.25,
        letterSpacing: -0.5,
      );

  static TextStyle get displayMedium => GoogleFonts.lora(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        height: 1.3,
        letterSpacing: -0.3,
      );

  // ── Section titles
  static TextStyle get titleLarge => GoogleFonts.lora(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        color: AppColors.textPrimary,
        height: 1.4,
      );

  static TextStyle get titleMedium => GoogleFonts.montserrat(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        letterSpacing: 0.8,
      );

  static TextStyle get titleSmall => GoogleFonts.montserrat(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: AppColors.textMuted,
        letterSpacing: 1.2,
      );

  // ── Body
  static TextStyle get bodyLarge => GoogleFonts.montserrat(
        fontSize: 15,
        fontWeight: FontWeight.w400,
        color: AppColors.textPrimary,
        height: 1.6,
      );

  static TextStyle get bodyMedium => GoogleFonts.montserrat(
        fontSize: 13,
        fontWeight: FontWeight.w400,
        color: AppColors.textSecondary,
        height: 1.6,
      );

  static TextStyle get bodySmall => GoogleFonts.montserrat(
        fontSize: 11,
        fontWeight: FontWeight.w400,
        color: AppColors.textMuted,
        height: 1.5,
      );

  // ── Labels / Captions
  static TextStyle get labelMedium => GoogleFonts.montserrat(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: AppColors.textSecondary,
        letterSpacing: 0.4,
      );

  static TextStyle get caption => GoogleFonts.montserrat(
        fontSize: 10,
        fontWeight: FontWeight.w500,
        color: AppColors.textMuted,
        letterSpacing: 1.0,
      );

  // ── Quote / Italic
  static TextStyle get quote => GoogleFonts.lora(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        fontStyle: FontStyle.italic,
        color: AppColors.textSecondary,
        height: 1.65,
      );
}

class AppSpacing {
  AppSpacing._();
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}

class AppRadius {
  AppRadius._();
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;
  static const double full = 999.0;
}

class AppShadows {
  AppShadows._();

  static List<BoxShadow> get cardSoft => [
        BoxShadow(
          color: AppColors.earthBrown.withValues(alpha: 0.06),
          blurRadius: 16,
          offset: const Offset(0, 4),
          spreadRadius: 0,
        ),
        BoxShadow(
          color: AppColors.earthBrown.withValues(alpha: 0.03),
          blurRadius: 4,
          offset: const Offset(0, 1),
          spreadRadius: 0,
        ),
      ];

  static List<BoxShadow> get cardMedium => [
        BoxShadow(
          color: AppColors.earthBrown.withValues(alpha: 0.10),
          blurRadius: 24,
          offset: const Offset(0, 6),
          spreadRadius: 0,
        ),
      ];

  static List<BoxShadow> get glowGold => [
        BoxShadow(
          color: AppColors.goldAccent.withValues(alpha: 0.25),
          blurRadius: 20,
          spreadRadius: 2,
        ),
      ];
}

ThemeData buildAppTheme() {
  return ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: AppColors.background,
    colorScheme: const ColorScheme(
      brightness: Brightness.light,
      primary: AppColors.goldAccent,
      onPrimary: AppColors.textPrimary,
      secondary: AppColors.sageMoss,
      onSecondary: AppColors.textOnDark,
      error: Color(0xFFD97B6C),
      onError: AppColors.pureWhite,
      surface: AppColors.surfaceCard,
      onSurface: AppColors.textPrimary,
    ),
    textTheme: GoogleFonts.montserratTextTheme().copyWith(
      displayLarge: AppTextStyles.displayLarge,
      displayMedium: AppTextStyles.displayMedium,
      titleLarge: AppTextStyles.titleLarge,
      titleMedium: AppTextStyles.titleMedium,
      bodyLarge: AppTextStyles.bodyLarge,
      bodyMedium: AppTextStyles.bodyMedium,
      bodySmall: AppTextStyles.bodySmall,
      labelMedium: AppTextStyles.labelMedium,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.background,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: true,
      titleTextStyle: AppTextStyles.titleLarge.copyWith(
        fontFamily: GoogleFonts.lora().fontFamily,
      ),
      iconTheme: const IconThemeData(color: AppColors.textPrimary),
    ),
    dividerTheme: const DividerThemeData(
      color: AppColors.divider,
      thickness: 1,
      space: 1,
    ),
    cardTheme: CardThemeData(
      color: AppColors.surfaceCard,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
    ),
  );
}
