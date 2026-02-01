import 'package:flutter/material.dart';

class FilterState {
  final List<String> status;
  final List<String> format;

  const FilterState({
    this.status = const [],
    this.format = const [],
  });

  bool get isEmpty => status.isEmpty && format.isEmpty;
}

class LibraryFilterMenu extends StatefulWidget {
  final FilterState filters;
  final int resultCount;
  final Function(String category, String value) onFilterChanged;
  final VoidCallback onReset;

  const LibraryFilterMenu({
    super.key,
    required this.filters,
    required this.resultCount,
    required this.onFilterChanged,
    required this.onReset,
  });

  @override
  State<LibraryFilterMenu> createState() => _LibraryFilterMenuState();
}

class _LibraryFilterMenuState extends State<LibraryFilterMenu> {
  final MenuController _menuController = MenuController();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final hasActiveFilters = !widget.filters.isEmpty;

    return MenuAnchor(
      controller: _menuController,
      alignmentOffset: const Offset(0, 8),
      style: MenuStyle(
        backgroundColor: MaterialStateProperty.all(Colors.white),
        surfaceTintColor: MaterialStateProperty.all(Colors.transparent),
        shape: MaterialStateProperty.all(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: Colors.grey.withOpacity(0.2)),
          ),
        ),
        padding: MaterialStateProperty.all(EdgeInsets.zero),
        elevation: MaterialStateProperty.all(6),
        maximumSize: MaterialStateProperty.all(const Size(280, 600)),
      ),
      builder: (context, controller, child) {
        return Stack(
          clipBehavior: Clip.none,
          children: [
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  if (controller.isOpen) {
                    controller.close();
                  } else {
                    controller.open();
                  }
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: controller.isOpen || hasActiveFilters
                        ? colorScheme.primary.withOpacity(0.1)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.filter_list,
                    size: 20,
                    color: controller.isOpen || hasActiveFilters
                        ? colorScheme.primary
                        : Colors.grey.shade600,
                  ),
                ),
              ),
            ),
            if (hasActiveFilters)
              Positioned(
                top: 4,
                right: 4,
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
          width: 260,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 8, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "筛选内容",
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
              ),

              const Divider(height: 1, thickness: 1, color: Color(0xFFF3F4F6)),

              // Content
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Status Section
                    _buildSectionHeader("阅读状态"),
                    const SizedBox(height: 8),
                    _buildCheckboxGroup(
                      context,
                      category: "status",
                      currentValues: widget.filters.status,
                      options: {
                        "Reading": "阅读中",
                        "Completed": "已完成",
                        "Plan to Read": "想读",
                      },
                    ),

                    const SizedBox(height: 16),
                    const Divider(height: 1, thickness: 1, color: Color(0xFFF3F4F6)),
                    const SizedBox(height: 16),

                    // Format Section
                    _buildSectionHeader("文件格式"),
                    const SizedBox(height: 8),
                    _buildCheckboxGroup(
                      context,
                      category: "format",
                      currentValues: widget.filters.format,
                      options: {
                        "CBZ": "CBZ / CBR",
                        "PDF": "PDF",
                        "ZIP": "ZIP",
                        "FOLDER": "文件夹",
                      },
                    ),
                  ],
                ),
              ),

              // Footer
              Container(
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: Color(0xFFF3F4F6))),
                  color: Color(0xFFFAFAFA),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "${widget.resultCount} 个结果",
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade400),
                    ),
                    TextButton(
                      onPressed: hasActiveFilters
                          ? () {
                              widget.onReset();
                              _menuController.close();
                            }
                          : null,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                        minimumSize: const Size(0, 32),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        foregroundColor: colorScheme.primary,
                        disabledForegroundColor: colorScheme.primary.withOpacity(0.5),
                        textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                      ),
                      child: const Text("重置所有"),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.bold,
        color: Colors.grey.shade500,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildCheckboxGroup(
    BuildContext context, {
    required String category,
    required List<String> currentValues,
    required Map<String, String> options,
  }) {
    return Column(
      children: options.entries.map((entry) {
        return _buildCheckbox(context, entry.value, entry.key, currentValues, category);
      }).toList(),
    );
  }

  Widget _buildCheckbox(
    BuildContext context,
    String label,
    String value,
    List<String> currentList,
    String category,
  ) {
    final isChecked = currentList.contains(value);
    final colorScheme = Theme.of(context).colorScheme;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => widget.onFilterChanged(category, value),
        borderRadius: BorderRadius.circular(6),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
          child: Row(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: isChecked ? colorScheme.primary.withOpacity(0.1) : Colors.transparent,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(
                    color: isChecked ? colorScheme.primary : Colors.grey.shade300,
                    width: 1.5,
                  ),
                ),
                child: isChecked
                    ? Icon(Icons.check, size: 12, color: colorScheme.primary)
                    : null,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 13,
                    color: isChecked ? colorScheme.primary : Colors.grey.shade700,
                    fontWeight: isChecked ? FontWeight.w500 : FontWeight.normal,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}