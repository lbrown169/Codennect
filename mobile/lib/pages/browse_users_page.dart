import 'package:flutter/material.dart';
import '../integration/get_users_call.dart';
import '../integration/invite_user_call.dart';
import '../integration/get_projects_call.dart';

class BrowseUsersPage extends StatefulWidget {
  const BrowseUsersPage({super.key});

  @override
  State<BrowseUsersPage> createState() => _BrowseUsersPageState();
}

class _BrowseUsersPageState extends State<BrowseUsersPage> {
  List<Map<String, dynamic>> users = [];
  List<Map<String, dynamic>> filteredUsers = [];
  String searchQuery = '';
  String selectedSkill = 'All';

  @override
  void initState() {
    super.initState();
    fetchUsers();
  }

  Future<void> fetchUsers() async {
    final data = await UserFetcher.getUsers();
    setState(() {
      users = data;
      filteredUsers = data;
    });
  }

  void filterUsers() {
    setState(() {
      filteredUsers = users.where((user) {
        final nameMatches =
            user['name'].toLowerCase().contains(searchQuery.toLowerCase());
        final skillMatches = selectedSkill == 'All' ||
            (user['skills'] as List<dynamic>).contains(selectedSkill);
        return nameMatches && skillMatches;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: const Text('Browse Users'),
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
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text("Filter by Skill:"),
                const SizedBox(width: 10),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: selectedSkill,
                    items: [
                      'All',
                      'Flutter',
                      'React',
                      'Python',
                      'Node.js',
                      'Firebase',
                      'C++'
                    ]
                        .map((skill) => DropdownMenuItem(
                              value: skill,
                              child: Text(skill),
                            ))
                        .toList(),
                    onChanged: (value) {
                      selectedSkill = value!;
                      filterUsers();
                    },
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      contentPadding:
                          const EdgeInsets.symmetric(horizontal: 12),
                    ),
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
                    child: ListTile(
                      title: Text(user['name'] ?? ''),
                      subtitle:
                          Text((user['skills'] as List<dynamic>).join(', ')),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => UserDetailPage(user: user),
                          ),
                        );
                      },
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
}

class UserDetailPage extends StatelessWidget {
  final Map<String, dynamic> user;
  const UserDetailPage({super.key, required this.user});

  Future<void> _showInviteDialog(BuildContext context) async {
    final projectData = await GetProjectsListCall.getProjects();

    String? selectedProjectId;
    final List<DropdownMenuItem<String>> projectOptions = projectData
        .map((proj) => DropdownMenuItem<String>(
              value: proj['id'] as String,
              child: Text(proj['title'] ?? 'Unnamed'),
            ))
        .toList()
        .cast<DropdownMenuItem<String>>();

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Invite to Project"),
        content: DropdownButtonFormField<String>(
          items: projectOptions,
          onChanged: (value) => selectedProjectId = value,
          decoration: const InputDecoration(labelText: 'Select a project'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () async {
              if (selectedProjectId != null) {
                final success = await InviteService.inviteUserToProject(
                  userId: user['id'],
                  projectId: selectedProjectId!,
                );
                Navigator.pop(context);
                final message = success
                    ? 'Invitation sent successfully.'
                    : 'Failed to send invitation.';
                ScaffoldMessenger.of(context)
                    .showSnackBar(SnackBar(content: Text(message)));
              }
            },
            child: const Text("Send Invite"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        title: Text(user['name'] ?? 'User Details'),
        backgroundColor: const Color(0xFF598392),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Name: ${user['name']}", style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 10),
            Text("Email: ${user['email']}",
                style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 10),
            Text("Skills: ${(user['skills'] as List<dynamic>).join(', ')}"),
            const SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: () => _showInviteDialog(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF124559),
                ),
                child: const Text("Invite to Project"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
