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
    /// When true, header title and subtitle use light colors (e.g. on blue background).
    this.lightHeader = false,
  });

  final String selectedTownId;
  final void Function(ProviderListItem provider) onSelectProvider;
  final bool lightHeader;

  @override
  State<FeaturedProvidersWidget> createState() => _FeaturedProvidersWidgetState();
}

class _FeaturedProvidersWidgetState extends State<FeaturedProvidersWidget> {
  List<ProviderListItem> _providers = [];
  bool _loading = true;

  /// Avatar URLs from MockDataRepository.ts (providerAvatars) – same as React app.
  static const String _avatarSparkle =
      'https://images.unsplash.com/photo-1667328549104-c125874407be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTE0MTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  static const String _avatarOffice =
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3JrZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5MTgxNTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  /// Mock providers for Top Rated section. Avatars match MockDataRepository.ts
  /// (Sparkle Home Cleaning, Floor Care Experts, Pro Office Clean).
  static List<ProviderListItem> _mockProviders(String townId) {
    return [
      const ProviderListItem(
        id: 'p1',
        displayName: 'Sparkle Home Cleaning',
        avatar: _avatarSparkle,
        rating: 4.9,
        reviewCount: 108,
        distance: '2.1 mi',
        responseTime: 'Within 2 hrs',
        availableToday: false,
        categoryNames: ['Cleaning'],
      ),
      const ProviderListItem(
        id: 'p2',
        displayName: 'Floor Care Experts',
        avatar: _avatarSparkle,
        rating: 4.9,
        reviewCount: 63,
        distance: '3.0 mi',
        responseTime: 'Within 1 hr',
        availableToday: false,
        categoryNames: ['Cleaning'],
      ),
      const ProviderListItem(
        id: 'p3',
        displayName: 'Pro Office Clean',
        avatar: _avatarOffice,
        rating: 4.8,
        reviewCount: 159,
        distance: '1.5 mi',
        responseTime: 'Within 3 hrs',
        availableToday: false,
        categoryNames: ['Cleaning'],
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

  /// Loading skeleton – matches React: px-4 py-6, h-6 bg-white/20 w-48, then horizontal row of 3 cards min-w-[280px] h-32 bg-white/20 rounded-2xl gap-3.
  Widget _buildLoadingSkeleton() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 24.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 24.h,
            width: 192.w,
            decoration: BoxDecoration(
              color: AllColor.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8.r),
            ),
          ),
          SizedBox(height: 16.h),
          SizedBox(
            height: 128.h,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              separatorBuilder: (_, __) => SizedBox(width: 12.w),
              itemBuilder: (_, __) => Container(
                width: 280.w,
                decoration: BoxDecoration(
                  color: AllColor.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16.r),
                ),
              ),
            ),
          ),
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
              Icon(
                Icons.trending_up,
                size: 22.sp,
                color: widget.lightHeader ? AllColor.white : AllColor.foreground,
              ),
              SizedBox(width: 8.w),
              Text(
                'Top Rated Providers',
                style: TextStyle(
                  fontSize: 18.sp,
                  fontWeight: FontWeight.w600,
                  color: widget.lightHeader ? AllColor.white : AllColor.foreground,
                ),
              ),
            ],
          ),
          SizedBox(height: 4.h),
          Text(
            'Highly recommended in your area',
            style: TextStyle(
              fontSize: 14.sp,
              color: widget.lightHeader
                  ? AllColor.white.withOpacity(0.9)
                  : AllColor.mutedForeground,
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
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16.r),
            border: Border.all(color: const Color(0xFFF3F4F6)),
          ),
          child: Stack(
            children: [
              Padding(
              padding: EdgeInsets.all(16.w),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Avatar: w-16 h-16 rounded-xl ring-2 ring-white shadow-md bg-gradient – matches React
                  Container(
                    width: 64.w,
                    height: 64.h,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12.r),
                      border: Border.all(color: AllColor.white, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10.r),
                      child: Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [Color(0xFF408AF1), Color(0xFF5ca3f5)],
                          ),
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
                  ),
                  SizedBox(width: 16.w),
                  Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(right: 32.w),
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
                          SizedBox(height: 4.h),
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
                      ],
                    ),
                  ),
                ),  // Expanded
                ],
              ),
            ),
            // Subtle overlay – matches React from-[#408AF1]/5 (behind badge)
            Positioned.fill(
              child: IgnorePointer(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16.r),
                    gradient: LinearGradient(
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                      colors: [
                        const Color(0xFF408AF1).withOpacity(0.03),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
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
      ),
    );
  }
}
