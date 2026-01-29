import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';
import 'package:renizo/core/models/provider_list_item.dart';

/// Top Rated Providers section – full conversion from just_tsx_code FeaturedProviders.tsx.
/// Shows loading skeleton, empty state, and provider cards with avatar, rating, #1 badge, available today.
class FeaturedProvidersWidget extends StatefulWidget {
  const FeaturedProvidersWidget({
    super.key,
    required this.selectedTownId,
    required this.onSelectProvider,
  });

  final String selectedTownId;
  final void Function(ProviderListItem provider) onSelectProvider;

  @override
  State<FeaturedProvidersWidget> createState() => _FeaturedProvidersWidgetState();
}

class _FeaturedProvidersWidgetState extends State<FeaturedProvidersWidget> {
  List<ProviderListItem> _providers = [];
  bool _loading = true;

  static List<ProviderListItem> _mockProviders(String townId) {
    if (townId.isEmpty) return [];
    return [
      const ProviderListItem(
        id: 'p1',
        displayName: 'Mike\'s Plumbing',
        avatar: '',
        rating: 4.9,
        reviewCount: 127,
        distance: '2.1 mi',
        responseTime: 'Within 2 hrs',
        availableToday: true,
        categoryNames: ['Plumbing'],
      ),
      const ProviderListItem(
        id: 'p2',
        displayName: 'Quick Fix Electric',
        avatar: '',
        rating: 4.8,
        reviewCount: 89,
        distance: '3.0 mi',
        responseTime: 'Within 1 hr',
        availableToday: true,
        categoryNames: ['Electrical'],
      ),
      const ProviderListItem(
        id: 'p3',
        displayName: 'Green Thumb Landscaping',
        avatar: '',
        rating: 4.7,
        reviewCount: 64,
        distance: '1.5 mi',
        responseTime: 'Within 3 hrs',
        availableToday: false,
        categoryNames: ['Landscaping'],
      ),
    ];
  }

