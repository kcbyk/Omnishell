class SystemInfo {
  final double cpuUsage; // 0 - 100%
  final double cpuTemp; // in °C
  final int totalRamMb;
  final int freeRamMb;
  final int totalStorageGb;
  final int freeStorageGb;
  final int batteryLevel; // 0 - 100
  final String batteryStatus;
  final bool isCharging;
  final String deviceModel;
  final String androidVersion;
  final String kernelVersion;
  final String uptime;
  final bool isRooted;
  final bool isShizukuActive;
  final int activeProcessesCount;

  const SystemInfo({
    this.cpuUsage = 24.5,
    this.cpuTemp = 38.2,
    this.totalRamMb = 8192,
    this.freeRamMb = 3450,
    this.totalStorageGb = 256,
    this.freeStorageGb = 112,
    this.batteryLevel = 84,
    this.batteryStatus = "Good (3950 mAh)",
    this.isCharging = false,
    this.deviceModel = "Android ARM64 Device",
    this.androidVersion = "Android 14 (API 34)",
    this.kernelVersion = "Linux 5.15.110-android14-perf",
    this.uptime = "42h 18m",
    this.isRooted = false,
    this.isShizukuActive = true,
    this.activeProcessesCount = 284,
  });

  double get ramUsagePercent => ((totalRamMb - freeRamMb) / totalRamMb) * 100;
  double get storageUsagePercent => ((totalStorageGb - freeStorageGb) / totalStorageGb) * 100;
}
