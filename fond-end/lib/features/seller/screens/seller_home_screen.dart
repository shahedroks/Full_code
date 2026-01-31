import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/features/bookings/data/bookings_mock_data.dart';
import 'package:renizo/features/seller/models/seller_job_item.dart';

// TSX/Tailwind colors – same as SellerHome.tsx
class _SellerHomeColors {
  static const gray50 = Color(0xFFF9FAFB);
  static const gray100 = Color(0xFFF3F4F6);
  static const gray200 = Color(0xFFE5E7EB);
  static const gray400 = Color(0xFF9CA3AF);
  static const gray500 = Color(0xFF6B7280);
  static const gray600 = Color(0xFF4B5563);
  static const gray700 = Color(0xFF374151);
  static const gray900 = Color(0xFF111827);
  // Status badge (Tailwind)
  static const yellow50 = Color(0xFFFEFCE8);
  static const yellow700 = Color(0xFFA16207);
  static const yellow200 = Color(0xFFFEF08A);
  static const green50 = Color(0xFFF0FDF4);
  static const green700 = Color(0xFF15803D);
  static const green200 = Color(0xFFBBF7D0);
  static const blue50 = Color(0xFFEFF6FF);
  static const blue700 = Color(0xFF1D4ED8);
  static const blue200 = Color(0xFFBFDBFE);
  static const red50 = Color(0xFFFEF2F2);
  static const red700 = Color(0xFFB91C1C);
  static const red200 = Color(0xFFFECACA);
}

/// Format date like TSX: toLocaleDateString("en-US", { month: "short", day: "numeric" }) → "Jan 18"
String _formatScheduleDate(String scheduledDate) {
  if (scheduledDate.contains('-')) {
    final d = DateTime.tryParse(scheduledDate);
    if (d != null) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return '${months[d.month - 1]} ${d.day}';
    }
  }
  return scheduledDate;
}

/// Seller home – full conversion from React SellerHome.tsx.
/// Hero (avatar, stats, availability toggle), quick actions (Services, Pricing), job tabs + list.
class SellerHomeScreen extends StatelessWidget {
  const SellerHomeScreen({
    super.key,
    required this.upcomingJobs,
    required this.pendingRequests,
    required this.providerStatusActive,
    required this.onSelectJob,
    required this.onManageServices,
    required this.onManagePricing,
    required this.onStatusChange,
  });

  final List<SellerJobItem> upcomingJobs;
  final List<SellerJobItem> pendingRequests;
  final bool providerStatusActive;
  final void Function(String jobId) onSelectJob;
  final VoidCallback onManageServices;
  final VoidCallback onManagePricing;
  final void Function(bool active) onStatusChange;

  static const Color _heroBlue = Color(0xFF1B6BD4);
  static const Color _tabBlue = Color(0xFF003E93);

  @override
  Widget build(BuildContext context) {
    final allJobs = [...pendingRequests, ...upcomingJobs];
    return SellerHomeContent(
      upcomingJobs: upcomingJobs,
      pendingRequests: pendingRequests,
      allJobs: allJobs,
      providerStatusActive: providerStatusActive,
      onSelectJob: onSelectJob,
      onManageServices: onManageServices,
      onManagePricing: onManagePricing,
      onStatusChange: onStatusChange,
    );
  }
}

class SellerHomeContent extends StatefulWidget {
  const SellerHomeContent({
    super.key,
    required this.upcomingJobs,
    required this.pendingRequests,
    required this.allJobs,
    required this.providerStatusActive,
    required this.onSelectJob,
    required this.onManageServices,
    required this.onManagePricing,
    required this.onStatusChange,
  });

  final List<SellerJobItem> upcomingJobs;
  final List<SellerJobItem> pendingRequests;
  final List<SellerJobItem> allJobs;
  final bool providerStatusActive;
  final void Function(String jobId) onSelectJob;
  final VoidCallback onManageServices;
  final VoidCallback onManagePricing;
  final void Function(bool active) onStatusChange;

  @override
  State<SellerHomeContent> createState() => _SellerHomeContentState();
}

