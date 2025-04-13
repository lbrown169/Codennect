import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/integration/create_project_call.dart';
import 'my_projects_page.dart';

class CreateProjectsPage extends StatefulWidget {
  const CreateProjectsPage({super.key});

  @override
  State<CreateProjectsPage> createState() => _CreateProjectsPageState();
}

class _CreateProjectsPageState extends State<CreateProjectsPage> {
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _memberCountController = TextEditingController();
  final _githubLinkController = TextEditingController();
  bool _isPrivate = false;
  final _formKey = GlobalKey<FormState>();
  int _memberCount = 1;

  List<String> programSkills = [];
  List<String> webDevelopmentSkills = [];
  List<String> backendSkills = [];
  List<String> mobileSkills = [];
  List<String> otherToolsSkills = [];

  final TextEditingController programLangController = TextEditingController();
  final TextEditingController webDevelopmentController = TextEditingController();
  final TextEditingController backendController = TextEditingController();
  final TextEditingController mobileController = TextEditingController();
  final TextEditingController otherToolsController = TextEditingController();

  List<String> programLangBank = [
    'C#',
    'C++',
    'Dart',
    'Java',
    'JavaScript',
    'Swift',
    'TypeScript'
  ];
  List<String> webDevelopmentBank = [
    'Angular',
    'Express.js',
    'Node.js',
    'React',
    'Vue.js'
  ];
  List<String> backendBank = [
    'Firebase',
    'GraphQL',
    'MongoDB',
    'MySQL',
    'PostgreSQL',
    'REST API'
  ];
  List<String> mobileDevelopmentBank = [
    'Android (Kotlin/Java)',
    'Flutter',
    'React Native',
    'iOS (Swift)'
  ];
  List<String> otherToolsBank = [
    'Arduino',
    'AWS',
    'Docker',
    'Figma (UI/UX)',
    'Google Cloud',
    'Machine Learning',
    'OpenAI API',
    'Raspberry Pi',
    'TensorFlow'
  ];

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
            Text(title, style: GoogleFonts.poppins(fontSize: 18)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: list
                  .map((item) => GestureDetector(
                        onTap: () {
                          setState(() {
                            list.remove(item);
                          });
                        },
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
                    backgroundColor: const Color(0xFF598392),
                  ),
                  child: Text("Add from list",
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                      )),
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
                    backgroundColor: const Color(0xFF598392),
                  ),
                  child: Text("Add custom",
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                      )),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _saveProject() async {
    if (_formKey.currentState?.validate() ?? false) {
      print('Project Name: ${_nameController.text}');
      print('Description: ${_descriptionController.text}');
      print('Member Count: $_memberCount');
      print('Is Private: $_isPrivate');

      final success = await CreateProjectCall.createProject(
        name: _nameController.text,
        description: _descriptionController.text,
        memberLimit: _memberCount,
      );

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Project saved successfully!')),
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MyProjectsPage()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to save project.')),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all required fields.')),
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
          'Create Project',
          style: GoogleFonts.poppins(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const MyProjectsPage()),
            );
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              _buildTextInput('Project Name', _nameController,
                  isRequired: true),
              const SizedBox(height: 16),
              _buildTextInput('Description', _descriptionController,
                  isRequired: true, maxLines: 3),
              const SizedBox(height: 16),
              _buildTextInput(
                'Number of Members',
                _memberCountController,
                isNumber: true,
                onChanged: (val) =>
                    setState(() => _memberCount = int.tryParse(val) ?? 1),
              ),
              const SizedBox(height: 16),
              _buildTextInput('Github Link', _githubLinkController,
                  isRequired: false),
              const SizedBox(height: 16),
              CheckboxListTile(
                title: Text('Make project private'),
                value: _isPrivate,
                onChanged: (bool? value) {
                  setState(() {
                    _isPrivate = value ?? false;
                  });
                },
                activeColor: const Color(0xFF124559),
              ),
              const SizedBox(height: 16),
              Text('Skills',
                  style: GoogleFonts.poppins(
                      fontWeight: FontWeight.bold, fontSize: 20)),
              buildSection("Programming Languages", programSkills,
                  programLangBank, programLangController, "Enter a skill"),
              buildSection(
                  "Web Development",
                  webDevelopmentSkills,
                  webDevelopmentBank,
                  webDevelopmentController,
                  "Enter a skill"),
              buildSection("Mobile Development", mobileSkills,
                  mobileDevelopmentBank, mobileController, "Enter a skill"),
              buildSection("Backend and Database", backendSkills, backendBank,
                  backendController, "Enter a skill"),
              buildSection("Other Tools", otherToolsSkills, otherToolsBank,
                  otherToolsController, "Enter a skill"),
              ElevatedButton(
                onPressed: _saveProject,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF124559),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: Text('Save Project',
                    style: GoogleFonts.poppins(color: Colors.white)),
              ),
            ],
          ),
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
      decoration: BoxDecoration(
        color: Colors.white, // Background color of the container
        borderRadius: BorderRadius.circular(12), // Rounded corners
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2), // Shadow color with opacity
            spreadRadius: 1, // How much the shadow spreads
            blurRadius: 1, // How blurry the shadow is
            offset:
                Offset(0, 2), // Position of the shadow (horizontal, vertical)
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
            borderRadius:
                BorderRadius.circular(12), 
          ),
          enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Colors.transparent, // Border color when not focused
            width: 2.0, // Border width
          ),
          borderRadius: BorderRadius.circular(12), // Same rounded corners
        ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: const Color.fromARGB(255, 80, 145, 142), // Border color when focused
              width: 2.0, // Border width
            ),
            borderRadius: BorderRadius.circular(12), // Same rounded corners
          ),
          errorBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: Colors.red, // Border color when there is an error
              width: 2.0, // Border width
            ),
            borderRadius: BorderRadius.circular(12), // Same rounded corners
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderSide: BorderSide(
              color: Colors.red, // Border color when focused and there's an error
              width: 2.0, // Border width
            ),
            borderRadius: BorderRadius.circular(12), // Same rounded corners
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
}
