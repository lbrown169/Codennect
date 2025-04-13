import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../objects/project.dart';
import '../integration/get_projects_call.dart';
import 'create_project_page.dart';
import 'project_details_page.dart';

class MyProjectsPage extends StatefulWidget {
  const MyProjectsPage({super.key});

  @override
  State<MyProjectsPage> createState() => _MyProjectsPageState();
}

class _MyProjectsPageState extends State<MyProjectsPage> {
  late Future<List<Project>> _projectsFuture;
  String? userId;
  String? userName;

  @override
  void initState() {
    super.initState();
    _loadUserSession();
    _projectsFuture = GetProjectsListCall.getProjects().then((data) {
      return data.map((json) => Project.fromJson(json)).toList();
    });
  }

  Future<void> _loadUserSession() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      userId = prefs.getString('userId');
      userName = prefs.getString('userName');
    });
  }

  void _goBack() {
    Navigator.of(context).pop();
  }

  void _addProject() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const CreateProjectsPage()),
    );
  }

  void _openProjectDetails(Project project) {

    //Checks if the creatorName on the project matches the userName for the session
    if (userName != null && project.creatorName == userName) {
      
      //They match so the the current user is the creator and can see the project's applications
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => ProjectDetailPage(
                  project: project,
                  showApplyButton: false,
                  showApplicationsButton: true,
                )),
      );
    } else {
      //The button is hidden
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => ProjectDetailPage(
                  project: project,
                  showApplyButton: false,
                  showApplicationsButton: false,
                )),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text(
          "My Projects",
          style: GoogleFonts.poppins(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: _goBack,
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: IconButton(
              icon: const Icon(Icons.add, color: Colors.white),
              onPressed: _addProject,
            ),
          ),
        ],
      ),
      body: FutureBuilder<List<Project>>(
        future: _projectsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("No projects found."));
          }

          final projects = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: projects.length,
            itemBuilder: (context, index) {
              final project = projects[index];
              return GestureDetector(
                onTap: () => _openProjectDetails(project),
                child: Card(
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
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Text(
                                project.title,
                                style: GoogleFonts.poppins(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF124559),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                "${project.currentMembers}/${project.memberLimit} members",
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          project.description,
                          style: GoogleFonts.poppins(fontSize: 14),
                        ),
                        const SizedBox(height: 10),
                      ],
                    ),
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
