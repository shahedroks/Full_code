import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:renizo/core/utils/auth_local_storage.dart';
import 'package:renizo/features/auth/screens/login_screen.dart';
import 'package:renizo/features/bookings/data/bookings_mock_data.dart';
import 'package:renizo/features/bookings/screens/booking_details_screen.dart';
import 'package:renizo/features/messages/screens/chat_screen.dart';
import 'package:renizo/features/notifications/screens/notifications_screen.dart';
import 'package:renizo/features/seller/screens/seller_bookings_screen.dart';
import 'package:renizo/features/seller/screens/seller_earnings_screen.dart';
import 'package:renizo/features/seller/screens/seller_home_screen.dart';
import 'package:renizo/features/seller/screens/seller_messages_screen.dart';
import 'package:renizo/features/seller/models/seller_job_item.dart';
import 'package:renizo/features/seller/screens/seller_profile_screen.dart';
import 'package:renizo/features/seller/widgets/seller_bottom_nav_bar.dart';

/// Provider app – full conversion from React ProviderApp.tsx.
/// Header (logo + notifications), body (home/bookings/messages/earnings/profile or overlay), bottom nav.
class ProviderAppScreen extends ConsumerStatefulWidget {
  const ProviderAppScreen({super.key});

  static const String routeName = '/seller';

  @override
  ConsumerState<ProviderAppScreen> createState() => _ProviderAppScreenState();
}

class _ProviderAppScreenState extends ConsumerState<ProviderAppScreen> {
  int _activeTab = 0; // 0=home, 1=bookings, 2=messages, 3=earnings, 4=profile
  String? _currentOverlay; // 'availability' | 'services' | 'pricing' | 'booking-details' | 'chat' | 'notifications'
  String? _selectedBookingId;
  String? _selectedChatId;

  bool _providerStatusActive = true; // 'active' | 'offline'
  List<SellerJobItem> _upcomingJobs = [];
  List<SellerJobItem> _pendingRequests = [];
  List<SellerJobItem> _allBookings = [];

  static const Color _headerBlue = Color(0xFF0060CF);
  static const Color _bgBlue = Color(0xFF2384F4);

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  Future<void> _loadBookings() async {
    await Future.delayed(const Duration(milliseconds: 400));
    if (!mounted) return;
    setState(() {
      // Pending (3) – match design: Residential Cleaning x2, Grass Cutting; Feb 1, Feb 7; Terrace, Kitimat
      _pendingRequests = [
        SellerJobItem(
          id: 'booking1',
          status: BookingStatus.pending,
          scheduledDate: '2026-02-01',
          scheduledTime: '10:00',
          customerName: 'Customer',
          categoryName: 'Residential Cleaning',
          townName: 'Terrace',
          notes: 'Need regular house cleaning with window cleaning',
        ),
        SellerJobItem(
          id: 'booking2',
          status: BookingStatus.pending,
          scheduledDate: '2026-02-07',
          scheduledTime: '14:00',
          customerName: 'Customer',
          categoryName: 'Grass Cutting',
          townName: 'Kitimat',
          notes: 'Medium yard needs mowing with edge trimming and leaf cleanup',
        ),
        SellerJobItem(
          id: 'booking3',
          status: BookingStatus.pending,
          scheduledDate: '2026-02-01',
          scheduledTime: '16:00',
          customerName: 'Customer',
          categoryName: 'Residential Cleaning',
          townName: 'Terrace',
          notes: 'Deep cleaning needed including fridge and oven',
        ),
      ];
      // Active (3) – confirmed/in-progress so tab counts match Pending (3), Active (3), Completed (0)
      _upcomingJobs = [
        SellerJobItem(
          id: 'booking4',
          status: BookingStatus.confirmed,
          scheduledDate: '2026-02-02',
          scheduledTime: '09:00',
          customerName: 'Customer',
          categoryName: 'Residential Cleaning',
          townName: 'Terrace',
        ),
        SellerJobItem(
          id: 'booking5',
          status: BookingStatus.inProgress,
          scheduledDate: '2026-02-03',
          scheduledTime: '11:00',
          customerName: 'Customer',
          categoryName: 'Grass Cutting',
          townName: 'Kitimat',
        ),
        SellerJobItem(
          id: 'booking6',
          status: BookingStatus.confirmed,
          scheduledDate: '2026-02-05',
          scheduledTime: '14:00',
          customerName: 'Customer',
          categoryName: 'Residential Cleaning',
          townName: 'Terrace',
        ),
      ];
      _allBookings = [..._pendingRequests, ..._upcomingJobs];
    });
  }

  void _showTab(int index) {
    setState(() {
      _activeTab = index;
      _currentOverlay = null;
    });
  }

  void _showOverlay(String overlay) {
    setState(() => _currentOverlay = overlay);
  }

  void _hideOverlay() {
    setState(() {
      _currentOverlay = null;
      _selectedBookingId = null;
      _selectedChatId = null;
    });
  }

  void _onSelectJob(String jobId) {
    setState(() {
      _selectedBookingId = jobId;
      _currentOverlay = 'booking-details';
    });
  }

  void _onOpenChat(String bookingId) {
    setState(() {
      _selectedChatId = bookingId;
      _currentOverlay = 'chat';
    });
  }

  void _onBackFromBookingDetails() {
    setState(() {
      _currentOverlay = null;
      _selectedBookingId = null;
    });
    _loadBookings();
  }

