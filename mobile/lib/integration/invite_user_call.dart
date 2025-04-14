import 'dart:convert';
import 'package:http/http.dart' as http;

class InviteService {
  static const String baseUrl = 'https://yourapi.com/api';

  static Future<bool> inviteUserToProject({
    required String userId,
    required String projectId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/invite-user'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "userId": userId,
          "projectId": projectId,
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Failed to invite user: \${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error inviting user: \$e');
      return false;
    }
  }
}
