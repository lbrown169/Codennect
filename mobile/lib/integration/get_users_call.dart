import 'dart:convert';
import 'package:http/http.dart' as http;

class UserFetcher {
  static const String baseUrl = 'https://yourapi.com/api';

  static Future<List<Map<String, dynamic>>> getUsers() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/get-all-users'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as List;
        return data.map((e) => e as Map<String, dynamic>).toList();
      } else {
        print('Failed to load users: \${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching users: \$e');
      return [];
    }
  }
}
