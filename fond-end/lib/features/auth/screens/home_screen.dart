import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  
  static const String routeName = '/home';

  @override
  Widget build(BuildContext context) {
    // Design size appears to be 430x1947 (based on React component)
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Container(
          width: 430.w,
          height: 1947.h,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(25.r),
          ),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              // Status bar - 9:41
              Positioned(
                left: 7.65.sw,
                top: 1.32.sh,
                child: Text(
                  '9:41',
                  style: TextStyle(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),

              // Signal/Battery indicator (tower icon)
              Positioned(
                left: 349.26.w,
                top: 28.73.h,
                width: 58.274.w,
                height: 11.92.h,
                child: Image.asset(
                  'assets/image 66.png', // Placeholder - update with actual asset
                  fit: BoxFit.cover,
                ),
              ),

              // Dashboard title
              Positioned(
                left: 36.21.sw,
                top: 3.24.sh,
                child: Text(
                  'Dashboard',
                  style: TextStyle(
                    fontSize: 22.sp,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),

              // HVAC button
              _buildCategoryButton(
                left: 13.w,
                top: 104.h,
                width: 123.w,
                height: 63.h,
                label: 'HVAC',
                isSelected: true,
              ),

              // Light button
              _buildCategoryButton(
                left: 294.w,
                top: 105.h,
                width: 123.w,
                height: 63.h,
                label: 'Light',
                isSelected: false,
              ),

              // Shading button (middle)
              _buildCategoryButton(
                left: 146.w,
                top: 105.h,
                width: 138.w,
                height: 63.h,
                label: 'Shading',
                isSelected: false,
              ),

              // Additional shading button (far right)
              _buildCategoryButton(
                left: 428.w,
                top: 105.h,
                width: 137.w,
                height: 63.h,
                label: 'Shading',
                isSelected: false,
              ),

              // Group1 - Left icon circle
              _buildIconCircle(left: 24.w, top: 115.h),

              // Group2 - Right icon circle
              _buildIconCircle(left: 306.64.w, top: 115.55.h),

              // Group10 - Middle icon circle
              _buildIconCircle(left: 158.w, top: 117.h),

              // Group3 - Far right icon circle
              _buildIconCircle(left: 441.w, top: 116.h),

              // Lighting section title
              Positioned(
                left: 3.5.sw,
                top: 31.23.sh,
                child: Text(
                  'Lighting',
                  style: TextStyle(
                    fontSize: 22.sp,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),

              // Light section cards
              ..._buildLightSectionCards(),

              // Favorites section title
              Positioned(
                left: 3.76.sw,
                top: 48.28.sh,
                child: Text(
                  'Favorites',
                  style: TextStyle(
                    fontSize: 22.sp,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),

              // Favorites cards
              ..._buildFavoritesCards(),

              // Shading section title
              Positioned(
                left: 3.72.sw,
                top: 65.9.sh,
                child: Text(
                  'Shading',
                  style: TextStyle(
                    fontSize: 22.sp,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),

              // Shading controls
              ..._buildShadingControls(),

              // Chart Section title
              Positioned(
                left: 3.72.sw,
                top: 81.77.sh,
                child: Text(
                  'Chart Section',
                  style: TextStyle(
                    fontSize: 22.sp,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),

              // Bottom navigation bar
              _buildBottomNavigation(),

              // Notification icon
              _buildNotificationIcon(),

              // Settings/More icon
              _buildMoreIcon(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryButton({
    required double left,
    required double top,
    required double width,
    required double height,
    required String label,
    required bool isSelected,
  }) {
    return Positioned(
      left: left,
      top: top,
      width: width,
      height: height,
      child: Container(
        decoration: BoxDecoration(
          color: isSelected
              ? Colors.white.withOpacity(0.74)
              : Colors.white.withOpacity(0.74),
          border: Border.all(
            color: isSelected ? const Color(0xFF15DFFE) : const Color(0xFFE1E1E1),
            width: 1,
          ),
          borderRadius: BorderRadius.circular(40.r),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              color: const Color(0xFF111827),
            ),
            textAlign: TextAlign.right,
          ),
        ),
      ),
    );
  }

  Widget _buildIconCircle({
    required double left,
    required double top,
  }) {
    return Positioned(
      left: left,
      top: top,
      width: 41.492.w,
      height: 41.492.h,
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  List<Widget> _buildLightSectionCards() {
    return [
      // First card
      Positioned(
        left: 16.w,
        top: 646.96.h,
        width: 127.w,
        height: 135.h,
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(26.r),
          ),
          padding: EdgeInsets.all(12.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Light Scene child room',
                style: TextStyle(
                  fontSize: 16.sp,
                  color: const Color(0xFF111827),
                ),
              ),
              SizedBox(height: 8.h),
              Text(
                'All On',
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF111827),
                ),
              ),
            ],
          ),
        ),
      ),

      // Second card
      Positioned(
        left: 152.w,
        top: 646.96.h,
        width: 127.w,
        height: 135.h,
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(26.r),
          ),
          padding: EdgeInsets.all(12.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'RGBW light patio entry',
                style: TextStyle(
                  fontSize: 16.sp,
                  color: const Color(0xFF111827),
                ),
              ),
              SizedBox(height: 8.h),
              Text(
                '100%',
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF111827),
                ),
              ),
            ],
          ),
        ),
      ),

      // Third card
      Positioned(
        left: 289.w,
        top: 646.96.h,
        width: 127.w,
        height: 135.h,
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(26.r),
          ),
          padding: EdgeInsets.all(12.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'LED Dimmer living room',
                style: TextStyle(
                  fontSize: 16.sp,
                  color: const Color(0xFF111827),
                ),
              ),
              SizedBox(height: 8.h),
              Text(
                '100%',
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF111827),
                ),
              ),
            ],
          ),
        ),
      ),

      // Progress circle at 298, 654
      Positioned(
        left: 298.w,
        top: 654.h,
        width: 52.w,
        height: 52.h,
        child: CustomPaint(
          painter: CircularProgressPainter(
            progress: 1.0,
            strokeWidth: 3,
            colors: [
              const Color(0xFF0088FE),
              const Color(0xFF15DFFE),
            ],
          ),
          child: Center(
            child: Text(
              '100%',
              style: TextStyle(
                fontSize: 14.sp,
                color: const Color(0xFF111827),
              ),
            ),
          ),
        ),
      ),
    ];
  }

  List<Widget> _buildFavoritesCards() {
    return [
      // Camera card
      Positioned(
        left: 16.w,
        top: 975.h,
        width: 194.w,
        height: 144.h,
        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(26.r),
              child: Image.asset(
                'assets/image 66.png', // Placeholder
                width: 194.w,
                height: 144.h,
                fit: BoxFit.cover,
              ),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    const Color(0xFF0175F0).withOpacity(0.4),
                  ],
                ),
                borderRadius: BorderRadius.circular(26.r),
              ),
            ),
            Positioned(
              bottom: 16.h,
              left: 16.w,
              child: Text(
                'Front Door Camera',
                style: TextStyle(
                  fontSize: 16.sp,
                  color: Colors.white,
                  shadows: [
                    Shadow(
                      color: Colors.black.withOpacity(0.25),
                      offset: const Offset(0, 4),
                      blurRadius: 4,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      // Thermostat card
      Positioned(
        left: 220.w,
        top: 975.h,
        width: 196.w,
        height: 144.h,
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(26.r),
          ),
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bedroom Thermostat parents room',
                style: TextStyle(
                  fontSize: 16.sp,
                  color: const Color(0xFF111827),
                ),
              ),
              SizedBox(height: 16.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildControlButton(left: 0, top: 0, icon: Icons.remove),
                  SizedBox(width: 24.w),
                  Text(
                    '24.6°',
                    style: TextStyle(
                      fontSize: 30.sp,
                      fontWeight: FontWeight.w300,
                      color: const Color(0xFF111827),
                    ),
                  ),
                  SizedBox(width: 24.w),
                  _buildControlButton(left: 0, top: 0, icon: Icons.add),
                ],
              ),
            ],
          ),
        ),
      ),
    ];
  }

  Widget _buildControlButton({
    required double left,
    required double top,
    required IconData icon,
  }) {
    return Container(
      width: 35.w,
      height: 35.h,
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
      ),
      child: Icon(
        icon,
        size: 24.sp,
        color: const Color(0xFF111827),
      ),
    );
  }

  List<Widget> _buildShadingControls() {
    return [
      // First shading control
      Positioned(
        left: 15.8.w,
        top: 1321.h,
        width: 400.w,
        height: 77.861.h,
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(26.r),
          ),
          padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Blind Living Room south window upside right',
                style: TextStyle(
                  fontSize: 16.sp,
                  color: const Color(0xFF111827),
                ),
              ),
              SizedBox(height: 8.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(
                        '50%',
                        style: TextStyle(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF111827),
                        ),
                      ),
                      SizedBox(width: 8.w),
                      Text(
                        '100%',
                        style: TextStyle(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF111827),
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      _buildControlButton(left: 0, top: 0, icon: Icons.keyboard_arrow_down),
                      SizedBox(width: 16.w),
                      _buildControlButton(left: 0, top: 0, icon: Icons.keyboard_arrow_up),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),

      // Temperature set point
      Positioned(
        left: 16.w,
        top: 1632.33.h,
        width: 400.w,
        height: 216.h,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: const Color(0xFFE1E1E1)),
            borderRadius: BorderRadius.circular(26.r),
          ),
          child: Column(
            children: [
              Expanded(
                child: Container(
                  padding: EdgeInsets.all(16.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Bathroom Temperature set point',
                        style: TextStyle(
                          fontSize: 16.sp,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF111827),
                        ),
                      ),
                      SizedBox(height: 16.h),
                      // Temperature display
                      Container(
                        width: 44.066.w,
                        height: 19.878.h,
                        decoration: BoxDecoration(
                          color: const Color(0xFF0088FE),
                          borderRadius: BorderRadius.circular(5.r),
                        ),
                        child: Center(
                          child: Text(
                            '24.6°C',
                            style: TextStyle(
                              fontSize: 10.sp,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Container(
                height: 37.h,
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF1FF),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(26.r),
                    bottomRight: Radius.circular(26.r),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ];
  }

  Widget _buildBottomNavigation() {
    return Positioned(
      left: 0,
      top: 1874.33.h,
      width: 430.w,
      height: 73.h,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.74),
        ),
        child: Column(
          children: [
            Container(
              height: 1,
              color: const Color(0xFFE1E1E1),
            ),
            SizedBox(height: 4.h),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem('Devices', isSelected: false),
                _buildNavItem('Automations', isSelected: false),
                _buildNavItem('Analytics', isSelected: false),
                _buildNavItem('Voice', isSelected: true),
                _buildNavItem('Notifications', isSelected: false),
              ],
            ),
            SizedBox(height: 4.h),
            Container(
              width: 77.w,
              height: 3.h,
              margin: EdgeInsets.only(left: 177.w),
              decoration: BoxDecoration(
                color: const Color(0xFF0088FE),
                borderRadius: BorderRadius.circular(2.r),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(String label, {required bool isSelected}) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 9.sp,
            fontWeight: FontWeight.w600,
            color: isSelected ? const Color(0xFF0088FE) : const Color(0xFF111827),
          ),
        ),
      ],
    );
  }

  Widget _buildNotificationIcon() {
    return Positioned(
      left: 289.w,
      top: 1890.33.h,
      width: 29.w,
      height: 29.h,
      child: Stack(
        children: [
          Image.asset(
            'assets/image 66.png', // Placeholder for notification icon
            width: 29.w,
            height: 29.h,
          ),
          Positioned(
            right: 0,
            top: 0,
            child: Container(
              width: 19.w,
              height: 15.h,
              decoration: BoxDecoration(
                color: const Color(0xFFFE019A),
                borderRadius: BorderRadius.circular(18.r),
              ),
              child: Center(
                child: Text(
                  '12',
                  style: TextStyle(
                    fontSize: 10.sp,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMoreIcon() {
    return Positioned(
      left: 380.w,
      top: 62.h,
      width: 32.w,
      height: 32.h,
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          shape: BoxShape.circle,
        ),
        child: Icon(
          Icons.more_vert,
          size: 22.sp,
          color: const Color(0xFF111827),
        ),
      ),
    );
  }
}

// Custom painter for circular progress
class CircularProgressPainter extends CustomPainter {
  final double progress;
  final double strokeWidth;
  final List<Color> colors;

  CircularProgressPainter({
    required this.progress,
    required this.strokeWidth,
    required this.colors,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    final gradient = SweepGradient(
      colors: colors,
      startAngle: -1.57, // -90 degrees in radians
      endAngle: 4.71, // 270 degrees in radians
    );

    paint.shader = gradient.createShader(
      Rect.fromCircle(center: center, radius: radius),
    );

    final startAngle = -1.57; // Start from top
    final sweepAngle = 6.28 * progress; // Full circle * progress

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}