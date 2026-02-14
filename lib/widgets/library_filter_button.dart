
import 'package:flutter/material.dart';

// 定义筛选状态模型
class FilterState {
  final bool showR18;
  final int? minChapters;
  final Set<String> formats; // 改为文件格式筛选

  const FilterState({
    required this.showR18,
    required this.minChapters,
    required this.formats,
  });

  // 辅助方法：计算活跃的高级筛选数量
  int get activeCount {
    int count = 0;
    if (showR18) count++; 
    if (minChapters != null && minChapters! > 0) count++;
    // 假设默认全选(CBZ, PDF, EPUB, FOLDER 4种)，如果少于4个则视为有筛选
    if (formats.length < 4) count++;
    return count;
  }

  FilterState copyWith({
    bool? showR18,
    int? minChapters, // 传入 -1 代表 null
    Set<String>? formats,
  }) {
    return FilterState(
      showR18: showR18 ?? this.showR18,
      minChapters: (minChapters == -1) ? null : (minChapters ?? this.minChapters),
      formats: formats ?? this.formats,
    );
  }
}

class LibraryFilterButton extends StatefulWidget {
  final FilterState filters;
  final int resultCount;
  final ValueChanged<FilterState> onApply;
  final VoidCallback onReset;

  const LibraryFilterButton({
    super.key,
    required this.filters,
    required this.resultCount,
    required this.onApply,
    required this.onReset,
  });

  @override
  State<LibraryFilterButton> createState() => _LibraryFilterButtonState();
}

class _LibraryFilterButtonState extends State<LibraryFilterButton> {
  final MenuController _menuController = MenuController();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final activeCount = widget.filters.activeCount;

