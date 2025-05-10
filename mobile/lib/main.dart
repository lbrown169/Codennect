import 'package:flutter/material.dart';
import 'pages/login_page.dart';
import 'pages/home_page.dart'; // if you want to route to this manually
import 'pages/profile_page.dart';
import 'pages/my_projects_page.dart';

void main() {
  runApp(const CodennectApp());
}

class CodennectApp extends StatelessWidget {
  const CodennectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Codennect',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginPage(),
        '/home': (context) => const HomePage(),
        '/profile': (context) => const ProfilePage(),
        '/projects': (context) => const MyProjectsPage(),
      },
    );
  }
}
