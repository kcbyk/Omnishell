import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/cyber_theme.dart';
import '../services/shell_service.dart';
import '../widgets/cyber_card.dart';
import '../widgets/neon_button.dart';

class ToolboxScreen extends StatefulWidget {
  const ToolboxScreen({super.key});

  @override
  State<ToolboxScreen> createState() => _ToolboxScreenState();
}

class _ToolboxScreenState extends State<ToolboxScreen> {
  final ShellService _shell = ShellService();

  // Resolution controls
  double _targetWidth = 720;
  double _targetHeight = 1600;
  double _targetDpi = 280;
  bool _isResApplying = false;

  // Battery status output
  String? _batteryDumpText;
  bool _isLoadingBattery = false;

  // Secret codes list
  final List<Map<String, String>> _secretCodes = [
    {"code": "*#*#4636#*#*", "title": "Testing / Radio & Battery Info", "desc": "Phone info, usage stats, Wi-Fi details"},
    {"code": "*#0*#", "title": "Hardware Diagnostic Test (Samsung)", "desc": "RGB, Sensor, Touch, Vibration tests"},
    {"code": "*#*#34971539#*#*", "title": "Camera Firmware Standard", "desc": "Camera hardware information & firmware"},
    {"code": "*#*#7594#*#*", "title": "Direct Power Off Button", "desc": "Enables direct shut down without menu"},
    {"code": "*#*#232338#*#*", "title": "Wi-Fi MAC Address Info", "desc": "Displays hardware MAC address"},
  ];

