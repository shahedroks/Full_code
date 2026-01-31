import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';
import 'package:renizo/core/utils/auth_local_storage.dart';
import 'package:renizo/features/auth/screens/login_screen.dart';

/// Seller profile – converted from React SellerProfileScreen.tsx.
class SellerProfileScreen extends StatelessWidget {
  const SellerProfileScreen({
    super.key,
    this.showAppBar = true,
    this.onLogout,
  });

  final bool showAppBar;
  final VoidCallback? onLogout;

  @override
  Widget build(BuildContext context) {
    final body = SafeArea(
      child: FutureBuilder(
        future: AuthLocalStorage.getCurrentUser(),
        builder: (context, snap) {
          final user = snap.data;
          return ListView(
            padding: EdgeInsets.all(16.w),
            children: [
              if (user != null)
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
              SizedBox(height: 24.h),
              ListTile(leading: Icon(Icons.person_outline, color: AllColor.primary), title: Text('Edit Profile', style: TextStyle(color: AllColor.foreground)), trailing: Icon(Icons.chevron_right, color: AllColor.mutedForeground), onTap: () {}),
              ListTile(leading: Icon(Icons.settings_outlined, color: AllColor.primary), title: Text('Settings', style: TextStyle(color: AllColor.foreground)), trailing: Icon(Icons.chevron_right, color: AllColor.mutedForeground), onTap: () {}),
              ListTile(
                leading: Icon(Icons.logout, color: AllColor.destructive),
                title: Text('Log Out', style: TextStyle(color: AllColor.destructive)),
                onTap: () async {
                  if (onLogout != null) {
                    onLogout!();
                    return;
                  }
                  await AuthLocalStorage.clearSession();
                  if (context.mounted) context.go(LoginScreen.routeName);
                },
              ),
            ],
          );
        },
      ),
    );

    if (!showAppBar) return Scaffold(backgroundColor: AllColor.background, body: body);
    return Scaffold(
      backgroundColor: AllColor.background,
      appBar: AppBar(
        title: Text('Profile', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: AllColor.foreground)),
        backgroundColor: AllColor.background,
        elevation: 0,
      ),
      body: body,
    );
  }
}
