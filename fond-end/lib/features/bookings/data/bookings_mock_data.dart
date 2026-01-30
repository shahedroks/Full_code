/// Display model for booking list – mirrors React BookingsScreen transformed booking.
class BookingDisplayItem {
  const BookingDisplayItem({
    required this.id,
    required this.providerName,
    required this.providerAvatar,
    required this.date,
    required this.time,
    required this.status,
    required this.categoryName,
  });

  final String id;
  final String providerName;
  final String providerAvatar;
  final String date;
  final String time;
  final BookingStatus status;
  final String categoryName;
}

enum BookingStatus {
  pending,
  confirmed,
  inProgress,
  completed,
  cancelled,
}

/// Mock load: returns display bookings for customer (mirrors AppService.getBookingsByCustomer + transform).
/// Uses customer1; one sample booking so list is non-empty by default.
Future<List<BookingDisplayItem>> loadBookingsForCustomer(String customerId) async {
  await Future.delayed(const Duration(milliseconds: 500));
  // Mock: one booking for customer1 (mirrors React mock – booking1 → provider1, cat1 Residential Cleaning).
  if (customerId != 'customer1') return [];
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final tomorrow = today.add(const Duration(days: 1));
  String dateStr(DateTime d) {
    if (d == today) return 'Today';
    if (d == tomorrow) return 'Tomorrow';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[d.month - 1]} ${d.day}';
  }
  return [
    BookingDisplayItem(
      id: 'booking1',
      providerName: 'Mike Johnson',
      providerAvatar: '',
      date: dateStr(tomorrow),
      time: '10:00',
      status: BookingStatus.pending,
      categoryName: 'Residential Cleaning',
    ),
    BookingDisplayItem(
      id: 'booking2',
      providerName: 'Sparkle Home Cleaning',
      providerAvatar: '',
      date: dateStr(today),
      time: '15:00',
      status: BookingStatus.confirmed,
      categoryName: 'Residential Cleaning',
    ),
  ];
}
