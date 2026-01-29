import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';

/// Onboarding slides – converted from React OnboardingSlides.tsx.
/// Uses confirmed colors from "just for confirm the color." theme.
class OnboardingSlidesScreen extends StatefulWidget {
  const OnboardingSlidesScreen({super.key, this.onComplete});

  static const String routeName = '/onboarding';

  final VoidCallback? onComplete;

  @override
  State<OnboardingSlidesScreen> createState() => _OnboardingSlidesScreenState();
}

class _OnboardingSlidesScreenState extends State<OnboardingSlidesScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  static const List<({String title, String description, IconData icon, List<Color> gradientColors})> _slides = [
    (
      title: 'Find Local Experts',
      description: 'Discover trusted service providers in your town with verified ratings and reviews',
      icon: Icons.search,
      gradientColors: [Color(0xFF3B82F6), Color(0xFF2563EB)],
    ),
    (
      title: 'Secure Payments',
      description: 'Pay safely through the app with secure payment processing',
      icon: Icons.shield_outlined,
      gradientColors: [Color(0xFF10B981), Color(0xFF059669)],
    ),
    (
      title: 'Safe Communication',
      description: 'Chat directly with providers while keeping your contact info private',
      icon: Icons.chat_bubble_outline,
      gradientColors: [Color(0xFF8B5CF6), Color(0xFF7C3AED)],
    ),
  ];

  void _onNext() {
    if (_currentPage < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() => _currentPage++);
    } else {
      widget.onComplete?.call();
    }
  }

  void _onSkip() {
    widget.onComplete?.call();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AllColor.background,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (i) => setState(() => _currentPage = i),
                itemCount: _slides.length,
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32.w, vertical: 48.h),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 112.w,
                          height: 112.h,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: slide.gradientColors,
                            ),
                            borderRadius: BorderRadius.circular(24.r),
                            boxShadow: [
                              BoxShadow(
                                color: slide.gradientColors.first.withOpacity(0.3),
                                blurRadius: 16,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: Icon(slide.icon, size: 56.sp, color: AllColor.white),
                        ),
                        SizedBox(height: 32.h),
                        Text(
                          slide.title,
                          style: TextStyle(
                            fontSize: 24.sp,
                            fontWeight: FontWeight.w600,
                            color: AllColor.foreground,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 16.h),
                        Text(
                          slide.description,
                          style: TextStyle(
                            fontSize: 16.sp,
                            height: 1.5,
                            color: AllColor.mutedForeground,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32.w, vertical: 48.h),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _slides.length,
                      (i) => AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: EdgeInsets.symmetric(horizontal: 4.w),
                        height: 8.h,
                        width: i == _currentPage ? 32.w : 8.w,
                        decoration: BoxDecoration(
                          color: i == _currentPage ? AllColor.primary : AllColor.grey200,
                          borderRadius: BorderRadius.circular(4.r),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 32.h),
                  Row(
                    children: [
                      if (_currentPage < _slides.length - 1)
                        Expanded(
                          child: TextButton(
                            onPressed: _onSkip,
                            child: Text(
                              'Skip',
                              style: TextStyle(
                                fontSize: 16.sp,
                                fontWeight: FontWeight.w500,
                                color: AllColor.mutedForeground,
                              ),
                            ),
                          ),
                        ),
                      Expanded(
                        flex: _currentPage < _slides.length - 1 ? 1 : 2,
                        child: FilledButton.icon(
                          onPressed: _onNext,
                          icon: Icon(
                            _currentPage < _slides.length - 1 ? Icons.chevron_right : Icons.check,
                            size: 20.sp,
                          ),
                          label: Text(
                            _currentPage < _slides.length - 1 ? 'Next' : 'Get Started',
                            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w500),
                          ),
                          style: FilledButton.styleFrom(
                            backgroundColor: AllColor.primary,
                            foregroundColor: AllColor.primaryForeground,
                            padding: EdgeInsets.symmetric(vertical: 16.h),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16.r),
                            ),
                            elevation: 2,
                            shadowColor: AllColor.primary.withOpacity(0.3),
                          ),
                        ),
                      ),
                    ],
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
