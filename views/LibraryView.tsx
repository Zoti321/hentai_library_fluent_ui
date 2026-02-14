import React, { useState, useMemo } from 'react';
import { Search, RotateCw, Filter, ArrowDownWideNarrow, ArrowUp, ArrowDown, LayoutGrid, List, Import, FileCheck, Trash2, X, BookOpen, Layers, ChevronDown, CheckSquare, Square, ArrowUpDown, ShieldAlert, Hash, HardDrive, Cloud, Globe, Library as LibraryIcon, Sparkles, FileArchive, Folder, FileText, Check } from 'lucide-react';
import { MangaData, LayoutDensity, ComicImageSourceType } from '../types';
import { MangaGridItem, ViewMode } from '../components/MangaGridItem';

type SortField = 'title' | 'dateAdded' | 'rating';
type SortDirection = 'asc' | 'desc';
interface SortRule { field: SortField; direction: SortDirection; }

// --- Updated Filter State Definition ---
interface FilterState {
    status: '连载中' | '已完结' | null;
    showR18: boolean;
    minChapters: number | null;
    formats: Set<string>; // Changed from imageSourceTypes to formats
}

interface LibraryViewProps {
    library: MangaData[];
    isR18Mode: boolean; // Global setting override
    onMangaClick: (manga: MangaData) => void;
    onStartReading: (manga: MangaData) => void;
    onContextMenu: (e: React.MouseEvent, manga: MangaData) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    onMergeRequest: (items: MangaData[]) => void;
    layoutDensity: LayoutDensity;
}

const SortOption = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`
            relative flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border text-center select-none
            ${active 
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-[1.02] z-10' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
        `}
    >
        {label}
    </button>
);

const SortSection = ({ 
    title, 
    rule, 
    onFieldChange, 
    onDirectionChange 
}: { 
    title: string, 
    rule: SortRule, 
    onFieldChange: (f: SortField) => void, 
    onDirectionChange: () => void 
}) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
            <button 
                onClick={(e) => { e.stopPropagation(); onDirectionChange(); }} 
                className={`
                    flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all border
                    ${rule.direction === 'asc' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                    }
                `}
            >
                {rule.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{rule.direction === 'asc' ? '升序' : '降序'}</span>
            </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
            <SortOption active={rule.field === 'title'} label="标题" onClick={() => onFieldChange('title')} />
            <SortOption active={rule.field === 'dateAdded'} label="日期" onClick={() => onFieldChange('dateAdded')} />
            <SortOption active={rule.field === 'rating'} label="评分" onClick={() => onFieldChange('rating')} />
        </div>
    </div>
);

// --- Component: Numeric Input for Min Chapters ---
const NumberInput = ({ value, onChange, label }: { value: number | null, onChange: (v: number | null) => void, label: string }) => (
    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-border-subtle">
        <span className="text-sm font-medium text-gray-700 ml-1">{label}</span>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => onChange(value ? Math.max(0, value - 1) : 0)} 
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 shadow-sm"
            >
                -
            </button>
            <input 
                type="number" 
                value={value ?? ''} 
                onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="0"
                className="w-12 text-center bg-transparent text-sm font-semibold outline-none"
            />
            <button 
                onClick={() => onChange((value || 0) + 1)} 
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 shadow-sm"
            >
                +
            </button>
        </div>
    </div>
);

