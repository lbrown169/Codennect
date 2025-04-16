// import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';
// import '../objects/project.dart';
// //import 'package:mobile/integration/edit_project_call.dart';

// class EditProjectPage extends StatefulWidget {
//   final Project project;
//   const EditProjectPage({super.key, required this.project});

//   @override
//   _EditProjectPageState createState() => _EditProjectPageState();
// }

// class _EditProjectPageState extends State<EditProjectPage> {
//   final _formKey = GlobalKey<FormState>();

//   late TextEditingController _titleController;
//   late TextEditingController _descriptionController;
//   late TextEditingController _memberLimitController;
//   bool _isPrivate = false;
//   List<String> _skills = [];

//   final TextEditingController skillsController = TextEditingController();

//   List<String> skillBank = [
//     'Android (Kotlin/Java)',
//     'Angular',
//     'Arduino',
//     'AWS',
//     'C#',
//     'C++',
//     'Dart',
//     'Docker',
//     'Express.js',
//     'Figma (UI/UX)',
//     'Firebase',
//     'Flutter',
//     'Google Cloud',
//     'GraphQL',
//     'iOS (Swift)',
//     'Java',
//     'JavaScript',
//     'Machine Learning',
//     'MongoDB',
//     'MySQL',
//     'Node.js',
//     'OpenAI API',
//     'PostgreSQL',
//     'Raspberry Pi',
//     'React',
//     'React Native',
//     'REST API',
//     'Swift',
//     'TensorFlow',
//     'TypeScript',
//     'Vue.js'
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _titleController = TextEditingController(text: widget.project.title);
//     _descriptionController =
//         TextEditingController(text: widget.project.description);
//     _memberLimitController =
//         TextEditingController(text: widget.project.memberLimit.toString());
//     _skills = List<String>.from(widget.project.requiredSkills);
//     _isPrivate = widget.project.is_private;
//   }

//   @override
//   void dispose() {
//     _titleController.dispose();
//     _descriptionController.dispose();
//     _memberLimitController.dispose();
//     super.dispose();
//   }

//   void addCustomItem(String item, List<String> list) {
//     setState(() {
//       if (item.trim().isNotEmpty) list.add(item.trim());
//     });
//   }

//   void addItemFromBank(String item, List<String> list) {
//     setState(() {
//       if (!list.contains(item)) list.add(item);
//     });
//   }

//   void openBankDialog(BuildContext context, List<String> bank,
//       Function(String) onItemSelected) {
//     showDialog(
//       context: context,
//       builder: (context) {
//         return AlertDialog(
//           title: Text('Choose an item', style: GoogleFonts.poppins()),
//           content: SizedBox(
//             height: 200,
//             width: double.maxFinite,
//             child: ListView.builder(
//               itemCount: bank.length,
//               itemBuilder: (context, index) {
//                 return ListTile(
//                   title: Text(bank[index], style: GoogleFonts.poppins()),
//                   onTap: () {
//                     onItemSelected(bank[index]);
//                     Navigator.of(context).pop();
//                   },
//                 );
//               },
//             ),
//           ),
//         );
//       },
//     );
//   }

//   Widget _buildTextInput(
//     String label,
//     TextEditingController controller, {
//     bool isRequired = false,
//     bool isNumber = false,
//     int maxLines = 1,
//     void Function(String)? onChanged,
//   }) {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 26),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(12),
//         boxShadow: [
//           BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2))
//         ],
//       ),
//       child: TextFormField(
//         controller: controller,
//         keyboardType: isNumber ? TextInputType.number : TextInputType.text,
//         maxLines: maxLines,
//         decoration: InputDecoration(
//           labelText: label,
//           filled: true,
//           fillColor: Colors.white,
//           border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
//           enabledBorder: OutlineInputBorder(
//             borderRadius: BorderRadius.circular(12),
//             borderSide: BorderSide(color: Colors.transparent),
//           ),
//           focusedBorder: OutlineInputBorder(
//             borderRadius: BorderRadius.circular(12),
//             borderSide: BorderSide(color: Color(0xFF508F8E), width: 2.0),
//           ),
//         ),
//         onChanged: onChanged,
//         validator: isRequired
//             ? (val) =>
//                 (val == null || val.isEmpty) ? '$label is required' : null
//             : null,
//       ),
//     );
//   }

