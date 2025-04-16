import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiApplicationCall {
  static const String baseUrl = 'http://cop4331.tech/api';

  static Future<bool> submitApplication({
    required String projectId,
    required String userId,
    required String message,
    required bool isInvite,
    required List<String> roles,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cookie = prefs.getString('auth_token');

      final response = await http.post(
        Uri.parse('$baseUrl/requests'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          if (cookie != null) 'Cookie': cookie,
        },
        body: jsonEncode({
          'user_id': userId,
          'project_id': projectId,
          'is_invite': isInvite,
          'roles': roles,
          'message': message,
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Failed to submit application: ${response.statusCode}');
        print('Response body: ${response.body}');
        return false;
      }
    } catch (e) {
      print('Error during application submission: $e');
      return false;
    }
  }
}
