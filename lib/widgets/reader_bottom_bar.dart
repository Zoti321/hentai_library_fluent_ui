
import 'dart:ui';
import 'package:flutter/material.dart';

class ReaderBottomBar extends StatelessWidget {
  final String chapterTitle;
  final double currentProgress; // Index for horizontal, % for vertical
  final double total; // Count for horizontal, 100 for vertical
  final String readMode; // 'vertical' or 'horizontal'
  final bool isVisible;
  final VoidCallback onPrevChapter;
  final VoidCallback onNextChapter;
  final Function(double) onSliderChange;

  const ReaderBottomBar({
    super.key,
    required this.chapterTitle,
    required this.currentProgress,
    required this.total,
    required this.readMode,
    required this.isVisible,
    required this.onPrevChapter,
    required this.onNextChapter,
    required this.onSliderChange,
  });

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom + 32;

    // Format progress text
    String progressText;
    if (readMode == 'horizontal') {
      progressText = "${(currentProgress + 1).toInt()} / ${total.toInt()}";
    } else {
      progressText = "${currentProgress.round()}%";
    }

    return AnimatedPositioned(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOutCubic,
      bottom: isVisible ? bottomPadding : bottomPadding - 32, // 位移动画
      left: 16,
      right: 16,
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 300),
        opacity: isVisible ? 1.0 : 0.0,
        child: Center(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16), // rounded-2xl
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 672), // max-w-2xl
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.6), // bg-black/60
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.1),
                    width: 1,
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Progress Info Row
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            chapterTitle,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: Colors.white.withOpacity(0.6),
                            ),
                          ),
                          Text(
                            progressText,
                            style: TextStyle(
                              fontFamily: 'RobotoMono', // Monospace font
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: Colors.white.withOpacity(0.9),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Controls Row
                    Row(
                      children: [
                        // Prev Chapter Button
                        _buildNavButton(
                          icon: Icons.chevron_left,
                          onTap: onPrevChapter,
                        ),

                        const SizedBox(width: 12),

                        // Slider
                        Expanded(
                          child: SizedBox(
                            height: 32, // Fixed height for touch target
                            child: SliderTheme(
                              data: SliderThemeData(
                                trackHeight: 4,
                                activeTrackColor: Colors.white.withOpacity(0.8),
                                inactiveTrackColor: Colors.white.withOpacity(0.2),
                                thumbColor: Colors.white,
                                thumbShape: const RoundSliderThumbShape(
                                  enabledThumbRadius: 8,
                                  elevation: 4,
                                ),
                                overlayColor: Colors.white.withOpacity(0.1),
                                overlayShape: const RoundSliderOverlayShape(overlayRadius: 16),
                                trackShape: const RoundedRectSliderTrackShape(),
                              ),
                              child: Slider(
                                value: currentProgress,
                                min: 0,
                                max: readMode == 'horizontal' ? (total - 1) : 100,
                                onChanged: onSliderChange,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(width: 12),

                        // Next Chapter Button
                        _buildNavButton(
                          icon: Icons.chevron_right,
                          onTap: onNextChapter,
                        ),
                      ],
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

  Widget _buildNavButton({required IconData icon, required VoidCallback onTap}) {
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(100),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(100),
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            // hover handled by InkWell
          ),
          child: Icon(
            icon,
            size: 20,
            color: Colors.white.withOpacity(0.7),
          ),
        ),
      ),
    );
  }
}
