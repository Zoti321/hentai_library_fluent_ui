import React, { useState, useMemo } from 'react';
import { Search, Trash2, Clock, Calendar, Play, BookOpen, XCircle, ArrowRight, History, ChevronDown, ChevronRight } from 'lucide-react';
import { MangaData } from '../types';

interface HistoryViewProps {
    history: MangaData[];
    onMangaClick: (manga: MangaData) => void;
    onStartReading: (manga: MangaData) => void;
    onRemoveItem: (id: string) => void;
    onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onMangaClick, onStartReading, onRemoveItem, onClearHistory }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    // Filter and Group History
    const groupedHistory = useMemo(() => {
        // 1. Filter by Search
        const filtered = history.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

        // 2. Group by Time (Mock logic based on 'lastOpened' string or real date)
        // In a real app, parse ISO string. Here we do simple heuristic for demo.
        const groups: Record<string, MangaData[]> = {
            '今天': [],
            '昨天': [],
            '本周': [],
            '更早': []
        };

        filtered.forEach(item => {
            const time = (item.lastOpened || '').toLowerCase();
            if (time.includes('ago') || time.includes('just now') || time.includes('hour') || time.includes('minute')) {
                groups['今天'].push(item);
            } else if (time.includes('yesterday')) {
                groups['昨天'].push(item);
            } else if (time.includes('days')) {
                groups['本周'].push(item);
            } else {
                groups['更早'].push(item);
            }
        });

        // Remove empty groups
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [history, searchQuery]);

    const toggleGroup = (group: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const hasHistory = history.length > 0;

    return (
        <div className="w-full max-w-5xl mx-auto h-full flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <header className="mb-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <History className="w-6 h-6 text-primary" />
                        阅读历史
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {history.length} 条记录 • 最长保留 30 天
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative group flex-1 md:w-64">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="搜索历史记录..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-border-strong focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm outline-none placeholder:text-gray-400" 
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Clear Button */}
                    {hasHistory && (
                        <button 
                            onClick={() => { if(confirm('确定要清空所有阅读历史吗？')) onClearHistory(); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100"
                            title="清空历史"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">清空</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar pr-1">
                {!hasHistory ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 pb-20">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600">暂无阅读历史</h3>
                        <p className="text-sm">开始阅读漫画，记录将显示在这里。</p>
                    </div>
                ) : groupedHistory.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <p>没有找到与 "{searchQuery}" 相关的记录</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedHistory.map(([groupTitle, items]) => {
                            const isCollapsed = collapsedGroups[groupTitle];
                            return (
                                <section key={groupTitle} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div 
                                        className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50/80 p-1.5 -ml-1.5 rounded-lg transition-colors select-none group"
                                        onClick={() => toggleGroup(groupTitle)}
                                    >
                                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                             {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </div>
                                        <Calendar className="w-4 h-4 text-primary/70" />
                                        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{groupTitle}</h3>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
                                        <div className="h-px bg-gray-100 flex-1 ml-2 group-hover:bg-gray-200 transition-colors" />
                                    </div>
                                    
                                    {!isCollapsed && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200 origin-top">
                                            {items.map(manga => (
                                                <div 
                                                    key={manga.id} 
                                                    onClick={() => onMangaClick(manga)}
                                                    className="group relative flex items-start gap-4 p-3 rounded-xl bg-white border border-border-subtle hover:border-primary/30 hover:shadow-fluent-hover transition-all duration-300 cursor-pointer"
                                                >
                                                    {/* Cover */}
                                                    <div className="relative w-16 h-24 sm:w-20 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                                                        <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 py-1 flex flex-col h-full">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{manga.title}</h3>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); onRemoveItem(manga.id); }}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                                title="删除记录"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{manga.lastOpened}</span>
                                                        </div>

                                                        <div className="mt-auto pt-3 flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-gray-400 mb-0.5">阅读进度</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <BookOpen className="w-3.5 h-3.5 text-gray-600" />
                                                                    <span className="text-sm font-medium text-gray-700">第 {manga.chapters ? Math.min(3, manga.chapters.length) : 1} 章</span>
                                                                </div>
                                                            </div>

                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); onStartReading(manga); }}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs hover:bg-primary hover:text-white transition-all active:scale-95 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-x-2 sm:translate-x-4 group-hover:translate-x-0"
                                                            >
                                                                <Play className="w-3 h-3 fill-current" />
                                                                继续阅读
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};