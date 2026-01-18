import React, { useState, useMemo } from 'react';
import { Search, RotateCw, Filter, ArrowDownWideNarrow, ArrowUp, ArrowDown, LayoutGrid, List, Import, FileCheck, Trash2, X, BookOpen, Layers, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { MangaData } from '../types';
import { MangaGridItem, ViewMode } from '../components/MangaGridItem';

type SortField = 'title' | 'dateAdded' | 'rating';
type SortDirection = 'asc' | 'desc';
interface SortRule { field: SortField; direction: SortDirection; }

interface FilterState {
    status: string[];
    format: string[];
}

interface LibraryViewProps {
    library: MangaData[];
    isR18Mode: boolean;
    onMangaClick: (manga: MangaData) => void;
    onStartReading: (manga: MangaData) => void;
    onContextMenu: (e: React.MouseEvent, manga: MangaData) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    onMergeRequest: (items: MangaData[]) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ 
    library, isR18Mode, onMangaClick, onStartReading, onContextMenu, onRefresh, isRefreshing, onMergeRequest 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sort State
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [sortRules, setSortRules] = useState<SortRule[]>([{ field: 'dateAdded', direction: 'desc' }, { field: 'title', direction: 'asc' }]);
    
    // Filter State
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({ status: [], format: [] });

    // View State
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    
    // Batch Selection State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredData = useMemo(() => {
        let data = isR18Mode ? [...library] : library.filter(manga => !manga.tags.general.includes('R18'));
        
        // 1. Search
        if (searchQuery) data = data.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // 2. Filter: Status
        if (filters.status.length > 0) {
            data = data.filter(m => m.status && filters.status.includes(m.status));
        }

        // 3. Filter: Format
        if (filters.format.length > 0) {
            data = data.filter(m => filters.format.includes(m.format));
        }

        // 4. Sort
        return data.sort((a, b) => { 
            for (const rule of sortRules) { 
                const dir = rule.direction === 'asc' ? 1 : -1; 
                let valA: any = a[rule.field];
                let valB: any = b[rule.field]; 
                
                // Handle different types
                if (rule.field === 'dateAdded') { 
                    valA = valA || '0'; valB = valB || '0'; 
                } 
                if (rule.field === 'title') { 
                    valA = (valA || '').toLowerCase(); valB = (valB || '').toLowerCase(); 
                } 
                if (rule.field === 'rating') {
                    valA = valA || 0; valB = valB || 0;
                }

                if (valA < valB) return -1 * dir; 
                if (valA > valB) return 1 * dir; 
            } 
            return 0; 
        });
    }, [searchQuery, isR18Mode, sortRules, library, filters]);
    
    const updateSortRule = (index: number, key: keyof SortRule, value: string) => { 
        const newRules = [...sortRules]; 
        newRules[index] = { ...newRules[index], [key]: value }; 
        setSortRules(newRules); 
    };

    const toggleFilter = (category: keyof FilterState, value: string) => {
        setFilters(prev => {
            const current = prev[category];
            const next = current.includes(value) 
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: next };
        });
    };

    const hasActiveFilters = filters.status.length > 0 || filters.format.length > 0;

    // Batch Action Handlers
    const handleToggleSelect = (manga: MangaData) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(manga.id)) {
            newSelected.delete(manga.id);
        } else {
            newSelected.add(manga.id);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === filteredData.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredData.map(m => m.id)));
        }
    };

    const handleBatchAction = (action: 'delete' | 'read' | 'add' | 'merge') => {
        if (selectedIds.size === 0) return;
        
        if (action === 'merge') {
            if (selectedIds.size < 2) {
                alert("请至少选择 2 项进行合并。");
                return;
            }
            const itemsToMerge = library.filter(m => selectedIds.has(m.id));
            onMergeRequest(itemsToMerge);
            setIsSelectionMode(false);
            setSelectedIds(new Set());
            return;
        }

        const count = selectedIds.size;
        // In a real app, this would perform API calls
        if (action === 'delete') {
            if(confirm(`确定要删除 ${count} 项吗？`)) {
                alert(`模拟删除 ${count} 项。`);
                setIsSelectionMode(false);
                setSelectedIds(new Set());
            }
        } else if (action === 'read') {
            alert(`已将 ${count} 项标记为已读。`);
            setIsSelectionMode(false);
            setSelectedIds(new Set());
        }
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds(new Set());
    };

    const FilterCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
        <button 
            onClick={onChange}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${checked ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            {checked ? <CheckSquare className="w-4 h-4 shrink-0" /> : <Square className="w-4 h-4 shrink-0 text-gray-400" />}
            <span>{label}</span>
        </button>
    );

    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 h-full flex flex-col relative">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
           <div className="flex items-center gap-3">
               <h1 className="text-3xl font-semibold text-gray-900">书库</h1>
               <span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">{filteredData.length} 项</span>
           </div>
           
           <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-border-subtle shadow-sm z-30">
                {!isSelectionMode && (
                    <div className="relative group">
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Search className="w-4 h-4" /></div>
                        <input type="text" placeholder="搜索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 pl-9 pr-3 py-1.5 text-sm bg-transparent border-none outline-none text-gray-900 placeholder-gray-400" />
                    </div>
                )}
                {!isSelectionMode && <div className="w-px h-5 bg-gray-200 mx-1" />}
                
                <button 
                    onClick={toggleSelectionMode}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isSelectionMode ? 'bg-primary text-white shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    {isSelectionMode ? '取消' : '选择'}
                </button>

                {!isSelectionMode && (
                    <>
                        <button onClick={onRefresh} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors" title="刷新">
                            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        
                        {/* Filter Button */}
                        <div className="relative">
                            <button 
                                onClick={() => { setIsFilterMenuOpen(!isFilterMenuOpen); setIsSortMenuOpen(false); }}
                                className={`p-1.5 rounded transition-all relative ${isFilterMenuOpen || hasActiveFilters ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} 
                                title="筛选"
                            >
                                <Filter className="w-4 h-4" />
                                {hasActiveFilters && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full border border-white" />}
                            </button>

                            {/* Filter Menu */}
                            {isFilterMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterMenuOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-flyout border border-border-subtle p-4 z-50 animate-in fade-in zoom-in-95 origin-top-right cursor-default">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold text-gray-900">筛选内容</h3>
                                            <button onClick={() => setIsFilterMenuOpen(false)}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">阅读状态</div>
                                                <div className="space-y-0.5">
                                                    <FilterCheckbox label="阅读中" checked={filters.status.includes('Reading')} onChange={() => toggleFilter('status', 'Reading')} />
                                                    <FilterCheckbox label="已完成" checked={filters.status.includes('Completed')} onChange={() => toggleFilter('status', 'Completed')} />
                                                    <FilterCheckbox label="想读" checked={filters.status.includes('Plan to Read')} onChange={() => toggleFilter('status', 'Plan to Read')} />
                                                </div>
                                            </div>
                                            
                                            <div className="h-px bg-gray-100" />

                                            <div>
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">文件格式</div>
                                                <div className="space-y-0.5">
                                                    <FilterCheckbox label="CBZ / CBR" checked={filters.format.includes('CBZ')} onChange={() => toggleFilter('format', 'CBZ')} />
                                                    <FilterCheckbox label="PDF" checked={filters.format.includes('PDF')} onChange={() => toggleFilter('format', 'PDF')} />
                                                    <FilterCheckbox label="ZIP" checked={filters.format.includes('ZIP')} onChange={() => toggleFilter('format', 'ZIP')} />
                                                    <FilterCheckbox label="文件夹" checked={filters.format.includes('FOLDER')} onChange={() => toggleFilter('format', 'FOLDER')} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-xs text-gray-400">{filteredData.length} 个结果</span>
                                            <button 
                                                onClick={() => { setFilters({ status: [], format: [] }); setIsFilterMenuOpen(false); }}
                                                className="text-xs font-medium text-primary hover:text-primary-hover disabled:opacity-50"
                                                disabled={!hasActiveFilters}
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
                                className={`p-1.5 rounded transition-all ${isSortMenuOpen ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} 
                                title="排序"
                             >
                                <ArrowDownWideNarrow className="w-4 h-4" />
                             </button>
                             
                             {/* Enhanced Sort Menu */}
                             {isSortMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-flyout border border-border-subtle p-5 z-50 animate-in fade-in zoom-in-95 origin-top-right cursor-default">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold text-gray-900">排序方式</h3>
                                            <button onClick={() => setIsSortMenuOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {/* Primary Sort */}
                                            <div className="bg-gray-50/50 p-3 rounded-lg border border-border-subtle">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">主要规则</div>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <select 
                                                            value={sortRules[0].field} 
                                                            onChange={(e) => updateSortRule(0, 'field', e.target.value as SortField)} 
                                                            className="w-full appearance-none bg-white border border-border-strong rounded-md pl-3 pr-8 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none cursor-pointer transition-all hover:border-gray-400"
                                                        >
                                                            <option value="title">标题</option>
                                                            <option value="dateAdded">添加日期</option>
                                                            <option value="rating">评分</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    <button 
                                                        onClick={() => updateSortRule(0, 'direction', sortRules[0].direction === 'asc' ? 'desc' : 'asc')} 
                                                        className="flex items-center justify-center w-10 bg-white border border-border-strong rounded-md text-gray-600 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                                                        title={sortRules[0].direction === 'asc' ? "升序" : "降序"}
                                                    >
                                                        {sortRules[0].direction === 'asc' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Secondary Sort */}
                                            <div className="bg-gray-50/50 p-3 rounded-lg border border-border-subtle">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">次要规则</div>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <select 
                                                            value={sortRules[1].field} 
                                                            onChange={(e) => updateSortRule(1, 'field', e.target.value as SortField)} 
                                                            className="w-full appearance-none bg-white border border-border-strong rounded-md pl-3 pr-8 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none cursor-pointer transition-all hover:border-gray-400"
                                                        >
                                                            <option value="title">标题</option>
                                                            <option value="dateAdded">添加日期</option>
                                                            <option value="rating">评分</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    <button 
                                                        onClick={() => updateSortRule(1, 'direction', sortRules[1].direction === 'asc' ? 'desc' : 'asc')} 
                                                        className="flex items-center justify-center w-10 bg-white border border-border-strong rounded-md text-gray-600 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                                                        title={sortRules[1].direction === 'asc' ? "升序" : "降序"}
                                                    >
                                                        {sortRules[1].direction === 'asc' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                            <button 
                                                onClick={() => { setSortRules([{ field: 'dateAdded', direction: 'desc' }, { field: 'title', direction: 'asc' }]); setIsSortMenuOpen(false); }}
                                                className="text-xs text-gray-500 hover:text-primary hover:underline"
                                            >
                                                重置默认
                                            </button>
                                        </div>
                                    </div>
                                </>
                             )}
                        </div>

                        <div className="w-px h-5 bg-gray-200 mx-1" />
                        <div className="flex gap-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:text-gray-900'}`} title="网格视图">
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:text-gray-900'}`} title="列表视图">
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
           </div>
        </header>
        <div className="flex-1 pb-24 md:pb-4">
            <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4" : "flex flex-col gap-2"}>
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
                    />
                ))}
            </div>
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