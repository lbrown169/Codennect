import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginCall {
  Future<Map<String, dynamic>> loginUser(String email, String password) async {
    final dio = Dio();

    final response = await dio.post(
      'http://cop4331.tech/api/login',
      data: {
        'email': email,
        'password': password,
      },
      options: Options(
        headers: {'Content-Type': 'application/json'},
        followRedirects: false,
        validateStatus: (status) => status! < 500,
      ),
    );

    // Attempt to grab the Set-Cookie header from the response
    final cookie = response.headers.map['set-cookie']?.first;
    print('Received cookie: $cookie'); // Debug print to verify cookie

    // store it in local storage using SharedPreferences
    if (cookie != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token',
          cookie); // Save the full cookie string under the key 'auth_token'
    }

    if (response.statusCode == 200) {
      return {
        'success': true,
        'id': response.data['id'],
        'name': response.data['name'],
      };
    } else {
      return {
        'success': false,
        'error': response.data['error'] ?? "Login failed."
      };
    }
  }
}