// --- Component: Format Filter Checkbox (Standard Checkbox Style) ---
const FormatCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <div 
        onClick={(e) => { e.stopPropagation(); onChange(); }}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group select-none -mx-2"
    >
        <div className={`
            w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all duration-200 shadow-sm
            ${checked 
                ? 'bg-primary border-primary' 
                : 'bg-white border-border-strong group-hover:border-gray-400'
            }
        `}>
             <Check className={`w-3 h-3 text-white transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
        </div>
        <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{label}</span>
    </div>
);

const QuickFilterTab = ({ label, count, isActive, onClick }: { label: string, count?: number, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`
            relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
            ${isActive 
                ? 'bg-primary text-white shadow-md shadow-primary/25 ring-1 ring-primary/20' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
        `}
    >
        <span>{label}</span>
        {count !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                {count}
            </span>
        )}
    </button>
);

export const LibraryView: React.FC<LibraryViewProps> = ({ 
    library, isR18Mode, onMangaClick, onStartReading, onContextMenu, onRefresh, isRefreshing, onMergeRequest, layoutDensity 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sort State
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [sortRules, setSortRules] = useState<SortRule[]>([{ field: 'dateAdded', direction: 'desc' }, { field: 'title', direction: 'asc' }]);
    
    // Filter State
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        status: null, // This will now be controlled by the Tabs
        showR18: isR18Mode, 
        minChapters: null,
        formats: new Set(['CBZ', 'ZIP', 'PDF', 'FOLDER'])
    });

    // View State
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    
    // Batch Selection State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const isCompact = layoutDensity === 'compact';

    // --- Filter Logic ---
    const filteredData = useMemo(() => {
        let data = [...library];
        
        // 1. Predicate: String? status (Publication Status)
        if (filters.status) {
            data = data.filter(m => m.publicationStatus === filters.status);
        }

        // 2. Predicate: bool? showR18
        if (!filters.showR18) {
            data = data.filter(m => !m.tags.general.includes('R18'));
        }

        // 3. Predicate: int? minChapters
        if (filters.minChapters !== null && filters.minChapters > 0) {
            data = data.filter(m => (m.chapters?.length || 0) >= (filters.minChapters as number));
        }

        // 4. Predicate: Set<String> formats
        if (filters.formats.size > 0) {
            data = data.filter(m => filters.formats.has(m.format));
        } else {
             data = [];
        }

        // 5. Search
        if (searchQuery) data = data.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

        // 6. Sort
        return data.sort((a, b) => { 
            for (const rule of sortRules) { 
                const dir = rule.direction === 'asc' ? 1 : -1; 
                let valA: any = a[rule.field];
                let valB: any = b[rule.field]; 
                
                if (rule.field === 'dateAdded') { valA = valA || '0'; valB = valB || '0'; } 
                if (rule.field === 'title') { valA = (valA || '').toLowerCase(); valB = (valB || '').toLowerCase(); } 
                if (rule.field === 'rating') { valA = valA || 0; valB = valB || 0; }

                if (valA < valB) return -1 * dir; 
                if (valA > valB) return 1 * dir; 
            } 
            return 0; 
        });
    }, [searchQuery, sortRules, library, filters]);
    
    const updateSortRule = (index: number, key: keyof SortRule, value: string) => { 
        const newRules = [...sortRules]; 
        newRules[index] = { ...newRules[index], [key]: value }; 
        setSortRules(newRules); 
    };

    // Filter Helpers
    const toggleFormat = (fmt: string) => {
        const next = new Set(filters.formats);
        if (next.has(fmt)) next.delete(fmt); else next.add(fmt);
        setFilters({...filters, formats: next});
    };

    // Count how many "Advanced" filters are active (excluding the main Status tab)
    // Assuming 4 formats are default active, so if < 4, it's filtered
    const activeAdvancedFilterCount = (filters.minChapters ? 1 : 0) + 
                              (filters.showR18 !== isR18Mode ? 1 : 0) + 
                              (filters.formats.size < 4 ? 1 : 0);

    // Batch Action Handlers
    const handleToggleSelect = (manga: MangaData) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(manga.id)) newSelected.delete(manga.id); else newSelected.add(manga.id);
        setSelectedIds(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === filteredData.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredData.map(m => m.id)));
    };

    const handleBatchAction = (action: 'delete' | 'read' | 'add' | 'merge') => {
        if (selectedIds.size === 0) return;
        if (action === 'merge') {
            if (selectedIds.size < 2) { alert("请至少选择 2 项进行合并。"); return; }
            const itemsToMerge = library.filter(m => selectedIds.has(m.id));
            onMergeRequest(itemsToMerge);
            setIsSelectionMode(false);
            setSelectedIds(new Set());
            return;
        }
        setIsSelectionMode(false);
        setSelectedIds(new Set());
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds(new Set());
    };

    return (
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col relative">
        
        {/* --- STICKY HEADER --- */}
        <header className="sticky top-0 z-30 bg-surface-alt/95 backdrop-blur-xl border-b border-border-subtle -mt-4 md:-mt-6 lg:-mt-8 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-4 mb-4 transition-all duration-300">
           
           {/* Top Row: Title & Basic Info */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <LibraryIcon className="w-6 h-6" />
                   </div>
                   <div>
                       <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">我的书库</h1>
                       <div className="flex items-center gap-2 mt-1">
                           <span className="text-xs text-gray-500 font-medium">{library.length} 本漫画</span>
                           <span className="text-xs text-gray-300">•</span>
                           <span className="text-xs text-gray-500 font-medium">上次更新: 今天 10:23</span>
                       </div>
                   </div>
               </div>
               
               {/* Search Bar - Integrated */}
               {!isSelectionMode && (
                   <div className="relative group w-full md:w-72">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="搜索漫画、作者或标签..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none placeholder:text-gray-400 font-medium" 
                        />
                   </div>
               )}
           </div>

           {/* Bottom Row: Controls Toolbar */}
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Quick Filter Tabs (Status) - Only show in normal mode */}
                {!isSelectionMode ? (
                    <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-full border border-gray-200/50 overflow-x-auto no-scrollbar max-w-full">
                        <QuickFilterTab 
                            label="全部" 
                            count={library.length}
                            isActive={filters.status === null} 
                            onClick={() => setFilters({...filters, status: null})} 
                        />
                        <QuickFilterTab 
                            label="连载中" 
                            count={library.filter(m => m.publicationStatus === '连载中').length}
                            isActive={filters.status === '连载中'} 
                            onClick={() => setFilters({...filters, status: '连载中'})} 
                        />
                         <QuickFilterTab 
                            label="已完结" 
                            count={library.filter(m => m.publicationStatus === '已完结').length}
                            isActive={filters.status === '已完结'} 
                            onClick={() => setFilters({...filters, status: '已完结'})} 
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-primary font-medium px-2 h-9">
                        <CheckSquare className="w-5 h-5" />
                        <span>批量操作模式</span>
                    </div>
                )}

                {/* Right Side Tools */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    
                    {/* Select Mode Toggle */}
                    <button 
                        onClick={toggleSelectionMode}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${isSelectionMode ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                        {isSelectionMode ? '取消选择' : '批量选择'}
                    </button>

                    {!isSelectionMode && (
                        <>
                            <div className="w-px h-5 bg-gray-200 mx-1" />

                            <button onClick={onRefresh} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors" title="刷新">
                                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                            
                            {/* Filter Button */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setIsFilterMenuOpen(!isFilterMenuOpen); setIsSortMenuOpen(false); }}
                                    className={`p-2 rounded-lg transition-all relative border ${isFilterMenuOpen || activeAdvancedFilterCount > 0 ? 'bg-primary/5 text-primary border-primary/20' : 'border-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} 
                                    title="高级筛选"
                                >
                                    <Filter className="w-4 h-4" />
                                    {activeAdvancedFilterCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-white" />}
                                </button>

                                {/* Advanced Filter Menu */}
                                {isFilterMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsFilterMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-flyout border border-border-subtle p-5 z-50 animate-in fade-in zoom-in-95 origin-top-right cursor-default">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-gray-900">高级筛选</h3>
                                                <button onClick={() => setIsFilterMenuOpen(false)}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Note: Status is now handled by tabs, removed from here */}

                                                {/* R18 Switch */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldAlert className={`w-4 h-4 ${filters.showR18 ? 'text-red-500' : 'text-gray-400'}`} />
                                                        <span className="text-sm font-medium text-gray-700">显示 R18 内容</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => setFilters({...filters, showR18: !filters.showR18})}
                                                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 border ${filters.showR18 ? 'bg-red-500 border-red-500' : 'bg-gray-200 border-gray-300'}`}
                                                    >
                                                        <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${filters.showR18 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                    </button>
                                                </div>

                                                {/* Min Chapters */}
                                                <div className="space-y-2">
                                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                        <Hash className="w-3 h-3" /> 章节数量
                                                    </div>
                                                    <NumberInput 
                                                        label="最少章节" 
                                                        value={filters.minChapters} 
                                                        onChange={(v) => setFilters({...filters, minChapters: v})} 
                                                    />
                                                </div>

                                                {/* Format Filter (Checkbox + Text List) */}
                                                <div className="space-y-2">
                                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">文件格式</div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <FormatCheckbox label="CBZ / CBR" checked={filters.formats.has('CBZ')} onChange={() => toggleFormat('CBZ')} />
                                                        <FormatCheckbox label="ZIP 压缩包" checked={filters.formats.has('ZIP')} onChange={() => toggleFormat('ZIP')} />
                                                        <FormatCheckbox label="PDF 文档" checked={filters.formats.has('PDF')} onChange={() => toggleFormat('PDF')} />
                                                        <FormatCheckbox label="文件夹" checked={filters.formats.has('FOLDER')} onChange={() => toggleFormat('FOLDER')} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                                <span className="text-xs text-gray-400">{filteredData.length} 个结果</span>
                                                <button 
                                                    onClick={() => { 
                                                        setFilters({ status: null, showR18: isR18Mode, minChapters: null, formats: new Set(['CBZ', 'ZIP', 'PDF', 'FOLDER']) }); 
                                                    }}
                                                    className="text-xs font-medium text-primary hover:text-primary-hover disabled:opacity-50"
                                                >
                                                    重置所有
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Sort Button */}
                            <div className="relative">
                                 <button 
                                    onClick={() => { setIsSortMenuOpen(!isSortMenuOpen); setIsFilterMenuOpen(false); }} 
                                    className={`p-2 rounded-lg transition-all border ${isSortMenuOpen ? 'bg-primary/5 text-primary border-primary/20' : 'border-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} 
                                    title="排序"
                                 >
                                    <ArrowDownWideNarrow className="w-4 h-4" />
                                 </button>
                                 
                                 {/* Sort Menu */}
                                 {isSortMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-flyout border border-border-subtle p-5 z-50 animate-in fade-in zoom-in-95 origin-top-right cursor-default">
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpDown className="w-4 h-4 text-primary" />
                                                    <h3 className="text-sm font-semibold text-gray-900">排序与视图</h3>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => { setSortRules([{ field: 'dateAdded', direction: 'desc' }, { field: 'title', direction: 'asc' }]); setIsSortMenuOpen(false); }}
                                                    className="text-xs font-medium text-gray-400 hover:text-primary transition-colors bg-gray-50 px-2 py-1 rounded-md"
                                                >
                                                    重置
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                <SortSection 
                                                    title="主要规则" 
                                                    rule={sortRules[0]} 
                                                    onFieldChange={(f) => updateSortRule(0, 'field', f)}
                                                    onDirectionChange={() => updateSortRule(0, 'direction', sortRules[0].direction === 'asc' ? 'desc' : 'asc')}
                                                />
                                                
                                                <div className="h-px bg-gray-100 -mx-2" />

                                                <SortSection 
                                                    title="次要规则" 
                                                    rule={sortRules[1]} 
                                                    onFieldChange={(f) => updateSortRule(1, 'field', f)}
                                                    onDirectionChange={() => updateSortRule(1, 'direction', sortRules[1].direction === 'asc' ? 'desc' : 'asc')}
                                                />
                                            </div>
                                        </div>
                                    </>
                                 )}
                            </div>

                            <div className="w-px h-5 bg-gray-200 mx-1" />
                            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="网格视图">
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="列表视图">
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}
               </div>
           </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 pb-24 md:pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <div className={viewMode === 'grid' ? `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${isCompact ? 'gap-2' : 'gap-4'}` : "flex flex-col gap-2"}>
                {filteredData.map((manga) => (
                    <MangaGridItem 
                        key={manga.id} 
                        manga={manga} 
                        onClick={onMangaClick} 
                        onStartReading={onStartReading} 
                        onContextMenu={onContextMenu} 
                        viewMode={viewMode}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedIds.has(manga.id)}
                        onToggleSelect={handleToggleSelect}
                        layoutDensity={layoutDensity}
                    />
                ))}
            </div>
            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                         <Filter className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="font-medium text-gray-500">没有找到符合条件的漫画</p>
                    <button 
                        onClick={() => { 
                            setFilters({ status: null, showR18: isR18Mode, minChapters: null, formats: new Set(['CBZ', 'ZIP', 'PDF', 'FOLDER']) }); 
                            setSearchQuery('');
                        }}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        清除所有筛选
                    </button>
                </div>
            )}
        </div>

        {/* Floating Batch Action Bar */}
        {isSelectionMode && (
             <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto md:min-w-[400px] z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-surface/95 backdrop-blur-xl border border-border-subtle rounded-xl shadow-flyout p-2 flex items-center gap-2 justify-between pl-4 pr-2">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                             <div className="bg-primary text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">{selectedIds.size}</div>
                             <span className="hidden sm:inline">已选</span>
                        </div>
                        <button onClick={handleSelectAll} className="text-xs font-medium text-primary hover:underline">
                            {selectedIds.size === filteredData.length ? '取消全选' : '全选'}
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-1"></div>
                    
                    <div className="flex items-center gap-1">
                         <button 
                            onClick={() => handleBatchAction('read')} 
                            disabled={selectedIds.size === 0}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="标记为已读"
                         >
                            <BookOpen className="w-5 h-5" />
                         </button>
                         <button 
                            onClick={() => handleBatchAction('merge')} 
                            disabled={selectedIds.size < 2}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="合并选中"
                         >
                            <Layers className="w-5 h-5" />
                         </button>
                         <div className="h-4 w-px bg-gray-200 mx-1"></div>
                         <button 
                            onClick={() => handleBatchAction('delete')} 
                            disabled={selectedIds.size === 0}
                            className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="删除"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
                         <button onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }} className="p-2 ml-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                             <X className="w-5 h-5" />
                         </button>
                    </div>
                </div>
             </div>
        )}
      </div>
    );
};