import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/constants/color_control/all_color.dart';
import 'package:renizo/core/models/service_category.dart';
import 'package:renizo/features/home/widgets/service_categories.dart';
import 'package:renizo/features/home/widgets/welcome_banner.dart';

/// Customer main home – WelcomeBanner + ServiceCategories (converted from React CustomerApp home).
class CustomerHomeScreen extends StatefulWidget {
  const CustomerHomeScreen({super.key, this.userName, this.selectedTownId});

  static const String routeName = '/customer-home';

  final String? userName;
  final String? selectedTownId;

  @override
  State<CustomerHomeScreen> createState() => _CustomerHomeScreenState();
}

class _CustomerHomeScreenState extends State<CustomerHomeScreen> {
  List<ServiceCategory> _categories = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  void _loadCategories() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 500));
    setState(() {
      _categories = ServiceCategoriesWidget.mockCategories;
      _loading = false;
    });
  }

  void _onSelectCategory(ServiceCategory category) {
    // TODO: Navigate to provider list or category flow
    debugPrint('Selected category: ${category.name}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AllColor.background,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: WelcomeBanner(userName: widget.userName),
            ),
            SliverToBoxAdapter(
              child: ServiceCategoriesWidget(
                categories: _categories,
                onSelectCategory: _onSelectCategory,
                loading: _loading,
              ),
            ),
            SliverToBoxAdapter(child: SizedBox(height: 24.h)),
          ],
        ),
      ),
    );
  }
}