  void _onBackFromChat() {
    setState(() {
      _currentOverlay = null;
      _selectedChatId = null;
    });
  }

  void _onUpdateBooking(String bookingId, BookingStatus status) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Booking ${status.name}')),
    );
    _loadBookings();
    _onBackFromBookingDetails();
  }

  void _onStatusChange(bool active) {
    setState(() => _providerStatusActive = active);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(active ? 'Available' : 'Offline')),
    );
  }

  void _onLogout() async {
    await AuthLocalStorage.clearSession();
    if (!mounted) return;
    context.go(LoginScreen.routeName);
  }

  bool get _showBottomNav =>
      _currentOverlay == null ||
      ![
        'availability',
        'services',
        'pricing',
        'booking-details',
        'chat',
        'notifications'
      ].contains(_currentOverlay);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgBlue,
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: _currentOverlay != null ? _buildOverlayContent() : _buildTabContent(),
          ),
          if (_showBottomNav) SellerBottomNavBar(
                currentIndex: _activeTab,
                onTabTap: _showTab,
                pendingCount: _pendingRequests.length,
              ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.only(left: 16.w, right: 16.w, bottom: 12.h),
      decoration: BoxDecoration(
        color: _headerBlue,
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: SafeArea(
        bottom: false,
        child: Row(
          children: [
            Image.asset(
              'assets/Renizo.png',
              height: 40.h,
              width: null,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => Icon(Icons.home_repair_service, size: 32.sp, color: Colors.white),
            ),
            const Spacer(),
            IconButton(
              onPressed: () => _showOverlay('notifications'),
              icon: Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(Icons.notifications_none, size: 24.sp, color: Colors.white),
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      width: 8.w,
                      height: 8.w,
                      decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    ),
                  ),
                ],
              ),
              style: IconButton.styleFrom(
                backgroundColor: Colors.white.withOpacity(0.1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.r)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabContent() {
    switch (_activeTab) {
      case 0:
        return SellerHomeScreen(
          upcomingJobs: _upcomingJobs,
          pendingRequests: _pendingRequests,
          providerStatusActive: _providerStatusActive,
          onSelectJob: _onSelectJob,
          onManageServices: () => _showOverlay('services'),
          onManagePricing: () => _showOverlay('pricing'),
          onStatusChange: _onStatusChange,
        );
      case 1:
        return Container(
          color: const Color(0xFFF9FAFB),
          child: SellerBookingsScreen(
            showAppBar: false,
            bookings: _allBookings,
            onSelectBooking: _onSelectJob,
          ),
        );
      case 2:
        return Container(
          color: const Color(0xFFF9FAFB),
          child: SellerMessagesScreen(showAppBar: false, onSelectChat: (_, bookingId) => _onOpenChat(bookingId)),
        );
      case 3:
        return Container(
          color: const Color(0xFFF9FAFB),
          child: SellerEarningsScreen(showAppBar: false, bookings: _allBookings),
        );
      case 4:
        return Container(
          color: const Color(0xFFF9FAFB),
          child: SellerProfileScreen(showAppBar: false, onLogout: _onLogout),
        );
      default:
        return SellerHomeScreen(
          upcomingJobs: _upcomingJobs,
          pendingRequests: _pendingRequests,
          providerStatusActive: _providerStatusActive,
          onSelectJob: _onSelectJob,
          onManageServices: () => _showOverlay('services'),
          onManagePricing: () => _showOverlay('pricing'),
          onStatusChange: _onStatusChange,
        );
    }
  }

  Widget _buildOverlayContent() {
    switch (_currentOverlay) {
      case 'booking-details':
        if (_selectedBookingId == null) return const SizedBox.shrink();
        return BookingDetailsScreen(
          bookingId: _selectedBookingId!,
          onBack: _onBackFromBookingDetails,
          onOpenChat: (id) => _onOpenChat(id),
          onUpdateBooking: _onUpdateBooking,
          userRole: UserRole.provider,
        );
      case 'chat':
        if (_selectedChatId == null) return const SizedBox.shrink();
        return ChatScreen(
          bookingId: _selectedChatId,
          userRole: 'provider',
          onBack: _onBackFromChat,
        );
      case 'notifications':
        return NotificationsScreen(
          onBack: () => setState(() => _currentOverlay = null),
        );
      case 'availability':
        return _placeholderScreen('Availability', 'Set your working hours', () => setState(() => _currentOverlay = null));
      case 'services':
        return _placeholderScreen('Services', 'Coverage areas & categories', () => setState(() => _currentOverlay = null));
      case 'pricing':
        return _placeholderScreen('Pricing', 'Manage your rates', () => setState(() => _currentOverlay = null));
      default:
        return _buildTabContent();
    }
  }

  Widget _placeholderScreen(String title, String subtitle, VoidCallback onBack) {
    return Container(
      color: _bgBlue,
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.all(16.w),
              child: Row(
                children: [
                  IconButton(
                    onPressed: onBack,
                    icon: Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 22.sp),
                    style: IconButton.styleFrom(backgroundColor: Colors.white.withOpacity(0.1), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.r))),
                  ),
                  SizedBox(width: 12.w),
                  Text(title, style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: Colors.white)),
                ],
              ),
            ),
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(subtitle, style: TextStyle(fontSize: 16.sp, color: Colors.white70)),
                    SizedBox(height: 24.h),
                    Text('Coming soon', style: TextStyle(fontSize: 14.sp, color: Colors.white54)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
