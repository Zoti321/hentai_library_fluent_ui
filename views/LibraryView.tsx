import React, { useState, useMemo } from 'react';
import { Search, RotateCw, Filter, ArrowDownWideNarrow, ArrowUp, ArrowDown, LayoutGrid, List, Import, FileCheck, Trash2, X, BookOpen, Layers } from 'lucide-react';
import { MangaData } from '../types';
import { MangaGridItem, ViewMode } from '../components/MangaGridItem';

type SortField = 'title' | 'dateAdded' | 'rating';
type SortDirection = 'asc' | 'desc';
interface SortRule { field: SortField; direction: SortDirection; }

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
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [sortRules, setSortRules] = useState<SortRule[]>([{ field: 'dateAdded', direction: 'desc' }, { field: 'title', direction: 'asc' }]);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    
    // Batch Selection State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredData = useMemo(() => {
        let data = isR18Mode ? [...library] : library.filter(manga => !manga.tags.general.includes('R18'));
        if (searchQuery) data = data.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return data.sort((a, b) => { for (const rule of sortRules) { const dir = rule.direction === 'asc' ? 1 : -1; let valA: any = a[rule.field], valB: any = b[rule.field]; if (rule.field === 'dateAdded') { valA = valA || '0'; valB = valB || '0'; } if (rule.field === 'title') { valA = (valA || '').toLowerCase(); valB = (valB || '').toLowerCase(); } if (valA < valB) return -1 * dir; if (valA > valB) return 1 * dir; } return 0; });
    }, [searchQuery, isR18Mode, sortRules, library]);
    
    const updateSortRule = (index: number, key: keyof SortRule, value: string) => { const newRules = [...sortRules]; newRules[index] = { ...newRules[index], [key]: value }; setSortRules(newRules); };

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
                alert("Please select at least 2 items to merge.");
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
            if(confirm(`Are you sure you want to delete ${count} items?`)) {
                alert(`Simulating deletion of ${count} items.`);
                setIsSelectionMode(false);
                setSelectedIds(new Set());
            }
        } else if (action === 'read') {
            alert(`Marked ${count} items as read.`);
            setIsSelectionMode(false);
            setSelectedIds(new Set());
        }
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds(new Set());
    };

    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 h-full flex flex-col relative">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
           <div className="flex items-center gap-3"><h1 className="text-3xl font-semibold text-gray-900">Library</h1><span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">{filteredData.length} items</span></div>
           <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-border-subtle shadow-sm z-30">
                {!isSelectionMode && (
                    <div className="relative group"><div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Search className="w-4 h-4" /></div><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 pl-9 pr-3 py-1.5 text-sm bg-transparent border-none outline-none text-gray-900 placeholder-gray-400" /></div>
                )}
                {!isSelectionMode && <div className="w-px h-5 bg-gray-200 mx-1" />}
                
                <button 
                    onClick={toggleSelectionMode}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isSelectionMode ? 'bg-primary text-white shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    {isSelectionMode ? 'Cancel' : 'Select'}
                </button>

                {!isSelectionMode && (
                    <>
                        <button onClick={onRefresh} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors" title="Refresh"><RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button><button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900" title="Filter"><Filter className="w-4 h-4" /></button>
                        <div className="relative"><button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className={`p-1.5 rounded transition-all ${isSortMenuOpen ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`} title="Sort"><ArrowDownWideNarrow className="w-4 h-4" /></button>{isSortMenuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} /><div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-flyout border border-border-subtle p-4 z-50 animate-in fade-in zoom-in-95 origin-top-right cursor-default"><h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sort Order</h3><div className="space-y-4"><div><div className="text-xs text-gray-400 mb-1.5">Primary</div><div className="flex gap-2"><select value={sortRules[0].field} onChange={(e) => updateSortRule(0, 'field', e.target.value as SortField)} className="flex-1 text-sm bg-gray-50 border border-border-strong rounded-md px-2 py-1.5 outline-none focus:border-primary cursor-pointer hover:bg-white transition-colors"><option value="title">Title</option><option value="dateAdded">Date Added</option><option value="rating">Rating</option></select><button onClick={() => updateSortRule(0, 'direction', sortRules[0].direction === 'asc' ? 'desc' : 'asc')} className="p-1.5 bg-gray-50 border border-border-strong rounded-md text-gray-600 hover:text-primary hover:border-primary transition-colors hover:bg-white" title={sortRules[0].direction === 'asc' ? "Ascending" : "Descending"}>{sortRules[0].direction === 'asc' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>}</button></div></div><div><div className="text-xs text-gray-400 mb-1.5">Secondary</div><div className="flex gap-2"><select value={sortRules[1].field} onChange={(e) => updateSortRule(1, 'field', e.target.value as SortField)} className="flex-1 text-sm bg-gray-50 border border-border-strong rounded-md px-2 py-1.5 outline-none focus:border-primary cursor-pointer hover:bg-white transition-colors"><option value="title">Title</option><option value="dateAdded">Date Added</option><option value="rating">Rating</option></select><button onClick={() => updateSortRule(1, 'direction', sortRules[1].direction === 'asc' ? 'desc' : 'asc')} className="p-1.5 bg-gray-50 border border-border-strong rounded-md text-gray-600 hover:text-primary hover:border-primary transition-colors hover:bg-white" title={sortRules[1].direction === 'asc' ? "Ascending" : "Descending"}>{sortRules[1].direction === 'asc' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>}</button></div></div></div></div></>)}</div>
                        <div className="w-px h-5 bg-gray-200 mx-1" />
                        <div className="flex gap-1"><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:text-gray-900'}`}><LayoutGrid className="w-4 h-4" /></button><button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:text-gray-900'}`}><List className="w-4 h-4" /></button></div>
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
                             <span className="hidden sm:inline">Selected</span>
                        </div>
                        <button onClick={handleSelectAll} className="text-xs font-medium text-primary hover:underline">
                            {selectedIds.size === filteredData.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-1"></div>
                    
                    <div className="flex items-center gap-1">
                         <button 
                            onClick={() => handleBatchAction('read')} 
                            disabled={selectedIds.size === 0}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Mark as Read"
                         >
                            <BookOpen className="w-5 h-5" />
                         </button>
                         <button 
                            onClick={() => handleBatchAction('merge')} 
                            disabled={selectedIds.size < 2}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Merge Selected"
                         >
                            <Layers className="w-5 h-5" />
                         </button>
                         <div className="h-4 w-px bg-gray-200 mx-1"></div>
                         <button 
                            onClick={() => handleBatchAction('delete')} 
                            disabled={selectedIds.size === 0}
                            className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Delete"
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