import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';

class NeonButton extends StatelessWidget {
  final String text;
  final IconData? icon;
  final VoidCallback? onPressed;
  final Color color;
  final bool isLoading;
  final bool outlined;
  final double height;

  const NeonButton({
    super.key,
    required this.text,
    this.icon,
    this.onPressed,
    this.color = CyberTheme.neonCyan,
    this.isLoading = false,
    this.outlined = false,
    this.height = 48.0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        boxShadow: outlined ? null : CyberTheme.neonGlow(color, blur: 10, spread: 0.5),
      ),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: outlined ? Colors.transparent : color,
          foregroundColor: outlined ? color : Colors.black,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
            side: BorderSide(color: color, width: 1.5),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 0),
        ),
        onPressed: isLoading ? null : onPressed,
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.2,
                  color: outlined ? color : Colors.black,
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: outlined ? color : Colors.black),
                    const SizedBox(width: 8),
                  ],
                  Text(
                    text.toUpperCase(),
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.1,
                      fontSize: 13,
                      color: outlined ? color : Colors.black,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
