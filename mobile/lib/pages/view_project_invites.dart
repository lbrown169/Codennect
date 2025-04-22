import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:google_fonts/google_fonts.dart';
import '../objects/project.dart';
import 'project_details_page.dart';

class ViewInvitesPage extends StatefulWidget {
  const ViewInvitesPage({super.key});

  @override
  State<ViewInvitesPage> createState() => _ViewInvitesPageState();
}

class _ViewInvitesPageState extends State<ViewInvitesPage> {
  List<dynamic> receivedInvites = [];
  Map<String, Project> projectMap = {};
  Map<String, dynamic> senderMap = {};

  @override
  void initState() {
    super.initState();
    fetchInvites();
  }

  Future<void> fetchInvites() async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final response = await http.get(
      Uri.parse('http://cop4331.tech/api/requests'),
      headers: {
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final List<dynamic> invites = data['invites']['me'];

      setState(() {
        receivedInvites = invites;
      });

      for (var invite in invites) {
        await fetchProject(invite['project_id']);
        await fetchUser(invite['user_id']);
      }
    } else {
      print("Failed to fetch invites: ${response.statusCode}");
    }
  }

  Future<void> fetchProject(String projectId) async {
    if (projectMap.containsKey(projectId)) return;
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final res = await http.get(
      Uri.parse('http://cop4331.tech/api/get-project?id=$projectId'),
      headers: {
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
    );

    if (res.statusCode == 200) {
      final json = jsonDecode(res.body);
      setState(() {
        projectMap[projectId] = Project.fromJson(json);
      });
    } else {
      print("Failed to fetch project for ID $projectId");
    }
  }

  Future<void> fetchUser(String userId) async {
    if (senderMap.containsKey(userId)) return;
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final res = await http.get(
      Uri.parse('http://cop4331.tech/api/get-user-info?id=$userId'),
      headers: {
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
    );

    if (res.statusCode == 200) {
      final json = jsonDecode(res.body);
      setState(() {
        senderMap[userId] = json;
      });
    } else {
      print("Failed to fetch user info for ID $userId");
    }
  }

  Future<void> respondToInvite(
      String userId, String projectId, bool isInvite, bool approve) async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');
    final endpoint = approve ? 'approve' : 'deny';

    final response = await http.post(
      Uri.parse('http://cop4331.tech/api/requests/$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
      body: jsonEncode({
        'user_id': userId,
        'project_id': projectId,
        'is_invite': isInvite,
      }),
    );

    if (response.statusCode == 200) {
      setState(() {
        receivedInvites.removeWhere((inv) =>
            inv['user_id'] == userId && inv['project_id'] == projectId);
      });
    } else {
      print("Error responding to invite: \${response.body}");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        title: const Text("Project Invites"),
        backgroundColor: const Color(0xFF598392),
      ),
      body: receivedInvites.isEmpty
          ? const Center(child: Text("No invites received."))
          : ListView.builder(
              itemCount: receivedInvites.length,
              itemBuilder: (context, index) {
                final invite = receivedInvites[index];
                final project = projectMap[invite['project_id']];
                final sender = senderMap[invite['user_id']];

                return Card(
                  margin: const EdgeInsets.all(12),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  elevation: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Project: ${project?.name ?? invite['project_id']}",
                          style: GoogleFonts.poppins(
                              fontSize: 18, fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 6),
                        Text("To: ${sender?['name'] ?? 'Unknown'}"),
                        const SizedBox(height: 6),
                        Text("Roles: ${invite['roles'].join(', ')}"),
                        const SizedBox(height: 6),
                        Text("Message: ${invite['message'] ?? 'No message'}"),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            ElevatedButton(
                              onPressed: () => respondToInvite(
                                  invite['user_id'],
                                  invite['project_id'],
                                  true,
                                  true),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF124559),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 24, vertical: 12),
                              ),
                              child: Text("Accept",
                                  style: GoogleFonts.poppins(
                                      color: const Color.fromARGB(
                                          255, 255, 255, 255))),
                            ),
                            const SizedBox(width: 12),
                            OutlinedButton(
                              onPressed: () => respondToInvite(
                                  invite['user_id'],
                                  invite['project_id'],
                                  true,
                                  false),
                              style: OutlinedButton.styleFrom(
                                backgroundColor: Colors.white,
                                side:
                                    const BorderSide(color: Color(0xFF124559)),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 24, vertical: 12),
                              ),
                              child: Text(
                                "Deny",
                                style: GoogleFonts.poppins(
                                  color: const Color(0xFF124559),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            TextButton(
                              onPressed: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => ProjectDetailPage(
                                      project: project ?? Project.empty(),
                                      showApplyButton: false,
                                      showApplicationsButton: false),
                                ),
                              ),
                              child: const Text("View Project"),
                            )
                          ],
                        )
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