class _SellerHomeContentState extends State<SellerHomeContent> {
  String _jobTab = 'pending'; // pending | active | completed

  static const Color _heroBlue = Color(0xFF1B6BD4);
  static const Color _tabBlue = Color(0xFF003E93);

  List<SellerJobItem> get _filteredJobs {
    if (_jobTab == 'active') {
      return widget.allJobs.where((j) => j.status == BookingStatus.confirmed || j.status == BookingStatus.inProgress).toList();
    }
    if (_jobTab == 'completed') {
      return widget.allJobs.where((j) => j.status == BookingStatus.completed).toList();
    }
    return widget.allJobs.where((j) => j.status == BookingStatus.pending).toList();
  }

  @override
  Widget build(BuildContext context) {
    const totalJobs = 156;
    const rating = 4.8;
    const completionRate = 98;
    const providerName = 'Mike Johnson';
    const providerAvatar = 'https://i.pravatar.cc/300?u=mike-johnson';

    // TSX root: flex flex-col h-full bg-[#1B6BD4] → single blue background; Hero → Quick Actions → Bookings List
    return SingleChildScrollView(
      child: Container(
        width: double.infinity,
        color: _heroBlue,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Hero – TSX: bg-[#1B6BD4] px-4 pt-6 pb-8 flex-shrink-0
            Container(
              width: double.infinity,
              padding: EdgeInsets.fromLTRB(16.w, 24.h, 16.w, 32.h),
              decoration: BoxDecoration(color: _heroBlue),
              child: SafeArea(
                top: false,
                bottom: false,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                  // Decorative circles (TSX: absolute top-right and bottom-left)
                  Positioned(top: -80.h, right: -80.w, child: Container(width: 160.w, height: 160.w, decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(0.05)))),
                  Positioned(bottom: -60.h, left: -60.w, child: Container(width: 120.w, height: 120.w, decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withOpacity(0.05)))),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Container(
                                decoration: BoxDecoration(borderRadius: BorderRadius.circular(16.r), border: Border.all(color: Colors.white.withOpacity(0.3), width: 2), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 12, offset: const Offset(0, 4))]),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(14.r),
                                  child: CachedNetworkImage(
                                    imageUrl: providerAvatar,
                                    width: 64.w,
                                    height: 64.w,
                                    fit: BoxFit.cover,
                                    placeholder: (_, __) => Container(color: Colors.white24, child: Icon(Icons.person, color: Colors.white70, size: 32.sp)),
                                    errorWidget: (_, __, ___) => Container(color: Colors.white24, child: Icon(Icons.person, color: Colors.white70, size: 32.sp)),
                                  ),
                                ),
                              ),
                              Positioned(bottom: -2.h, right: -2.w, child: Container(width: 20.w, height: 20.w, decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.green.shade400, border: Border.all(color: const Color(0xFF408AF1), width: 2)))),
                            ],
                          ),
                          SizedBox(width: 16.w),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Welcome Back, $providerName! 👋', style: TextStyle(fontSize: 22.sp, fontWeight: FontWeight.w600, color: Colors.white)),
                                SizedBox(height: 4.h),
                                Text('Service Provider', style: TextStyle(fontSize: 14.sp, color: Colors.white.withOpacity(0.9))),
                              ],
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 24.h),
                      // Stats grid – TSX: icon in small colored box, value, label
                      Row(
                        children: [
                          Expanded(child: _StatCard(icon: Icons.schedule, value: '${widget.pendingRequests.length}', label: 'Pending', iconBgColor: Colors.yellow.withOpacity(0.2), iconColor: Colors.yellow.shade300)),
                          SizedBox(width: 12.w),
                          Expanded(child: _StatCard(icon: Icons.check_circle_outline, value: '${widget.upcomingJobs.length}', label: 'Active', iconBgColor: Colors.green.withOpacity(0.2), iconColor: Colors.green.shade300)),
                          SizedBox(width: 12.w),
                          Expanded(child: _StatCard(icon: Icons.star_outline, value: '$rating', label: 'Rating', iconBgColor: Colors.amber.withOpacity(0.2), iconColor: Colors.amber.shade300)),
                        ],
                      ),
                      SizedBox(height: 16.h),
                      // Performance badge – TSX: Success Rate + Total Jobs
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(16.r), border: Border.all(color: Colors.white.withOpacity(0.2))),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(children: [Icon(Icons.trending_up, color: Colors.green.shade300, size: 20.sp), SizedBox(width: 8.w), Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Success Rate', style: TextStyle(fontSize: 11.sp, color: Colors.white.withOpacity(0.8))), Text('$completionRate%', style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.w600, color: Colors.white))])]),
                            Row(children: [Icon(Icons.check_circle_outline, color: Colors.blue.shade300, size: 20.sp), SizedBox(width: 8.w), Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Total Jobs', style: TextStyle(fontSize: 11.sp, color: Colors.white.withOpacity(0.8))), Text('$totalJobs', style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.w600, color: Colors.white))])]),
                          ],
                        ),
                      ),
                      SizedBox(height: 16.h),
                      // Availability toggle – TSX: Clock icon, label, subtitle, toggle
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(16.r), border: Border.all(color: Colors.white.withOpacity(0.2))),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.schedule, color: Colors.white.withOpacity(0.9), size: 22.sp),
                                SizedBox(width: 8.w),
                                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                  Text('Availability Status', style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.w500, color: Colors.white)),
                                  Text(widget.providerStatusActive ? 'Accepting new jobs' : 'Not accepting jobs', style: TextStyle(fontSize: 12.sp, color: Colors.white.withOpacity(0.7))),
                                ]),
                              ],
                            ),
                            Switch(
                              value: widget.providerStatusActive,
                              onChanged: widget.onStatusChange,
                              activeTrackColor: Colors.green.shade400,
                              activeThumbColor: Colors.white,
                              inactiveTrackColor: Colors.white.withOpacity(0.3),
                              inactiveThumbColor: Colors.grey.shade200,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),  // Hero Container
          // Quick Actions – TSX: px-4 py-4 flex-shrink-0 (inherits root blue)
          Padding(
            padding: EdgeInsets.fromLTRB(16.w, 16.h, 16.w, 16.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('QUICK ACTIONS', style: TextStyle(fontSize: 11.sp, fontWeight: FontWeight.w600, color: Colors.white, letterSpacing: 1.5)),
                SizedBox(height: 12.h),
                  Row(
                    children: [
                      Expanded(
                        child: _QuickActionCard(
                          icon: Icons.location_on_outlined,
                          title: 'Services',
                          subtitle: 'Coverage areas',
                          color: const Color(0xFF3B82F6),
                          onTap: widget.onManageServices,
                        ),
                      ),
                      SizedBox(width: 12.w),
                      Expanded(
                        child: _QuickActionCard(
                          icon: Icons.attach_money,
                          title: 'Pricing',
                          subtitle: 'See the rates',
                          color: const Color(0xFF5DD9C1),
                          onTap: widget.onManagePricing,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          // Bookings List – TSX: py-4 pb-24 flex-shrink-0; inner px-4 for tabs and list
          Padding(
            padding: EdgeInsets.only(top: 16.h, bottom: 96.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Status Tabs – TSX: <div className="px-4"><div className="flex gap-2 mb-4 overflow-x-auto pb-2">buttons</div></div>
                Padding(
                  padding: EdgeInsets.only(left: 16.w, right: 16.w, bottom: 16.h),
                  child: ScrollConfiguration(
                    behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      padding: EdgeInsets.only(bottom: 8.h),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _TabChip(label: 'Pending (${widget.allJobs.where((j) => j.status == BookingStatus.pending).length})', isSelected: _jobTab == 'pending', onTap: () => setState(() => _jobTab = 'pending')),
                          SizedBox(width: 8.w),
                          _TabChip(label: 'Active (${widget.allJobs.where((j) => j.status == BookingStatus.confirmed || j.status == BookingStatus.inProgress).length})', isSelected: _jobTab == 'active', onTap: () => setState(() => _jobTab = 'active')),
                          SizedBox(width: 8.w),
                          _TabChip(label: 'Completed (${widget.allJobs.where((j) => j.status == BookingStatus.completed).length})', isSelected: _jobTab == 'completed', onTap: () => setState(() => _jobTab = 'completed')),
                        ],
                      ),
                    ),
                  ),
                ),
                // Filtered Jobs List – TSX: <div className="px-4"> space-y-3
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16.w),
                  child: _filteredJobs.isEmpty
                      ? _EmptyJobs(activeTab: _jobTab)
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: _filteredJobs.asMap().entries.map((entry) {
                            final index = entry.key;
                            final job = entry.value;
                            return Padding(
                              padding: EdgeInsets.only(bottom: 12.h),
                              child: _AnimatedJobCard(
                                index: index,
                                job: job,
                                onSelect: () => widget.onSelectJob(job.id),
                              ),
                            );
                          }).toList(),
                        ),
                ),
              ],
            ),
          ),
        ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    this.iconBgColor,
    this.iconColor,
  });

  final IconData icon;
  final String value;
  final String label;
  final Color? iconBgColor;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    final bg = iconBgColor ?? Colors.white.withOpacity(0.2);
    final iconC = iconColor ?? Colors.white;
    return Container(
      padding: EdgeInsets.symmetric(vertical: 16.h, horizontal: 12.w),
      decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(16.r), border: Border.all(color: Colors.white.withOpacity(0.2))),
      child: Column(
        children: [
          Container(
            width: 32.w,
            height: 32.w,
            decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8.r)),
            child: Icon(icon, size: 18.sp, color: iconC),
          ),
          SizedBox(height: 8.h),
          Text(value, style: TextStyle(fontSize: 20.sp, fontWeight: FontWeight.bold, color: Colors.white)),
          SizedBox(height: 4.h),
          Text(label, style: TextStyle(fontSize: 11.sp, color: Colors.white.withOpacity(0.8))),
        ],
      ),
    );
  }
}

