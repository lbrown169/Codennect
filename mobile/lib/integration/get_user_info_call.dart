import 'dart:convert';
import 'package:http/http.dart' as http;

class UserInfoService {
  static const baseUrl = 'http://10.0.2.2:5001/api';

  static Future<Map<String, dynamic>?> getUserInfo(String userId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/get-user-info'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"id": userId}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Failed to fetch user info: \${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching user info: \$e');
      return null;
    }
  }
}
