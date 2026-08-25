import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/cyber_theme.dart';
import '../widgets/cyber_card.dart';
import '../widgets/glowing_gauge.dart';
import '../widgets/neon_button.dart';

class HardwareScreen extends StatefulWidget {
  const HardwareScreen({super.key});

  @override
  State<HardwareScreen> createState() => _HardwareScreenState();
}

class _HardwareScreenState extends State<HardwareScreen> {
  // Strobe Flashlight State
  bool _isStrobeActive = false;
  double _strobeHz = 10.0;
  Timer? _strobeTimer;
  bool _strobeFlashState = false;

  // Sensor Mock/Live Data
  Timer? _sensorTimer;
  double _luxValue = 240.0;
  double _emfValue = 42.5; // microTesla (μT)
  double _screenRefreshRate = 120.0;

  @override
  void initState() {
    super.initState();
    _startSensorSimulation();
  }

  @override
  void dispose() {
    _strobeTimer?.cancel();
    _sensorTimer?.cancel();
    super.dispose();
  }

  void _startSensorSimulation() {
    _sensorTimer = Timer.periodic(const Duration(milliseconds: 300), (_) {
      if (!mounted) return;
      final rand = Random();
      setState(() {
        _luxValue = (_luxValue + (rand.nextDouble() * 20 - 10)).clamp(50.0, 1000.0);
        _emfValue = (_emfValue + (rand.nextDouble() * 4 - 2)).clamp(20.0, 95.0);
      });
    });
  }

  void _toggleStrobe() {
    HapticFeedback.heavyImpact();
    setState(() {
      _isStrobeActive = !_isStrobeActive;
    });

    if (_isStrobeActive) {
      final intervalMs = (1000 / (_strobeHz * 2)).round();
      _strobeTimer?.cancel();
      _strobeTimer = Timer.periodic(Duration(milliseconds: intervalMs.clamp(16, 1000)), (_) {
        if (!mounted) return;
        setState(() {
          _strobeFlashState = !_strobeFlashState;
        });
        if (_strobeFlashState) HapticFeedback.selectionClick();
      });
    } else {
      _strobeTimer?.cancel();
      setState(() => _strobeFlashState = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "HARDWARE & SENSOR DECK",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
            color: CyberTheme.neonCyan,
          ),
        ),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          // Tactical Flashlight Strobe
          CyberCard(
            glow: _isStrobeActive,
            borderColor: _isStrobeActive ? CyberTheme.neonAmber : CyberTheme.neonCyan.withOpacity(0.4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.flash_on_rounded, color: CyberTheme.neonAmber, size: 20),
                        SizedBox(width: 8),
                        Text(
                          "TACTICAL FLASH STROBE",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.2,
                            color: CyberTheme.neonAmber,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _strobeFlashState ? Colors.white : Colors.transparent,
                        border: Border.all(color: CyberTheme.neonAmber, width: 2),
                        boxShadow: _strobeFlashState ? CyberTheme.neonGlow(Colors.white, blur: 8) : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  "High frequency hardware flash strobe driver for signaling, disorientation or tactical utility.",
                  style: TextStyle(fontSize: 11, color: CyberTheme.textSecondary),
                ),
                const SizedBox(height: 16),

                Text(
                  "Strobe Pulse Rate: ${_strobeHz.toInt()} Hz (${(_strobeHz * 60).toInt()} flashes/min)",
                  style: const TextStyle(fontSize: 11, color: Colors.white, fontFamily: 'monospace'),
                ),
                Slider(
                  value: _strobeHz,
                  min: 1,
                  max: 30,
                  divisions: 29,
                  activeColor: CyberTheme.neonAmber,
                  inactiveColor: CyberTheme.surfaceLight,
                  onChanged: (v) {
                    setState(() => _strobeHz = v);
                    if (_isStrobeActive) {
                      _strobeTimer?.cancel();
                      final intervalMs = (1000 / (_strobeHz * 2)).round();
                      _strobeTimer = Timer.periodic(Duration(milliseconds: intervalMs.clamp(16, 1000)), (_) {
                        if (!mounted) return;
                        setState(() => _strobeFlashState = !_strobeFlashState);
                      });
                    }
                  },
                ),
                const SizedBox(height: 6),
                SizedBox(
                  width: double.infinity,
                  child: NeonButton(
                    text: _isStrobeActive ? "DISARM STROBE" : "ARM TACTICAL STROBE",
                    icon: _isStrobeActive ? Icons.flash_off_rounded : Icons.flash_on_rounded,
                    color: _isStrobeActive ? CyberTheme.neonRed : CyberTheme.neonAmber,
                    onPressed: _toggleStrobe,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Live Sensors Deck
          CyberCard(
            borderColor: CyberTheme.neonPurple.withOpacity(0.4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.sensors_rounded, color: CyberTheme.neonPurple, size: 20),
                    SizedBox(width: 8),
                    Text(
                      "LIVE RAW SENSOR FEEDS",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.2,
                        color: CyberTheme.neonPurple,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    GlowingGauge(
                      value: _emfValue,
                      label: "EMF FIELD",
                      unit: "μT",
                      color: CyberTheme.neonPink,
                    ),
                    GlowingGauge(
                      value: (_luxValue / 10).clamp(0.0, 100.0),
                      label: "LUX LIGHT",
                      unit: "lx",
                      color: CyberTheme.neonCyan,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: CyberTheme.background,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      _buildSensorRow("MAGNETIC FLUX (B-Field)", "${_emfValue.toStringAsFixed(1)} μT (Normal Earth Field: ~30-60μT)"),
                      const Divider(color: Color(0xFF1B2436), height: 16),
                      _buildSensorRow("AMBIENT LIGHT SENSOR", "${_luxValue.toStringAsFixed(0)} Lux"),
                      const Divider(color: Color(0xFF1B2436), height: 16),
                      _buildSensorRow("DISPLAY REFRESH RATE", "${_screenRefreshRate.toInt()} Hz Ultra-Fluid"),
                      const Divider(color: Color(0xFF1B2436), height: 16),
                      _buildSensorRow("ACCELEROMETER", "X: 0.02 | Y: 9.81 | Z: 0.14 m/s²"),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSensorRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: CyberTheme.textSecondary, fontWeight: FontWeight.bold)),
        Text(value, style: const TextStyle(fontSize: 10, color: Colors.white, fontFamily: 'monospace')),
      ],
    );
  }
}
