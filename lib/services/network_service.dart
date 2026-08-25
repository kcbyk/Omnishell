import 'dart:async';
import 'dart:io';

class PortScanResult {
  final int port;
  final String serviceName;
  final bool isOpen;
  final Duration latency;

  PortScanResult({
    required this.port,
    required this.serviceName,
    required this.isOpen,
    required this.latency,
  });
}

class LanHostResult {
  final String ip;
  final String hostname;
  final bool isAlive;
  final Duration pingTime;

  LanHostResult({
    required this.ip,
    required this.hostname,
    required this.isAlive,
    required this.pingTime,
  });
}

class NetworkService {
  static final Map<int, String> commonPorts = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    3000: "NodeJS / React Dev",
    3306: "MySQL",
    5432: "PostgreSQL",
    5555: "ADB Wireless",
    6379: "Redis",
    8080: "HTTP Proxy / Web",
    8443: "HTTPS Alt",
    9000: "Sonar / Portainer",
    27017: "MongoDB",
  };

  /// Scan specific host and list of ports
  static Future<List<PortScanResult>> scanPorts(
    String host,
    List<int> ports, {
    Duration timeout = const Duration(milliseconds: 600),
    Function(PortScanResult)? onPortScanned,
  }) async {
    final results = <PortScanResult>[];

    for (final port in ports) {
      final sw = Stopwatch()..start();
      bool isOpen = false;
      try {
        final socket = await Socket.connect(host, port, timeout: timeout);
        isOpen = true;
        await socket.close();
      } catch (_) {
        isOpen = false;
      }
      sw.stop();

      final res = PortScanResult(
        port: port,
        serviceName: commonPorts[port] ?? "Unknown",
        isOpen: isOpen,
        latency: sw.elapsed,
      );
      results.add(res);
      onPortScanned?.call(res);
    }
    return results;
  }

  /// Ping target host
  static Future<int?> pingHost(String host, {Duration timeout = const Duration(seconds: 2)}) async {
    final sw = Stopwatch()..start();
    try {
      final socket = await Socket.connect(host, 80, timeout: timeout);
      sw.stop();
      await socket.close();
      return sw.elapsedMilliseconds;
    } catch (_) {
      try {
        // Fallback to DNS lookup timing
        final swDns = Stopwatch()..start();
        await InternetAddress.lookup(host);
        swDns.stop();
        return swDns.elapsedMilliseconds;
      } catch (_) {
        return null;
      }
    }
  }

  /// Resolve DNS records
  static Future<List<String>> resolveDns(String host) async {
    try {
      final addresses = await InternetAddress.lookup(host);
      return addresses.map((a) => "${a.type.name.toUpperCase()}: ${a.address}").toList();
    } catch (e) {
      return ["DNS Lookup failed: $e"];
    }
  }

  /// Scan Local Subnet (e.g. 192.168.1.X)
  static Stream<LanHostResult> scanSubnet(String baseSubnet) async* {
    // Example: baseSubnet = "192.168.1"
    for (int i = 1; i <= 30; i++) {
      final ip = "$baseSubnet.$i";
      final sw = Stopwatch()..start();
      bool alive = false;
      String hostname = "Device-$i";

      try {
        final socket = await Socket.connect(ip, 80, timeout: const Duration(milliseconds: 150));
        alive = true;
        await socket.close();
      } catch (_) {
        // Check 443 / 5555
        try {
          final socket2 = await Socket.connect(ip, 5555, timeout: const Duration(milliseconds: 100));
          alive = true;
          hostname = "ADB Device ($ip)";
          await socket2.close();
        } catch (_) {
          alive = false;
        }
      }
      sw.stop();

      if (alive || i == 1) {
        yield LanHostResult(
          ip: ip,
          hostname: i == 1 ? "Default Gateway / Router" : hostname,
          isAlive: alive || i == 1,
          pingTime: sw.elapsed,
        );
      }
    }
  }
}
