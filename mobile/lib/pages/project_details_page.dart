import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'project_application_page.dart';
import '../objects/project.dart';

class ProjectDetailPage extends StatelessWidget {
  final Project project;
  const ProjectDetailPage({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Project Details', style: GoogleFonts.poppins()),
        backgroundColor: const Color(0xFF598392),
      ),
      backgroundColor: const Color(0xFFEFF6E0),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(project.title,
                style: GoogleFonts.poppins(
                    fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.group, color: Colors.black54),
                const SizedBox(width: 8),
                Text(
                    '${project.currentMembers} Members (${project.memberLimit - project.currentMembers} spots left)',
                    style: GoogleFonts.poppins(fontSize: 16)),
              ],
            ),
            const SizedBox(height: 20),
            Text('Project Description:',
                style: GoogleFonts.poppins(
                    fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text(
              project.description,
              style: GoogleFonts.poppins(fontSize: 15, color: Colors.black87),
            ),
            const SizedBox(height: 20),
            Text('Required Skills:',
                style: GoogleFonts.poppins(
                    fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 10,
              children: project.requiredSkills
                  .map((skill) => Chip(label: Text(skill)))
                  .toList(),
            ),
            const SizedBox(height: 30),
            Text('Project Creator:',
                style: GoogleFonts.poppins(
                    fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () {
                // Navigate to creator profile page
              },
              child: Row(
                children: [
                  const CircleAvatar(
                    backgroundColor: Color(0xFF598392),
                    child: Icon(Icons.person, color: Colors.white),
                  ),
                  const SizedBox(width: 10),
                  Text(project.creatorName,
                      style: GoogleFonts.poppins(
                          fontSize: 16, color: Color(0xFF124559))),
                ],
              ),
            ),
            const Spacer(),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            ApplicationPage(project: project)),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF124559),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 40, vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                child: Text('Apply to Join',
                    style: GoogleFonts.poppins(fontSize: 16)),
              ),
            )
          ],
        ),
      ),
    );
  }
}
