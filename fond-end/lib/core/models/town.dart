/// Town model – aligned with "just for confirm the color." domain/models.ts
class Town {
  const Town({
    required this.id,
    required this.name,
    required this.state,
    this.enabled = true,
    this.zipCodes,
  });

  final String id;
  final String name;
  final String state;
  final bool enabled;
  final List<String>? zipCodes;
}