/// Quick Action card – matches TSX: p-4 rounded-2xl border-gray-100 shadow-sm,
/// icon box w-10 h-10 shadow-lg shadow-{color}/30, whileTap scale 0.98.
class _QuickActionCard extends StatefulWidget {
  const _QuickActionCard({required this.icon, required this.title, required this.subtitle, required this.color, required this.onTap});

  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  @override
  State<_QuickActionCard> createState() => _QuickActionCardState();
}

class _QuickActionCardState extends State<_QuickActionCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: widget.onTap,
        child: AnimatedScale(
          scale: _pressed ? 0.98 : 1.0,
          duration: const Duration(milliseconds: 100),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 100),
            padding: EdgeInsets.all(16.w),
            decoration: BoxDecoration(
              color: _pressed ? const Color(0xFFF9FAFB) : Colors.white,
              borderRadius: BorderRadius.circular(16.r),
              border: Border.all(color: const Color(0xFFF3F4F6)),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 1))],
            ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40.w,
                height: 40.w,
                margin: EdgeInsets.only(bottom: 12.h),
                decoration: BoxDecoration(
                  color: widget.color,
                  borderRadius: BorderRadius.circular(12.r),
                  boxShadow: [BoxShadow(color: widget.color.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 2))],
                ),
                child: Icon(widget.icon, size: 20.sp, color: Colors.white),
              ),
              Text(widget.title, style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.w600, color: const Color(0xFF111827))),
              SizedBox(height: 2.h),
              Text(widget.subtitle, style: TextStyle(fontSize: 12.sp, color: const Color(0xFF6B7280))),
            ],
          ),
        ),
      ),
    );
  }
}

