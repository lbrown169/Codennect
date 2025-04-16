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

    final cookie = response.headers.map['set-cookie']?.first;

    if (cookie != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', cookie);
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
