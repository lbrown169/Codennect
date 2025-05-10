import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'project_details_page.dart';
import '../objects/project.dart';
import '../../integration/get_projects_call.dart';

class BrowseProjectsPage extends StatefulWidget {
  const BrowseProjectsPage({super.key});

  @override
  State<BrowseProjectsPage> createState() => _BrowseProjectsPageState();
}

class _BrowseProjectsPageState extends State<BrowseProjectsPage> {
  List<Project> projects = [];
  List<Project> filteredProjects = [];
  String selectedSkill = 'All';
  String selectedRole = 'All';
  String searchQuery = '';

  final List<String> allSkills = [
    "All",
    "Android (Kotlin/Java)",
    "Angular",
    "Arduino",
    "AWS",
    "C#",
    "C++",
    "Dart",
    "Docker",
    "Express.js",
    "Figma (UI/UX)",
    "Firebase",
    "Flutter",
    "Google Cloud",
    "GraphQL",
    "iOS (Swift)",
    "Java",
    "JavaScript",
    "Machine Learning",
    "MongoDB",
    "MySQL",
    "Node.js",
    "OpenAI API",
    "PostgreSQL",
    "Raspberry Pi",
    "React",
    "React Native",
    "REST API",
    "Swift",
    "TensorFlow",
    "TypeScript",
    "Vue.js"
  ];

  final List<String> allRoles = [
    "All",
    "Frontend",
    "Backend",
    "Mobile",
    "Database",
  ];

  @override
  void initState() {
    super.initState();
    fetchProjects();
  }

  Future<void> fetchProjects() async {
    final projectData = await GetProjectsListCall.getProjects();
    final loadedProjects =
        projectData.map((data) => Project.fromJson(data)).toList();

    setState(() {
      projects = loadedProjects;
      filteredProjects = loadedProjects;
    });
  }

  void filterProjects() {
    final filtered = projects.where((project) {
      final matchesSkill = selectedSkill == 'All' ||
          project.requiredSkills.contains(selectedSkill);

      final matchesRole = selectedRole == 'All' ||
          project.roles.keys.contains(selectedRole.toLowerCase());

      final matchesSearch =
          project.name.toLowerCase().contains(searchQuery.toLowerCase());

      return matchesSkill && matchesRole && matchesSearch;
    }).toList();

    setState(() {
      filteredProjects = filtered;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6E0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF598392),
        title: Text("Browse Projects",
            style: GoogleFonts.poppins(color: Colors.white)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              onChanged: (val) {
                searchQuery = val;
                filterProjects();
              },
              style: GoogleFonts.poppins(),
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search),
                hintText: 'Search projects by name...',
                hintStyle: GoogleFonts.poppins(),
                filled: true,
                fillColor: Colors.white.withOpacity(0.5),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Skill Dropdown
            Row(
              children: [
                Text("Filter by Skill:",
                    style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: selectedSkill,
                    items: allSkills
                        .map((skill) => DropdownMenuItem(
                              value: skill,
                              child: Text(skill,
                                  style: GoogleFonts.poppins(
                                      color: Colors.black)),
                            ))
                        .toList(),
                    onChanged: (value) {
                      setState(() {
                        selectedSkill = value!;
                        filterProjects();
                      });
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.5),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                )
              ],
            ),
            const SizedBox(height: 16),

            // Role Filter
            Row(
              children: [
                Text("Filter by Role:",
                    style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: selectedRole,
                    items: allRoles
                        .map((role) => DropdownMenuItem(
                            value: role,
                            child: Text(role,
                                style: GoogleFonts.poppins(
                                    color: Colors.black))))
                        .toList(),
                    onChanged: (value) {
                      selectedRole = value!;
                      filterProjects();
                    },
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.5),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                )
              ],
            ),
            const SizedBox(height: 20),

            // List of Projects
            Expanded(
              child: filteredProjects.isEmpty
                  ? Center(
                      child: Text("No projects found.",
                          style: GoogleFonts.poppins()))
                  : ListView.builder(
                      itemCount: filteredProjects.length,
                      itemBuilder: (context, index) {
                        final project = filteredProjects[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 8),
                          elevation: 3,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(16),
                            title: Text(project.name,
                                style: GoogleFonts.poppins(
                                    fontWeight: FontWeight.w600)),
                            subtitle: Text(project.description,
                                style: GoogleFonts.poppins()),
                            trailing: ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        ProjectDetailPage(project: project),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF124559),
                              ),
                              child: Text("See Details",
                                  style: GoogleFonts.poppins(
                                      color: Colors.white)),
                            ),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => ProjectDetailPage(
                                    project: project,
                                    showApplyButton: true,
                                    showApplicationsButton: false,
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
            )
          ],
        ),
      ),
    );
  }
}