/// TSX button: px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
/// selected: bg-[#003E93] text-white shadow-md | unselected: bg-white text-gray-600 hover:bg-gray-50
class _TabChip extends StatefulWidget {
  const _TabChip({required this.label, required this.isSelected, required this.onTap});

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  State<_TabChip> createState() => _TabChipState();
}

class _TabChipState extends State<_TabChip> {
  bool _pressed = false;

  static const Color _tabBlue = Color(0xFF003E93);
  static const Color _white = Color(0xFFFFFFFF);
  // Tailwind shadow-md
  static final List<BoxShadow> _shadowMd = [
    BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 6, offset: const Offset(0, 4)),
    BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4, offset: const Offset(0, 2)),
  ];

  @override
  Widget build(BuildContext context) {
    final isSelected = widget.isSelected;
    final bgColor = isSelected ? _tabBlue : (_pressed ? _SellerHomeColors.gray50 : _white);
    return GestureDetector(
      onTap: widget.onTap,
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12.r),
          boxShadow: isSelected ? _shadowMd : null,
        ),
        child: Text(
          widget.label,
          style: TextStyle(
            fontSize: 14.sp,
            fontWeight: FontWeight.w500,
            color: isSelected ? _white : _SellerHomeColors.gray600,
          ),
          overflow: TextOverflow.ellipsis,
          maxLines: 1,
        ),
      ),
    );
  }
}

