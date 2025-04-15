import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class EditProjectCall {
  static const String baseUrl = 'https://cop4331.tech/api';

  static Future<bool> editProject({
    required String userId,
    required Map<String, dynamic> changes,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final Cookie = prefs.getString('auth_token');

      if (Cookie == null) {
        print('No cookie found in SharedPreferences');
        return false;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/edit-project'),
        headers: {'Content-Type': 'application/json', 
          'Cookie': Cookie},
        body: jsonEncode({
          'name': userId,
          'changes': changes,
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