  Future<void> _loadProviders() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 400));
    if (!mounted) return;
    setState(() {
      _providers = _mockProviders(widget.selectedTownId);
      _loading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    _loadProviders();
  }

  @override
  void didUpdateWidget(covariant FeaturedProvidersWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedTownId != widget.selectedTownId) {
      _loadProviders();
    }
  }

  void _handleSelectProvider(ProviderListItem provider) {
    widget.onSelectProvider(provider);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return _buildLoadingSkeleton();
    }
    if (_providers.isEmpty) {
      return const SizedBox.shrink();
    }
    return _buildContent();
  }

  Widget _buildLoadingSkeleton() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 24.h,
            width: 180.w,
            decoration: BoxDecoration(
              color: AllColor.muted,
              borderRadius: BorderRadius.circular(8.r),
            ),
          ),
          SizedBox(height: 16.h),
          ...List.generate(3, (_) => Padding(
            padding: EdgeInsets.only(bottom: 12.h),
            child: Container(
              height: 88.h,
              decoration: BoxDecoration(
                color: AllColor.muted,
                borderRadius: BorderRadius.circular(16.r),
              ),
            ),
          )),
        ],
      ),
    );
  }

  Widget _buildContent() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.trending_up, size: 22.sp, color: AllColor.foreground),
              SizedBox(width: 8.w),
              Text(
                'Top Rated Providers',
                style: TextStyle(
                  fontSize: 18.sp,
                  fontWeight: FontWeight.w600,
                  color: AllColor.foreground,
                ),
              ),
            ],
          ),
          SizedBox(height: 4.h),
          Text(
            'Highly recommended in your area',
            style: TextStyle(
              fontSize: 14.sp,
              color: AllColor.mutedForeground,
            ),
          ),
          SizedBox(height: 16.h),
          ...List.generate(_providers.length, (index) {
            final provider = _providers[index];
            return Padding(
              padding: EdgeInsets.only(bottom: 12.h),
              child: _ProviderCard(
                provider: provider,
                isFirst: index == 0,
                onTap: () => _handleSelectProvider(provider),
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _ProviderCard extends StatefulWidget {
  const _ProviderCard({
    required this.provider,
    required this.isFirst,
    required this.onTap,
  });

  final ProviderListItem provider;
  final bool isFirst;
  final VoidCallback onTap;

  @override
  State<_ProviderCard> createState() => _ProviderCardState();
}

class _ProviderCardState extends State<_ProviderCard> {
  bool _imageError = false;

  @override
  Widget build(BuildContext context) {
    final p = widget.provider;
    final initial = p.displayName.isNotEmpty ? p.displayName[0].toUpperCase() : '?';

    return Material(
      color: AllColor.white,
      borderRadius: BorderRadius.circular(16.r),
      elevation: 2,
      shadowColor: AllColor.primary.withOpacity(0.1),
      child: InkWell(
        onTap: widget.onTap,
        borderRadius: BorderRadius.circular(16.r),
        child: Stack(
          children: [
            Padding(
              padding: EdgeInsets.all(16.w),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12.r),
                    child: Container(
                      width: 64.w,
                      height: 64.h,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [Color(0xFF408AF1), Color(0xFF5ca3f5)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AllColor.primary.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: p.avatar.isNotEmpty && !_imageError
                          ? CachedNetworkImage(
                              imageUrl: p.avatar,
                              fit: BoxFit.cover,
                              placeholder: (_, __) => Center(
                                child: Text(
                                  initial,
                                  style: TextStyle(
                                    fontSize: 24.sp,
                                    fontWeight: FontWeight.w600,
                                    color: AllColor.white,
                                  ),
                                ),
                              ),
                              errorWidget: (_, __, ___) {
                                WidgetsBinding.instance.addPostFrameCallback((_) {
                                  if (mounted) setState(() => _imageError = true);
                                });
                                return Center(
                                  child: Text(
                                    initial,
                                    style: TextStyle(
                                      fontSize: 24.sp,
                                      fontWeight: FontWeight.w600,
                                      color: AllColor.white,
                                    ),
                                  ),
                                );
                              },
                            )
                          : Center(
                              child: Text(
                                initial,
                                style: TextStyle(
                                  fontSize: 24.sp,
                                  fontWeight: FontWeight.w600,
                                  color: AllColor.white,
                                ),
                              ),
                            ),
                    ),
                  ),
                  SizedBox(width: 16.w),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          p.displayName,
                          style: TextStyle(
                            fontSize: 16.sp,
                            fontWeight: FontWeight.w500,
                            color: AllColor.foreground,
                          ),
                        ),
                        SizedBox(height: 6.h),
                        Row(
                          children: [
                            Icon(Icons.star, size: 16.sp, color: const Color(0xFFFBBF24)),
                            SizedBox(width: 4.w),
                            Text(
                              p.rating.toString(),
                              style: TextStyle(
                                fontSize: 14.sp,
                                fontWeight: FontWeight.w500,
                                color: AllColor.foreground,
                              ),
                            ),
                            SizedBox(width: 8.w),
                            Text(
                              '•',
                              style: TextStyle(
                                fontSize: 12.sp,
                                color: AllColor.mutedForeground,
                              ),
                            ),
                            SizedBox(width: 8.w),
                            Text(
                              '${p.reviewCount} reviews',
                              style: TextStyle(
                                fontSize: 12.sp,
                                color: AllColor.mutedForeground,
                              ),
                            ),
                          ],
                        ),
                        if (p.availableToday) ...[
                          SizedBox(height: 8.h),
                          Container(
                            padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD1FAE5),
                              borderRadius: BorderRadius.circular(999.r),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6.w,
                                  height: 6.h,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF10B981),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                SizedBox(width: 6.w),
                                Text(
                                  'Available Today',
                                  style: TextStyle(
                                    fontSize: 12.sp,
                                    fontWeight: FontWeight.w500,
                                    color: const Color(0xFF047857),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
            if (widget.isFirst)
              Positioned(
                top: 12.h,
                right: 12.w,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 6.h),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFBBF24), Color(0xFFF59E0B)],
                    ),
                    borderRadius: BorderRadius.circular(999.r),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.emoji_events, size: 14.sp, color: AllColor.white),
                      SizedBox(width: 4.w),
                      Text(
                        '#1',
                        style: TextStyle(
                          fontSize: 12.sp,
                          fontWeight: FontWeight.w600,
                          color: AllColor.white,
                        ),
                      ),
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
