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
  String searchQuery = '';

  @override
  void initState() {
    super.initState();
    fetchProjects();
  }

  Future<void> fetchProjects() async {
    final projectData = await GetProjectsListCall.getProjects();
    setState(() {
      projects = projectData.map((data) => Project.fromJson(data)).toList();
    });
    filterProjects();
  }

  void filterProjects() {
    setState(() {
      filteredProjects = projects.where((project) {
        final matchesSkill = selectedSkill == 'All' ||
            project.requiredSkills.contains(selectedSkill);
        final matchesSearch =
            project.title.toLowerCase().contains(searchQuery.toLowerCase());
        return matchesSkill && matchesSearch;
      }).toList();
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
            // Search Bar
            TextField(
              onChanged: (val) {
                searchQuery = val;
                filterProjects();
              },
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search),
                hintText: 'Search projects by name...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Skill Filter Dropdown
            Row(
              children: [
                const Text("Filter by Skill: ",
                    style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: selectedSkill,
                    items: ["All", "Flutter", "Python", "React", "C++"]
                        .map((skill) =>
                            DropdownMenuItem(value: skill, child: Text(skill)))
                        .toList(),
                    onChanged: (value) {
                      selectedSkill = value!;
                      filterProjects();
                    },
                    decoration: InputDecoration(
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
              child: ListView.builder(
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
                      title: Text(project.title,
                          style:
                              GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                      subtitle: Text(project.description),
                      trailing: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    ProjectDetailPage(project: project)),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF124559),
                        ),
                        child: const Text("See Details", style: TextStyle(color: Colors.white),),
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => ProjectDetailPage(
                                    project: project,
                                    showApplyButton: true,
                                    showApplicationsButton: false,
                                  )),
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
