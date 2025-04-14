// class User {
//   final String id;
//   final String name;
//   final String email;
//   final String comm;
//   final List<String> skills;
//   final List<String> roles;
//   final List<String> interests;
//   final List<String> accounts;

//   User({
//     required this.id,
//     required this.name,
//     required this.email,
//     required this.comm,
//     required this.skills,
//     required this.roles,
//     required this.interests,
//     required this.accounts,
//   });

//   factory User.fromJson(Map<String, dynamic> json) {
//     return User(
//       name: json['name'],
//       comm: json['comm'],
//       skills: List<String>.from(json['skills']),
//       roles: List<String>.from(json['roles']),
//       interests: List<String>.from(json['interests']),
//     );
//   }

//   Map<String, dynamic> toJson() => {
//         'id': id,
//         'title': title,
//         'description': description,
//         'creatorName': creatorName,
//         'requiredSkills': requiredSkills,
//         'currentMembers': currentMembers,
//         'memberLimit': memberLimit,
//       };
// }
