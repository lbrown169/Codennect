import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../objects/user.dart';

class UserFetcher {
  static const String baseUrl = 'http://cop4331.tech/api';

  static Future<List<User>> getUsers() async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString('auth_token');

    final response = await http.get(
      Uri.parse('$baseUrl/get-all-users'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        if (cookie != null) 'Cookie': cookie,
      },
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      print("DECODED TYPE: ${decoded.runtimeType}");

      if (decoded is List) {
        return decoded
            .map((e) => User.fromJson(e as Map<String, dynamic>))
            .toList();
      } else {
        throw Exception('Expected a List but got ${decoded.runtimeType}');
      }
    } else {
      throw Exception('Failed to fetch users: ${response.statusCode}');
    }
  }
}
