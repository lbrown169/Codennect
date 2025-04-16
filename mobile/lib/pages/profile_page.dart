import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'edit_profile_page.dart';
import 'home_page.dart';
import 'package:mobile/integration/get_profile_call.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController commController = TextEditingController();
  bool isPublic = true;

  List<String> skills = [];
  List<String> roles = [];
  List<String> interests = [];
  List<String> links = [];

  @override
  void initState() {
    super.initState();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    final profileData = await ProfileInfoService.getProfile();
    if (profileData != null) {
      setState(() {
        nameController.text = profileData['name'] ?? '';
        emailController.text = profileData['email'] ?? '';
        commController.text = profileData['comm'] ?? '';
        isPublic = profileData['isPublic'] ?? true;
        skills = List<String>.from(profileData['skills'] ?? []);
        roles = List<String>.from(profileData['roles'] ?? []);
        interests = List<String>.from(profileData['interests'] ?? []);
        links = List<String>.from(profileData['accounts'] ?? []);
      });
    } else {
      print("Error: Profile data is null");
    }
  }

  Widget buildInfoBlock(String title, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: GoogleFonts.poppins(
                  fontWeight: FontWeight.w500, fontSize: 14)),
          const SizedBox(height: 4),
          Text(value.isNotEmpty ? value : "N/A",
              style: GoogleFonts.poppins(fontSize: 14)),
        ],
      ),
    );
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text("Your Profile",
            style: GoogleFonts.poppins(color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomePage()),
            );
          },
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: IconButton(
              icon: const Icon(Icons.edit, color: Colors.white),
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EditProfilePage(
                      name: nameController.text,
                      email: emailController.text,
                      comm: commController.text,
                      links: links,
                      isPublic: isPublic,
                      skills: skills,
                      roles: roles,
                      interests: interests,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
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
                    const SizedBox(height: 12),
                    buildInfoBlock("Name", nameController.text),
                    buildInfoBlock("Email", emailController.text),
                    buildInfoBlock(
                        "Preferred Communication", commController.text),
                    buildInfoBlock("Public Account", isPublic ? "Yes" : "No"),
                  ],
                ),
              ),
            ),
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
    );
  }
}
