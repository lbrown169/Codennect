import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class EditProfileService {
  static const url = 'https://cop4331.tech/api/edit-me';

  static Future<bool> updateProfile({
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
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': Cookie,
        },
        body: jsonEncode({'updates': changes}),
      );

      if (response.statusCode == 200) {
        print("Profile updated successfully.");
        return true;
      } else {
        print('Failed to update profile: ${response.statusCode}');
        print('Response body: ${response.body}');
        return false;
      }
    } catch (e) {
      print('Error updating profile: $e');
      return false;
    }
  }
}
