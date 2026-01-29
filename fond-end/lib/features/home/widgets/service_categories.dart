import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';
import 'package:renizo/core/models/service_category.dart';

/// Service categories grid – converted from React ServiceCategories.tsx.
/// Uses confirmed primary #408AF1 (AllColor.primary).
class ServiceCategoriesWidget extends StatelessWidget {
  const ServiceCategoriesWidget({
    super.key,
    required this.categories,
    required this.onSelectCategory,
    this.loading = false,
  });

  final List<ServiceCategory> categories;
  final void Function(ServiceCategory category) onSelectCategory;
  final bool loading;

  static final List<ServiceCategory> _mockCategories = [
    const ServiceCategory(id: '1', name: 'Plumbing', icon: 'Wrench', description: ''),
    const ServiceCategory(id: '2', name: 'Electrical', icon: 'Zap', description: ''),
    const ServiceCategory(id: '3', name: 'Cleaning', icon: 'Sparkles', description: ''),
    const ServiceCategory(id: '4', name: 'Landscaping', icon: 'TreePine', description: ''),
    const ServiceCategory(id: '5', name: 'HVAC', icon: 'Thermometer', description: ''),
    const ServiceCategory(id: '6', name: 'Moving', icon: 'Truck', description: ''),
  ];

  static List<ServiceCategory> get mockCategories => _mockCategories;

  IconData _iconFor(String iconName) {
    switch (iconName) {
      case 'Wrench':
        return Icons.build;
      case 'Zap':
        return Icons.flash_on;
      case 'Sparkles':
        return Icons.auto_awesome;
      case 'TreePine':
        return Icons.park;
      case 'Thermometer':
        return Icons.thermostat;
      case 'Truck':
        return Icons.local_shipping;
      default:
        return Icons.build;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Padding(
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 24.h,
              width: 120.w,
              decoration: BoxDecoration(
                color: AllColor.muted,
                borderRadius: BorderRadius.circular(8.r),
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
                childAspectRatio: 1.1,
              ),
              itemCount: 6,
              itemBuilder: (_, __) => Container(
                decoration: BoxDecoration(
                  color: AllColor.muted,
                  borderRadius: BorderRadius.circular(16.r),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Services Available',
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.w600,
              color: AllColor.foreground,
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
              childAspectRatio: 1.1,
            ),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return Material(
                color: AllColor.white,
                borderRadius: BorderRadius.circular(16.r),
                elevation: 2,
                shadowColor: AllColor.primary.withOpacity(0.1),
                child: InkWell(
                  onTap: () => onSelectCategory(category),
                  borderRadius: BorderRadius.circular(16.r),
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
                            color: AllColor.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12.r),
                          ),
                          child: Icon(
                            _iconFor(category.icon),
                            size: 24.sp,
                            color: AllColor.primary,
                          ),
                        ),
                        SizedBox(height: 12.h),
                        Text(
                          category.name,
                          style: TextStyle(
                            fontSize: 16.sp,
                            fontWeight: FontWeight.w500,
                            color: AllColor.foreground,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
