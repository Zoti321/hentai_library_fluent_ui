import 'package:flutter/material.dart';

enum SortField { title, dateAdded, rating }
enum SortDirection { asc, desc }

class SortRule {
  final SortField field;
  final SortDirection direction;

  const SortRule(this.field, this.direction);

  SortRule copyWith({SortField? field, SortDirection? direction}) {
    return SortRule(
      field ?? this.field,
      direction ?? this.direction,
    );
  }
}

class LibrarySortMenu extends StatefulWidget {
  final List<SortRule> rules;
  final Function(List<SortRule>) onRulesChanged;
  final VoidCallback onReset;

  const LibrarySortMenu({
    super.key,
    required this.rules,
    required this.onRulesChanged,
    required this.onReset,
  });

  @override
  State<LibrarySortMenu> createState() => _LibrarySortMenuState();
}

class _LibrarySortMenuState extends State<LibrarySortMenu> {
  final MenuController _menuController = MenuController();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

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
        maximumSize: MaterialStateProperty.all(const Size(320, 600)),
      ),
      builder: (context, controller, child) {
        // Button trigger
        return Material(
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
                color: controller.isOpen 
                    ? colorScheme.primary.withOpacity(0.1) 
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.sort, // Using sort icon as requested for the sort menu
                size: 20,
                color: controller.isOpen ? colorScheme.primary : Colors.grey.shade600,
              ),
            ),
          ),
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
                // --- Header ---
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.swap_vert, size: 18, color: colorScheme.primary),
                        const SizedBox(width: 8),
                        const Text(
                          "排序与视图",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                      ],
                    ),
                    
                    // Reset Button
                    Material(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(6),
                      child: InkWell(
                        onTap: () {
                          widget.onReset();
                          _menuController.close();
                        },
                        borderRadius: BorderRadius.circular(6),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          child: Text(
                            "重置",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey.shade500,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // --- Primary Rule ---
                _buildSortSection(
                  context,
                  title: "主要规则",
                  ruleIndex: 0,
                ),

                const SizedBox(height: 16),
                const Divider(height: 1, thickness: 1, color: Color(0xFFF3F4F6)),
                const SizedBox(height: 16),

                // --- Secondary Rule ---
                _buildSortSection(
                  context,
                  title: "次要规则",
                  ruleIndex: 1,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSortSection(BuildContext context, {required String title, required int ruleIndex}) {
    if (ruleIndex >= widget.rules.length) return const SizedBox.shrink();

    final rule = widget.rules[ruleIndex];
    final isAsc = rule.direction == SortDirection.asc;
    
    // Theme Colors for Asc/Desc
    final ascColor = Colors.blue.shade600;
    final ascBg = Colors.blue.shade50;
    final ascBorder = Colors.blue.shade100;
    
    final descColor = Colors.orange.shade600;
    final descBg = Colors.orange.shade50;
    final descBorder = Colors.orange.shade100;

    final currentColor = isAsc ? ascColor : descColor;
    final currentBg = isAsc ? ascBg : descBg;
    final currentBorder = isAsc ? ascBorder : descBorder;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header & Direction Toggle
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Colors.grey.shade400,
                letterSpacing: 0.5,
              ),
            ),
            
            // Direction Toggle Button
            Material(
              color: currentBg,
              borderRadius: BorderRadius.circular(6),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(6),
                side: BorderSide(color: currentBorder, width: 1),
              ),
              child: InkWell(
                onTap: () => _updateRule(ruleIndex, direction: isAsc ? SortDirection.desc : SortDirection.asc),
                borderRadius: BorderRadius.circular(6),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isAsc ? Icons.arrow_upward : Icons.arrow_downward,
                        size: 12,
                        color: currentColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        isAsc ? "升序" : "降序",
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: currentColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        // Field Chips Grid
        Row(
          children: [
            Expanded(child: _buildSortOption(context, "标题", SortField.title, rule.field, ruleIndex)),
            const SizedBox(width: 8),
            Expanded(child: _buildSortOption(context, "日期", SortField.dateAdded, rule.field, ruleIndex)),
            const SizedBox(width: 8),
            Expanded(child: _buildSortOption(context, "评分", SortField.rating, rule.field, ruleIndex)),
          ],
        ),
      ],
    );
  }

  Widget _buildSortOption(
    BuildContext context, 
    String label, 
    SortField value, 
    SortField groupValue, 
    int ruleIndex
  ) {
    final isSelected = value == groupValue;
    final colorScheme = Theme.of(context).colorScheme;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: isSelected ? colorScheme.primary : Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isSelected ? colorScheme.primary : Colors.grey.shade200,
        ),
        boxShadow: isSelected 
            ? [BoxShadow(color: colorScheme.primary.withOpacity(0.25), blurRadius: 4, offset: const Offset(0, 2))] 
            : [],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _updateRule(ruleIndex, field: value),
          borderRadius: BorderRadius.circular(10),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Center(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: isSelected ? Colors.white : Colors.grey.shade600,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _updateRule(int index, {SortField? field, SortDirection? direction}) {
    final newRules = List<SortRule>.from(widget.rules);
    if (index < newRules.length) {
      newRules[index] = newRules[index].copyWith(
        field: field,
        direction: direction,
      );
      widget.onRulesChanged(newRules);
    }
  }
}