/// Wraps SellerJobCard with TSX motion: initial opacity 0 x -20 → animate opacity 1 x 0, delay index*0.05
class _AnimatedJobCard extends StatefulWidget {
  const _AnimatedJobCard({required this.index, required this.job, required this.onSelect});

  final int index;
  final SellerJobItem job;
  final VoidCallback onSelect;

  @override
  State<_AnimatedJobCard> createState() => _AnimatedJobCardState();
}

class _AnimatedJobCardState extends State<_AnimatedJobCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: const Duration(milliseconds: 250), vsync: this);
    _opacity = Tween<double>(begin: 0, end: 1).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
    _slide = Tween<Offset>(begin: const Offset(-20, 0), end: Offset.zero).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
    Future.delayed(Duration(milliseconds: widget.index * 50), () { if (mounted) _controller.forward(); });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacity,
      child: SlideTransition(
        position: _slide,
        child: _SellerJobCard(booking: widget.job, onSelect: widget.onSelect),
      ),
    );
  }
}

class _SellerJobCard extends StatelessWidget {
  const _SellerJobCard({required this.booking, required this.onSelect});

  final SellerJobItem booking;
  final VoidCallback onSelect;

  @override
  Widget build(BuildContext context) {
    // Same status colors as TSX SellerJobCard (Tailwind)
    final statusColors = {
      BookingStatus.pending: (_SellerHomeColors.yellow50, _SellerHomeColors.yellow700, _SellerHomeColors.yellow200),
      BookingStatus.confirmed: (_SellerHomeColors.green50, _SellerHomeColors.green700, _SellerHomeColors.green200),
      BookingStatus.inProgress: (_SellerHomeColors.blue50, _SellerHomeColors.blue700, _SellerHomeColors.blue200),
      BookingStatus.completed: (_SellerHomeColors.gray50, _SellerHomeColors.gray700, _SellerHomeColors.gray200),
      BookingStatus.cancelled: (_SellerHomeColors.red50, _SellerHomeColors.red700, _SellerHomeColors.red200),
    };
    final triple = statusColors[booking.status] ?? (_SellerHomeColors.gray50, _SellerHomeColors.gray700, _SellerHomeColors.gray200);
    final bgColor = triple.$1;
    final textColor = triple.$2;
    final borderColor = triple.$3;
    final statusLabel = booking.status == BookingStatus.inProgress ? 'Active' : booking.status.name[0].toUpperCase() + booking.status.name.substring(1);
    final dateDisplay = _formatScheduleDate(booking.scheduledDate);

    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16.r),
      child: InkWell(
        onTap: onSelect,
        borderRadius: BorderRadius.circular(16.r),
        child: Container(
          padding: EdgeInsets.all(16.w),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16.r),
            border: Border.all(color: _SellerHomeColors.gray100),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 1))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40.w,
                    height: 40.w,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: [const Color(0xFF408AF1).withOpacity(0.1), const Color(0xFF5ca3f5).withOpacity(0.1)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                    child: Icon(Icons.person_outline, size: 20.sp, color: const Color(0xFF408AF1)),
                  ),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(booking.categoryName, style: TextStyle(fontSize: 15.sp, fontWeight: FontWeight.w600, color: _SellerHomeColors.gray900)),
                        SizedBox(height: 2.h),
                        Text(booking.customerName, style: TextStyle(fontSize: 14.sp, color: _SellerHomeColors.gray500)),
                      ],
                    ),
                  ),
                  Container(padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h), decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(12.r), border: Border.all(color: borderColor)), child: Text(statusLabel, style: TextStyle(fontSize: 12.sp, fontWeight: FontWeight.w500, color: textColor))),
                ],
              ),
              SizedBox(height: 12.h),
              Row(
                children: [
                  _InfoChip(icon: Icons.calendar_today_outlined, text: dateDisplay),
                  SizedBox(width: 8.w),
                  _InfoChip(icon: Icons.access_time, text: booking.scheduledTime),
                ],
              ),
              SizedBox(height: 12.h),
              Row(children: [Icon(Icons.location_on_outlined, size: 16.sp, color: _SellerHomeColors.gray400), SizedBox(width: 8.w), Text(booking.townName, style: TextStyle(fontSize: 14.sp, color: _SellerHomeColors.gray600))]),
              if (booking.notes != null && booking.notes!.isNotEmpty) ...[
                SizedBox(height: 8.h),
                Container(
                  padding: EdgeInsets.all(12.w),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [_SellerHomeColors.gray50, const Color(0xFFF3F4F6)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    borderRadius: BorderRadius.circular(12.r),
                    border: Border.all(color: _SellerHomeColors.gray100),
                  ),
                  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(Icons.description_outlined, size: 16.sp, color: _SellerHomeColors.gray400), SizedBox(width: 8.w), Expanded(child: Text(booking.notes!, style: TextStyle(fontSize: 14.sp, color: _SellerHomeColors.gray700, height: 1.35), maxLines: 2, overflow: TextOverflow.ellipsis))]),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// TSX: "text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
