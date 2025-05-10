import 'package:flutter/material.dart';
import '../integration/get_users_call.dart';
import 'package:google_fonts/google_fonts.dart';
import '../objects/user.dart';
import 'invite_user_page.dart';

class BrowseUsersPage extends StatefulWidget {
  const BrowseUsersPage({super.key});

  @override
  State<BrowseUsersPage> createState() => _BrowseUsersPageState();
}

class _BrowseUsersPageState extends State<BrowseUsersPage> {
  List<User> users = [];
  List<User> filteredUsers = [];
  String searchQuery = '';
  String selectedSkill = 'All';
  String selectedRole = 'All';

  final List<String> allSkills = [
    "All",
    "Android (Kotlin/Java)",
    "Angular",
    "Arduino",
    "AWS",
    "C#",
    "C++",
    "Dart",
    "Docker",
    "Express.js",
    "Figma (UI/UX)",
    "Firebase",
    "Flutter",
    "Google Cloud",
    "GraphQL",
    "iOS (Swift)",
    "Java",
    "JavaScript",
    "Machine Learning",
    "MongoDB",
    "MySQL",
    "Node.js",
    "OpenAI API",
    "PostgreSQL",
    "Raspberry Pi",
    "React",
    "React Native",
    "REST API",
    "Swift",
    "TensorFlow",
    "TypeScript",
    "Vue.js"
  ];

  @override
  void initState() {
    super.initState();
    fetchUsers();
  }

  Future<void> fetchUsers() async {
    try {
      final data = await UserFetcher.getUsers();
      setState(() {
        users = data;
        filteredUsers = data;
      });
    } catch (e) {
      print('Error fetching users: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading users', style: GoogleFonts.poppins())),
      );
    }
  }

  void filterUsers() {
    setState(() {
      filteredUsers = users.where((user) {
        final nameMatches =
            user.name.toLowerCase().contains(searchQuery.toLowerCase());
        final skillMatches =
            selectedSkill == 'All' || user.skills.contains(selectedSkill);
        final roleMatches =
            selectedRole == 'All' || user.roles.contains(selectedRole);
        return nameMatches && skillMatches && roleMatches;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text("Browse Users",
            style: GoogleFonts.poppins(color: Colors.white)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              onChanged: (value) {
                searchQuery = value;
                filterUsers();
              },
              decoration: InputDecoration(
                hintText: 'Search by name...',
                hintStyle: GoogleFonts.poppins(),
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white.withOpacity(0.6),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              style: GoogleFonts.poppins(),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Text("Filter by Skill:", style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                const SizedBox(width: 10),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: selectedSkill,
                    items: allSkills
                        .map((skill) => DropdownMenuItem(
                              value: skill,
                              child: Text(skill,
                                  style: GoogleFonts.poppins(color: Colors.black)),
                            ))
                        .toList(),
                    onChanged: (value) {
                      selectedSkill = value!;
                      filterUsers();
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.6),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      contentPadding:
                          const EdgeInsets.symmetric(horizontal: 12),
                    ),
                    style: GoogleFonts.poppins(),
                  ),
                )
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Text("Filter by Role:", style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                const SizedBox(width: 10),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: selectedRole,
                    items: [
                      'All',
                      'Frontend',
                      'Backend',
                      'Database',
                      'Mobile'
                    ]
                        .map((role) => DropdownMenuItem(
                              value: role,
                              child: Text(role,
                                  style: GoogleFonts.poppins(color: Colors.black)),
                            ))
                        .toList(),
                    onChanged: (value) {
                      selectedRole = value!;
                      filterUsers();
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.6),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      contentPadding:
                          const EdgeInsets.symmetric(horizontal: 12),
                    ),
                    style: GoogleFonts.poppins(),
                  ),
                )
              ],
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: filteredUsers.length,
                itemBuilder: (context, index) {
                  final user = filteredUsers[index];
                  return Card(
                    elevation: 3,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          vertical: 12.0, horizontal: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                user.name,
                                style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                              ElevatedButton(
                                onPressed: () =>
                                    _showUserDetails(context, user),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF124559),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16),
                                ),
                                child: Text("See Details",
                                    style: GoogleFonts.poppins(
                                        color: Colors.white)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 4,
                            children: user.skills
                                .map((skill) => Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFD9E8EC),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Text(skill,
                                          style: GoogleFonts.poppins(
                                              fontSize: 12)),
                                    ))
                                .toList(),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showUserDetails(BuildContext context, User user) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Text(user.name,
                style: GoogleFonts.poppins(
                    fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text("Preferred Communication: ${user.comm}",
                style: GoogleFonts.poppins()),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: user.skills
                  .map(
                    (skill) => Chip(
                      label: Text(skill, style: GoogleFonts.poppins()),
                      backgroundColor: const Color(0xFFD9E8EC),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: user.roles
                  .map(
                    (role) => Chip(
                      label: Text(role, style: GoogleFonts.poppins()),
                      backgroundColor: const Color.fromARGB(255, 223, 243, 225),                     
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: user.interests
                  .map(
                    (interest) => Chip(
                      label: Text(interest, style: GoogleFonts.poppins()),
                      backgroundColor: const Color.fromARGB(255, 235, 246, 224),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 20),
            Text("Accounts:",
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            ...user.accounts.entries.map((e) =>
                Text("${e.key}: ${e.value}", style: GoogleFonts.poppins())),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          InviteUserPage(targetUserId: user.id),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF124559),
                ),
                child: Text("Invite User",
                    style: GoogleFonts.poppins(color: Colors.white)),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
