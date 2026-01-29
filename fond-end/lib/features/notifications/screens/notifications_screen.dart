import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';

/// Notifications – converted from React NotificationsScreen.tsx.
class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AllColor.background,
      appBar: AppBar(
        title: Text('Notifications', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
        backgroundColor: AllColor.background,
        elevation: 0,
      ),
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.notifications_none, size: 64.sp, color: AllColor.mutedForeground),
              SizedBox(height: 16.h),
              Text('No notifications', style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
              SizedBox(height: 8.h),
              Text('Booking and message alerts will show here.', style: TextStyle(fontSize: 14.sp, color: AllColor.mutedForeground)),
            ],
          ),
        ),
      ),
    );
  }
}
