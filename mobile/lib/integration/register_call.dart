import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  Future<Map<String, dynamic>> registerUser(String email) async {
    const url = 'http://cop4331.tech/api/register';

    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email}),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return {'success': true};
    } else {
      return {'success': false, 'error': data['error']};
    }
  }
}
