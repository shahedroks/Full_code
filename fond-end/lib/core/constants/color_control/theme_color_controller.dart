import 'package:flutter/material.dart';

/// Theme colors aligned with "just for confirm the color." React app.
/// Primary and semantic colors match theme.css :root.
class ThemeColorController {
  static const Color black = Color(0xFF000000);
  static const Color white = Color(0xFFFFFFFF);
  static const Color primary = Color(0xFF408AF1); // React --primary
  static const Color foreground = Color(0xFF1F2937); // React --foreground
  static const Color background = Color(0xFFFFFFFF);
  static const Color secondary = Color(0xFFF3F4F6);
  static const Color muted = Color(0xFFF3F4F6);
  static const Color mutedForeground = Color(0xFF6B7280);
  static const Color destructive = Color(0xFFDC2626);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color grey = Color(0xFFF5F5F5);

  // Legacy names (mapped to confirmed palette)
  static const Color blue = Color(0xFF408AF1);
  static const Color orange = Color(0xFFE65100);
  static const Color green = Color(0xFF10B981);
  static const Color teal = Color(0xFF004D40);
}
