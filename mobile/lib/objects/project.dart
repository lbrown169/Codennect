import 'field_details.dart';

class Project {
  final String id;
  final String name;
  final String domain;
  final String owner;
  final bool isPrivate;
  final String description;
  final List<FieldDetails> fields;
  final Map<String, int> roles;
  final Map<String, List<String>> users;
  final List<String> requiredSkills;

  Project({
    required this.id,
    required this.name,
    required this.domain,
    required this.owner,
    required this.isPrivate,
    required this.description,
    required this.fields,
    required this.roles,
    required this.users,
    required this.requiredSkills,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['_id'],
      name: json['name'],
      domain: json['domain'],
      owner: json['owner'],
      isPrivate: json['is_private'],
      description: json['description'],
      fields: (json['fields'] as List<dynamic>)
          .map((fieldJson) => FieldDetails.fromJson(fieldJson))
          .toList(),
      roles: json['roles'] is Map ? Map<String, int>.from(json['roles']) : {},
      users: json['users'] is Map
          ? Map<String, List<String>>.from(
              json['users'].map(
                (key, value) => MapEntry(key, List<String>.from(value)),
              ),
            )
          : {},
      requiredSkills: List<String>.from(json['required_skills'] ?? []),
    );
  }

  static Project empty() {
    return Project(
      id: '',
      name: '',
      domain: '',
      owner: '',
      isPrivate: false,
      description: '',
      fields: [],
      roles: {},
      users: {},
      requiredSkills: [],
    );
  }
}
