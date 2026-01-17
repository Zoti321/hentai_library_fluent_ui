import React, { useState } from 'react';
import { Home as HomeIcon, X, CheckSquare, Plus, Folder, FileText, Check, Import, FileCheck, Trash2 } from 'lucide-react';

export const FileSystemView: React.FC = () => {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    // Mock Data (flattened for easier selection logic)
    const items = [
        { id: 'folder-1', name: 'Downloads', type: 'folder', size: 'Folder' },
        { id: 'folder-2', name: 'Comics', type: 'folder', size: 'Folder' },
        { id: 'folder-3', name: 'SD Card', type: 'folder', size: 'Folder' },
        { id: 'folder-4', name: 'Archive', type: 'folder', size: 'Folder' },
        { id: 'file-1', name: 'Scan_Log_1.txt', type: 'file', size: '12 KB' },
        { id: 'file-2', name: 'Scan_Log_2.txt', type: 'file', size: '8 KB' },
        { id: 'file-3', name: 'Scan_Log_3.txt', type: 'file', size: '12 KB' },
    ];

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedItems(newSet);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === items.length) setSelectedItems(new Set());
        else setSelectedItems(new Set(items.map(i => i.id)));
    };

    const handleBatchAction = (action: string) => {
        if (selectedItems.size === 0) return;
        if (confirm(`Perform ${action} on ${selectedItems.size} items?`)) {
            // Action logic here
            setIsSelectionMode(false);
            setSelectedItems(new Set());
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 relative h-full flex flex-col">
            <header className="mb-8 flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">File Explorer</h1>
                    <p className="text-gray-500 text-sm mt-1">Browse and import from local storage</p>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={() => { setIsSelectionMode(!isSelectionMode); setSelectedItems(new Set()); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all active:scale-95 ${isSelectionMode ? 'bg-gray-200 text-gray-900' : 'bg-white border border-border-subtle text-gray-700 hover:bg-gray-50'}`}
                     >
                        {isSelectionMode ? <X className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                        <span>{isSelectionMode ? 'Cancel' : 'Select'}</span>
                     </button>
                     <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-hover shadow-sm transition-all active:scale-95">
                        <Plus className="w-4 h-4" /><span>Add Folder</span>
                     </button>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="p-3 border-b border-border-subtle bg-gray-50 flex items-center gap-2 text-sm text-gray-600 shrink-0">
                    <HomeIcon className="w-4 h-4" /><span>/</span><span className="font-medium text-gray-900">Local Storage</span>
                </div>
                <div className="divide-y divide-gray-100 overflow-y-auto">
                    {items.map((item) => {
                        const isSelected = selectedItems.has(item.id);
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => isSelectionMode ? toggleSelection(item.id) : null}
                                className={`flex items-center gap-3 p-4 transition-colors group select-none ${isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-primary/5'} ${isSelected ? 'bg-primary/5' : ''}`}
                            >
                                {isSelectionMode && (
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-gray-400 bg-white'}`}>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                )}
                                
                                {item.type === 'folder' ? (
                                    <Folder className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />
                                ) : (
                                    <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                                )}
                                
                                <span className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>
                                    {item.name}
                                </span>
                                <span className="text-xs text-gray-400 ml-auto shrink-0">{item.size}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Batch Action Bar */}
            {isSelectionMode && (
                 <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto md:min-w-[400px] z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-surface/95 backdrop-blur-xl border border-border-subtle rounded-xl shadow-flyout p-2 flex items-center gap-2 justify-between pl-4 pr-2">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                 <div className="bg-primary text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">{selectedItems.size}</div>
                                 <span className="hidden sm:inline">Selected</span>
                            </div>
                            <button onClick={handleSelectAll} className="text-xs font-medium text-primary hover:underline">
                                {selectedItems.size === items.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-200 mx-1"></div>
                        
                        <div className="flex items-center gap-1">
                             <button 
                                onClick={() => handleBatchAction('Import')} 
                                disabled={selectedItems.size === 0}
                                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Import Selected"
                             >
                                <Import className="w-5 h-5" />
                             </button>
                             <button 
                                onClick={() => handleBatchAction('Scan')} 
                                disabled={selectedItems.size === 0}
                                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Scan for Media"
                             >
                                <FileCheck className="w-5 h-5" />
                             </button>
                             <div className="h-4 w-px bg-gray-200 mx-1"></div>
                             <button 
                                onClick={() => handleBatchAction('Delete')} 
                                disabled={selectedItems.size === 0}
                                className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Delete"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                             <button onClick={() => { setIsSelectionMode(false); setSelectedItems(new Set()); }} className="p-2 ml-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                                 <X className="w-5 h-5" />
                             </button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};