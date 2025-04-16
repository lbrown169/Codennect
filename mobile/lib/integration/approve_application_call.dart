import 'dart:convert';
import 'package:http/http.dart' as http;

class ApproveApplicationService {
    static const String baseUrl = 'http://cop4331.tech/api';
    static Future<bool> approveApplication({
    required String user_id,
    required String project_id,
    required bool is_invite,
  }) async {
    
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/requests/approve'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': user_id,
          'project_id': project_id,
          'is_invite': is_invite,
        }),
      );

      if (response.statusCode == 200) {
        print("Application approved updated successfully.");
        return true;
      } else {
        print('Failed to approve application: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error approving application: $e');
      return false;
    }
  }
}