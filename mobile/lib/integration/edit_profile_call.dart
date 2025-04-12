import 'dart:convert';
import 'package:http/http.dart' as http;

class EditProfileService {
  static const baseUrl = 'http://10.0.2.2:5001/api';

  static Future<bool> updateProfile({
    required String userId,
    required Map<String, dynamic> changes,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/edit-user-info'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'id': userId,
          'changes': changes,
        }),
      );

      if (response.statusCode == 200) {
        print("Profile updated successfully.");
        return true;
      } else {
        print('Failed to update profile: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error updating profile: $e');
      return false;
    }
  }
}
