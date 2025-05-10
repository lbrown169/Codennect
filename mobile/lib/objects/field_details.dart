class FieldDetails {
  final String name;
  final String value;
  final bool isPrivate;

  FieldDetails({
    required this.name,
    required this.value,
    required this.isPrivate,
  });

  factory FieldDetails.fromJson(Map<String, dynamic> json) {
    return FieldDetails(
      name: json['name'],
      value: json['value'],
      isPrivate: json['private'],
    );
  }
  Map<String, dynamic> toJson() => {
        'name': name,
        'value': value,
        'private': isPrivate,
      };
}
