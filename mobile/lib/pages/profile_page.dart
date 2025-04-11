import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  List<String> skills = [];
  List<String> roles = [];
  List<String> interests = [];
  final TextEditingController skillController = TextEditingController();
  final TextEditingController roleController = TextEditingController();
  final TextEditingController interestController = TextEditingController();

  List<String> skillBank = ['Flutter', 'Dart', 'React', 'Node.js', 'Python'];
  List<String> roleBank = ['Frontend', 'Backend', 'Database', 'Tester'];
  List<String> interestBank = ['Gaming', 'Music', 'Traveling', 'Reading'];

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

  void openBankDialog(
      BuildContext context, List<String> bank, Function(String) onItemSelected) {
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
                  .map((item) => Chip(
                        label: Text(item, style: GoogleFonts.poppins()),
                        backgroundColor: const Color(0xFF9DB4C0),
                        labelStyle: const TextStyle(color: Colors.white),
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
                  child: Text("Add from list", style: GoogleFonts.poppins(color: Colors.white,)),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) {
                        return AlertDialog(
                          title: Text('Enter $title', style: GoogleFonts.poppins()),
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
                  child: Text("Add custom", style: GoogleFonts.poppins(color: Colors.white,)),
                ),
              ],
            ),
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
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
            buildSection("Skills", skills, skillBank, skillController, "Enter a skill"),
            buildSection("Roles", roles, roleBank, roleController, "Enter a role"),
            buildSection("Interests", interests, interestBank, interestController, "Enter an interest"),
          ],
        ),
      ),
    );
  }
}
