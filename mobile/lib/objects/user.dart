class User {
  final String id;
  final String name;
  final bool isPrivate;
  final String comm;
  final List<String> skills;
  final List<String> roles;
  final List<String> interests;
  final Map<String, String> accounts;

  User({
    required this.id,
    required this.name,
    required this.isPrivate,
    required this.comm,
    required this.skills,
    required this.roles,
    required this.interests,
    required this.accounts,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    final rawAccounts = json['accounts'];
    final parsedAccounts = (rawAccounts is Map)
        ? Map<String, String>.from(rawAccounts)
        : <String, String>{};

    return User(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      isPrivate: json['isPrivate'] ?? false,
      comm: json['comm'] ?? '',
      skills: List<String>.from(json['skills'] ?? []),
      roles: List<String>.from(json['roles'] ?? []),
      interests: List<String>.from(json['interests'] ?? []),
      accounts: parsedAccounts,
    );
  }
}
