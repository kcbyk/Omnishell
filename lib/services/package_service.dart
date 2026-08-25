import 'shell_service.dart';

class AppPackageInfo {
  final String packageName;
  final String appName;
  final bool isSystem;
  final bool isFrozen;
  final String category;

  const AppPackageInfo({
    required this.packageName,
    required this.appName,
    required this.isSystem,
    this.isFrozen = false,
    this.category = "Utility",
  });
}

class PackageService {
  static List<AppPackageInfo> getPresetBloatwareList() {
    return [
      const AppPackageInfo(
        packageName: "com.miui.analytics",
        appName: "Xiaomi MIUI Analytics / Telemetry",
        isSystem: true,
        category: "Xiaomi Telemetry",
      ),
      const AppPackageInfo(
        packageName: "com.miui.msa.global",
        appName: "MIUI System Ads Daemon",
        isSystem: true,
        category: "Xiaomi Ad Service",
      ),
      const AppPackageInfo(
        packageName: "com.samsung.android.bixby.agent",
        appName: "Samsung Bixby Voice Agent",
        isSystem: true,
        category: "Samsung Bloat",
      ),
      const AppPackageInfo(
        packageName: "com.samsung.android.bixby.service",
        appName: "Samsung Bixby Background Service",
        isSystem: true,
        category: "Samsung Bloat",
      ),
      const AppPackageInfo(
        packageName: "com.samsung.android.game.gamehome",
        appName: "Samsung Game Launcher Hub",
        isSystem: true,
        category: "Samsung Service",
      ),
      const AppPackageInfo(
        packageName: "com.google.android.youtube",
        appName: "YouTube Default Stock",
        isSystem: true,
        category: "Google Suite",
      ),
      const AppPackageInfo(
        packageName: "com.google.android.apps.tachyon",
        appName: "Google Meet / Duo",
        isSystem: true,
        category: "Google Suite",
      ),
      const AppPackageInfo(
        packageName: "com.facebook.katana",
        appName: "Facebook Pre-installed",
        isSystem: true,
        category: "Meta / Social",
      ),
      const AppPackageInfo(
        packageName: "com.facebook.system",
        appName: "Facebook App Installer Background",
        isSystem: true,
        category: "Meta Tracking",
      ),
      const AppPackageInfo(
        packageName: "com.facebook.appmanager",
        appName: "Facebook App Manager Daemon",
        isSystem: true,
        category: "Meta Tracking",
      ),
    ];
  }

  /// Freeze/Disable an app via ADB or Root shell
  static Future<ShellResult> freezeApp(String packageName) async {
    final cmd = "pm disable-user --user 0 $packageName";
    return await ShellService().execute(cmd);
  }

  /// Unfreeze/Enable an app
  static Future<ShellResult> unfreezeApp(String packageName) async {
    final cmd = "pm enable $packageName";
    return await ShellService().execute(cmd);
  }

  /// Force kill an app process
  static Future<ShellResult> forceStopApp(String packageName) async {
    final cmd = "am force-stop $packageName";
    return await ShellService().execute(cmd);
  }

  /// Clear app cache & data
  static Future<ShellResult> clearAppData(String packageName) async {
    final cmd = "pm clear $packageName";
    return await ShellService().execute(cmd);
  }

  /// Get list of installed packages from device shell
  static Future<List<String>> listInstalledPackages({bool thirdPartyOnly = false}) async {
    final flag = thirdPartyOnly ? "-3" : "-a";
    final res = await ShellService().execute("pm list packages $flag");
    if (res.isSuccess) {
      return res.stdout
          .split('\n')
          .map((line) => line.replaceFirst('package:', '').trim())
          .where((p) => p.isNotEmpty)
          .toList();
    }
    return [];
  }
}
