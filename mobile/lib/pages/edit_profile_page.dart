import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'profile_page.dart';

class EditProfilePage extends StatefulWidget {
  final String name;
  final String email;
  final String comm;
  final bool isPublic;
  final List<String> links;
  final List<String> skills;
  final List<String> roles;
  final List<String> interests;

  const EditProfilePage({
    super.key,
    required this.name,
    required this.email,
    required this.comm,
    required this.links,
    required this.isPublic,
    required this.skills,
    required this.roles,
    required this.interests,
  });

  @override
  _EditProfilePageState createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController commController = TextEditingController();
  final TextEditingController linkController = TextEditingController();
  final TextEditingController skillController = TextEditingController();
  final TextEditingController roleController = TextEditingController();
  final TextEditingController interestController = TextEditingController();
  bool isPublic = true;

  List<String> links = [];
  List<String> skills = [];
  List<String> roles = [];
  List<String> interests = [];

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
  List<String> interestBank = [
    'Gaming',
    'Web Development',
    'Mobile Development',
    'Business'
  ];

  @override
  void initState() {
    super.initState();
    nameController.text = widget.name;
    emailController.text = widget.email;
    commController.text = widget.comm;
    isPublic = widget.isPublic;
    links = List.from(widget.links);
    skills = List.from(widget.skills);
    roles = List.from(widget.roles);
    interests = List.from(widget.interests);
  }

  void addLink(String link) {
    if (link.trim().isEmpty) return;
    setState(() {
      links.add(link.trim());
      linkController.clear();
    });
  }

  void removeItem(String item, List<String> list) {
    setState(() {
      list.remove(item);
    });
  }

  void addItem(
      String item, List<String> list, TextEditingController controller) {
    if (item.trim().isEmpty) return;
    setState(() {
      list.add(item.trim());
      controller.clear();
    });
  }

  Future<void> saveProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final rawCookie = prefs.getString('auth_token');
    if (rawCookie == null) {
      print('No cookie found');
      return;
    }

    final response = await http.post(
      Uri.parse('http://cop4331.tech/api/edit-me'),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': rawCookie,
      },
      body: jsonEncode({
        "updates": {
          "name": nameController.text.trim(),
          "comm": commController.text.trim(),
          "isPublic": isPublic,
          "accounts": links,
          "skills": skills,
          "roles": roles,
          "interests": interests,
        }
      }),
    );

    if (response.statusCode == 200) {
      print("Profile updated successfully.");
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const ProfilePage()),
      );
    } else {
      print("Update failed: ${response.statusCode}");
      print(response.body);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to save changes")),
      );
    }
  }

  Widget buildTagSection(String title, List<String> bank, List<String> list,
      TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style:
                GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w600)),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: list
              .map((item) => Chip(
                    label: Text(item),
                    onDeleted: () => removeItem(item, list),
                  ))
              .toList(),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                decoration: const InputDecoration(hintText: 'Add custom'),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => addItem(controller.text, list, controller),
            )
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: bank
              .map((item) => ActionChip(
                    label: Text(item),
                    onPressed: () => addItem(item, list, controller),
                  ))
              .toList(),
        )
      ],
    );
  }

  Widget buildLinkField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Links",
            style:
                GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w600)),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: links
              .map((link) => Chip(
                    label: Text(link),
                    onDeleted: () => removeItem(link, links),
                  ))
              .toList(),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: linkController,
                decoration: const InputDecoration(hintText: 'Enter link URL'),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () =>
                  addItem(linkController.text, links, linkController),
            )
          ],
        )
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text("Edit Profile",
            style: GoogleFonts.poppins(color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const ProfilePage()),
            );
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.check, color: Colors.white),
            onPressed: saveProfile,
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            buildTextInput("Name", nameController),
            const SizedBox(height: 12),
            buildTextInput("Email", emailController, enabled: false),
            const SizedBox(height: 12),
            buildTextInput("Preferred Communication", commController),
            const SizedBox(height: 12),
            buildLinkField(),
            const SizedBox(height: 20),
            buildTagSection("Skills", skillBank, skills, skillController),
            const SizedBox(height: 20),
            buildTagSection("Roles", roleBank, roles, roleController),
            const SizedBox(height: 20),
            buildTagSection(
                "Interests", interestBank, interests, interestController),
          ],
        ),
      ),
    );
  }

  Widget buildTextInput(String label, TextEditingController controller,
      {bool enabled = true}) {
    return TextFormField(
      controller: controller,
      enabled: enabled,
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: enabled ? Colors.white : Colors.grey.shade200,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
