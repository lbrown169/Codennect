import 'dart:convert';
import 'package:http/http.dart' as http;

class CreateProjectCall {
  static const String baseUrl = 'http://cop4331.tech/api';

  static Future<bool> createProject({
    required String name,
    required String description,
    required bool is_private,
    required List<String> required_skills,
    required List<Map<String, dynamic>> fields,
    required Map<String, int>  roles,
    
  }) async {

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/create-project'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          'name': name,
          'description': description,
          'is_private': is_private,
          'required_skills': required_skills,
          'fields': fields,
          'roles': roles,
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Failed to create project: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error during creating project: $e');
      return false;
    }
  }
}