//   Widget buildSection(String title, List<String> list, List<String> bank,
//       TextEditingController controller, String inputHint) {
//     return Card(
//       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//       elevation: 2,
//       margin: const EdgeInsets.only(bottom: 16),
//       child: Padding(
//         padding: const EdgeInsets.all(16),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text(title,
//                 style: GoogleFonts.poppins(
//                     fontWeight: FontWeight.bold, fontSize: 20)),
//             const SizedBox(height: 12),
//             Wrap(
//               spacing: 8,
//               runSpacing: 8,
//               children: list
//                   .map((item) => GestureDetector(
//                         onTap: () => setState(() => list.remove(item)),
//                         child: Chip(
//                           label: Text(item, style: GoogleFonts.poppins()),
//                           backgroundColor: const Color(0xFF9DB4C0),
//                           labelStyle: const TextStyle(color: Colors.black),
//                         ),
//                       ))
//                   .toList(),
//             ),
//             const SizedBox(height: 12),
//             Row(
//               children: [
//                 ElevatedButton(
//                   onPressed: () => openBankDialog(
//                       context, bank, (item) => addItemFromBank(item, list)),
//                   style: ElevatedButton.styleFrom(
//                       backgroundColor: const Color(0xFF598392)),
//                   child: Text("Add from list",
//                       style: GoogleFonts.poppins(color: Colors.white)),
//                 ),
//                 const SizedBox(width: 10),
//                 ElevatedButton(
//                   onPressed: () {
//                     showDialog(
//                       context: context,
//                       builder: (context) {
//                         return AlertDialog(
//                           title: Text('Enter $title',
//                               style: GoogleFonts.poppins()),
//                           content: TextField(
//                             controller: controller,
//                             decoration: InputDecoration(hintText: inputHint),
//                           ),
//                           actions: [
//                             TextButton(
//                               onPressed: () {
//                                 addCustomItem(controller.text, list);
//                                 controller.clear();
//                                 Navigator.of(context).pop();
//                               },
//                               child: Text('Add', style: GoogleFonts.poppins()),
//                             ),
//                           ],
//                         );
//                       },
//                     );
//                   },
//                   style: ElevatedButton.styleFrom(
//                       backgroundColor: const Color(0xFF598392)),
//                   child: Text("Add custom",
//                       style: GoogleFonts.poppins(color: Colors.white)),
//                 ),
//               ],
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   void saveProject() {
//     // Save logic here: print updated values or send to backend
//     final updatedProject = Project(
//       id: widget.project.id,
//       title: _titleController.text,
//       description: _descriptionController.text,
//       creatorName: widget.project.creatorName,
//       requiredSkills: _skills,
//       currentMembers: widget.project.currentMembers,
//       memberLimit: int.tryParse(_memberLimitController.text) ??
//           widget.project.memberLimit,
//       is_private: _isPrivate,
//     );

//     Navigator.pop(context, updatedProject);
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color(0xFFEFF6E0),
//       appBar: AppBar(
//         backgroundColor: const Color(0xFF598392),
//         title: Text('Edit Project',
//             style: GoogleFonts.poppins(color: Colors.white)),
//         leading: BackButton(color: Colors.black),
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Form(
//           key: _formKey,
//           child: ListView(
//             children: [
//               const SizedBox(height: 16),
//               _buildTextInput('Project Name', _titleController,
//                   isRequired: true),
//               _buildTextInput('Description', _descriptionController,
//                   isRequired: true, maxLines: 3),
//               CheckboxListTile(
//                 title:
//                     Text('Make project private', style: GoogleFonts.poppins()),
//                 value: _isPrivate,
//                 onChanged: (val) => setState(() => _isPrivate = val ?? false),
//                 activeColor: const Color(0xFF124559),
//               ),
//               const SizedBox(height: 25),
//               _buildTextInput('Member Limit', _memberLimitController,
//                   isRequired: true, isNumber: true),
//               const SizedBox(height: 16),
//               buildSection("Required Skills", _skills, skillBank,
//                   skillsController, "Enter a skill"),
//               ElevatedButton(
//                 onPressed: saveProject,
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: const Color(0xFF124559),
//                   padding: const EdgeInsets.symmetric(vertical: 14),
//                 ),
//                 child: Text('Save Changes',
//                     style: GoogleFonts.poppins(color: Colors.white)),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
