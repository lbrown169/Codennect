import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';


class GetProjectApplications {
  //CHANGE THIS URL WHEN TESTING
    static const String baseUrl = 'http://cop4331.tech/api';

  static Future<Map<String, List<Map<String, dynamic>>>> getApplications() async {
  
  try {
    final prefs = await SharedPreferences.getInstance();
      final Cookie = prefs.getString('auth_token');

      if (Cookie == null) {
        print('No cookie found in SharedPreferences');
        return {};
      }

      final response = await http.get(
        Uri.parse('$baseUrl/requests'),
        headers: {'Content-Type': 'application/json', 'Cookie': Cookie},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);

        // Flatten invites
      final List<Map<String, dynamic>> allInvites = (data['invites'] as Map<String, dynamic>)
          .values
          .expand((list) => List<Map<String, dynamic>>.from(list))
          .toList();

      // Flatten applications
      final List<Map<String, dynamic>> allApplications = (data['applications'] as Map<String, dynamic>)
          .values
          .expand((list) => List<Map<String, dynamic>>.from(list))
          .toList();

      return {
        'invites': allInvites,
        'applications': allApplications,
      };
    } else {
      print('Failed to fetch applications: ${response.statusCode}');
      return {'invites': [], 'applications': []};
    }
  } catch (e) {
    print('Error fetching applications: $e');
    return {'invites': [], 'applications': []};
  }
}
}