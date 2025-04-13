import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../objects/project.dart';
import '../integration/get_user_info_call.dart';

class ApplicantProfilePage extends StatefulWidget {
  final Project project;
  final String applicantId;
  const ApplicantProfilePage({super.key, required this.project, required this.applicantId});

  @override
  State<ApplicantProfilePage> createState() => _ApplicantProfilePageState();
}

class _ApplicantProfilePageState extends State<ApplicantProfilePage> {
  Map<String, dynamic>? profileInfo;

  List<String> skills = [];
  List<String> roles = [];
  List<String> interests = [];

  @override
  void initState() {
    super.initState();
    fetchInfo();
  }

  Future<void> fetchInfo() async {
    final profileData = await UserInfoService.getUserInfo(widget.applicantId);
    setState(() {
      profileInfo = profileData;
      skills = List<String>.from(profileInfo?['skills'] ?? []);
      roles = List<String>.from(profileInfo?['roles'] ?? []);
      interests = List<String>.from(profileInfo?['interests'] ?? []);
    });
  }

  void _goBack() {
    Navigator.of(context).pop();
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
                          Text("Info",
                              style: GoogleFonts.poppins(
                                  fontSize: 18, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 15),
                          Row(
                            children: [
                              Text("Name: ", style: GoogleFonts.poppins()),
                              Text(profileInfo?['name'] ?? " ",
                                  style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.w500)),
                            ],
                          ),
                          const SizedBox(height: 15),
                          Row(
                            children: [
                              Text("Email: ", style: GoogleFonts.poppins()),
                              Text(profileInfo?['email'] ?? " ",
                                  style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.w500)),
                            ],
                          ),
                          const SizedBox(height: 15),
                          Row(
                            children: [
                              Text("Preferred Method of Communication: ",
                                  style: GoogleFonts.poppins()),
                              Text(profileInfo?['preferredComm'] ?? " ",
                                  style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.w500)),
                            ],
                          ),
                          const SizedBox(height: 15),
                          Row(
                            children: [
                              Text("Public Account: ",
                                  style: GoogleFonts.poppins()),
                              Text(
                                  profileInfo?['isPublic'] == true
                                      ? "Yes"
                                      : "No",
                                  style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.w500)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Links section
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
                          Text("Links",
                              style: GoogleFonts.poppins(
                                  fontSize: 18, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Text("GitHub: ", style: GoogleFonts.poppins()),
                              TextButton(
                                onPressed: () {},
                                child: Text(profileInfo?['github'] ?? "N/A",
                                    style: GoogleFonts.poppins(
                                        color: const Color(0xFF124559))),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              Text("Discord: ", style: GoogleFonts.poppins()),
                              TextButton(
                                onPressed: () {},
                                child: Text(profileInfo?['discord'] ?? "N/A",
                                    style: GoogleFonts.poppins(
                                        color: const Color(0xFF124559))),
                              ),
                            ],
                          ),
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
                  onPressed: _goBack,
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color.fromARGB(255, 18, 69, 89), 
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                  ),
                  child: Text("Approve", style: GoogleFonts.poppins(color: const Color.fromARGB(255, 255, 255, 255))),
                ),
                ElevatedButton(
                  onPressed: _goBack,
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color.fromARGB(255, 89, 18, 18), 
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                  ),
                  child: Text("Deny", style: GoogleFonts.poppins(color: const Color.fromARGB(255, 255, 255, 255))),
                ),
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
