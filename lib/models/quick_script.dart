import 'package:flutter/material.dart';

enum ScriptCategory { system, network, performance, debloat, security }

class QuickScript {
  final String id;
  final String title;
  final String description;
  final String command;
  final ScriptCategory category;
  final IconData icon;
  final bool requiresRoot;
  final bool isDangerous;

  const QuickScript({
    required this.id,
    required this.title,
    required this.description,
    required this.command,
    required this.category,
    required this.icon,
    this.requiresRoot = false,
    this.isDangerous = false,
  });

  static List<QuickScript> get presetScripts => [
    const QuickScript(
      id: 'ram_flush',
      title: 'RAM Flush & Wakelock Clean',
      description: 'Clears pagecache, dentries and inodes to free unallocated memory.',
      command: 'echo 3 > /proc/sys/vm/drop_caches || am kill-all',
      category: ScriptCategory.performance,
      icon: Icons.cleaning_services_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'fps_boost_720p',
      title: 'Gaming Resolution Mode (720p)',
      description: 'Lowers render resolution to 720x1600 for ultra-high FPS gaming.',
      command: 'wm size 720x1600 && wm density 280',
      category: ScriptCategory.performance,
      icon: Icons.sports_esports_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'reset_resolution',
      title: 'Reset Resolution to Native',
      description: 'Restores default screen resolution and density.',
      command: 'wm size reset && wm density reset',
      category: ScriptCategory.performance,
      icon: Icons.aspect_ratio_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'dns_flush',
      title: 'Flush DNS & Reset Net Routes',
      description: 'Flushes network daemon routing and socket resolver caches.',
      command: 'ndc resolver flushtran && ndc resolver flushdefaultif',
      category: ScriptCategory.network,
      icon: Icons.wifi_protected_setup_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'open_ports',
      title: 'Show Open TCP/UDP Sockets',
      description: 'Lists all currently listening network ports and connected IPs.',
      command: 'netstat -tuln || ss -tulpn',
      category: ScriptCategory.network,
      icon: Icons.lan_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'battery_dump',
      title: 'Battery Deep Diagnostic Dump',
      description: 'Dumps raw hardware battery stats, charging voltage & cycle health.',
      command: 'dumpsys battery',
      category: ScriptCategory.system,
      icon: Icons.battery_charging_full_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'cpu_governor_perf',
      title: 'Force CPU Performance Governor',
      description: 'Forces all CPU cores to maximum clock frequency without thermal throttle.',
      command: 'for g in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo performance > \$g; done',
      category: ScriptCategory.performance,
      icon: Icons.speed_rounded,
      requiresRoot: true,
      isDangerous: true,
    ),
    const QuickScript(
      id: 'debloat_xiaomi',
      title: 'Disable Xiaomi/MIUI Analytics',
      description: 'Disables background telemetry & tracking daemons for Xiaomi/Poco.',
      command: 'pm disable-user --user 0 com.miui.analytics && pm disable-user --user 0 com.miui.msa.global',
      category: ScriptCategory.debloat,
      icon: Icons.security_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'debloat_samsung',
      title: 'Disable Samsung Bixby & Pay',
      description: 'Disables background Bixby daemons to save battery & RAM.',
      command: 'pm disable-user --user 0 com.samsung.android.bixby.agent && pm disable-user --user 0 com.samsung.android.bixby.service',
      category: ScriptCategory.debloat,
      icon: Icons.shield_moon_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'sys_props',
      title: 'Dump Android System Properties',
      description: 'Outputs complete system build props, hardware identifiers & ro.* keys.',
      command: 'getprop',
      category: ScriptCategory.system,
      icon: Icons.list_alt_rounded,
      requiresRoot: false,
    ),
    const QuickScript(
      id: 'force_120hz',
      title: 'Force High Refresh Rate (120Hz)',
      description: 'Forces peak refresh rate on supported displays.',
      command: 'settings put system peak_refresh_rate 120.0 && settings put system min_refresh_rate 120.0',
      category: ScriptCategory.performance,
      icon: Icons.sync_rounded,
      requiresRoot: false,
    ),
  ];
}
