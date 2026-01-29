/// User model – aligned with "just for confirm the color." domain/auth.ts
enum UserRole { customer, provider }

class User {
  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    required this.phone,
    this.avatar,
    required this.createdAt,
  });

  final String id;
  final String email;
  final String name;
  final UserRole role;
  final String phone;
  final String? avatar;
  final String createdAt;

  bool get isProvider => role == UserRole.provider;
  bool get isCustomer => role == UserRole.customer;
}
