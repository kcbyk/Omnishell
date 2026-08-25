import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';
import '../services/network_service.dart';
import '../widgets/cyber_card.dart';
import '../widgets/neon_button.dart';

class NetworkScreen extends StatefulWidget {
  const NetworkScreen({super.key});

  @override
  State<NetworkScreen> createState() => _NetworkScreenState();
}

class _NetworkScreenState extends State<NetworkScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Port Scanner State
  final TextEditingController _portHostController = TextEditingController(text: "127.0.0.1");
  final List<PortScanResult> _portResults = [];
  bool _isPortScanning = false;

  // LAN Scanner State
  final TextEditingController _subnetController = TextEditingController(text: "192.168.1");
  final List<LanHostResult> _lanResults = [];
  bool _isLanScanning = false;

  // Ping State
  final TextEditingController _pingHostController = TextEditingController(text: "1.1.1.1");
  final List<int> _pingHistory = [];
  bool _isPinging = false;

  // DNS State
  final TextEditingController _dnsHostController = TextEditingController(text: "google.com");
  List<String> _dnsResults = [];
  bool _isDnsResolving = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _startPortScan() async {
    final host = _portHostController.text.trim();
    if (host.isEmpty) return;

    setState(() {
      _isPortScanning = true;
      _portResults.clear();
    });

    final ports = NetworkService.commonPorts.keys.toList();
    await NetworkService.scanPorts(
      host,
      ports,
      onPortScanned: (res) {
        if (mounted) {
          setState(() {
            _portResults.add(res);
          });
        }
      },
    );

    if (mounted) setState(() => _isPortScanning = false);
  }

  void _startLanScan() async {
    final subnet = _subnetController.text.trim();
    if (subnet.isEmpty) return;

    setState(() {
      _isLanScanning = true;
      _lanResults.clear();
    });

    await for (final host in NetworkService.scanSubnet(subnet)) {
      if (!mounted) break;
      setState(() {
        _lanResults.add(host);
      });
    }

    if (mounted) setState(() => _isLanScanning = false);
  }

  void _runPing() async {
    final host = _pingHostController.text.trim();
    if (host.isEmpty) return;

    setState(() {
      _isPinging = true;
      _pingHistory.clear();
    });

    for (int i = 0; i < 5; i++) {
      if (!mounted) break;
      final ping = await NetworkService.pingHost(host);
      if (mounted) {
        setState(() {
          _pingHistory.add(ping ?? 999);
        });
      }
      await Future.delayed(const Duration(milliseconds: 300));
    }

    if (mounted) setState(() => _isPinging = false);
  }

  void _runDnsLookup() async {
    final host = _dnsHostController.text.trim();
    if (host.isEmpty) return;

    setState(() {
      _isDnsResolving = true;
      _dnsResults.clear();
    });

    final records = await NetworkService.resolveDns(host);

    if (mounted) {
      setState(() {
        _isDnsResolving = false;
        _dnsResults = records;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "NETWORK RECON & SOCKETS",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
            color: CyberTheme.neonCyan,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: CyberTheme.neonCyan,
          labelColor: CyberTheme.neonCyan,
          unselectedLabelColor: CyberTheme.textMuted,
          isScrollable: true,
          tabs: const [
            Tab(text: "PORT SCAN"),
            Tab(text: "LAN SCAN"),
            Tab(text: "PING GRAPH"),
            Tab(text: "DNS RECON"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 1. Port Scanner
          _buildPortScannerTab(),
          // 2. LAN Subnet Scan
          _buildLanScannerTab(),
          // 3. Ping Graph
          _buildPingTab(),
          // 4. DNS Lookup
          _buildDnsTab(),
        ],
      ),
    );
  }

  Widget _buildPortScannerTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _portHostController,
                  style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 13),
                  decoration: InputDecoration(
                    labelText: "Target Host / IP",
                    labelStyle: const TextStyle(color: CyberTheme.textSecondary, fontSize: 12),
                    filled: true,
                    fillColor: CyberTheme.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              NeonButton(
                text: "Scan",
                icon: Icons.radar_rounded,
                isLoading: _isPortScanning,
                onPressed: _startPortScan,
              ),
            ],
          ),
          const SizedBox(height: 14),
          Expanded(
            child: _portResults.isEmpty
                ? Center(
                    child: Text(
                      _isPortScanning ? "Scanning ports..." : "Enter IP and tap Scan to discover open ports.",
                      style: const TextStyle(color: CyberTheme.textMuted, fontSize: 12),
                    ),
                  )
                : ListView.builder(
                    itemCount: _portResults.length,
                    itemBuilder: (context, index) {
                      final item = _portResults[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: CyberTheme.surface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: item.isOpen ? CyberTheme.neonGreen.withOpacity(0.4) : const Color(0xFF1B2436),
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: item.isOpen ? CyberTheme.neonGreen : CyberTheme.neonRed.withOpacity(0.5),
                                boxShadow: item.isOpen ? CyberTheme.neonGlow(CyberTheme.neonGreen, blur: 4) : null,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              "PORT ${item.port}",
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, fontFamily: 'monospace'),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              item.serviceName,
                              style: const TextStyle(color: CyberTheme.textSecondary, fontSize: 11),
                            ),
                            const Spacer(),
                            Text(
                              item.isOpen ? "OPEN (${item.latency.inMilliseconds}ms)" : "CLOSED",
                              style: TextStyle(
                                color: item.isOpen ? CyberTheme.neonGreen : CyberTheme.textMuted,
                                fontSize: 10.5,
                                fontWeight: FontWeight.bold,
                              ),
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

  Widget _buildLanScannerTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _subnetController,
                  style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 13),
                  decoration: InputDecoration(
                    labelText: "Subnet Base",
                    hintText: "192.168.1",
                    labelStyle: const TextStyle(color: CyberTheme.textSecondary, fontSize: 12),
                    filled: true,
                    fillColor: CyberTheme.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              NeonButton(
                text: "LAN Scan",
                icon: Icons.devices_rounded,
                color: CyberTheme.neonPink,
                isLoading: _isLanScanning,
                onPressed: _startLanScan,
              ),
            ],
          ),
          const SizedBox(height: 14),
          Expanded(
            child: _lanResults.isEmpty
                ? Center(
                    child: Text(
                      _isLanScanning ? "Scanning local subnet..." : "Scan local Wi-Fi subnet to find connected devices.",
                      style: const TextStyle(color: CyberTheme.textMuted, fontSize: 12),
                    ),
                  )
                : ListView.builder(
                    itemCount: _lanResults.length,
                    itemBuilder: (context, index) {
                      final host = _lanResults[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: CyberTheme.surface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: CyberTheme.neonPink.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.router_rounded, color: CyberTheme.neonPink, size: 18),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(host.ip, style: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'monospace', fontSize: 12)),
                                Text(host.hostname, style: const TextStyle(color: CyberTheme.textSecondary, fontSize: 10)),
                              ],
                            ),
                            const Spacer(),
                            Text(
                              "${host.pingTime.inMilliseconds} ms",
                              style: const TextStyle(color: CyberTheme.neonGreen, fontSize: 11, fontWeight: FontWeight.bold),
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

  Widget _buildPingTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _pingHostController,
                  style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 13),
                  decoration: InputDecoration(
                    labelText: "Ping Target Host",
                    labelStyle: const TextStyle(color: CyberTheme.textSecondary, fontSize: 12),
                    filled: true,
                    fillColor: CyberTheme.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              NeonButton(
                text: "Ping",
                icon: Icons.network_ping_rounded,
                color: CyberTheme.neonGreen,
                isLoading: _isPinging,
                onPressed: _runPing,
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_pingHistory.isNotEmpty) ...[
            CyberCard(
              borderColor: CyberTheme.neonGreen.withOpacity(0.4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("LATENCY WAVEFORM", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: CyberTheme.neonGreen)),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: _pingHistory.map((ms) {
                      final height = (ms / 3).clamp(15.0, 100.0);
                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text("${ms}ms", style: const TextStyle(fontSize: 10, color: Colors.white, fontFamily: 'monospace')),
                          const SizedBox(height: 4),
                          Container(
                            width: 24,
                            height: height,
                            decoration: BoxDecoration(
                              color: ms > 150 ? CyberTheme.neonRed : CyberTheme.neonGreen,
                              borderRadius: BorderRadius.circular(4),
                              boxShadow: CyberTheme.neonGlow(ms > 150 ? CyberTheme.neonRed : CyberTheme.neonGreen, blur: 6),
                            ),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDnsTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _dnsHostController,
                  style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 13),
                  decoration: InputDecoration(
                    labelText: "Domain Name",
                    labelStyle: const TextStyle(color: CyberTheme.textSecondary, fontSize: 12),
                    filled: true,
                    fillColor: CyberTheme.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              NeonButton(
                text: "Query",
                icon: Icons.search_rounded,
                color: CyberTheme.neonAmber,
                isLoading: _isDnsResolving,
                onPressed: _runDnsLookup,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: _dnsResults.isEmpty
                ? const Center(
                    child: Text("Enter a domain name to lookup IP addresses.", style: TextStyle(color: CyberTheme.textMuted, fontSize: 12)),
                  )
                : ListView.builder(
                    itemCount: _dnsResults.length,
                    itemBuilder: (context, index) {
                      return CyberCard(
                        margin: const EdgeInsets.only(bottom: 8),
                        borderColor: CyberTheme.neonAmber.withOpacity(0.3),
                        child: Text(
                          _dnsResults[index],
                          style: const TextStyle(fontFamily: 'monospace', fontSize: 12, color: CyberTheme.neonAmber),
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
