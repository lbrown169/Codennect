import 'dart:convert';
import 'dart:io';

import 'package:html/dom.dart';
import 'package:html/parser.dart' as parser;

class LoginCall {
  Future<Map<String, dynamic>> loginUser(String email, String password) async {
    const url = 'http://cop4331.tech/api/login';
    final uri = Uri.parse(url);

    HttpClient client = HttpClient();
    HttpClientRequest request = await client.postUrl(uri);

    request.headers.set('Content-Type', 'application/json');
    request.add(utf8.encode(jsonEncode({'email': email, 'password': password})));

    HttpClientResponse response = await request.close();
    final responseBody = await response.transform(utf8.decoder).join();
    final data = jsonDecode(responseBody);

    final cookies = response.cookies;

    if (response.statusCode == 200) {
      return {
        'success': true,
        'id': data['id'],
        'name': data['name'],
        'cookies': cookies,
      };
    } else {
      return {
        'success': false,
        'error': data['error'],
      };
    }
  }
}

// You can keep parseHtml right here
Future<void> parseHtml(List<Cookie> cookies) async {
  HttpClient client = HttpClient();
  HttpClientRequest request =
      await client.getUrl(Uri.parse("http://www.example.com/"));

  for (final cookie in cookies) {
    request.cookies.add(cookie);
  }

  HttpClientResponse response = await request.close();
  final body = await response.transform(utf8.decoder).join();
  Document document = parser.parse(body);

  print(document.body?.text); // safer than document.text
}
