import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/cyber_theme.dart';
import 'screens/dashboard_screen.dart';
import 'screens/terminal_screen.dart';
import 'screens/toolbox_screen.dart';
import 'screens/network_screen.dart';
import 'screens/package_manager_screen.dart';
import 'screens/hardware_screen.dart';
import 'screens/permission_deck_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: CyberTheme.surface,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const OmniShellApp());
}

class OmniShellApp extends StatelessWidget {
  const OmniShellApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OmniShell Cyberdeck',
      debugShowCheckedModeBanner: false,
      theme: CyberTheme.darkTheme,
      home: const MainNavigationDeck(),
    );
  }
}

class MainNavigationDeck extends StatefulWidget {
  const MainNavigationDeck({super.key});

  @override
  State<MainNavigationDeck> createState() => _MainNavigationDeckState();
}

class _MainNavigationDeckState extends State<MainNavigationDeck> {
  int _currentIndex = 0;
  String? _queuedTerminalCommand;

  final GlobalKey<TerminalScreenState> _terminalKey = GlobalKey<TerminalScreenState>();

  void _navigateToTerminalWithCommand(String cmd) {
    setState(() {
      _currentIndex = 1;
      _queuedTerminalCommand = cmd;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _terminalKey.currentState?.runCommand(cmd);
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      DashboardScreen(onRunInTerminal: _navigateToTerminalWithCommand),
      TerminalScreen(key: _terminalKey, initialCommand: _queuedTerminalCommand),
      const ToolboxScreen(),
      const NetworkScreen(),
      const PackageManagerScreen(),
      const HardwareScreen(),
      const PermissionDeckScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: CyberTheme.surface,
          border: Border(top: BorderSide(color: Color(0xFF1B2436), width: 1.2)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (idx) {
            HapticFeedback.selectionClick();
            setState(() => _currentIndex = idx);
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: 'HUD',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.terminal_rounded),
              label: 'Terminal',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.build_circle_rounded),
              label: 'GodMode',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.radar_rounded),
              label: 'Network',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.apps_rounded),
              label: 'Packages',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.sensors_rounded),
              label: 'Hardware',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.vpn_key_rounded),
              label: 'Privileges',
            ),
          ],
        ),
      ),
    );
  }
}
