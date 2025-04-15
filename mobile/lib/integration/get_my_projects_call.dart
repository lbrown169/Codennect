import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class GetMyProjectsListCall {
  //CHANGE THIS URL WHEN TESTING

  static const String baseUrl = 'https://cop4331.tech.com/api';

  static Future<List<Map<String, dynamic>>> getProjects() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final Cookie = prefs.getString('auth_token');

      if (Cookie == null) {
        print('No cookie found in SharedPreferences');
        return [];
      }

      final response = await http.get(
        Uri.parse('$baseUrl/get-my-projects'),
        headers: {'Content-Type': 'application/json', 
          'Cookie': Cookie},
      );

      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((e) => e as Map<String, dynamic>).toList();
      } else {
        print('Failed to fetch projects: \${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching projects: \$e');
      return [];
    }
  }
}
