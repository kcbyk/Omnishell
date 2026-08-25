import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';

class GlowingGauge extends StatelessWidget {
  final double value; // 0.0 to 100.0
  final String label;
  final String unit;
  final Color color;
  final double size;

  const GlowingGauge({
    super.key,
    required this.value,
    required this.label,
    this.unit = "%",
    this.color = CyberTheme.neonCyan,
    this.size = 110.0,
  });

  @override
  Widget build(BuildContext context) {
    final clampedValue = value.clamp(0.0, 100.0);
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: _GaugePainter(
              percentage: clampedValue / 100,
              glowColor: color,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "${clampedValue.toInt()}$unit",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: size * 0.19,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                  shadows: [
                    Shadow(color: color, blurRadius: 10),
                  ],
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label.toUpperCase(),
                style: TextStyle(
                  color: CyberTheme.textSecondary,
                  fontSize: size * 0.10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _GaugePainter extends CustomPainter {
  final double percentage;
  final Color glowColor;

  _GaugePainter({required this.percentage, required this.glowColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - 8;
    const startAngle = 0.75 * pi;
    const sweepAngle = 1.5 * pi;

    // Background track
    final bgPaint = Paint()
      ..color = const Color(0xFF1B2436)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      bgPaint,
    );

    // Active Glow Arc
    final activePaint = Paint()
      ..color = glowColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 7.0
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.solid, 4.0);

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle * percentage,
      false,
      activePaint,
    );
  }

  @override
  bool shouldRepaint(covariant _GaugePainter oldDelegate) {
    return oldDelegate.percentage != percentage || oldDelegate.glowColor != glowColor;
  }
}
