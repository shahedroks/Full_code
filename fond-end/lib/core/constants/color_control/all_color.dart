
import 'package:flutter/material.dart';

/// Colors aligned with "just for confirm the color." React app theme (theme.css).
/// Use these for all screens when converting from the React app to Flutter.
class AllColor {
  // Base
  static const Color white = Colors.white;
  static const Color white70 = Colors.white70;
  static const Color black = Colors.black;
  static const Color black87 = Colors.black87;

  // React theme :root (light) — confirmed from theme.css
  static const Color background = Color(0xFFFFFFFF);
  static const Color foreground = Color(0xFF1F2937);
  static const Color card = Color(0xFFFFFFFF);
  static const Color cardForeground = Color(0xFF1F2937);
  static const Color primary = Color(0xFF408AF1);
  static const Color primaryForeground = Color(0xFFFFFFFF);
  static const Color secondary = Color(0xFFF3F4F6);
  static const Color secondaryForeground = Color(0xFF1F2937);
  static const Color muted = Color(0xFFF3F4F6);
  static const Color mutedForeground = Color(0xFF6B7280);
  static const Color accent = Color(0xFFEFF6FF);
  static const Color accentForeground = Color(0xFF1F2937);
  static const Color destructive = Color(0xFFDC2626);
  static const Color destructiveForeground = Color(0xFFFFFFFF);
  static const Color inputBackground = Color(0xFFF3F4F6);
  static const Color ring = Color(0xFF408AF1);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color border = Color(0x1A000000); // rgba(0,0,0,0.1)

  // Legacy / utility (kept for compatibility)
  static const Color orange = Colors.orange;
  static const Color lightBlue = Colors.lightBlue;
  static const Color grey = Colors.grey;
  static final Color grey200 = Colors.grey.shade200;
  static final Color red200 = Colors.red.shade200;
}
