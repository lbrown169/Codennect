// session_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class SessionService {
  static Future<String?> getSSID() async {
    const String ssidServerLink = "https://your-server-link.com";

    final response = await http.post(
      Uri.parse(ssidServerLink),
      body: "some body for request that probably need to be private",
    );

    final setCookie = response.headers['set-cookie'];
    if (setCookie != null) {
      final sessionId = setCookie.split(';').firstWhere(
        (part) => part.trim().startsWith('sessionid='),
        orElse: () => '',
      ).split('=').last;

      return sessionId;
    }

    return null;
  }
}
