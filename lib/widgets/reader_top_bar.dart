
import 'dart:ui';
import 'package:flutter/material.dart';

// 假设 MangaData 和 Chapter 是简单的数据模型，或者直接传入 String
// 这里为了通用性，直接定义所需的参数类型

class ReaderTopBar extends StatelessWidget {
  final String mangaTitle;
  final String chapterTitle;
  final bool isVisible;
  final String readMode; // 'vertical' or 'horizontal'
  final VoidCallback onBack;
  final Function(String) onModeChange;

  const ReaderTopBar({
    super.key,
    required this.mangaTitle,
    required this.chapterTitle,
    required this.isVisible,
    required this.readMode,
    required this.onBack,
    required this.onModeChange,
  });

  @override
  Widget build(BuildContext context) {
    // 顶部安全区域高度 + 边距
    final topPadding = MediaQuery.of(context).padding.top + 24;

    return AnimatedPositioned(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOutCubic,
      top: isVisible ? topPadding : topPadding - 20, // 位移动画
      left: 0,
      right: 0,
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 300),
        opacity: isVisible ? 1.0 : 0.0,
        child: Center(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(100), // 完全圆角
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 500), // 限制最大宽度
                padding: const EdgeInsets.fromLTRB(8, 6, 6, 6),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.6), // bg-black/60
                  borderRadius: BorderRadius.circular(100),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.1), // border-white/10
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Back Button
                    _buildCircleButton(
                      icon: Icons.arrow_back,
                      onTap: onBack,
                    ),
                    
                    const SizedBox(width: 12),

                    // Title Info
                    Container(
                      constraints: const BoxConstraints(maxWidth: 200, minWidth: 100),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        border: Border.symmetric(
                          vertical: BorderSide(
                            color: Colors.white.withOpacity(0.1),
                            width: 1,
                          ),
                        ),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            mangaTitle.toUpperCase(),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Colors.white.withOpacity(0.5),
                              letterSpacing: 1.2,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            chapterTitle,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Colors.white.withOpacity(0.9),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 12),

                    // Mode Switcher (Segmented Control)
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(100),
                        border: Border.all(color: Colors.white.withOpacity(0.05)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _buildModeButton(
                            label: '分页',
                            icon: Icons.view_column_outlined, // 对应 Columns
                            isActive: readMode == 'horizontal',
                            onTap: () => onModeChange('horizontal'),
                          ),
                          _buildModeButton(
                            label: '条漫',
                            icon: Icons.view_agenda_outlined, // 对应 MoveVertical
                            isActive: readMode == 'vertical',
                            onTap: () => onModeChange('vertical'),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 4),
                    
                    // Settings Button
                    _buildCircleButton(
                      icon: Icons.tune, // 对应 Settings2
                      onTap: () {}, // Placeholder
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCircleButton({required IconData icon, required VoidCallback onTap}) {
    return Material(
      color: Colors.transparent,
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Container(
          width: 32,
          height: 32,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            // hover effect handled by InkWell overlay, but we can add default style if needed
          ),
          child: Icon(icon, size: 16, color: Colors.white.withOpacity(0.9)),
        ),
      ),
    );
  }

  Widget _buildModeButton({
    required String label,
    required IconData icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(100),
          boxShadow: isActive
              ? [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4)]
              : [],
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 14,
              color: isActive ? Colors.black : Colors.white.withOpacity(0.6),
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: isActive ? Colors.black : Colors.white.withOpacity(0.6),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
