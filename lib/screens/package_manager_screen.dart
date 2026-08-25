import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';
import '../services/package_service.dart';
import '../widgets/cyber_card.dart';
import '../widgets/neon_button.dart';

class PackageManagerScreen extends StatefulWidget {
  const PackageManagerScreen({super.key});

  @override
  State<PackageManagerScreen> createState() => _PackageManagerScreenState();
}

class _PackageManagerScreenState extends State<PackageManagerScreen> {
  final List<AppPackageInfo> _bloatwareList = PackageService.getPresetBloatwareList();
  final Set<String> _frozenPackages = {};
  bool _isLoading = false;
  String _searchQuery = "";

  Future<void> _toggleFreeze(AppPackageInfo app) async {
    final isCurrentlyFrozen = _frozenPackages.contains(app.packageName);
    setState(() => _isLoading = true);

    if (isCurrentlyFrozen) {
      await PackageService.unfreezeApp(app.packageName);
      _frozenPackages.remove(app.packageName);
    } else {
      await PackageService.freezeApp(app.packageName);
      _frozenPackages.add(app.packageName);
    }

    if (mounted) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: CyberTheme.surfaceLight,
          content: Text(
            isCurrentlyFrozen
                ? "✓ Enabled: ${app.appName}"
                : "❄️ Frozen/Disabled: ${app.appName}",
            style: const TextStyle(fontFamily: 'monospace'),
          ),
        ),
      );
    }
  }

  Future<void> _forceStop(AppPackageInfo app) async {
    await PackageService.forceStopApp(app.packageName);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: CyberTheme.surfaceLight,
          content: Text("Force stopped: ${app.packageName}"),
        ),
      );
    }
  }

  void _showAppDetailsDialog(AppPackageInfo app) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: CyberTheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: CyberTheme.neonCyan, width: 1.2),
        ),
        title: Row(
          children: [
            const Icon(Icons.apps_rounded, color: CyberTheme.neonCyan, size: 20),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                app.appName,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("PACKAGE ID:", style: const TextStyle(fontSize: 10, color: CyberTheme.textMuted, fontWeight: FontWeight.bold)),
            SelectableText(app.packageName, style: const TextStyle(fontFamily: 'monospace', fontSize: 12, color: CyberTheme.neonCyan)),
            const SizedBox(height: 12),
            Text("CATEGORY:", style: const TextStyle(fontSize: 10, color: CyberTheme.textMuted, fontWeight: FontWeight.bold)),
            Text(app.category, style: const TextStyle(fontSize: 12, color: Colors.white)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: NeonButton(
                    text: "Force Kill",
                    icon: Icons.cancel_rounded,
                    color: CyberTheme.neonRed,
                    height: 38,
                    onPressed: () {
                      Navigator.pop(ctx);
                      _forceStop(app);
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: NeonButton(
                    text: _frozenPackages.contains(app.packageName) ? "Unfreeze" : "Freeze",
                    icon: Icons.ac_unit_rounded,
                    color: CyberTheme.neonCyan,
                    height: 38,
                    onPressed: () {
                      Navigator.pop(ctx);
                      _toggleFreeze(app);
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _bloatwareList.where((a) {
      final q = _searchQuery.toLowerCase();
      return a.appName.toLowerCase().contains(q) || a.packageName.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "DEEP PACKAGE MANAGER",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
            color: CyberTheme.neonCyan,
          ),
        ),
      ),
      body: Column(
        children: [
          // Search & Debloat header
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v),
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: InputDecoration(
                hintText: "Search apps or package IDs...",
                hintStyle: const TextStyle(color: CyberTheme.textMuted, fontSize: 12),
                prefixIcon: const Icon(Icons.search_rounded, color: CyberTheme.neonCyan, size: 20),
                filled: true,
                fillColor: CyberTheme.surface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF1B2436)),
                ),
                isDense: true,
              ),
            ),
          ),

          // Presets summary banner
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: CyberCard(
              padding: const EdgeInsets.all(12),
              borderColor: CyberTheme.neonPink.withOpacity(0.3),
              child: Row(
                children: [
                  const Icon(Icons.shield_rounded, color: CyberTheme.neonPink, size: 22),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "SYSTEM DEBLOATER PRESETS",
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        Text(
                          "Freeze background tracking daemons safely without bricking the device.",
                          style: TextStyle(fontSize: 10, color: CyberTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    "${_frozenPackages.length} FROZEN",
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: CyberTheme.neonPink),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // App List
          Expanded(
            child: ListView.builder(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final app = filtered[index];
                final isFrozen = _frozenPackages.contains(app.packageName);

                return CyberCard(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  borderColor: isFrozen ? CyberTheme.neonRed.withOpacity(0.5) : const Color(0xFF1B2436),
                  onTap: () => _showAppDetailsDialog(app),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isFrozen ? CyberTheme.neonRed.withOpacity(0.15) : CyberTheme.background,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          isFrozen ? Icons.ac_unit_rounded : Icons.android_rounded,
                          color: isFrozen ? CyberTheme.neonRed : CyberTheme.neonGreen,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              app.appName,
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              app.packageName,
                              style: const TextStyle(fontSize: 10, color: CyberTheme.textMuted, fontFamily: 'monospace'),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          isFrozen ? Icons.lock_outline_rounded : Icons.lock_open_rounded,
                          color: isFrozen ? CyberTheme.neonRed : CyberTheme.neonCyan,
                          size: 20,
                        ),
                        onPressed: () => _toggleFreeze(app),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
