import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  Future<Map<String, dynamic>> registerUser(
    String name,
    String email,
    String password,
  ) async {
    const url = 'http://10.0.2.2:5001/api/register';

    // For request using real device
    //const url = 'http://10.32.98.83:5001/api/register';

    // URL USING NGROCK FOR WHEN AT UCF
    //const url = 'https://49c0-132-170-212-55.ngrok-free.app/api/register';

    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return {'success': true, 'id': data['id'], 'name': data['name']};
    } else {
      return {'success': false, 'error': data['error']};
    }
  }
}
