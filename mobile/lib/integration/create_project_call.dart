import 'dart:convert';
import 'package:http/http.dart' as http;
import '../objects/field_details.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CreateProjectCall {
  static const String baseUrl = 'http://cop4331.tech/api';

  static Future<bool> createProject({
    required String name,
    required String description,
    required bool is_private,
    required List<String> required_skills,
    required List<FieldDetails> fields,
    required Map<String, int> roles,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final Cookie = prefs.getString('auth_token');

      if (Cookie == null) {
        print('No cookie found in SharedPreferences');
        return false;
      }
      print("Success");
      final response = await http.post(
        Uri.parse('$baseUrl/create-project'),
        headers: {'Content-Type': 'application/json', 'Cookie': Cookie},
        body: jsonEncode({
          'name': name,
          'description': description,
          'is_private': is_private,
          'required_skills': required_skills,
          'fields': fields.map((f) => f.toJson()).toList(),
          'roles': roles,
        }),
      );
      print("Response");
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
