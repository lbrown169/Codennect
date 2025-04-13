class Project {
  final String id;
  final String title;
  final String description;
  final String creatorName;
  final List<String> requiredSkills;
  final int currentMembers;
  final int memberLimit;
  final bool is_private;

  Project({
    required this.id,
    required this.title,
    required this.description,
    required this.creatorName,
    required this.requiredSkills,
    required this.currentMembers,
    required this.memberLimit,
    required this.is_private,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      creatorName: json['creatorName'],
      requiredSkills: List<String>.from(json['requiredSkills']),
      currentMembers: json['currentMembers'],
      memberLimit: json['memberLimit'],
      is_private: json['is_private']
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'creatorName': creatorName,
        'requiredSkills': requiredSkills,
        'currentMembers': currentMembers,
        'memberLimit': memberLimit,
        'is_private' : is_private,
      };
}
