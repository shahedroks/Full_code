import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:renizo/core/models/provider_list_item.dart';
import 'package:renizo/features/search/data/search_mock_data.dart';

const Color _searchGradientStart = Color(0xFF408AF1);
const Color _searchGradientEnd = Color(0xFF5ca3f5);

/// Search tab – full conversion from React SearchScreen.tsx.
/// Blue background, search input, filtered categories and providers by town and query.
class SearchScreen extends StatefulWidget {
  const SearchScreen({
    super.key,
    this.selectedTownId = '',
    this.onSelectProvider,
  });

  final String selectedTownId;
  final void Function(ProviderListItem provider)? onSelectProvider;

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();

  static const Color _bgBlue = Color(0xFF2384F4);

  List<SearchCategory> get _filteredCategories {
    final query = _searchController.text.toLowerCase().trim();
    if (query.isEmpty) return [];
    return searchCategories.where((cat) {
      if (widget.selectedTownId.isNotEmpty && !cat.townIds.contains(widget.selectedTownId)) return false;
      return cat.name.toLowerCase().contains(query);
    }).toList();
  }

  List<SearchProvider> get _filteredProviders {
    final query = _searchController.text.toLowerCase().trim();
    if (query.isEmpty) return [];
    return searchProviders.where((p) {
      if (widget.selectedTownId.isNotEmpty && !p.townIds.contains(widget.selectedTownId)) return false;
      final matchesName = p.name.toLowerCase().contains(query);
      final catName = categoryNameForId(p.categoryId)?.toLowerCase() ?? '';
      final matchesCategory = catName.contains(query);
      return matchesName || matchesCategory;
    }).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgBlue,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: EdgeInsets.fromLTRB(16.w, 24.h, 16.w, 16.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Search',
                    style: TextStyle(
                      fontSize: 20.sp,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 16.h),
                  _buildSearchField(),
                ],
              ),
            ),
            Expanded(
              child: ListenableBuilder(
                listenable: _searchController,
                builder: (context, _) {
                  final query = _searchController.text.trim();
                  if (query.isEmpty) return _buildEmptyPrompt();
                  final categories = _filteredCategories;
                  final providers = _filteredProviders;
                  if (categories.isEmpty && providers.isEmpty) return _buildNoResults();
                  return _buildResults(categories, providers);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchField() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        controller: _searchController,
        focusNode: _searchFocusNode,
        onChanged: (_) => setState(() {}),
        decoration: InputDecoration(
          hintText: 'Search services or providers...',
          hintStyle: TextStyle(fontSize: 15.sp, color: Colors.grey.shade500),
          prefixIcon: Icon(Icons.search_rounded, size: 22.sp, color: Colors.grey.shade400),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16.r),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 14.h),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16.r),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.8), width: 2),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyPrompt() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(24.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_rounded, size: 48.sp, color: Colors.white.withOpacity(0.5)),
            SizedBox(height: 12.h),
            Text(
              'Search for services or providers',
              style: TextStyle(fontSize: 16.sp, color: Colors.white),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNoResults() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(24.w),
        child: Text(
          'No results found',
          style: TextStyle(fontSize: 16.sp, color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildResults(List<SearchCategory> categories, List<SearchProvider> providers) {
    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (categories.isNotEmpty) ...[
            Text(
              'Categories',
              style: TextStyle(
                fontSize: 16.sp,
                fontWeight: FontWeight.w500,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 12.h),
            ...List.generate(categories.length, (index) => _CategoryTile(category: categories[index], index: index)),
            SizedBox(height: 24.h),
          ],
          if (providers.isNotEmpty) ...[
            Text(
              'Providers',
              style: TextStyle(
                fontSize: 16.sp,
                fontWeight: FontWeight.w500,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 12.h),
            ...List.generate(
              providers.length,
              (index) => _SearchProviderCard(
                provider: providers[index],
                index: index,
                onTap: () => _onSelectProvider(providers[index]),
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _onSelectProvider(SearchProvider p) {
    final categoryName = categoryNameForId(p.categoryId);
    final item = ProviderListItem(
      id: p.id,
      displayName: p.name,
      avatar: p.avatar,
      rating: p.rating,
      reviewCount: p.reviewCount,
      distance: p.distance,
      responseTime: p.responseTime,
      availableToday: false,
      categoryNames: categoryName != null ? [categoryName] : [],
    );
    widget.onSelectProvider?.call(item);
    if (widget.onSelectProvider == null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selected ${p.name}')),
      );
    }
  }
}

class _CategoryTile extends StatefulWidget {
  const _CategoryTile({required this.category, required this.index});

  final SearchCategory category;
  final int index;

  @override
  State<_CategoryTile> createState() => _CategoryTileState();
}

class _CategoryTileState extends State<_CategoryTile> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _slide = Tween<Offset>(begin: const Offset(-0.05, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    Future.delayed(Duration(milliseconds: widget.index * 50), () {
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
    return FadeTransition(
      opacity: _opacity,
      child: SlideTransition(
        position: _slide,
        child: Container(
          width: double.infinity,
          margin: EdgeInsets.only(bottom: 8.h),
          padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 14.h),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12.r),
            border: Border.all(color: const Color(0xFFF3F4F6)),
          ),
          child: Text(
            widget.category.name,
            style: TextStyle(fontSize: 15.sp, fontWeight: FontWeight.w500, color: Colors.black87),
          ),
        ),
      ),
    );
  }
}

class _SearchProviderCard extends StatefulWidget {
  const _SearchProviderCard({
    required this.provider,
    required this.index,
    required this.onTap,
  });

  final SearchProvider provider;
  final int index;
  final VoidCallback onTap;

  @override
  State<_SearchProviderCard> createState() => _SearchProviderCardState();
}

class _SearchProviderCardState extends State<_SearchProviderCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;
  bool _imageError = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _slide = Tween<Offset>(begin: const Offset(-0.05, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    Future.delayed(Duration(milliseconds: widget.index * 50), () {
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
    final p = widget.provider;
    final initial = p.name.isNotEmpty ? p.name[0].toUpperCase() : '?';
    final categoryName = categoryNameForId(p.categoryId) ?? '';

    return FadeTransition(
      opacity: _opacity,
      child: SlideTransition(
        position: _slide,
        child: Padding(
          padding: EdgeInsets.only(bottom: 12.h),
          child: Material(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16.r),
            elevation: 2,
            shadowColor: Colors.black.withOpacity(0.08),
            child: InkWell(
              onTap: widget.onTap,
              borderRadius: BorderRadius.circular(16.r),
              child: Container(
                padding: EdgeInsets.all(16.w),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16.r),
                  border: Border.all(color: const Color(0xFFF3F4F6)),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12.r),
                      child: Container(
                        width: 48.w,
                        height: 48.h,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [_searchGradientStart, _searchGradientEnd],
                          ),
                        ),
                        child: p.avatar.isNotEmpty && !_imageError
                            ? CachedNetworkImage(
                                imageUrl: p.avatar,
                                fit: BoxFit.cover,
                                placeholder: (_, __) => Center(
                                  child: Text(initial, style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: Colors.white)),
                                ),
                                errorWidget: (_, __, ___) {
                                  WidgetsBinding.instance.addPostFrameCallback((_) {
                                    if (mounted) setState(() => _imageError = true);
                                  });
                                  return Center(
                                    child: Text(initial, style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: Colors.white)),
                                  );
                                },
                              )
                            : Center(
                                child: Text(initial, style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.w600, color: Colors.white)),
                              ),
                      ),
                    ),
                    SizedBox(width: 12.w),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            p.name,
                            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w500, color: Colors.black87),
                          ),
                          if (categoryName.isNotEmpty) ...[
                            SizedBox(height: 4.h),
                            Text(
                              categoryName,
                              style: TextStyle(fontSize: 14.sp, color: Colors.grey.shade600),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
