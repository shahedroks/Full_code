/// Service category – aligned with "just for confirm the color." domain/models.ts
class ServiceCategory {
  const ServiceCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.description,
    this.enabled = true,
    this.subSections = const [],
    this.addons = const [],
  });

  final String id;
  final String name;
  final String icon;
  final String description;
  final bool enabled;
  final List<ServiceSubSection> subSections;
  final List<ServiceAddon> addons;
}

class ServiceSubSection {
  const ServiceSubSection({required this.id, required this.name, this.description});

  final String id;
  final String name;
  final String? description;
}

class ServiceAddon {
  const ServiceAddon({required this.id, required this.name, this.price});

  final String id;
  final String name;
  final double? price;
}
