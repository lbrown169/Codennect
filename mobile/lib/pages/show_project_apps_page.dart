import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../objects/project.dart';
import '../integration/get_project_apps_call.dart';
import 'applicant_profile_page.dart';

class ShowApplicationsPage extends StatefulWidget {
  final Project project;
  const ShowApplicationsPage({super.key, required this.project});

  @override
  State<ShowApplicationsPage> createState() => _ShowApplicationsPageState();
}

class _ShowApplicationsPageState extends State<ShowApplicationsPage> {
  final TextEditingController messageController = TextEditingController();
  late Future<List<Map<String, dynamic>>> _applicationsFuture;
  String? userId;
  String? userName;

  @override
  void initState() {
    super.initState();
    _applicationsFuture = GetProjectApplications.getApplications().then((data) {
      return data
          .map<Map<String, dynamic>>((json) => {
                'userId': json['userId'],
                'projectId': json['projectId'],
                'message': json['message'],
              })
          .where((app) => app['projectId'] == widget.project.id)
          .toList();
    });
  }

  void _goBack() {
    Navigator.of(context).pop();
  }

  void _seeDetails(String userId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ApplicantProfilePage(
          project: widget.project,
          applicantId: userId,
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
        title: Text(
          "Project Applications",
          style: GoogleFonts.poppins(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: _goBack,
        ),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _applicationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("No applications found."));
          }

          final applications = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: applications.length,
            itemBuilder: (context, index) {
              final application = applications[index];
              return Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                margin: const EdgeInsets.only(bottom: 12),
                elevation: 3,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 2),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              "Name: ${application['userId']}",
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          TextButton(
                            onPressed: () => _seeDetails(application['userId']),
                            style: TextButton.styleFrom(
                              foregroundColor: const Color(0xFF124559),
                              textStyle: GoogleFonts.poppins(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            child: const Text("See Details"),
                          ),
                        ],
                      ),
                      const SizedBox(height: 1),
                      Text(
                        "Message:",
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        application['message'] ?? '',
                        style: GoogleFonts.poppins(fontSize: 14),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
