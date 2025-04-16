import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import '../objects/project.dart';
import 'project_application_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProjectDetailPage extends StatefulWidget {
  final Project project;
  final bool showApplyButton;
  final bool showApplicationsButton;
  const ProjectDetailPage({
    super.key,
    required this.project,
    this.showApplyButton = true,
    this.showApplicationsButton = false,
  });

  @override
  State<ProjectDetailPage> createState() => _ProjectDetailPageState();
}

class _ProjectDetailPageState extends State<ProjectDetailPage> {
  Map<String, Map<String, dynamic>> userInfo = {};

  @override
  void initState() {
    super.initState();
    loadAllUsers();
  }

  Future<Map<String, dynamic>?> fetchUserInfo(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final response = await http.get(
      Uri.parse('http://cop4331.tech/api/get-user-info?id=$userId'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      print("Failed to fetch user info for $userId");
      print("Status: ${response.statusCode}, Body: ${response.body}");
      return null;
    }
  }

  Future<void> loadAllUsers() async {
    final allUserIds = <String>{};
    for (var list in widget.project.users.values) {
      allUserIds.addAll(list);
    }
    allUserIds.add(widget.project.owner);

    for (final id in allUserIds) {
      if (!userInfo.containsKey(id)) {
        final data = await fetchUserInfo(id);
        if (data != null) {
          userInfo[id] = data;
        }
      }
    }

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final totalSlots = widget.project.roles.values.fold(0, (a, b) => a + b);
    final totalMembers =
        widget.project.users.values.fold(0, (a, b) => a + b.length);

    return Scaffold(
      appBar: AppBar(
        title: Text('Project Details',
            style: GoogleFonts.poppins(color: Colors.white)),
        backgroundColor: const Color(0xFF598392),
      ),
      backgroundColor: const Color(0xFFEFF6E0),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(widget.project.name,
                  style: GoogleFonts.poppins(
                      fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Text("Total Slots: $totalSlots | Current Members: $totalMembers"),
              const SizedBox(height: 20),
              Text('Project Description:',
                  style: GoogleFonts.poppins(
                      fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Text(widget.project.description,
                  style:
                      GoogleFonts.poppins(fontSize: 15, color: Colors.black87)),
              const SizedBox(height: 20),
              Text('Required Skills:',
                  style: GoogleFonts.poppins(
                      fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 10,
                children: widget.project.requiredSkills
                    .map((skill) => Chip(label: Text(skill)))
                    .toList(),
              ),
              const SizedBox(height: 20),
              Text('Roles Needed:',
                  style: GoogleFonts.poppins(
                      fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              ...widget.project.roles.entries.map((entry) => Row(
                    children: [
                      const Icon(Icons.work_outline, size: 20),
                      const SizedBox(width: 6),
                      Text("${entry.key.toUpperCase()}: ${entry.value} slots"),
                    ],
                  )),
              const SizedBox(height: 20),
              Text('Project Creator:',
                  style: GoogleFonts.poppins(
                      fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              if (userInfo.containsKey(widget.project.owner))
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFF598392),
                    child: Icon(Icons.person, color: Colors.white),
                  ),
                  title: Text(userInfo[widget.project.owner]!['name'] ??
                      'Unnamed User'),
                  subtitle:
                      Text(userInfo[widget.project.owner]!['email'] ?? ''),
                  trailing: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.blueGrey.shade100,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child:
                        const Text("Creator", style: TextStyle(fontSize: 12)),
                  ),
                ),
              const SizedBox(height: 20),
              Text('Members:',
                  style: GoogleFonts.poppins(
                      fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              ...widget.project.users.entries
                  .expand((entry) => entry.value.map((id) {
                        if (userInfo.containsKey(id)) {
                          return ListTile(
                            leading: const CircleAvatar(
                              backgroundColor: Color(0xFF598392),
                              child: Icon(Icons.person, color: Colors.white),
                            ),
                            title:
                                Text(userInfo[id]!['name'] ?? 'Unnamed User'),
                            subtitle: Text("Role: ${entry.key}"),
                          );
                        } else {
                          return const SizedBox.shrink();
                        }
                      }))
                  .toList(),
              const SizedBox(height: 30),
              if ((widget.showApplyButton && !widget.showApplicationsButton) ||
                  (!widget.showApplyButton && widget.showApplicationsButton))
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ApplicationPage(project: widget.project),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF124559),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 40, vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      widget.showApplyButton
                          ? 'Apply to Join'
                          : 'See Project Applications',
                      style: GoogleFonts.poppins(
                          fontSize: 16, color: Colors.white),
                    ),
                  ),
                ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
