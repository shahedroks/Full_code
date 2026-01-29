import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';

/// Seller bookings – converted from React SellerBookingsScreen.tsx.
class SellerBookingsScreen extends StatelessWidget {
  const SellerBookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AllColor.background,
      appBar: AppBar(title: Text('Bookings', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)), backgroundColor: AllColor.background, elevation: 0),
      body: SafeArea(child: Center(child: Text('Your job bookings', style: TextStyle(fontSize: 16.sp, color: AllColor.mutedForeground)))),
    );
  }
}
