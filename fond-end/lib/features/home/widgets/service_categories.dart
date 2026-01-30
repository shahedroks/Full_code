import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';
import 'package:renizo/core/models/service_category.dart';

/// Primary blue from React ServiceCategories (text-[#408AF1], gradient).
const Color _primary = Color(0xFF408AF1);
const Color _primaryLight = Color(0xFF5ca3f5);

/// Service categories – full conversion from React ServiceCategories.tsx.
/// Props: selectedTownId, onSelectCategory. Loads categories when selectedTownId changes.
class ServiceCategoriesWidget extends StatefulWidget {
  const ServiceCategoriesWidget({
    super.key,
    required this.selectedTownId,
    required this.onSelectCategory,
    /// When true, "Services Available" title uses white (e.g. on blue background).
    this.lightTitle = false,
  });

  final String selectedTownId;
  final void Function(ServiceCategory category) onSelectCategory;
  final bool lightTitle;

  /// Same 8 categories as React MockDataRepository.ts / image design.
  static final List<ServiceCategory> _mockCategories = [
    const ServiceCategory(id: 'cat1', name: 'Residential Cleaning', icon: 'Home', description: 'Professional home cleaning services'),
    const ServiceCategory(id: 'cat2', name: 'Commercial Cleaning', icon: 'Building2', description: 'Office and commercial space cleaning'),
    const ServiceCategory(id: 'cat3', name: 'Contract Cleaning', icon: 'CalendarCheck', description: 'Scheduled recurring cleaning'),
    const ServiceCategory(id: 'cat4', name: 'Floor Waxing', icon: 'Sparkles', description: 'Professional floor care'),
    const ServiceCategory(id: 'cat5', name: 'Pressure Washing', icon: 'Droplets', description: 'Power washing services'),
    const ServiceCategory(id: 'cat6', name: 'Grass Cutting', icon: 'Scissors', description: 'Lawn maintenance services'),
    const ServiceCategory(id: 'cat7', name: 'Snow Removal', icon: 'Snowflake', description: 'Winter snow clearing'),
    const ServiceCategory(id: 'cat8', name: 'Laundry', icon: 'Shirt', description: 'Laundry and ironing services'),
  ];

  static List<ServiceCategory> get mockCategories => _mockCategories;

  @override
  State<ServiceCategoriesWidget> createState() => _ServiceCategoriesWidgetState();
}

class _ServiceCategoriesWidgetState extends State<ServiceCategoriesWidget> {
  List<ServiceCategory> _categories = [];
  bool _loading = true;

