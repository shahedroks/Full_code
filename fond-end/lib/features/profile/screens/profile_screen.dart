import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';
import 'package:renizo/core/utils/auth_local_storage.dart';
import 'package:renizo/features/auth/screens/login_screen.dart';

/// Profile – converted from React ProfileScreen.tsx.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AllColor.background,
      appBar: AppBar(
        title: Text('Account', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
        backgroundColor: AllColor.background,
        elevation: 0,
      ),
      body: SafeArea(
        child: FutureBuilder(
          future: AuthLocalStorage.getCurrentUser(),
          builder: (context, snap) {
            final user = snap.data;
            return ListView(
              padding: EdgeInsets.all(16.w),
              children: [
                if (user != null) ...[
                  Center(
                    child: Column(
                      children: [
                        CircleAvatar(radius: 40.r, backgroundColor: AllColor.primary, child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?', style: TextStyle(fontSize: 24.sp, color: AllColor.white))),
                        SizedBox(height: 12.h),
                        Text(user.name, style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
                        Text(user.email, style: TextStyle(fontSize: 14.sp, color: AllColor.mutedForeground)),
                      ],
                    ),
                  ),
                  SizedBox(height: 32.h),
                ],
                _tile(Icons.person_outline, 'Edit Profile', () {}),
                _tile(Icons.lock_outline, 'Change Password', () {}),
                _tile(Icons.settings_outlined, 'Settings', () {}),
                _tile(Icons.help_outline, 'Help & Support', () {}),
                _tile(Icons.privacy_tip_outlined, 'Privacy Policy', () {}),
                _tile(Icons.description_outlined, 'Terms of Service', () {}),
                SizedBox(height: 24.h),
                _tile(Icons.logout, 'Log Out', () async {
                  await AuthLocalStorage.clearSession();
                  if (context.mounted) context.go(LoginScreen.routeName);
                }, color: AllColor.destructive),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _tile(IconData icon, String label, VoidCallback onTap, {Color? color}) {
    return ListTile(
      leading: Icon(icon, color: color ?? AllColor.primary, size: 24.sp),
      title: Text(label, style: TextStyle(fontSize: 16.sp, color: color ?? AllColor.foreground)),
      trailing: Icon(Icons.chevron_right, color: AllColor.mutedForeground),
      onTap: onTap,
    );
  }
}
