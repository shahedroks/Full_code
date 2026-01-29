import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';

/// Bookings list – converted from React BookingsScreen.tsx.
class BookingsScreen extends StatelessWidget {
  const BookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AllColor.background,
      appBar: AppBar(
        title: Text('My Bookings', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
        backgroundColor: AllColor.background,
        elevation: 0,
      ),
      body: SafeArea(
        child: ListView(
          padding: EdgeInsets.all(16.w),
          children: [
            Text('Upcoming and past bookings will appear here.', style: TextStyle(fontSize: 14.sp, color: AllColor.mutedForeground)),
            SizedBox(height: 24.h),
            _emptyCard('No bookings yet', 'Book a service from Home to see your appointments here.', Icons.calendar_today),
          ],
        ),
      ),
    );
  }

  Widget _emptyCard(String title, String sub, IconData icon) {
    return Container(
      padding: EdgeInsets.all(24.w),
      decoration: BoxDecoration(color: AllColor.muted, borderRadius: BorderRadius.circular(16.r)),
      child: Column(
        children: [
          Icon(icon, size: 48.sp, color: AllColor.mutedForeground),
          SizedBox(height: 16.h),
          Text(title, style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
          SizedBox(height: 8.h),
          Text(sub, style: TextStyle(fontSize: 14.sp, color: AllColor.mutedForeground), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