  /// Icon name (React Lucide) → SVG asset. Matches MockDataRepository + image design.
  static const Map<String, String> _iconAssets = {
    'Home': 'assets/images/icons/home.svg',
    'Building2': 'assets/images/icons/building-2.svg',
    'CalendarCheck': 'assets/images/icons/calendar-check.svg',
    'Sparkles': 'assets/images/icons/sparkles.svg',
    'Droplets': 'assets/images/icons/droplets.svg',
    'Scissors': 'assets/images/icons/scissors.svg',
    'Snowflake': 'assets/images/icons/snowflake.svg',
    'Shirt': 'assets/images/icons/shirt.svg',
  };

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void didUpdateWidget(covariant ServiceCategoriesWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedTownId != widget.selectedTownId) {
      _loadCategories();
    }
  }

  Future<void> _loadCategories() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 300));
    if (!mounted) return;
    setState(() {
      _categories = ServiceCategoriesWidget._mockCategories;
      _loading = false;
    });
  }

  String? _iconAssetFor(String iconName) => _iconAssets[iconName];

  Widget _buildCategoryIcon(String iconName, double size) {
    final asset = _iconAssetFor(iconName);
    if (asset != null) {
      return SvgPicture.asset(
        asset,
        width: size,
        height: size,
        colorFilter: const ColorFilter.mode(_primary, BlendMode.srcIn),
      );
    }
    return Icon(_fallbackIconFor(iconName), size: size, color: _primary);
  }

  IconData _fallbackIconFor(String iconName) {
    switch (iconName) {
      case 'Home': return LucideIcons.house;
      case 'Building2': return LucideIcons.building2;
      case 'CalendarCheck': return LucideIcons.calendarCheck;
      case 'Sparkles': return LucideIcons.sparkles;
      case 'Droplets': return LucideIcons.droplets;
      case 'Scissors': return LucideIcons.scissors;
      case 'Snowflake': return LucideIcons.snowflake;
      case 'Shirt': return LucideIcons.shirt;
      default: return LucideIcons.sparkles;
    }
  }

  /// Loading skeleton – matches React: px-4 py-6, h-6 bg-white/20 w-32, grid-cols-4 gap-3, 8 items h-20 bg-white/20 rounded-2xl.
  Widget _buildLoading() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 24.h,
            width: 128.w,
            decoration: BoxDecoration(
              color: AllColor.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8.r),
            ),
          ),
          SizedBox(height: 16.h),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              mainAxisSpacing: 12.w,
              crossAxisSpacing: 12.w,
              childAspectRatio: 0.85,
            ),
            itemCount: 8,
            itemBuilder: (_, __) => Container(
              decoration: BoxDecoration(
                color: AllColor.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16.r),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Content – matches React: px-4 py-6 pb-8, h3 "Services Available", grid-cols-2 gap-3, cards with gradient icon box, border, shadow, hover scale.
  Widget _buildContent() {
    final titleColor = widget.lightTitle ? AllColor.white : AllColor.foreground;
    return Padding(
      padding: EdgeInsets.fromLTRB(16.w, 24.h, 16.w, 32.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Services Available',
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.w600,
              color: titleColor,
            ),
          ),
          SizedBox(height: 16.h),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12.h,
              crossAxisSpacing: 12.w,
              childAspectRatio: 1.0,
            ),
            itemCount: _categories.length,
            itemBuilder: (context, index) {
              final category = _categories[index];
              return _CategoryCard(
                category: category,
                index: index,
                buildIcon: _buildCategoryIcon,
                onTap: () => widget.onSelectCategory(category),
              );
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return _buildLoading();
    return _buildContent();
  }
}

/// Single category card – matches React motion.button: bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border border-gray-100 hover:scale-105, icon box gradient.
class _CategoryCard extends StatefulWidget {
  const _CategoryCard({
    required this.category,
    required this.index,
    required this.buildIcon,
    required this.onTap,
  });

  final ServiceCategory category;
  final int index;
  final Widget Function(String iconName, double size) buildIcon;
  final VoidCallback onTap;

  @override
  State<_CategoryCard> createState() => _CategoryCardState();
}

class _CategoryCardState extends State<_CategoryCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _scale = Tween<double>(begin: 0.9, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    Future.delayed(Duration(milliseconds: (widget.index * 50).round()), () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacity.value,
          child: Transform.scale(
            scale: _scale.value,
            child: child,
          ),
        );
      },
      child: Material(
        color: AllColor.white,
        borderRadius: BorderRadius.circular(16.r),
        elevation: 2,
        shadowColor: AllColor.primary.withOpacity(0.1),
        child: InkWell(
          onTap: widget.onTap,
          borderRadius: BorderRadius.circular(16.r),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16.r),
              border: Border.all(color: const Color(0xFFF3F4F6)),
            ),
            child: Padding(
              padding: EdgeInsets.all(20.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 48.w,
                    height: 48.h,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          _primary.withOpacity(0.1),
                          _primaryLight.withOpacity(0.1),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                    child: Center(
                      child: widget.buildIcon(widget.category.icon, 24.sp),
                    ),
                  ),
                  SizedBox(height: 12.h),
                  Text(
                    widget.category.name,
                    style: TextStyle(
                      fontSize: 16.sp,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF111827),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
