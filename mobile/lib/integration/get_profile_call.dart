import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileInfoService {
  static Future<Map<String, dynamic>?> getProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final rawCookie = prefs.getString('auth_token');
    print('Raw cookie: $rawCookie');

    if (rawCookie == null) return null;

    final dio = Dio();
    try {
      final response = await dio.get(
        'http://cop4331.tech/api/get-me',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Cookie': rawCookie,
          },
        ),
      );

      if (response.statusCode == 200) {
        print("Profile fetched");
        return response.data;
      } else {
        print("Failed: ${response.statusCode}");
        return null;
      }
    } catch (e) {
      print("Error fetching profile info: $e");
      return null;
    }
  }
}
