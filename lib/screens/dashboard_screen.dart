import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/cyber_theme.dart';
import '../models/system_info.dart';
import '../models/quick_script.dart';
import '../services/system_service.dart';
import '../services/shell_service.dart';
import '../widgets/cyber_card.dart';
import '../widgets/glowing_gauge.dart';

class DashboardScreen extends StatefulWidget {
  final Function(String command)? onRunInTerminal;

  const DashboardScreen({super.key, this.onRunInTerminal});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final SystemService _sysService = SystemService();
  final ShellService _shellService = ShellService();
  bool _isExecuting = false;
  String? _lastActionStatus;

  @override
  void initState() {
    super.initState();
    _sysService.startMonitoring();
    _shellService.initialize();
  }

  Future<void> _runQuickAction(QuickScript script) async {
    HapticFeedback.heavyImpact();
    setState(() {
      _isExecuting = true;
      _lastActionStatus = "Executing: ${script.title}...";
    });

    final res = await _shellService.execute(script.command);

    if (mounted) {
      setState(() {
        _isExecuting = false;
        _lastActionStatus = res.isSuccess ? "✓ ${script.title} executed!" : "✗ Failed: ${res.stderr}";
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: res.isSuccess ? CyberTheme.surfaceLight : CyberTheme.neonRed.withOpacity(0.9),
          content: Text(
            res.isSuccess ? "${script.title} executed successfully!" : "Error: ${res.stderr}",
            style: const TextStyle(fontFamily: 'monospace', color: Colors.white),
          ),
          action: SnackBarAction(
            label: "VIEW LOG",
            textColor: CyberTheme.neonCyan,
            onPressed: () => widget.onRunInTerminal?.call(script.command),
          ),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<SystemInfo>(
      stream: _sysService.systemInfoStream,
      initialData: _sysService.currentInfo,
      builder: (context, snapshot) {
        final info = snapshot.data ?? const SystemInfo();

        return Scaffold(
          body: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Top Cyber Header
              SliverAppBar(
                expandedHeight: 80,
                floating: true,
                pinned: true,
                backgroundColor: CyberTheme.background,
                title: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: CyberTheme.neonCyan.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: CyberTheme.neonCyan, width: 1),
                      ),
                      child: const Icon(Icons.terminal_rounded, color: CyberTheme.neonCyan, size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "OMNISHELL",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2.0,
                            color: CyberTheme.neonCyan,
                          ),
                        ),
                        Text(
                          "CORE SYSTEM HUD",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                            color: CyberTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                actions: [
                  // Privilege Tier Indicator
                  Container(
                    margin: const EdgeInsets.only(right: 16, top: 12, bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: info.isRooted
                          ? CyberTheme.neonPink.withOpacity(0.2)
                          : CyberTheme.neonGreen.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: info.isRooted ? CyberTheme.neonPink : CyberTheme.neonGreen,
                        width: 1.2,
                      ),
                      boxShadow: CyberTheme.neonGlow(
                        info.isRooted ? CyberTheme.neonPink : CyberTheme.neonGreen,
                        blur: 6,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          info.isRooted ? Icons.lock_open_rounded : Icons.security_rounded,
                          size: 13,
                          color: info.isRooted ? CyberTheme.neonPink : CyberTheme.neonGreen,
                        ),
                        const SizedBox(width: 5),
                        Text(
                          info.isRooted ? "ROOT SU" : "SHIZUKU / ADB",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.8,
                            color: info.isRooted ? CyberTheme.neonPink : CyberTheme.neonGreen,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Gauges Grid
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: CyberCard(
                    glow: true,
                    borderColor: CyberTheme.neonCyan.withOpacity(0.4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.memory_rounded, color: CyberTheme.neonCyan, size: 16),
                                SizedBox(width: 8),
                                Text(
                                  "REAL-TIME HARDWARE METERS",
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.2,
                                    color: CyberTheme.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              "UPTIME: ${info.uptime}",
                              style: const TextStyle(
                                fontSize: 10,
                                color: CyberTheme.textMuted,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 18),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            GlowingGauge(
                              value: info.cpuUsage,
                              label: "CPU LOAD",
                              unit: "%",
                              color: CyberTheme.neonCyan,
                            ),
                            GlowingGauge(
                              value: info.ramUsagePercent,
                              label: "RAM USED",
                              unit: "%",
                              color: CyberTheme.neonPink,
                            ),
                            GlowingGauge(
                              value: info.batteryLevel.toDouble(),
                              label: "BATTERY",
                              unit: "%",
                              color: CyberTheme.neonGreen,
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // RAM details bar
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: CyberTheme.background,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "RAM: ${(info.totalRamMb - info.freeRamMb)} MB / ${info.totalRamMb} MB",
                                style: const TextStyle(fontSize: 11, color: CyberTheme.textSecondary),
                              ),
                              Text(
                                "CPU TEMP: ${info.cpuTemp.toStringAsFixed(1)}°C",
                                style: const TextStyle(fontSize: 11, color: CyberTheme.neonAmber, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Status Bar / Action feedback
              if (_lastActionStatus != null)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: CyberTheme.surfaceLight,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: CyberTheme.neonGreen.withOpacity(0.5)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline_rounded, size: 16, color: CyberTheme.neonGreen),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _lastActionStatus!,
                              style: const TextStyle(fontSize: 11, color: Colors.white, fontFamily: 'monospace'),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

              // Quick Actions Section Title
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "⚡ GODMODE QUICK ACTIONS",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.2,
                          color: CyberTheme.neonCyan,
                        ),
                      ),
                      if (_isExecuting)
                        const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 2, color: CyberTheme.neonCyan),
                        ),
                    ],
                  ),
                ),
              ),

              // Quick Actions Grid
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.5,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final script = QuickScript.presetScripts[index % QuickScript.presetScripts.length];
                      return CyberCard(
                        padding: const EdgeInsets.all(12),
                        borderColor: script.requiresRoot ? CyberTheme.neonPink.withOpacity(0.4) : CyberTheme.neonCyan.withOpacity(0.3),
                        onTap: _isExecuting ? null : () => _runQuickAction(script),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: (script.requiresRoot ? CyberTheme.neonPink : CyberTheme.neonCyan).withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    script.icon,
                                    size: 18,
                                    color: script.requiresRoot ? CyberTheme.neonPink : CyberTheme.neonCyan,
                                  ),
                                ),
                                if (script.requiresRoot)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: CyberTheme.neonPink.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Text(
                                      "ROOT",
                                      style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: CyberTheme.neonPink),
                                    ),
                                  ),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  script.title,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: CyberTheme.textPrimary,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  script.description,
                                  style: const TextStyle(
                                    fontSize: 9,
                                    color: CyberTheme.textMuted,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                    childCount: 6,
                  ),
                ),
              ),

              // System Specs Card
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: CyberCard(
                    borderColor: CyberTheme.neonPurple.withOpacity(0.4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.info_outline_rounded, color: CyberTheme.neonPurple, size: 16),
                            SizedBox(width: 8),
                            Text(
                              "KERNEL & OS ENVIRONMENT",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                                color: CyberTheme.textPrimary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildSpecRow("DEVICE ARCH", "AArch64 (ARMv8.2-A 64-bit)"),
                        _buildSpecRow("OS BUILD", info.androidVersion),
                        _buildSpecRow("KERNEL", info.kernelVersion),
                        _buildSpecRow("ACTIVE THREADS", "${info.activeProcessesCount} Processes Running"),
                        _buildSpecRow("STORAGE", "${(info.totalStorageGb - info.freeStorageGb)}GB / ${info.totalStorageGb}GB Used"),
                      ],
                    ),
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 40)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSpecRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: CyberTheme.textSecondary, fontWeight: FontWeight.bold)),
          Text(val, style: const TextStyle(fontSize: 10, color: CyberTheme.neonCyan, fontFamily: 'monospace')),
        ],
      ),
    );
  }
}
