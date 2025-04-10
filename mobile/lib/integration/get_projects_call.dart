import 'dart:convert';
import 'package:http/http.dart' as http;

class GetProjectsListCall {
  //CHANGE THIS URL WHEN TESTING
  static const String baseUrl = 'https://yourapi.com/api';

  static Future<List<Map<String, dynamic>>> getProjects() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/projects'));
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
