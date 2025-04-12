import 'dart:convert';
import 'package:http/http.dart' as http;

class ProfileInfoService {
  static const baseUrl = 'http://10.0.2.2:5001/api';

  static Future<Map<String, dynamic>?> getProfile(String userId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/get-me'),);

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        return body as Map<String, dynamic>;
      } else {
        print('Failed to fetch profile info: \${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching profile info: \$e');
      return null;
    }
  }
}