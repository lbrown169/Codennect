import 'package:flutter/material.dart';
import 'login_page.dart';
import '../../integration/register_call.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController password2Controller = TextEditingController();

  bool isPasswordVisible = false;

  String errorMessage = "";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF598392), Color(0xFFAEC3B0), Color(0xFFEFF6E0)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(top: 100, bottom: 40),
          child: Column(
            children: [
              // Login title at the top
              const Padding(
                padding: EdgeInsets.only(left: 32),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Signup',
                    style: TextStyle(
                      fontSize: 42,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                      fontFamily: 'Poppins',
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              // white login box in the center
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 32,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Name',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Poppins',
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: nameController,
                        decoration: const InputDecoration(
                          hintText: 'Enter your name',
                          hintStyle: TextStyle(fontSize: 14),
                          border: UnderlineInputBorder(),
                          prefixIcon: Icon(Icons.person, size: 20),
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'Email',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Poppins',
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: emailController,
                        decoration: const InputDecoration(
                          hintText: 'Enter your email',
                          hintStyle: TextStyle(fontSize: 14),
                          border: UnderlineInputBorder(),
                          prefixIcon: Icon(Icons.email_outlined, size: 20),
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'Password',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Poppins',
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: passwordController,
                        obscureText: !isPasswordVisible,
                        decoration: InputDecoration(
                          hintText: 'Enter your password',
                          hintStyle: const TextStyle(fontSize: 14),
                          border: const UnderlineInputBorder(),
                          prefixIcon: const Icon(Icons.lock_outline, size: 20),
                          suffixIcon: IconButton(
                            icon: Icon(
                              isPasswordVisible
                                  ? Icons.visibility_off
                                  : Icons.visibility,
                              size: 20,
                            ),
                            onPressed: () {
                              // password visible thingy
                              setState(() {
                                isPasswordVisible = !isPasswordVisible;
                              });
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'Re-enter Password',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Poppins',
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: password2Controller,
                        obscureText: !isPasswordVisible,
                        decoration: InputDecoration(
                          hintText: 'Re-enter your password',
                          hintStyle: const TextStyle(fontSize: 14),
                          border: const UnderlineInputBorder(),
                          prefixIcon: const Icon(Icons.lock_outline, size: 20),
                          suffixIcon: IconButton(
                            icon: Icon(
                              isPasswordVisible
                                  ? Icons.visibility_off
                                  : Icons.visibility,
                              size: 20,
                            ),
                            onPressed: () {
                              // password visible thingy
                              setState(() {
                                isPasswordVisible = !isPasswordVisible;
                              });
                            },
                          ),
                        ),
                      ),

                      // error message display
                      const SizedBox(height: 12),
                      if (errorMessage.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 6.0),
                          child: Text(
                            errorMessage,
                            style: const TextStyle(
                              color: Colors.redAccent,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),

                      const SizedBox(height: 28),

                      //Create account button
                      Align(
                        alignment: Alignment.centerRight,
                        child: GestureDetector(
                          // Calls API fucntion which calls API endpoint
                          onTap: () async {
                            String name = nameController.text.trim();
                            String email = emailController.text.trim();
                            String password = passwordController.text.trim();
                            String password2 = password2Controller.text.trim();

                            setState(() {
                              errorMessage = "";
                            });

                            if (email.isEmpty ||
                                name.isEmpty ||
                                password.isEmpty ||
                                password2.isEmpty) {
                              setState(() {
                                errorMessage = "Please fill out all fields.";
                              });

                              final passwordRegex = RegExp(
                                  r'^(?=.*[0-9])(?=.*[!@#\$&*~])[A-Za-z\d!@#\$&*~]{8,}$');

                              if (!passwordRegex.hasMatch(password)) {
                                setState(() {
                                  errorMessage =
                                      "Password must be at least 8 characters, include 1 number and 1 special character.";
                                });
                                return;
                              }

                              if (password != password2) {
                                setState(() {
                                  errorMessage = "Passwords do not match.";
                                });
                                return;
                              }
                              return;
                            }

                            try {
                              final authService = AuthService();
                              final response =
                                  await authService.registerUser(email);

                              if (response['success']) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                      content: Text(
                                          'Check Your Email to Finish Signing Up')),
                                );
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => const LoginPage()),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                      content:
                                          Text('Error: ${response['error']}')),
                                );
                              }
                            } catch (e) {
                              setState(() {
                                errorMessage = "Invalid Email.";
                              });
                            }
                          },

                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 28,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF52796F),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'Create Account',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontFamily: 'Poppins',
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              //Login redirect at the bottom
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Already have an account? ",
                      style: TextStyle(fontSize: 13)),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const LoginPage()),
                      );
                    },
                    child: const Text(
                      "Login",
                      style: TextStyle(
                        color: Color(0xFF1565C0),
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
