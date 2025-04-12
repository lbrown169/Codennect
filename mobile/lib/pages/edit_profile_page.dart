import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'profile_page.dart';
import 'package:mobile/integration/get_profile_call.dart';
import 'package:mobile/integration/edit_profile_call.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  _EditProfilePageState createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
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
  List<String> interestBank = [
    'Gaming',
    'Web Development',
    'Mobile Development',
    'Business'
  ];

  String profileId = "";

  @override
  void initState() {
    super.initState();
    fetchProfileData();
  }

  Future<void> fetchProfileData() async {
    final profileData = await ProfileInfoService.getProfile(
        'CHANGE STRING'); // Replace with user ID or token
    if (profileData != null) {
      setState(() {
        profileId = profileData['id'];
        nameController.text = profileData['name'] ?? '';
        emailController.text = profileData['email'] ?? '';
        commController.text = profileData['preferredComm'] ?? '';
        githubController.text = profileData['github'] ?? '';
        discordController.text = profileData['discord'] ?? '';
        isPublic = profileData['isPublic'] ?? true;
        skills = List<String>.from(profileData['skills'] ?? []);
        roles = List<String>.from(profileData['roles'] ?? []);
        interests = List<String>.from(profileData['interests'] ?? []);
      });
    }
  }

  void addCustomItem(String item, List<String> list) {
    setState(() {
      if (item.trim().isNotEmpty) list.add(item.trim());
    });
  }

  void addItemFromBank(String item, List<String> list) {
    setState(() {
      if (!list.contains(item)) list.add(item);
    });
  }

  void openBankDialog(BuildContext context, List<String> bank,
      Function(String) onItemSelected) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Choose an item', style: GoogleFonts.poppins()),
          content: SizedBox(
            height: 200,
            width: double.maxFinite,
            child: ListView.builder(
              itemCount: bank.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(bank[index], style: GoogleFonts.poppins()),
                  onTap: () {
                    onItemSelected(bank[index]);
                    Navigator.of(context).pop();
                  },
                );
              },
            ),
          ),
        );
      },
    );
  }

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
                  .map((item) => GestureDetector(
                        onTap: () => setState(() => list.remove(item)),
                        child: Chip(
                          label: Text(item, style: GoogleFonts.poppins()),
                          backgroundColor: const Color(0xFF9DB4C0),
                          labelStyle: const TextStyle(color: Colors.black),
                        ),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                ElevatedButton(
                  onPressed: () {
                    openBankDialog(context, bank, (item) {
                      addItemFromBank(item, list);
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF124559),
                  ),
                  child: Text("Add from list",
                      style: GoogleFonts.poppins(color: Colors.white)),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) {
                        return AlertDialog(
                          title: Text('Enter $title',
                              style: GoogleFonts.poppins()),
                          content: TextField(
                            controller: controller,
                            decoration: InputDecoration(hintText: inputHint),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () {
                                addCustomItem(controller.text, list);
                                controller.clear();
                                Navigator.of(context).pop();
                              },
                              child: Text('Add', style: GoogleFonts.poppins()),
                            ),
                          ],
                        );
                      },
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF124559),
                  ),
                  child: Text("Add custom",
                      style: GoogleFonts.poppins(color: Colors.white)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> saveProfileChanges() async {
    final success = await EditProfileService.updateProfile(
      userId: profileId,
      changes: {
        "name": nameController.text.trim(),
        "email": emailController.text.trim(),
        "comm": commController.text.trim(),
        "github": githubController.text.trim(),
        "discord": discordController.text.trim(),
        "isPublic": isPublic,
        "skills": skills,
        "roles": roles,
        "interests": interests,
      },
    );

    if (success) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const ProfilePage()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to save profile changes.")),
      );
    }
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
            onPressed: saveProfileChanges,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            _buildTextInput("Name", nameController, isRequired: true),
            const SizedBox(height: 12),
            _buildTextInput("Email", emailController),
            const SizedBox(height: 12),
            _buildTextInput("Preferred Communication", commController),
            const SizedBox(height: 12),
            CheckboxListTile(
              title: Text("Public Account"),
              value: isPublic,
              onChanged: (value) => setState(() => isPublic = value ?? true),
            ),
            const SizedBox(height: 16),
            _buildTextInput("GitHub", githubController),
            const SizedBox(height: 12),
            _buildTextInput("Discord", discordController),
            const SizedBox(height: 16),

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

  Widget _buildTextInput(
    String label,
    TextEditingController controller, {
    bool isRequired = false,
    bool isNumber = false,
    int maxLines = 1,
    void Function(String)? onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 1,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextFormField(
        controller: controller,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.transparent, width: 2.0),
            borderRadius: BorderRadius.circular(12),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: const BorderSide(
              color: Color.fromARGB(255, 80, 145, 142),
              width: 2.0,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          errorBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.red, width: 2.0),
            borderRadius: BorderRadius.circular(12),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.red, width: 2.0),
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        onChanged: onChanged,
        validator: isRequired
            ? (val) =>
                (val == null || val.isEmpty) ? '$label is required' : null
            : null,
      ),
    );
  }
}
