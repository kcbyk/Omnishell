import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';

class CyberCard extends StatelessWidget {
  final Widget child;
  final Color? borderColor;
  final Color? backgroundColor;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final bool glow;
  final VoidCallback? onTap;

  const CyberCard({
    super.key,
    required this.child,
    this.borderColor,
    this.backgroundColor,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.borderRadius = 14.0,
    this.glow = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final borderCol = borderColor ?? CyberTheme.neonCyan.withOpacity(0.3);
    
    Widget content = Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: backgroundColor ?? CyberTheme.cardBg,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: borderCol, width: 1.2),
        boxShadow: glow ? CyberTheme.neonGlow(borderCol, blur: 8, spread: 0.5) : null,
      ),
      child: child,
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius),
          onTap: onTap,
          splashColor: borderCol.withOpacity(0.2),
          highlightColor: borderCol.withOpacity(0.1),
          child: content,
        ),
      );
    }

    return content;
  }
}
