import 'package:renizo/features/bookings/data/bookings_mock_data.dart';

/// Provider/Seller job item for home and bookings list – mirrors ProviderApp enriched booking.
class SellerJobItem {
  const SellerJobItem({
    required this.id,
    required this.status,
    required this.scheduledDate,
    required this.scheduledTime,
    required this.customerName,
    required this.categoryName,
    required this.townName,
    this.notes,
    this.paidInApp = false,
  });

  final String id;
  final BookingStatus status;
  final String scheduledDate;
  final String scheduledTime;
  final String customerName;
  final String categoryName;
  final String townName;
  final String? notes;
  /// TSX: booking.paidInApp for "Paid In-App" vs "Pending Payment".
  final bool paidInApp;
}
