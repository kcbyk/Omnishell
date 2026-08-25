import 'package:flutter/material.dart';

class CyberTheme {
  // Cyberpunk Dark Palette
  static const Color background = Color(0xFF070A10);
  static const Color surface = Color(0xFF0E131F);
  static const Color surfaceLight = Color(0xFF161F33);
  static const Color cardBg = Color(0xFF111726);

  // Neon Accent Colors
  static const Color neonCyan = Color(0xFF00F0FF);
  static const Color neonPink = Color(0xFFFF0055);
  static const Color neonGreen = Color(0xFF00FF66);
  static const Color neonAmber = Color(0xFFFFB800);
  static const Color neonPurple = Color(0xFF9D00FF);
  static const Color neonRed = Color(0xFFFF2A2A);

  // Text Colors
  static const Color textPrimary = Color(0xFFE2E8F0);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF475569);

  // Glow Box Shadow Helper
  static List<BoxShadow> neonGlow(Color color, {double blur = 12.0, double spread = 1.0}) {
    return [
      BoxShadow(
        color: color.withOpacity(0.35),
        blurRadius: blur,
        spreadRadius: spread,
      ),
      BoxShadow(
        color: color.withOpacity(0.15),
        blurRadius: blur * 2,
        spreadRadius: spread * 1.5,
      ),
    ];
  }

  // Border Decorations
  static BoxDecoration cyberBox({
    Color? borderColor,
    Color? bgColor,
    double radius = 12.0,
    bool glow = false,
  }) {
    final border = borderColor ?? neonCyan.withOpacity(0.4);
    return BoxDecoration(
      color: bgColor ?? surface,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: border, width: 1.2),
      boxShadow: glow ? neonGlow(border) : null,
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: neonCyan,
      colorScheme: const ColorScheme.dark(
        primary: neonCyan,
        secondary: neonPink,
        surface: surface,
        background: background,
        error: neonRed,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: neonCyan,
          fontSize: 20,
          fontWeight: FontWeight.w800,
          letterSpacing: 1.5,
        ),
        iconTheme: IconThemeData(color: neonCyan),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: neonCyan,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 10,
      ),
      fontFamily: 'monospace',
    );
  }
}
