import 'dart:convert';
import 'package:http/http.dart' as http;

class GetProjectApplications {
  static const String baseUrl = 'https://yourapi.com/api';

  static Future<List<Map<String, dynamic>>> getApplications() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/see-applications'));
      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((e) => e as Map<String, dynamic>).toList();
      } else {
        print('Failed to fetch applications: \${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching applications: \$e');
      return [];
    }
  }
}
