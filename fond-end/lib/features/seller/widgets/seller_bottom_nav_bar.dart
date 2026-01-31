import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

/// Seller bottom nav bar – converted from React SellerBottomNav.tsx.
/// Blue #003E93, 5 tabs: Home, Bookings, Messages, Earnings, Profile.
class SellerBottomNavBar extends StatelessWidget {
  const SellerBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTabTap,
    this.pendingCount = 0,
    this.unreadMessages = 0,
  });

  final int currentIndex;
  final void Function(int index) onTabTap;
  final int pendingCount;
  final int unreadMessages;

  static const Color _navBlue = Color(0xFF003E93);
  static const Color _activeGradientStart = Color(0xFF408AF1);
  static const Color _activeGradientEnd = Color(0xFF5ca3f5);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 1.h),
      decoration: BoxDecoration(
        color: _navBlue,
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavItem(icon: Icons.home_rounded, label: 'Home', isActive: currentIndex == 0, onTap: () => onTabTap(0)),
            _NavItem(icon: Icons.calendar_today_rounded, label: 'Bookings', isActive: currentIndex == 1, badge: pendingCount, onTap: () => onTabTap(1)),
            _NavItem(icon: Icons.chat_bubble_outline_rounded, label: 'Messages', isActive: currentIndex == 2, badge: unreadMessages, onTap: () => onTabTap(2)),
            _NavItem(icon: Icons.payments_outlined, label: 'Earnings', isActive: currentIndex == 3, onTap: () => onTabTap(3)),
            _NavItem(icon: Icons.person_outline_rounded, label: 'Profile', isActive: currentIndex == 4, onTap: () => onTabTap(4)),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
    this.badge = 0,
  });

  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;
  final int badge;

  static const Color _activeGradientStart = Color(0xFF408AF1);
  static const Color _activeGradientEnd = Color(0xFF5ca3f5);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16.r),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  padding: EdgeInsets.all(10.w),
                  decoration: BoxDecoration(
                    gradient: isActive ? const LinearGradient(colors: [_activeGradientStart, _activeGradientEnd], begin: Alignment.topLeft, end: Alignment.bottomRight) : null,
                    color: isActive ? null : Colors.transparent,
                    borderRadius: BorderRadius.circular(16.r),
                  ),
                  child: Icon(icon, size: 22.sp, color: isActive ? Colors.white : Colors.white70),
                ),
                if (badge > 0)
                  Positioned(
                    top: -2,
                    right: -2,
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 2.h),
                      decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(10.r)),
                      child: Text('$badge', style: TextStyle(fontSize: 10.sp, color: Colors.white, fontWeight: FontWeight.w600)),
                    ),
                  ),
              ],
            ),
            SizedBox(height: 4.h),
            Text(
              label,
              style: TextStyle(fontSize: 11.sp, color: isActive ? Colors.white : Colors.white70, fontWeight: isActive ? FontWeight.w600 : FontWeight.normal),
            ),
          ],
        ),
      ),
    );
  }
}