class _InfoChip extends StatelessWidget {
  const _InfoChip({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
      decoration: BoxDecoration(color: _SellerHomeColors.gray50, borderRadius: BorderRadius.circular(8.r)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [Icon(icon, size: 16.sp, color: _SellerHomeColors.gray400), SizedBox(width: 8.w), Text(text, style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.w500, color: _SellerHomeColors.gray600))]),
    );
  }
}

/// TSX: text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200
/// w-16 h-16 bg-gray-100 rounded-2xl mb-4, Calendar w-8 h-8 text-gray-400
/// "No {activeTab} jobs" font-medium text-gray-600 mb-1 | subtitle text-sm text-gray-500
class _EmptyJobs extends StatelessWidget {
  const _EmptyJobs({required this.activeTab});

  final String activeTab;

  @override
  Widget build(BuildContext context) {
    String msg = 'New requests will appear here';
    if (activeTab == 'active') msg = 'Active jobs will appear here';
    if (activeTab == 'completed') msg = 'Completed jobs will appear here';

    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 48.h),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Colors.white, _SellerHomeColors.gray50], begin: Alignment.topLeft, end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: _SellerHomeColors.gray200),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 64.w,
            height: 64.w,
            margin: EdgeInsets.only(bottom: 16.h),
            decoration: BoxDecoration(color: _SellerHomeColors.gray100, borderRadius: BorderRadius.circular(16.r)),
            child: Icon(Icons.calendar_today_outlined, size: 32.sp, color: _SellerHomeColors.gray400),
          ),
          Text('No $activeTab jobs', style: TextStyle(fontSize: 15.sp, fontWeight: FontWeight.w500, color: _SellerHomeColors.gray600)),
          SizedBox(height: 4.h),
          Text(msg, style: TextStyle(fontSize: 14.sp, color: _SellerHomeColors.gray500)),
        ],
      ),
    );
  }
}
