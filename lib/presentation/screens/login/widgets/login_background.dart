import 'package:flutter/material.dart';

class LoginBackground extends StatelessWidget {
  final Size size;

  const LoginBackground({super.key, required this.size});

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: Stack(
        children: [
          // Vòng tròn trên cùng
          Positioned(
            top: -size.width * 0.3,
            right: -size.width * 0.2,
            child: Container(
              width: size.width * 0.75,
              height: size.width * 0.75,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFDDD5CA).withValues(alpha: 0.35),
              ),
            ),
          ),
          // Vòng tròn nhỏ góc trái dưới
          Positioned(
            bottom: size.height * 0.08,
            left: -size.width * 0.15,
            child: Container(
              width: size.width * 0.45,
              height: size.width * 0.45,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFB5A886).withValues(alpha: 0.15),
              ),
            ),
          ),
          // Dấu sao trang trí
          const Positioned(
            top: 80,
            left: 40,
            child: Text('✦',
                style: TextStyle(fontSize: 12, color: Color(0xFF9E8E7E))),
          ),
          const Positioned(
            top: 140,
            right: 60,
            child: Text('✦',
                style: TextStyle(fontSize: 8, color: Color(0xFFB5A886))),
          ),
          const Positioned(
            bottom: 200,
            right: 40,
            child: Text('✦',
                style: TextStyle(fontSize: 10, color: Color(0xFF9E8E7E))),
          ),
        ],
      ),
    );
  }
}
