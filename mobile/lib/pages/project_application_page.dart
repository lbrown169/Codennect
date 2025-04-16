import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../objects/project.dart';
import '../../integration/project_application_call.dart';

class ApplicationPage extends StatefulWidget {
  final Project project;
  const ApplicationPage({super.key, required this.project});

  @override
  State<ApplicationPage> createState() => _ApplicationPageState();
}

class _ApplicationPageState extends State<ApplicationPage> {
  final TextEditingController messageController = TextEditingController();
  String? userId;
  List<String> selectedRoles = [];

  @override
  void initState() {
    super.initState();
    _loadUserSession();
  }

  Future<void> _loadUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      userId = prefs.getString('user_id');
    });
  }

  Future<void> _submitApplication() async {
    final message = messageController.text.trim();

    if (userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("User session not found. Please log in again.")),
      );
      return;
    }

    final success = await ApiApplicationCall.submitApplication(
      projectId: widget.project.id,
      userId: userId!,
      message: message,
      isInvite: false,
      roles: selectedRoles,
    );

    if (success) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Application Sent"),
          content: const Text(
              "Your application has been sent to the project creator."),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("OK"),
            )
          ],
        ),
      );
      messageController.clear();
      setState(() => selectedRoles.clear());
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to submit application.")),
      );
    }
  }

  List<String> getAvailableRoles() {
    final rolesMap = widget.project.roles;
    final usersMap = widget.project.users;
    return rolesMap.entries
        .where((entry) {
          final filled = usersMap[entry.key]?.length ?? 0;
          return filled < entry.value;
        })
        .map((entry) => entry.key)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final availableRoles = getAvailableRoles();

    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text("Application Form", style: GoogleFonts.poppins()),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("You're applying to join:",
                style: GoogleFonts.poppins(
                    fontSize: 18, fontWeight: FontWeight.w500)),
            const SizedBox(height: 10),
            Text("Project: ${widget.project.name}",
                style:
                    GoogleFonts.poppins(fontSize: 16, color: Colors.black87)),
            const SizedBox(height: 30),
            Text("Select Your Role(s):",
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 10,
              children: availableRoles.map((role) {
                return FilterChip(
                  label: Text(role),
                  selected: selectedRoles.contains(role),
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        selectedRoles.add(role);
                      } else {
                        selectedRoles.remove(role);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 30),
            Text("Optional Message:",
                style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            const SizedBox(height: 10),
            TextField(
              controller: messageController,
              maxLines: 5,
              decoration: InputDecoration(
                hintText: "Tell the creator why you want to join...",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                fillColor: Colors.white,
                filled: true,
              ),
            ),
            const SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: _submitApplication,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF124559),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 40, vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  "Submit Application",
                  style: GoogleFonts.poppins(fontSize: 16, color: Colors.white),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
