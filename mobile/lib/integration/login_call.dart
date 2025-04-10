import 'dart:convert';
import 'package:http/http.dart' as http;

class LoginCall {
  Future<Map<String, dynamic>> loginUser(String email, String password) async {
    // For normal request using emulator
    const url = 'http://10.0.2.2:5001/api/login';

    // For request using real device
    //const url = 'http://10.32.98.83:5001/api/login';

    // URL USING NGROCK FOR WHEN AT UCF
    //const url = 'https://49c0-132-170-212-55.ngrok-free.app/api/login';

    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return {'success': true, 'id': data['id'], 'name': data['name']};
    } else {
      return {'success': false, 'error': data['error']};
    }
  }
}
