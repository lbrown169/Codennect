import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'edit_profile_page.dart';
import 'home_page.dart';
import 'package:mobile/integration/get_profile_call.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  String? userId;
  String? userName;

  Map<String, dynamic>? profileInfo;

  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController commController = TextEditingController();
  bool isPublic = true;
  final TextEditingController githubController = TextEditingController();
  final TextEditingController discordController = TextEditingController();

  List<String> skills = [];
  List<String> roles = [];
  List<String> interests = [];

  @override
  void initState() {
    super.initState();
    _loadUserSession();
    fetchProfile();
  }

  Future<void> _loadUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      userId = prefs.getString('userId');
      userName = prefs.getString('userName');
    });
  }

  Future<void> fetchProfile() async {
    if (userId != null) {
      final profileData = await ProfileInfoService.getProfile(userId!);
      setState(() {
        profileInfo = profileData;
        skills = List<String>.from(profileInfo?['skills'] ?? []);
        roles = List<String>.from(profileInfo?['roles'] ?? []);
        interests = List<String>.from(profileInfo?['interests'] ?? []);
      });
    } else {
      // Handle case where userId is null (perhaps show a message or return)
      print("Error: userId is null");
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
                    builder: (context) => const EditProfilePage(),
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
                        Text("Public Account: ", style: GoogleFonts.poppins()),
                        Text(profileInfo?['isPublic'] == true ? "Yes" : "No",
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
    );
  }
}
