import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';

/// Welcome banner – converted from React WelcomeBanner.tsx.
/// Uses confirmed primary family (dark blue #003E93-style for banner).
class WelcomeBanner extends StatelessWidget {
  const WelcomeBanner({super.key, this.userName});

  final String? userName;

  @override
  Widget build(BuildContext context) {
    final greeting = userName != null && userName!.isNotEmpty
        ? 'Welcome Back, ${userName!.split(' ').first}!'
        : 'Welcome Back!';

    return Container(
      margin: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
      padding: EdgeInsets.all(24.w),
      decoration: BoxDecoration(
        color: const Color(0xFF003E93),
        borderRadius: BorderRadius.circular(24.r),
        border: Border.all(color: AllColor.white.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: AllColor.primary.withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  greeting,
                  style: TextStyle(
                    fontSize: 20.sp,
                    fontWeight: FontWeight.w600,
                    color: AllColor.white,
                  ),
                ),
                SizedBox(height: 4.h),
                Text(
                  'Ready to book your next service?',
                  style: TextStyle(
                    fontSize: 14.sp,
                    color: AllColor.white.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.all(8.w),
            decoration: BoxDecoration(
              color: AllColor.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.star, size: 20.sp, color: AllColor.white),
          ),
        ],
      ),
    );
  }
}
