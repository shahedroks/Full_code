import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';

/// Seller home – converted from React SellerHome.tsx.
class SellerHomeScreen extends StatelessWidget {
  const SellerHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AllColor.background,
      appBar: AppBar(
        title: Text('Provider Dashboard', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
        backgroundColor: AllColor.background,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Welcome back, Provider', style: TextStyle(fontSize: 20.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
              SizedBox(height: 24.h),
              _card('Upcoming Jobs', 'View and manage your scheduled jobs', Icons.work_outline),
              SizedBox(height: 12.h),
              _card('Pending Requests', 'Accept or decline new requests', Icons.schedule),
              SizedBox(height: 12.h),
              _card('Availability', 'Set your working hours', Icons.access_time),
              SizedBox(height: 12.h),
              _card('Services & Pricing', 'Manage categories and rates', Icons.tune),
            ],
          ),
        ),
      ),
    );
  }

  Widget _card(String title, String subtitle, IconData icon) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AllColor.white,
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: AllColor.border),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12.w),
            decoration: BoxDecoration(color: AllColor.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12.r)),
            child: Icon(icon, color: AllColor.primary, size: 24.sp),
          ),
          SizedBox(width: 16.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
                SizedBox(height: 4.h),
                Text(subtitle, style: TextStyle(fontSize: 12.sp, color: AllColor.mutedForeground)),
              ],
            ),
          ),
          Icon(Icons.chevron_right, color: AllColor.mutedForeground),
        ],
      ),
    );
  }
}
