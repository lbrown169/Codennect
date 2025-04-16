import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/integration/create_project_call.dart';
import 'my_projects_page.dart';
import '../objects/field_details.dart';

class CreateProjectsPage extends StatefulWidget {
  const CreateProjectsPage({super.key});

  @override
  State<CreateProjectsPage> createState() => _CreateProjectsPageState();
}

class _CreateProjectsPageState extends State<CreateProjectsPage> {
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  bool _isPrivate = false;
  final _formKey = GlobalKey<FormState>();
  int _frontendCount = 0;
  int _backendCount = 0;
  int _databaseCount = 0;
  int _mobileCount = 0;
  List<Map<String, String>> _links = [];

  List<String> programSkills = [];
  List<String> webDevelopmentSkills = [];
  List<String> backendSkills = [];
  List<String> mobileSkills = [];
  List<String> otherToolsSkills = [];

  final _frontendController = TextEditingController(text: '0');
  final _backendController = TextEditingController(text: '0');
  final _databaseController = TextEditingController(text: '0');
  final _mobileController = TextEditingController(text: '0');
  final TextEditingController programLangController = TextEditingController();
  final TextEditingController webDevelopmentController =
      TextEditingController();
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

  void _addLink() {
    setState(() {
      _links.add({"label": "", "url": ""});
    });
  }

  void _removeLink(int index) {
    setState(() {
      _links.removeAt(index);
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
      List<String> allSkills = [
        ...programSkills,
        ...webDevelopmentSkills,
        ...backendSkills,
        ...mobileSkills,
        ...otherToolsSkills,
      ];

      Map<String, int> roles = {
        'Frontend': _frontendCount,
        'API': _backendCount,
        'Database': _databaseCount,
        'Mobile': _mobileCount,
      };

      List<FieldDetails> fields = _links.map((link) {
        final label = link['label'] ?? '';
        final url = link['url'] ?? '';
        return FieldDetails(
          name: label,
          value: url,
          isPrivate: false,
        );
      }).toList();

      final success = await CreateProjectCall.createProject(
        name: _nameController.text.trim(),
        description: _descriptionController.text.trim(),
        is_private: _isPrivate,
        required_skills: allSkills,
        fields: fields,
        roles: roles,
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
              const SizedBox(height: 16),
              _buildTextInput('Project Name', _nameController,
                  isRequired: true),
              const SizedBox(height: 16),
              _buildTextInput('Description', _descriptionController,
                  isRequired: true, maxLines: 3),
              const SizedBox(height: 20),
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
              const SizedBox(height: 15),
              // Roles Section
              Text('Roles',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              SizedBox(height: 5),

              _buildRoleCountField('Frontend', _frontendController, (value) {
                _frontendCount = value;
              }),
              _buildRoleCountField('API', _backendController, (value) {
                _backendCount = value;
              }),
              _buildRoleCountField('Database', _databaseController, (value) {
                _databaseCount = value;
              }),
              _buildRoleCountField('Mobile', _mobileController, (value) {
                _mobileCount = value;
              }),
              SizedBox(height: 25),

              // Links Section
              Text('Project Links',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              for (int i = 0; i < _links.length; i++)
                LinkRow(
                  link: _links[i],
                  onLabelChanged: (newLabel) {
                    setState(() {
                      _links[i]['label'] = newLabel;
                    });
                  },
                  onUrlChanged: (newUrl) {
                    setState(() {
                      _links[i]['url'] = newUrl;
                    });
                  },
                  onRemove: () => _removeLink(i),
                ),
              SizedBox(height: 25),
              ElevatedButton(
                onPressed: _addLink,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF598392),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: Text('Add Another Link',
                    style: GoogleFonts.poppins(color: Colors.white)),
              ),

              //Skills section
              const SizedBox(height: 25),
              Text('Skills',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 1,
            offset: Offset(0, 2),
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
            borderSide: const BorderSide(
              color: Colors.transparent,
              width: 2.0,
            ),
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
            borderSide: const BorderSide(
              color: Colors.red,
              width: 2.0,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderSide: const BorderSide(
              color: Colors.red,
              width: 2.0,
            ),
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

  Widget _buildRoleCountField(
      String role, TextEditingController controller, Function(int) onChanged) {
    return TextFormField(
      controller: controller,
      keyboardType: TextInputType.number,
      decoration: InputDecoration(labelText: '$role Roles'),
      onChanged: (value) {
        onChanged(int.tryParse(value) ?? 0);
      },
      validator: (value) {
        if (int.tryParse(value ?? '') == null ||
            int.tryParse(value ?? '')! < 0) {
          return '$role role count must be a valid number';
        }
        return null;
      },
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

class LinkRow extends StatelessWidget {
  final Map<String, String> link;
  final ValueChanged<String> onLabelChanged;
  final ValueChanged<String> onUrlChanged;
  final VoidCallback onRemove;

  LinkRow({
    required this.link,
    required this.onLabelChanged,
    required this.onUrlChanged,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            decoration: InputDecoration(labelText: 'Link Label'),
            onChanged: onLabelChanged,
            controller: TextEditingController(text: link['label']),
          ),
        ),
        SizedBox(width: 8),
        Expanded(
          child: TextField(
            decoration: InputDecoration(labelText: 'Link URL'),
            onChanged: onUrlChanged,
            controller: TextEditingController(text: link['url']),
          ),
        ),
        IconButton(
          icon: Icon(Icons.remove_circle),
          onPressed: onRemove,
        ),
      ],
    );
  }
}
