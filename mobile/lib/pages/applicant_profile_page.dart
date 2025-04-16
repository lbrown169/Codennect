import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../objects/project.dart';
import '../integration/get_user_info_call.dart';
import '../integration/approve_application_call.dart';
import '../integration/deny_application_call.dart';
import 'show_project_apps_page.dart';

class ApplicantProfilePage extends StatefulWidget {
  final Project project;
  final String applicantId;
  const ApplicantProfilePage(
      {super.key, required this.project, required this.applicantId});

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
    fetchProfile();
  }

  Future<void> fetchProfile() async {
     final profileData = await UserInfoService.getUserInfo(widget.applicantId);
    if (profileData != null) {
      setState(() {
        IDController.text = profileData['_id'] ?? '';
        nameController.text = profileData['name'] ?? '';
        links = List<String>.from(profileData['accounts'] ?? []);
        commController.text = profileData['comm'] ?? '';
        skills = List<String>.from(profileData['skills'] ?? []);
        roles = List<String>.from(profileData['roles'] ?? []);
        interests = List<String>.from(profileData['interests'] ?? []);

      });
    } else {
      print("Error: Profile data is null");
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
  void _approveApplication() async{ //Sends applicant id
    final success = await ApproveApplicationService.approveApplication(
      user_id: IDController.text,
      project_id: widget.project.id,
      is_invite: false
    );

    if (success) {
        _goBack();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to approve application.")),
      );
    }
  }

  void _denyApplication() async{ //sends user id
    final success = await DenialApplicationService.denyApplication(
      user_id: creatorId!,
      project_id: widget.project.id,
      is_invite: false
    );

    if (success) {
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
                        labelStyle: const TextStyle(color: Colors.white),
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
                    backgroundColor: const Color.fromARGB(255, 18, 69, 89),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                  ),
                  child: Text("Approve",
                      style: GoogleFonts.poppins(
                          color: const Color.fromARGB(255, 255, 255, 255))),
                ),
                ElevatedButton(
                  onPressed: _denyApplication,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 89, 18, 18),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                  ),
                  child: Text("Deny",
                      style: GoogleFonts.poppins(
                          color: const Color.fromARGB(255, 255, 255, 255))),
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
