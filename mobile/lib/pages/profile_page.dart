import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'edit_profile_page.dart';
import 'home_page.dart';
import 'package:mobile/integration/get_user_info_call.dart';

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

  final TextEditingController githubController = TextEditingController();
  final TextEditingController discordController = TextEditingController();

  List<String> skills = [];
  List<String> roles = [];
  List<String> interests = [];
  final TextEditingController skillController = TextEditingController();
  final TextEditingController roleController = TextEditingController();
  final TextEditingController interestController = TextEditingController();

  List<String> skillBank = [
    'Android (Kotlin/Java)',
    'Angular',
    'Arduino',
    'AWS',
    'C#',
    'C++',
    'Dart',
    'Docker',
    'Express.js',
    'Figma (UI/UX)',
    'Firebase',
    'Flutter',
    'Google Cloud',
    'GraphQL',
    'iOS (Swift)',
    'Java',
    'JavaScript',
    'Machine Learning',
    'MongoDB',
    'MySQL',
    'Node.js',
    'OpenAI API',
    'PostgreSQL',
    'Raspberry Pi',
    'React',
    'React Native',
    'REST API',
    'Swift',
    'TensorFlow',
    'TypeScript',
    'Vue.js'
  ];
  List<String> roleBank = ['Frontend', 'Backend', 'Database', 'Mobile'];
  List<String> interestBank = ['Gaming', 'Web Development', 'Mobile Development', 'Business'];

  // @override
  // void initState() {
  //   super.initState();
  //   getUserInfo();
  // }

  // Future<void> fetchProjects() async {
  //   final projectData = await UserInfoService.getUserInfo();


  // }

  Widget buildSection(String title, List<String> list, List<String> bank,
      TextEditingController controller, String inputHint) {
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
        title: Text("User Profile",
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
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white, width: 2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: TextButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const EditProfilePage(),
                    ),
                  );
                },
                style: TextButton.styleFrom(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 1),
                ),
                child: Text(
                  "Edit Profile",
                  style: GoogleFonts.poppins(color: Colors.white),
                ),
              ),
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
                        Text("John Doe", // Replace with dynamic user name
                            style: GoogleFonts.poppins(
                                fontWeight: FontWeight.w500)),
                      ],
                    ),
                    const SizedBox(height: 15),
                    Row(
                      children: [
                        Text("Email: ", style: GoogleFonts.poppins()),
                        Text("johndoe@email.com", // Replace with dynamic email
                            style: GoogleFonts.poppins(
                                fontWeight: FontWeight.w500)),
                      ],
                    ),
                    const SizedBox(height: 15),
                    Row(
                      children: [
                        Text("Preferred Method of Communication: ",
                            style: GoogleFonts.poppins()),
                        Text(
                            "Email", // Replace with dynamic preferred communication method
                            style: GoogleFonts.poppins(
                                fontWeight: FontWeight.w500)),
                      ],
                    ),
                    const SizedBox(height: 15),
                    Row(
                      children: [
                        Text("Public Account: ", style: GoogleFonts.poppins()),
                        Text(
                            "Yes", // Replace with dynamic public account status
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
                          child: Text("github.com/user",
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
                          child: Text("discord.com/user",
                              style: GoogleFonts.poppins(
                                  color: const Color(0xFF124559))),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            buildSection(
                "Skills", skills, skillBank, skillController, "Enter a skill"),
            buildSection(
                "Roles", roles, roleBank, roleController, "Enter a role"),
            buildSection("Interests", interests, interestBank,
                interestController, "Enter an interest"),
          ],
        ),
      ),
    );
  }
}