  Future<void> _applyResolution() async {
    setState(() => _isResApplying = true);
    final cmd = "wm size ${_targetWidth.toInt()}x${_targetHeight.toInt()} && wm density ${_targetDpi.toInt()}";
    final res = await _shell.execute(cmd);
    setState(() => _isResApplying = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: res.isSuccess ? CyberTheme.surfaceLight : CyberTheme.neonRed,
          content: Text("Resolution set to ${_targetWidth.toInt()}x${_targetHeight.toInt()} @ ${_targetDpi.toInt()} DPI"),
        ),
      );
    }
  }

  Future<void> _resetResolution() async {
    setState(() => _isResApplying = true);
    final res = await _shell.execute("wm size reset && wm density reset");
    setState(() => _isResApplying = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: CyberTheme.surfaceLight,
          content: Text("Screen resolution & DPI reset to native!"),
        ),
      );
    }
  }

  Future<void> _dumpBattery() async {
    setState(() => _isLoadingBattery = true);
    final res = await _shell.execute("dumpsys battery");
    setState(() {
      _isLoadingBattery = false;
      _batteryDumpText = res.stdout;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "GODMODE TOOLBOX",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            letterSpacing: 2.0,
            color: CyberTheme.neonCyan,
          ),
        ),
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          // Section 1: Resolution & DPI Scaler
          CyberCard(
            glow: true,
            borderColor: CyberTheme.neonCyan.withOpacity(0.4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.aspect_ratio_rounded, color: CyberTheme.neonCyan, size: 20),
                    SizedBox(width: 10),
                    Text(
                      "DISPLAY RESOLUTION & DPI OVERRIDE",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.2,
                        color: CyberTheme.neonCyan,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  "Instantly change Android framebuffer rendering resolution. Downscale for FPS boost in heavy games or upscale for tablet DPI.",
                  style: TextStyle(fontSize: 11, color: CyberTheme.textSecondary),
                ),
                const SizedBox(height: 16),

                // Sliders
                Text("Render Width: ${_targetWidth.toInt()} px", style: const TextStyle(fontSize: 11, color: Colors.white)),
                Slider(
                  value: _targetWidth,
                  min: 540,
                  max: 1440,
                  divisions: 15,
                  activeColor: CyberTheme.neonCyan,
                  inactiveColor: CyberTheme.surfaceLight,
                  onChanged: (v) => setState(() => _targetWidth = v),
                ),

                Text("Render Height: ${_targetHeight.toInt()} px", style: const TextStyle(fontSize: 11, color: Colors.white)),
                Slider(
                  value: _targetHeight,
                  min: 1200,
                  max: 3200,
                  divisions: 20,
                  activeColor: CyberTheme.neonCyan,
                  inactiveColor: CyberTheme.surfaceLight,
                  onChanged: (v) => setState(() => _targetHeight = v),
                ),

                Text("Display Density: ${_targetDpi.toInt()} DPI", style: const TextStyle(fontSize: 11, color: Colors.white)),
                Slider(
                  value: _targetDpi,
                  min: 160,
                  max: 560,
                  divisions: 20,
                  activeColor: CyberTheme.neonPink,
                  inactiveColor: CyberTheme.surfaceLight,
                  onChanged: (v) => setState(() => _targetDpi = v),
                ),

                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: NeonButton(
                        text: "Apply Display Mode",
                        icon: Icons.check_circle_outline_rounded,
                        isLoading: _isResApplying,
                        color: CyberTheme.neonCyan,
                        onPressed: _applyResolution,
                      ),
                    ),
                    const SizedBox(width: 10),
                    NeonButton(
                      text: "Reset",
                      icon: Icons.restore_rounded,
                      outlined: true,
                      color: CyberTheme.neonPink,
                      onPressed: _resetResolution,
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Section 2: Deep Battery Diagnostics
          CyberCard(
            borderColor: CyberTheme.neonGreen.withOpacity(0.4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.battery_saver_rounded, color: CyberTheme.neonGreen, size: 20),
                        SizedBox(width: 10),
                        Text(
                          "BATTERY DIAGNOSTIC DUMP",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.2,
                            color: CyberTheme.neonGreen,
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.refresh_rounded, color: CyberTheme.neonGreen, size: 20),
                      onPressed: _dumpBattery,
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                const Text(
                  "Reads raw kernel battery stats (voltage mV, microamps, cycle health, thermal sensors).",
                  style: TextStyle(fontSize: 11, color: CyberTheme.textSecondary),
                ),
                const SizedBox(height: 12),
                if (_batteryDumpText != null)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF04060A),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: CyberTheme.neonGreen.withOpacity(0.3)),
                    ),
                    child: SelectableText(
                      _batteryDumpText!,
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 11,
                        color: CyberTheme.neonGreen,
                        height: 1.3,
                      ),
                    ),
                  )
                else
                  NeonButton(
                    text: "Dump Battery Telemetry",
                    icon: Icons.download_rounded,
                    isLoading: _isLoadingBattery,
                    color: CyberTheme.neonGreen,
                    onPressed: _dumpBattery,
                  ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Section 3: Android Secret Codes
          CyberCard(
            borderColor: CyberTheme.neonAmber.withOpacity(0.4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.dialpad_rounded, color: CyberTheme.neonAmber, size: 20),
                    SizedBox(width: 10),
                    Text(
                      "ANDROID SECRET SERVICE CODES",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.2,
                        color: CyberTheme.neonAmber,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                const Text(
                  "Direct hardware tests and hidden engineering dialer shortcuts.",
                  style: TextStyle(fontSize: 11, color: CyberTheme.textSecondary),
                ),
                const SizedBox(height: 14),
                ...List.generate(_secretCodes.length, (idx) {
                  final item = _secretCodes[idx];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: CyberTheme.background,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFF1B2436)),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item["code"]!,
                                style: const TextStyle(
                                  color: CyberTheme.neonAmber,
                                  fontWeight: FontWeight.bold,
                                  fontFamily: 'monospace',
                                  fontSize: 13,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item["title"]!,
                                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                              ),
                              Text(
                                item["desc"]!,
                                style: const TextStyle(color: CyberTheme.textMuted, fontSize: 9.5),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy_rounded, size: 16, color: CyberTheme.neonAmber),
                          tooltip: "Copy Code",
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: item["code"]!));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                backgroundColor: CyberTheme.surfaceLight,
                                content: Text("Copied ${item["code"]!} - Paste in Phone dialer"),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
