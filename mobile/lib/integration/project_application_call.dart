import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiApplicationCall {
  //CHANGE THIS URL WHEN TESTING
  static const String baseUrl = 'https://yourapi.com/api';

  static Future<bool> submitApplication({
    required String projectId,
    required String userId,
    required String userName,
    required String message,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/applications'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          'projectId': projectId,
          'userId': userId,
          'userName': userName,
          'message': message,
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Failed to submit application: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error during application submission: $e');
      return false;
    }
  }
}
