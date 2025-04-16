import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class LogoutService {
  static const String baseUrl = 'http://cop4331.tech/api/logout';

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    try {
      await http.post(
        Uri.parse(baseUrl),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          if (cookie != null) 'Cookie': cookie,
        },
      );
    } catch (e) {
      print('Logout failed: $e');
    }

    await prefs.clear(); // Clear stored session data
  }
}
