import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../objects/project.dart';
import 'package:http/http.dart' as http;
import '../integration/get_user_info_call.dart';
import '../integration/approve_application_call.dart';
import '../integration/deny_application_call.dart';
import 'show_project_apps_page.dart';

class ApplicantProfilePage extends StatefulWidget {
  final Project project;
  final String applicantId;
  final List<dynamic> receivedApplications;
  const ApplicantProfilePage(
      {super.key, required this.project, required this.applicantId, required this.receivedApplications});

  @override
  State<ApplicantProfilePage> createState() => _ApplicantProfilePageState();
}

class _ApplicantProfilePageState extends State<ApplicantProfilePage> {
  Map<String, dynamic>? profileInfo;
  String? creatorId;
  final TextEditingController nameController = TextEditingController();
  final TextEditingController commController = TextEditingController();
  final TextEditingController IDController = TextEditingController();
  List<String> skills = [];
  List<String> roles = [];
  List<String> interests = [];
    List<String> links = [];

  @override
  void initState() {
    super.initState();
    _loadUserSession();
    fetchUser(widget.applicantId);
  }

Future<void> fetchUser(String userId) async {
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
    final Map<String, dynamic>? profileData = jsonDecode(res.body);

    setState(() {
      IDController.text = profileData?['_id'] ?? '';
      nameController.text = profileData?['name'] ?? '';
      links = List<String>.from(profileData?['accounts'] ?? []);
      commController.text = profileData?['comm'] ?? '';
      skills = List<String>.from(profileData?['skills'] ?? []);
      roles = List<String>.from(profileData?['roles'] ?? []);
      interests = List<String>.from(profileData?['interests'] ?? []);
    });
  } else {
    print("Failed to fetch user info for ID $userId");
  }
}

  Future<void> _loadUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      creatorId = prefs.getString('userId');
    });
  }

  void _goBack() {
    Navigator.of(context).pop();
  }

  void _approveApplication() async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final response = await http.post(
      Uri.parse('http://cop4331.tech/api/requests/approve'),
      headers: {
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
      body: jsonEncode({
        'user_id': IDController.text,
        'project_id': widget.project.id,
        'is_invite': false,
      }),
    );

    if (response.statusCode == 200) {
        _goBack();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to approve application.")),
      );
    }
  }

  void _denyApplication() async{
   final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final response = await http.post(
      Uri.parse('http://cop4331.tech/api/requests/deny'),
      headers: {
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
      body: jsonEncode({
        'user_id': IDController.text,
        'project_id': widget.project.id,
        'is_invite': false,
      }),
    );

    if (response.statusCode == 200) {
        _goBack();
           
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to deny application.")),
      );
    }
  }

  Widget buildSection(String title, List<String> list) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: GoogleFonts.poppins(
                    fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: list
                  .map((item) => Chip(
                        label: Text(item, style: GoogleFonts.poppins()),
                        backgroundColor: const Color(0xFF9DB4C0),
                        labelStyle: const TextStyle(color: Colors.black),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text("Applicant Profile",
            style: GoogleFonts.poppins(color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: _goBack,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: ListView(
                children: [
                  // Info section for user's name, email, preferred method of communication, and public account
                  Card(
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 2,
                    margin: const EdgeInsets.only(bottom: 16),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("User Info",
                              style: GoogleFonts.poppins(
                                  fontSize: 18, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 15),
                          Row(
                            children: [
                              Text("Name: ", style: GoogleFonts.poppins()),
                              Text(nameController.text,
                                  style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.w500)),
                            ],
                          ),
                          const SizedBox(height: 15),
                          Row(
                            children: [
                              Text("Preferred Method of Communication: ",
                                  style: GoogleFonts.poppins()),
                              Text(commController.text,
                                  style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.w500)),
                            ],
                          ),
                          const SizedBox(height: 15),
                          Text("Links",
                              style: GoogleFonts.poppins(
                                  fontSize: 18, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 1),
                          buildLinkList(links),

                        ],
                      ),
                    ),
                  ),

                  buildSection("Skills", skills),
                  buildSection("Roles", roles),
                  buildSection("Interests", interests),
                ],
              ),
            ),

            // --- Buttons Section ---
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: _approveApplication,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF124559),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                  ),
                  child: Text("Approve",
                      style: GoogleFonts.poppins(
                          color: const Color.fromARGB(255, 255, 255, 255))),
                ),
                OutlinedButton(
                  onPressed: _denyApplication,
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFF124559)),
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
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget buildLinkList(List<String> links) {
    return Column(
      children: links
          .map((link) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        link,
                        style: GoogleFonts.poppins(
                            color: const Color(0xFF124559),
                            decoration: TextDecoration.underline),
                      ),
                    ),
                  ],
                ),
              ))
          .toList(),
    );
  }
}