    return MenuAnchor(
      controller: _menuController,
      alignmentOffset: const Offset(0, 8),
      style: MenuStyle(
        backgroundColor: MaterialStateProperty.all(Colors.white),
        surfaceTintColor: MaterialStateProperty.all(Colors.transparent),
        shape: MaterialStateProperty.all(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.withOpacity(0.2)),
          ),
        ),
        padding: MaterialStateProperty.all(EdgeInsets.zero),
        elevation: MaterialStateProperty.all(8),
        maximumSize: MaterialStateProperty.all(const Size(320, 600)),
      ),
      builder: (context, controller, child) {
        return Stack(
          clipBehavior: Clip.none,
          children: [
            Material(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(8),
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: () {
                  if (controller.isOpen) {
                    controller.close();
                  } else {
                    controller.open();
                  }
                },
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: controller.isOpen || activeCount > 0
                        ? colorScheme.primary.withOpacity(0.05)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: controller.isOpen || activeCount > 0
                          ? colorScheme.primary.withOpacity(0.2)
                          : Colors.transparent,
                    ),
                  ),
                  child: Icon(
                    Icons.filter_list,
                    size: 20,
                    color: controller.isOpen || activeCount > 0
                        ? colorScheme.primary
                        : Colors.grey.shade500,
                  ),
                ),
              ),
            ),
            if (activeCount > 0)
              Positioned(
                top: 2,
                right: 2,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: colorScheme.primary,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                ),
              ),
          ],
        );
      },
      menuChildren: [
        SizedBox(
          width: 300,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "高级筛选",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 16),
                      onPressed: () => _menuController.close(),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      style: IconButton.styleFrom(
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        foregroundColor: Colors.grey.shade400,
                      ),
                    )
                  ],
                ),

                const SizedBox(height: 24),

                // 1. R18 Switch
                Row(
                  children: [
                    Icon(
                      Icons.explicit, // ShieldAlert equivalent
                      size: 18,
                      color: widget.filters.showR18 ? Colors.red : Colors.grey.shade400,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      "显示 R18 内容",
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.black87),
                    ),
                    const Spacer(),
                    SizedBox(
                      height: 24,
                      child: Switch(
                        value: widget.filters.showR18,
                        onChanged: (val) {
                          widget.onApply(widget.filters.copyWith(showR18: val));
                        },
                        activeColor: Colors.white,
                        activeTrackColor: Colors.red,
                        inactiveThumbColor: Colors.white,
                        inactiveTrackColor: Colors.grey.shade300,
                        trackOutlineColor: MaterialStateProperty.all(Colors.transparent),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // 2. Min Chapters Input
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionHeader(Icons.numbers, "章节数量"),
                    const SizedBox(height: 8),
                    _NumberInput(
                      label: "最少章节",
                      value: widget.filters.minChapters,
                      onChanged: (val) {
                        widget.onApply(widget.filters.copyWith(minChapters: val ?? -1));
                      },
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // 3. File Formats Grid (Modified)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionHeader(null, "文件格式"),
                    const SizedBox(height: 8),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      childAspectRatio: 2.8,
                      mainAxisSpacing: 8,
                      crossAxisSpacing: 8,
                      padding: EdgeInsets.zero,
                      children: [
                        _FormatOptionCard(
                          label: "CBZ / CBR",
                          icon: Icons.folder_zip_outlined,
                          isSelected: widget.filters.formats.contains("CBZ"),
                          onTap: () => _toggleFormat("CBZ"),
                        ),
                        _FormatOptionCard(
                          label: "PDF",
                          icon: Icons.picture_as_pdf_outlined,
                          isSelected: widget.filters.formats.contains("PDF"),
                          onTap: () => _toggleFormat("PDF"),
                        ),
                        _FormatOptionCard(
                          label: "EPUB",
                          icon: Icons.import_contacts, // Book icon
                          isSelected: widget.filters.formats.contains("EPUB"),
                          onTap: () => _toggleFormat("EPUB"),
                        ),
                        _FormatOptionCard(
                          label: "文件夹",
                          icon: Icons.folder_open,
                          isSelected: widget.filters.formats.contains("FOLDER"),
                          onTap: () => _toggleFormat("FOLDER"),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 24),
                const Divider(height: 1, thickness: 1, color: Color(0xFFF3F4F6)),
                const SizedBox(height: 16),

                // Footer
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "${widget.resultCount} 个结果",
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade400),
                    ),
                    TextButton(
                      onPressed: () {
                        widget.onReset();
                      },
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                        minimumSize: const Size(0, 32),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        foregroundColor: colorScheme.primary,
                        textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                      ),
                      child: const Text("重置所有"),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _toggleFormat(String type) {
    final current = widget.filters.formats.toSet();
    if (current.contains(type)) {
      current.remove(type);
    } else {
      current.add(type);
    }
    widget.onApply(widget.filters.copyWith(formats: current));
  }

  Widget _buildSectionHeader(IconData? icon, String title) {
    return Row(
      children: [
        if (icon != null) ...[
          Icon(icon, size: 12, color: Colors.grey.shade500),
          const SizedBox(width: 4),
        ],
        Text(
          title,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade500,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
}

class _NumberInput extends StatelessWidget {
  final String label;
  final int? value;
  final ValueChanged<int?> onChanged;

  const _NumberInput({
    required this.label,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.black87),
          ),
          Row(
            children: [
              _buildBtn(
                icon: Icons.remove,
                onTap: () => onChanged(value != null && value! > 0 ? value! - 1 : 0),
              ),
              SizedBox(
                width: 40,
                child: Text(
                  value?.toString() ?? "0",
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                ),
              ),
              _buildBtn(
                icon: Icons.add,
                onTap: () => onChanged((value ?? 0) + 1),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBtn({required IconData icon, required VoidCallback onTap}) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(6),
        child: Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade200),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Icon(icon, size: 16, color: Colors.grey.shade600),
        ),
      ),
    );
  }
}

class _FormatOptionCard extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _FormatOptionCard({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
          decoration: BoxDecoration(
            color: isSelected ? colorScheme.primary.withOpacity(0.05) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? colorScheme.primary : Colors.grey.withOpacity(0.2),
            ),
            boxShadow: isSelected ? [] : [
              BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 2, offset: const Offset(0, 1))
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? colorScheme.primary : Colors.grey.shade400,
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? colorScheme.primary : Colors.grey.shade500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
