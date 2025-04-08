import 'package:flutter/material.dart';
import 'register_page.dart';
import '../integration/login_call.dart';
import 'home_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // text controllers for user input
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  // controls password visibility
  bool isPasswordVisible = false;

  // shows login error if any
  String errorMessage = "";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // background with gradient
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
        child: Stack(
          children: [
            // Login title at the top
            const Positioned(
              top: 100,
              left: 32,
              child: Text(
                'Login',
                style: TextStyle(
                  fontSize: 42,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  fontFamily: 'Poppins',
                ),
              ),
            ),

            // white login box in the center
            Positioned(
              top: 220,
              left: 32,
              right: 32,
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
                    // username label and input
                    const Text(
                      'Username',
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

                    // password label and input
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

                    // sign in button
                    Align(
                      alignment: Alignment.centerRight,
                      child: GestureDetector(
                        // Calls API fucntion which calls API endpoint
                        onTap: () async {
                          final authService = AuthService();

                          try {
                            final result = await authService.loginUser(
                              emailController.text.trim(),
                              passwordController.text.trim(),
                            );

                            setState(() {
                              if (result['success']) {
                                errorMessage = "";
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => const HomePage(),
                                  ),
                                );
                              } else {
                                errorMessage =
                                    result['error'] ?? "Login failed.";
                              }
                            });
                          } catch (e) {
                            setState(() {
                              errorMessage = "An unexpected error occurred.";
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
                            'Sign In',
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

            // sign up redirect at the bottom
            const Positioned(
              bottom: 40,
              left: 0,
              right: 0,
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Don't have an account? ",
                      style: TextStyle(fontSize: 13),
                    ),
                    SignUpLink(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// separate widget for the sign up link
class SignUpLink extends StatelessWidget {
  const SignUpLink({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => RegisterPage()),
        );
      },
      child: const Text(
        "Sign up",
        style: TextStyle(
          color: Color(0xFF1565C0),
          fontWeight: FontWeight.bold,
          fontSize: 13,
          decoration: TextDecoration.underline,
        ),
      ),
    );
  }
}
