import 'package:shared_preferences/shared_preferences.dart';

class SessionManager {
  static const String _authTokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _userNameKey = 'user_name';

  static Future<void> saveSession({
    required String userId,
    required String userName,
    String? authToken,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userIdKey, userId);
    await prefs.setString(_userNameKey, userName);
    if (authToken != null) {
      await prefs.setString(_authTokenKey, authToken);
    }
  }

  static Future<String?> getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    String? raw = prefs.getString(_authTokenKey);
    return raw?.split(';').first; // Returns only "token=..."
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_authTokenKey);
    await prefs.remove(_userIdKey);
    await prefs.remove(_userNameKey);
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(_authTokenKey);
  }
}
