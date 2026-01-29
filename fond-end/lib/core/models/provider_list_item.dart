/// UI-optimized provider list item – aligned with just_tsx_code domain/models.ts ProviderListItem.
class ProviderListItem {
  const ProviderListItem({
    required this.id,
    required this.displayName,
    this.avatar = '',
    this.rating = 0.0,
    this.reviewCount = 0,
    this.distance = '',
    this.responseTime = '',
    this.availableToday = false,
    this.categoryNames = const [],
  });

  final String id;
  final String displayName;
  final String avatar;
  final double rating;
  final int reviewCount;
  final String distance;
  final String responseTime;
  final bool availableToday;
  final List<String> categoryNames;
}
