
import 'package:flutter/material.dart';

// 假设 MangaData 定义在 models 文件夹中
// 这里为了演示方便，定义一个简化的 MangaData 类
class MangaData {
  final String id;
  final String title;
  final String coverUrl;
  final String fileSize;
  final List<dynamic>? chapters;

  MangaData({
    required this.id,
    required this.title,
    required this.coverUrl,
    required this.fileSize,
    this.chapters,
  });
}

class AddChapterSourceDialog extends StatefulWidget {
  final MangaData? currentManga;
  final List<MangaData> library;
  final Function(List<String>) onConfirm;

  const AddChapterSourceDialog({
    super.key,
    required this.currentManga,
    required this.library,
    required this.onConfirm,
  });

  @override
  State<AddChapterSourceDialog> createState() => _AddChapterSourceDialogState();
}

class _AddChapterSourceDialogState extends State<AddChapterSourceDialog> {
  // 状态管理：选中的 ID 集合
  final Set<String> _selectedIds = {};
  
  // 状态管理：搜索文本
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text;
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // 逻辑：过滤候选列表
  List<MangaData> get _candidates {
    if (widget.currentManga == null) return [];
    
    return widget.library.where((m) {
      // 排除当前漫画
      if (m.id == widget.currentManga!.id) return false;
      // 搜索过滤
      if (_searchQuery.isNotEmpty) {
        return m.title.toLowerCase().contains(_searchQuery.toLowerCase());
      }
      return true;
    }).toList();
  }

  // 逻辑：切换选中状态
  void _toggleSelection(String id) {
    setState(() {
      if (_selectedIds.contains(id)) {
        _selectedIds.remove(id);
      } else {
        _selectedIds.add(id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    // 使用 Dialog 组件作为模态框的基础
    return Dialog(
      backgroundColor: Colors.white,
      surfaceTintColor: Colors.transparent, // 移除 M3 的默认色调，保持白色背景
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      insetPadding: const EdgeInsets.all(16),
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxWidth: 512, // 对应 max-w-lg
          maxHeight: 600, // 对应 h-[600px]
        ),
        child: Column(
          children: [
            // --- Header & Search ---
            Container(
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 16),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: Colors.grey.withOpacity(0.2)),
                ),
                color: Colors.grey.withOpacity(0.02), // bg-gray-50/50
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "从库中添加章节",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.grey),
                        onPressed: () => Navigator.of(context).pop(),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        style: IconButton.styleFrom(
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: "搜索库...",
                      hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                      prefixIcon: Icon(Icons.search, size: 20, color: Colors.grey.shade400),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      isDense: true,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide(color: colorScheme.primary),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    style: const TextStyle(fontSize: 14),
                  ),
                ],
              ),
            ),

            // --- List Body ---
            Expanded(
              child: _candidates.isEmpty
                  ? Center(
                      child: Text(
                        "未找到匹配的漫画。",
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(8),
                      itemCount: _candidates.length,
                      itemBuilder: (context, index) {
                        final item = _candidates[index];
                        final isSelected = _selectedIds.contains(item.id);

                        return Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () => _toggleSelection(item.id),
                            borderRadius: BorderRadius.circular(8),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              margin: const EdgeInsets.only(bottom: 4),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? colorScheme.primary.withOpacity(0.05)
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: isSelected
                                      ? colorScheme.primary
                                      : Colors.transparent,
                                ),
                              ),
                              child: Row(
                                children: [
                                  // Checkbox Visual
                                  Container(
                                    width: 20,
                                    height: 20,
                                    margin: const EdgeInsets.only(right: 12),
                                    decoration: BoxDecoration(
                                      color: isSelected ? colorScheme.primary : Colors.white,
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(
                                        color: isSelected
                                            ? colorScheme.primary
                                            : Colors.grey.shade300,
                                      ),
                                    ),
                                    child: isSelected
                                        ? const Icon(Icons.check, size: 14, color: Colors.white)
                                        : null,
                                  ),
                                  
                                  // Cover Image Placeholder
                                  Container(
                                    width: 40,
                                    height: 56,
                                    margin: const EdgeInsets.only(right: 12),
                                    decoration: BoxDecoration(
                                      color: Colors.grey.shade200,
                                      borderRadius: BorderRadius.circular(4),
                                      image: DecorationImage(
                                        image: NetworkImage(item.coverUrl),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),

                                  // Text Details
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.title,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w500,
                                            color: Colors.black87,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          "${item.chapters?.length ?? 0} 章 • ${item.fileSize}",
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey.shade500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
            ),

            // --- Footer ---
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(color: Colors.grey.withOpacity(0.2)),
                ),
                color: Colors.grey.withOpacity(0.02),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.grey.shade700,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("取消"),
                  ),
                  const SizedBox(width: 12),
                  FilledButton(
                    onPressed: _selectedIds.isEmpty
                        ? null
                        : () {
                            widget.onConfirm(_selectedIds.toList());
                            Navigator.of(context).pop();
                          },
                    style: FilledButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      disabledBackgroundColor: colorScheme.primary.withOpacity(0.5),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      elevation: 0,
                    ),
                    child: Text(
                      "添加 ${_selectedIds.length} 项为章节",
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
