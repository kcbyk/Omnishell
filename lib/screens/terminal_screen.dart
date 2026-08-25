import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/cyber_theme.dart';
import '../services/shell_service.dart';

class TerminalScreen extends StatefulWidget {
  final String? initialCommand;

  const TerminalScreen({super.key, this.initialCommand});

  @override
  State<TerminalScreen> createState() => TerminalScreenState();
}

class TerminalScreenState extends State<TerminalScreen> {
  final ShellService _shellService = ShellService();
  final TextEditingController _cmdController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_TerminalEntry> _entries = [];
  bool _isRunning = false;

  final List<String> _quickChips = [
    'uname -a',
    'id',
    'dumpsys battery',
    'getprop',
    'top -n 1 -b',
    'netstat -tuln',
    'df -h',
    'ps -ef',
    'pm list packages -3',
    'wm size',
  ];

  @override
  void initState() {
    super.initState();
    _entries.add(_TerminalEntry(
      command: 'sys.init',
      output: '''=== OMNISHELL CYBER KERNEL v1.0.0 ===
[+] Shell Engine: Native sh / Toybox Linux
[+] Privilege: Standard Android UID (ADB/Shizuku Bridge Ready)
Type help or tap quick chips below to execute commands.
''',
      isSystem: true,
    ));

    if (widget.initialCommand != null) {
      runCommand(widget.initialCommand!);
    }
  }

  void runCommand(String cmd) async {
    final cleanCmd = cmd.trim();
    if (cleanCmd.isEmpty) return;

    if (cleanCmd == 'clear' || cleanCmd == 'cls') {
      setState(() {
        _entries.clear();
      });
      _cmdController.clear();
      return;
    }

    setState(() {
      _isRunning = true;
      _entries.add(_TerminalEntry(command: cleanCmd, isRunning: true));
    });
    _cmdController.clear();
    _scrollToBottom();

    final result = await _shellService.execute(cleanCmd);

    if (mounted) {
      setState(() {
        _isRunning = false;
        final lastIdx = _entries.length - 1;
        if (lastIdx >= 0) {
          _entries[lastIdx] = _TerminalEntry(
            command: cleanCmd,
            output: result.stdout.isNotEmpty ? result.stdout : (result.stderr.isNotEmpty ? result.stderr : '[Command exited with code ${result.exitCode}]'),
            exitCode: result.exitCode,
            executionTime: result.executionTime,
            isError: !result.isSuccess,
          );
        }
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _copyAllOutput() {
    final buffer = StringBuffer();
    for (final e in _entries) {
      buffer.writeln("> ${e.command}");
      if (e.output != null) buffer.writeln(e.output);
      buffer.writeln();
    }
    Clipboard.setData(ClipboardData(text: buffer.toString()));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: CyberTheme.surfaceLight,
        content: Text("Terminal output copied to clipboard!"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF04060A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF04060A),
        title: const Row(
          children: [
            Icon(Icons.terminal, color: CyberTheme.neonGreen, size: 20),
            SizedBox(width: 8),
            Text(
              "BASH / SH TERMINAL",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: CyberTheme.neonGreen,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.copy_rounded, size: 18, color: CyberTheme.textSecondary),
            tooltip: "Copy Terminal Log",
            onPressed: _copyAllOutput,
          ),
          IconButton(
            icon: const Icon(Icons.delete_sweep_rounded, size: 20, color: CyberTheme.textSecondary),
            tooltip: "Clear Terminal",
            onPressed: () {
              setState(() => _entries.clear());
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Quick Chips Bar
          Container(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 10),
            color: CyberTheme.surface,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _quickChips.length,
              separatorBuilder: (_, __) => const SizedBox(width: 6),
              itemBuilder: (context, index) {
                final chip = _quickChips[index];
                return ActionChip(
                  label: Text(
                    chip,
                    style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: CyberTheme.neonCyan),
                  ),
                  backgroundColor: CyberTheme.background,
                  side: BorderSide(color: CyberTheme.neonCyan.withOpacity(0.3)),
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  onPressed: _isRunning ? null : () => runCommand(chip),
                );
              },
            ),
          ),

          // Terminal Output Window
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(12),
              color: const Color(0xFF020408),
              child: ListView.builder(
                controller: _scrollController,
                physics: const BouncingScrollPhysics(),
                itemCount: _entries.length,
                itemBuilder: (context, index) {
                  final item = _entries[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Command line header
                        if (!item.isSystem)
                          Row(
                            children: [
                              const Text(
                                "omni@android:~\$ ",
                                style: TextStyle(
                                  color: CyberTheme.neonPink,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                  fontFamily: 'monospace',
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  item.command,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                              ),
                              if (item.executionTime != null)
                                Text(
                                  "${item.executionTime!.inMilliseconds}ms",
                                  style: const TextStyle(
                                    color: CyberTheme.textMuted,
                                    fontSize: 10,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                            ],
                          ),
                        const SizedBox(height: 4),
                        // Output content
                        if (item.isRunning)
                          const Row(
                            children: [
                              SizedBox(
                                width: 12,
                                height: 12,
                                child: CircularProgressIndicator(strokeWidth: 1.5, color: CyberTheme.neonGreen),
                              ),
                              SizedBox(width: 8),
                              Text(
                                "Running process...",
                                style: TextStyle(color: CyberTheme.neonGreen, fontSize: 11, fontFamily: 'monospace'),
                              ),
                            ],
                          )
                        else if (item.output != null)
                          SelectableText(
                            item.output!,
                            style: TextStyle(
                              color: item.isError
                                  ? CyberTheme.neonRed
                                  : (item.isSystem ? CyberTheme.neonAmber : CyberTheme.neonGreen),
                              fontSize: 11.5,
                              fontFamily: 'monospace',
                              height: 1.35,
                            ),
                          ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),

          // Command Input Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: const BoxDecoration(
              color: CyberTheme.surface,
              border: Border(top: BorderSide(color: Color(0xFF1B2436), width: 1.2)),
            ),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  const Text(
                    "\$ ",
                    style: TextStyle(
                      color: CyberTheme.neonCyan,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'monospace',
                    ),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _cmdController,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontFamily: 'monospace',
                      ),
                      decoration: const InputDecoration(
                        hintText: "Enter shell command...",
                        hintStyle: TextStyle(color: CyberTheme.textMuted, fontSize: 12),
                        border: InputBorder.none,
                        isDense: true,
                      ),
                      onSubmitted: _isRunning ? null : (val) => runCommand(val),
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      Icons.play_arrow_rounded,
                      color: _isRunning ? CyberTheme.textMuted : CyberTheme.neonCyan,
                    ),
                    onPressed: _isRunning ? null : () => runCommand(_cmdController.text),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TerminalEntry {
  final String command;
  final String? output;
  final int? exitCode;
  final Duration? executionTime;
  final bool isRunning;
  final bool isError;
  final bool isSystem;

  _TerminalEntry({
    required this.command,
    this.output,
    this.exitCode,
    this.executionTime,
    this.isRunning = false,
    this.isError = false,
    this.isSystem = false,
  });
}
