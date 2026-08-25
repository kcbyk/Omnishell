import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/cyber_theme.dart';
import '../widgets/cyber_card.dart';
import '../widgets/neon_button.dart';

class PermissionDeckScreen extends StatelessWidget {
  const PermissionDeckScreen({super.key});

  final List<Map<String, dynamic>> _permissions = const [
    {
      "name": "WRITE_SECURE_SETTINGS",
      "cmd": "adb shell pm grant com.cyberdeck.omnishell android.permission.WRITE_SECURE_SETTINGS",
      "desc": "Required to modify screen resolution, refresh rate, and core Android settings.",
      "level": "ADB / Root",
    },
    {
      "name": "PACKAGE_USAGE_STATS",
      "cmd": "adb shell pm grant com.cyberdeck.omnishell android.permission.PACKAGE_USAGE_STATS",
      "desc": "Inspect app execution duration, memory allocation and process states.",
      "level": "Settings / ADB",
    },
    {
      "name": "DUMP & READ_LOGS",
      "cmd": "adb shell pm grant com.cyberdeck.omnishell android.permission.DUMP && adb shell pm grant com.cyberdeck.omnishell android.permission.READ_LOGS",
      "desc": "Real-time logcat streaming and raw hardware dumpsys diagnostics.",
      "level": "ADB / Root",
    },
    {
      "name": "MANAGE_EXTERNAL_STORAGE",
      "cmd": "Granted via Android Settings -> Special App Access -> All Files Access",
      "desc": "Full filesystem traversal, APK extraction and script saving.",
      "level": "User Granted",
    },
    {
      "name": "SUPERUSER (SU / ROOT)",
      "cmd": "Direct kernel shell access via Magisk / KernelSU / APatch",
      "desc": "Unlocks CPU governors, iptables firewall, and hardware overrides.",
      "level": "Root Only",
    },
  ];

  void _copyCommand(BuildContext context, String cmd) {
    Clipboard.setData(ClipboardData(text: cmd));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: CyberTheme.surfaceLight,
        content: Text("Copied ADB command to clipboard: $cmd"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "PERMISSION COMMAND DECK",
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
          // Banner
          CyberCard(
            glow: true,
            borderColor: CyberTheme.neonCyan.withOpacity(0.5),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.vpn_key_rounded, color: CyberTheme.neonCyan, size: 22),
                    SizedBox(width: 10),
                    Text(
                      "ELEVATE OMNISHELL PRIVILEGES",
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
                  "To give OmniShell absolute authority over Android, execute these ADB commands once from a PC, Shizuku or Termux. No root required for ADB commands!",
                  style: TextStyle(fontSize: 11, color: CyberTheme.textSecondary, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          const Text(
            "REQUIRED ELEVATION PERMISSIONS",
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: CyberTheme.neonGreen),
          ),
          const SizedBox(height: 10),

          ..._permissions.map((perm) {
            return CyberCard(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              borderColor: const Color(0xFF1B2436),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        perm["name"]!,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: CyberTheme.neonCyan.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: CyberTheme.neonCyan.withOpacity(0.4)),
                        ),
                        child: Text(
                          perm["level"]!,
                          style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: CyberTheme.neonCyan),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    perm["desc"]!,
                    style: const TextStyle(fontSize: 11, color: CyberTheme.textSecondary),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: CyberTheme.background,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFF1B2436)),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: SelectableText(
                            perm["cmd"]!,
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 10.5,
                              color: CyberTheme.neonGreen,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy_rounded, size: 16, color: CyberTheme.neonGreen),
                          onPressed: () => _copyCommand(context, perm["cmd"]!),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
