import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { MangaData } from '../../types';

export const AddChapterSourceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentManga: MangaData | null;
    library: MangaData[];
    onConfirm: (selectedIds: string[]) => void;
}> = ({ isOpen, onClose, currentManga, library, onConfirm }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');

    if (!isOpen || !currentManga) return null;

    const candidates = library.filter(m => m.id !== currentManga.id && m.title.toLowerCase().includes(search.toLowerCase()));

    const toggle = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelectedIds(next);
    }

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
             <div className="relative w-full max-w-lg bg-white rounded-xl shadow-flyout border border-border-subtle overflow-hidden flex flex-col animate-in fade-in zoom-in-95 h-[600px]">
                <div className="px-6 py-4 border-b border-border-subtle bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-gray-900">Add Chapters from Library</h3>
                        <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search library..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-strong text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {candidates.map(item => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => toggle(item.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-primary/5 border-primary' : 'bg-white border-transparent hover:bg-gray-50'}`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <img src={item.coverUrl} className="w-10 h-14 object-cover rounded bg-gray-200" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                                    <div className="text-xs text-gray-500">{item.chapters?.length || 0} chapters • {item.fileSize}</div>
                                </div>
                            </div>
                        );
                    })}
                    {candidates.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No matching manga found.</div>}
                </div>
                <div className="p-4 border-t border-border-subtle flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button 
                        onClick={() => onConfirm(Array.from(selectedIds))} 
                        disabled={selectedIds.size === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm disabled:opacity-50"
                    >
                        Add {selectedIds.size} as Chapters
                    </button>
                </div>
             </div>
        </div>
    );
}