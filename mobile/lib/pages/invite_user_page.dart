import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../objects/project.dart';
import '../../integration/project_application_call.dart';

class InviteUserPage extends StatefulWidget {
  final String targetUserId;

  const InviteUserPage({super.key, required this.targetUserId});

  @override
  State<InviteUserPage> createState() => _InviteUserPageState();
}

class _InviteUserPageState extends State<InviteUserPage> {
  final TextEditingController messageController = TextEditingController();
  List<Project> myProjects = [];
  Project? selectedProject;
  List<String> selectedRoles = [];
  List<String> availableRoles = [];

  @override
  void initState() {
    super.initState();
    fetchMyProjects();
  }

  Future<void> fetchMyProjects() async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final response = await http.get(
      Uri.parse('http://cop4331.tech/api/get-my-projects'),
      headers: {
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        myProjects = data.map((json) => Project.fromJson(json)).toList();
      });
    } else {
      print("Failed to load user projects");
    }
  }

  void updateAvailableRoles(Project project) {
    final rolesMap = project.roles;
    final usersMap = project.users;
    setState(() {
      availableRoles = rolesMap.entries
          .where((entry) {
            final filled = usersMap[entry.key]?.length ?? 0;
            return filled < entry.value;
          })
          .map((entry) => entry.key)
          .toList();
    });
  }

  Future<void> _submitInvite() async {
    final message = messageController.text.trim();

    if (selectedProject == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select a project.")),
      );
      return;
    }

    final success = await ApiApplicationCall.submitApplication(
      projectId: selectedProject!.id,
      userId: widget.targetUserId,
      message: message,
      isInvite: true,
      roles: selectedRoles,
    );

    if (success) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Invite Sent"),
          content: const Text("The invitation has been sent to the user."),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("OK"),
            )
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to send invitation.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text("Invite User", style: GoogleFonts.poppins()),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Select a project:",
                style: GoogleFonts.poppins(
                    fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 10),
            DropdownButtonFormField<Project>(
              value: selectedProject,
              items: myProjects.map((project) {
                return DropdownMenuItem(
                  value: project,
                  child: Text(project.name),
                );
              }).toList(),
              onChanged: (project) {
                setState(() {
                  selectedProject = project;
                  selectedRoles.clear();
                });
                if (project != null) {
                  updateAvailableRoles(project);
                }
              },
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12),
              ),
            ),
            const SizedBox(height: 20),
            if (selectedProject != null && availableRoles.isNotEmpty) ...[
              Text("Select Role(s) for this User:",
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                children: availableRoles.map((role) {
                  return FilterChip(
                    label: Text(role),
                    selected: selectedRoles.contains(role),
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          selectedRoles.add(role);
                        } else {
                          selectedRoles.remove(role);
                        }
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 30),
              Text("Message to the User:",
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
              const SizedBox(height: 10),
              TextField(
                controller: messageController,
                maxLines: 5,
                decoration: InputDecoration(
                  hintText: "Tell the user about this opportunity...",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  fillColor: Colors.white,
                  filled: true,
                ),
              ),
              const SizedBox(height: 30),
              Center(
                child: ElevatedButton(
                  onPressed: _submitInvite,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF124559),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 40, vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text("Send Invite",
                      style: GoogleFonts.poppins(fontSize: 16)),
                ),
              )
            ]
          ],
        ),
      ),
    );
  }
}
