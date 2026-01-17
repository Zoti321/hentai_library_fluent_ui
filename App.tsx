import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MangaCard } from './components/MangaCard';
import { ChapterList } from './components/ChapterList';
import { Navigation } from './components/Navigation';
import { Reader } from './components/Reader';
import { SettingsPage } from './components/SettingsPage';
import { MangaData, Chapter, MangaTags } from './types';
import { libraryData } from './mockData';
import { Play, Plus, Search, X, Folder, FileText, LayoutGrid, List, Clock, Filter, ArrowDownWideNarrow, Home as HomeIcon, ChevronRight, BookOpen, Trash2, Edit, ArrowUp, ArrowDown, RotateCw, Sparkles, Loader2, CheckCircle2, Circle, CheckSquare, Square, MoreHorizontal, Check, ShieldAlert, Lock, PenTool, Users, Tag, Library, Import, FileCheck, Layers, FilePlus, Info, ExternalLink } from 'lucide-react';

type ViewState = 'home' | 'library' | 'detail' | 'reader' | 'settings' | 'browse' | 'read';
type ViewMode = 'grid' | 'list';
type Theme = 'fluent' | 'pink';
type SortField = 'title' | 'dateAdded' | 'rating';
type SortDirection = 'asc' | 'desc';
interface SortRule { field: SortField; direction: SortDirection; }

const MangaGridItem: React.FC<{ 
  manga: MangaData; 
  onClick: (manga: MangaData) => void; 
  onStartReading: (manga: MangaData) => void; 
  onContextMenu: (e: React.MouseEvent, manga: MangaData) => void; 
  viewMode: ViewMode;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (manga: MangaData) => void;
}> = ({ manga, onClick, onStartReading, onContextMenu, viewMode, isSelectionMode, isSelected, onToggleSelect }) => {
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect(manga);
    } else {
      onClick(manga);
    }
  };

  if (viewMode === 'list') {
    return (
      <div onClick={handleClick} onContextMenu={(e) => onContextMenu(e, manga)} className={`group cursor-default flex items-center gap-4 bg-white p-2 pr-4 rounded-lg border transition-all select-none ${isSelected ? 'border-primary bg-primary/5' : 'border-border-subtle hover:bg-surface-alt'}`}>
        {isSelectionMode && (
          <div className="pl-2">
             <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-gray-400 bg-white'}`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
             </div>
          </div>
        )}
        <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-gray-200"><img src={manga.coverUrl} alt={manga.title} className="w-full h-full object-cover" /></div>
        <div className="flex-1 min-w-0"><h3 className="font-semibold text-gray-900 text-sm truncate">{manga.title}</h3><div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5"><span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-medium">{manga.format}</span><span>{manga.fileSize}</span></div></div>
        {manga.status === 'Reading' && <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Reading</div>}
      </div>
    );
  }
  return (
    <div onClick={handleClick} onContextMenu={(e) => onContextMenu(e, manga)} className={`group cursor-default flex flex-col gap-3 p-3 rounded-xl transition-all duration-200 select-none ${isSelected ? 'bg-primary/10 ring-2 ring-primary ring-inset' : 'hover:bg-white hover:shadow-fluent'}`}>
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-gray-100 shadow-sm">
        <img src={manga.coverUrl} alt={manga.title} className={`w-full h-full object-cover transition-transform duration-500 ${isSelectionMode ? 'scale-100' : 'group-hover:scale-105'}`} />
        
        {isSelectionMode ? (
           <div className="absolute inset-0 bg-black/10 flex items-start justify-end p-2">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${isSelected ? 'bg-primary border-primary scale-110' : 'bg-white/80 border-gray-400 hover:scale-110'}`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </div>
           </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button onClick={(e) => { e.stopPropagation(); onStartReading(manga); }} className="bg-white/90 text-gray-900 p-3 rounded-full shadow-lg hover:scale-110 transition-transform backdrop-blur-sm"><Play className="w-5 h-5 fill-current" /></button></div>
            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] text-white font-medium border border-white/10">{manga.format}</div>
          </>
        )}
      </div>
      <div>
        <h3 className={`font-semibold text-sm leading-tight line-clamp-2 transition-colors ${isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>{manga.title}</h3>
        <div className="flex items-center justify-between mt-1.5"><span className={`text-xs ${isSelected ? 'text-primary/80' : 'text-gray-500'}`}>{manga.chapters?.length || 0} Ch</span>{manga.status && <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${manga.status === 'Reading' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>{manga.status}</span>}</div>
      </div>
    </div>
  );
};

// ... (TagEditorField, EditMetadataModal components remain same)
const TagEditorField = ({ label, tags, onAdd, onRemove, icon: Icon }: { label: string, tags: string[], onAdd: (t: string) => void, onRemove: (t: string) => void, icon?: React.ElementType }) => {
    const [input, setInput] = useState('');
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                {Icon && <Icon className="w-3.5 h-3.5" />} {label}
            </div>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50/50 rounded-lg border border-border-subtle focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all min-h-[48px]">
                {tags.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-sm animate-in zoom-in-95 duration-200">
                        {tag}
                        <button onClick={() => onRemove(tag)} className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                ))}
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter' && input.trim()) { e.preventDefault(); onAdd(input.trim()); setInput(''); } }}
                    placeholder="Add tag..."
                    className="bg-transparent border-none outline-none text-sm min-w-[100px] flex-1 text-gray-900 placeholder:text-gray-400 py-1"
                />
            </div>
        </div>
    );
};

const EditMetadataModal: React.FC<{ isOpen: boolean; onClose: () => void; manga: MangaData | null; }> = ({ isOpen, onClose, manga }) => {
  const [formData, setFormData] = useState<MangaData | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'tags'>('details');
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    if (isOpen && manga) {
      setFormData(JSON.parse(JSON.stringify(manga)));
    }
  }, [isOpen, manga]);

  if (!isOpen || !formData) return null;

  const isR18 = formData.tags.general.includes('R18');

  const handleSave = () => {
    // In a real app, this would update the global state/backend
    console.log("Saving metadata:", formData);
    onClose();
  };

  const toggleR18 = () => {
    const newTags = new Set(formData.tags.general);
    if (isR18) newTags.delete('R18');
    else newTags.add('R18');
    setFormData({ ...formData, tags: { ...formData.tags, general: Array.from(newTags) } });
  };

  const handleTagAdd = (category: keyof MangaTags, tag: string) => {
    if (!tag) return;
    const current = formData.tags[category] || [];
    if (!current.includes(tag)) {
        setFormData({ ...formData, tags: { ...formData.tags, [category]: [...current, tag] } });
    }
  };

  const handleTagRemove = (category: keyof MangaTags, tag: string) => {
    const current = formData.tags[category] || [];
    setFormData({ ...formData, tags: { ...formData.tags, [category]: current.filter(t => t !== tag) } });
  };
  
  const handleAIGenerate = async () => {
      setIsGenerating(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `Write a compelling, professional, and concise synopsis (max 100 words) for the manga series "${formData.title}". Context: "${formData.description || ''}". Tags: ${formData.tags.general.join(', ')}.`,
          });
          if (response.text) setFormData({...formData, description: response.text});
      } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-flyout border border-border-subtle overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-lg text-gray-900">Edit Metadata</h3>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-border-subtle px-6 gap-6 bg-white">
                <button onClick={() => setActiveTab('details')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>General Details</button>
                <button onClick={() => setActiveTab('tags')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tags' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Tags & Classification</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
                {activeTab === 'details' ? (
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Series Title</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-medium" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Date Added</label>
                                <input type="date" value={formData.dateAdded} onChange={e => setFormData({...formData, dateAdded: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-700" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Content Rating</label>
                                <div onClick={toggleR18} className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-all ${isR18 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-border-strong'}`}>
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${isR18 ? 'bg-red-500' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${isR18 ? 'translate-x-4.5 left-[1px]' : 'translate-x-0.5'}`} style={{ left: isR18 ? 'auto' : '2px', right: isR18 ? '2px' : 'auto' }}/>
                                    </div>
                                    <span className={`text-sm font-medium ${isR18 ? 'text-red-700' : 'text-gray-600'}`}>{isR18 ? 'R18 / Adult' : 'Safe / General'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                             <div className="flex justify-between items-end">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Synopsis</label>
                                <button onClick={handleAIGenerate} disabled={isGenerating} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover disabled:opacity-50 transition-colors bg-primary/5 px-2 py-1 rounded-md">
                                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI Enhance
                                </button>
                             </div>
                             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={6} className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm leading-relaxed resize-none" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <TagEditorField label="Authors" tags={formData.tags.authors} onAdd={t => handleTagAdd('authors', t)} onRemove={t => handleTagRemove('authors', t)} icon={PenTool} />
                        <TagEditorField label="Characters" tags={formData.tags.characters} onAdd={t => handleTagAdd('characters', t)} onRemove={t => handleTagRemove('characters', t)} icon={Users} />
                        <TagEditorField label="Series / Group" tags={formData.tags.series} onAdd={t => handleTagAdd('series', t)} onRemove={t => handleTagRemove('series', t)} icon={Library} />
                        <TagEditorField label="General Tags" tags={formData.tags.general} onAdd={t => handleTagAdd('general', t)} onRemove={t => handleTagRemove('general', t)} icon={Tag} />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-border-subtle flex justify-end gap-3">
                <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium border border-border-strong bg-white hover:bg-gray-50 text-gray-700 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors">Save Changes</button>
            </div>
        </div>
    </div>
  );
};

const MenuItem: React.FC<{ 
    icon: React.ElementType; 
    label: string; 
    shortcut?: string; 
    onClick: () => void;
    variant?: 'default' | 'destructive';
}> = ({ icon: Icon, label, shortcut, onClick, variant = 'default' }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] transition-colors group
            ${variant === 'destructive' 
                ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                : 'text-gray-700 hover:bg-black/5 hover:text-gray-900'
            }
        `}
    >
        <div className="flex items-center gap-2.5">
            <Icon className={`w-4 h-4 ${variant === 'destructive' ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-700'}`} />
            <span className="font-medium">{label}</span>
        </div>
        {shortcut && <span className="text-xs text-gray-400 font-sans">{shortcut}</span>}
    </button>
);

const MenuDivider: React.FC = () => <div className="h-px bg-gray-100 my-1 mx-1" />;

const ContextMenu: React.FC<{ x: number; y: number; manga: MangaData | null; onClose: () => void; onAction: (action: string) => void; }> = ({ x, y, manga, onClose, onAction }) => {
  if (!manga) return null;
  const style: React.CSSProperties = { top: Math.min(y, window.innerHeight - 260), left: Math.min(x, window.innerWidth - 220) };
  
  return (
    <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }}>
        <div style={style} className="absolute w-56 bg-white border border-border-subtle shadow-flyout rounded-xl p-1.5 animate-in fade-in zoom-in-95 duration-100 flex flex-col ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="px-3 py-2 mb-1 border-b border-gray-100 pb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider line-clamp-1">{manga.title}</div>
            </div>

            {/* Primary Actions */}
            <MenuItem icon={BookOpen} label="Read" onClick={() => onAction('read')} shortcut="Enter" />
            <MenuItem icon={Info} label="View Details" onClick={() => onAction('detail')} />
            
            <MenuDivider />
            
            {/* Management */}
            <MenuItem icon={Edit} label="Edit Metadata" onClick={() => onAction('edit')} />
            <MenuItem icon={Layers} label="Merge" onClick={() => onAction('merge')} />
            
            <MenuDivider />

            <MenuItem icon={ExternalLink} label="Open in Folder" onClick={() => onAction('open_folder')} />
            
            <MenuDivider />
            
            {/* Destructive */}
            <MenuItem icon={Trash2} label="Delete" variant="destructive" onClick={() => onAction('delete')} shortcut="Del" />
        </div>
    </div>
  );
};

// ... (FileSystemView, MergeModal, AddChapterSourceModal remain same)
const FileSystemView: React.FC = () => {
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

// ... (MergeModal, AddChapterSourceModal remain same)
const MergeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    items: MangaData[];
    onConfirm: (targetId: string) => void;
}> = ({ isOpen, onClose, items, onConfirm }) => {
    const [targetId, setTargetId] = useState<string>(items[0]?.id || '');

    useEffect(() => { if (items.length > 0 && !items.find(i => i.id === targetId)) setTargetId(items[0].id); }, [items, targetId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
             <div className="relative w-full max-w-lg bg-white rounded-xl shadow-flyout border border-border-subtle overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
                <div className="px-6 py-4 border-b border-border-subtle bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">Merge Resources</h3>
                        <p className="text-xs text-gray-500">Select the main entry. Others will become chapters.</p>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                    {items.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setTargetId(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${targetId === item.id ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-white border-border-subtle hover:bg-gray-50'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${targetId === item.id ? 'border-primary' : 'border-gray-400'}`}>
                                {targetId === item.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            <img src={item.coverUrl} className="w-8 h-12 object-cover rounded bg-gray-200" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                                <div className="text-xs text-gray-500">{item.chapters?.length || 0} chapters</div>
                            </div>
                            {targetId === item.id && <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">Main</span>}
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-border-subtle flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={() => onConfirm(targetId)} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm">Merge {items.length} Items</button>
                </div>
             </div>
        </div>
    );
};

const AddChapterSourceModal: React.FC<{
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedManga, setSelectedManga] = useState<MangaData | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isR18Mode, setIsR18Mode] = useState(false);
  const [theme, setTheme] = useState<Theme>('fluent'); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, manga: MangaData} | null>(null);

  // New State for Library Logic
  const [library, setLibrary] = useState<MangaData[]>(libraryData);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [mergeCandidates, setMergeCandidates] = useState<MangaData[]>([]);

  useEffect(() => { if (theme === 'pink') document.body.classList.add('theme-pink'); else document.body.classList.remove('theme-pink'); }, [theme]);
  useEffect(() => { if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [isDarkMode]);

  const filteredLibraryData = useMemo(() => isR18Mode ? library : library.filter(manga => !manga.tags.general.includes('R18')), [isR18Mode, library]);
  const handleMangaClick = (manga: MangaData) => { setSelectedManga(manga); setCurrentView('detail'); document.querySelector('main')?.scrollTo(0,0); };
  const handleTabChange = (tab: string) => { setActiveTab(tab); if (['settings', 'home', 'library', 'browse', 'read'].includes(tab)) { setCurrentView(tab as ViewState); setSelectedManga(null); } else { setCurrentView('home'); } document.querySelector('main')?.scrollTo(0,0); };
  const handleStartReading = (manga: MangaData) => { const chapterToRead = manga.chapters?.[0] || null; if (chapterToRead) { setSelectedManga(manga); setCurrentChapter(chapterToRead); setCurrentView('reader'); } };
  const handleBackToLibrary = () => { setCurrentView('library'); setActiveTab('library'); setSelectedManga(null); };
  const handleContextMenu = (e: React.MouseEvent, manga: MangaData) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, manga }); };
  const handleContextAction = (action: string) => { 
      if (!contextMenu) return; 
      const manga = contextMenu.manga; 
      setContextMenu(null); 
      switch(action) { 
          case 'read': handleStartReading(manga); break; 
          case 'edit': setSelectedManga(manga); setIsEditModalOpen(true); break; 
          case 'detail': handleMangaClick(manga); break;
          case 'delete': if(confirm(`Delete "${manga.title}"?`)) console.log("Deleted", manga.id); break; 
          case 'merge': 
             // Normally this would require a multi-select state to target, but for single item context menu
             // we can perhaps open the Add Chapter modal directly for this item
             setSelectedManga(manga);
             setIsAddChapterModalOpen(true);
             break;
      } 
  };
  const handleRefresh = () => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 800); };

  // Logic: Merge Functionality
  const performMerge = (targetId: string, sourceIds: string[]) => {
      const target = library.find(m => m.id === targetId);
      const sources = library.filter(m => sourceIds.includes(m.id));

      if (!target || sources.length === 0) return;

      const newChapters: Chapter[] = sources.map((source, index) => ({
          id: source.id, // Use original Manga ID as Chapter ID
          number: (target.chapters?.length || 0) + index + 1,
          title: source.title,
          date: new Date().toISOString().split('T')[0],
          read: false,
          size: source.fileSize
      }));

      const updatedTarget = {
          ...target,
          chapters: [...(target.chapters || []), ...newChapters]
      };

      // Remove sources and update target in library
      const updatedLibrary = library.filter(m => !sourceIds.includes(m.id) && m.id !== targetId).concat(updatedTarget);
      setLibrary(updatedLibrary);
      
      // Update Selection if open
      if (selectedManga && selectedManga.id === targetId) setSelectedManga(updatedTarget);
  };

  const handleMergeConfirm = (targetId: string) => {
      const sourceIds = mergeCandidates.map(m => m.id).filter(id => id !== targetId);
      performMerge(targetId, sourceIds);
      setIsMergeModalOpen(false);
  };

  const handleAddChapterConfirm = (sourceIds: string[]) => {
      if (!selectedManga) return;
      performMerge(selectedManga.id, sourceIds);
      setIsAddChapterModalOpen(false);
  };

  const HomeView = () => {
    const continueReadingList = filteredLibraryData.filter(m => m.status === 'Reading').slice(0, 4);
    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
        <header className="mb-8 flex items-end justify-between"><div><h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Home</h1><p className="text-gray-500 text-sm mt-1">Good afternoon, Reader</p></div><div className="flex gap-2"><button onClick={handleRefresh} className="p-2 bg-white text-gray-600 border border-border-subtle rounded-md hover:bg-gray-50 hover:text-primary transition-all shadow-sm active:scale-95" title="Refresh"><RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button><button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-hover shadow-sm transition-all active:scale-95"><Plus className="w-4 h-4" /><span>Scan Library</span></button></div></header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-fluent flex flex-col justify-between h-40"><div className="flex items-start justify-between"><div><div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Collection</div><div className="text-3xl font-semibold text-gray-900 mt-1">{filteredLibraryData.length}</div></div><div className="p-2 bg-primary/10 text-primary rounded-md"><FileText className="w-5 h-5" /></div></div><div className="text-xs text-gray-500"><span className="text-green-600 font-medium">+3 new</span> this week</div></div>
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-primary-hover text-white p-6 rounded-xl shadow-fluent relative overflow-hidden h-40 flex items-center"><div className="relative z-10 w-full"><div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Featured Pick</div><h3 className="text-2xl font-semibold mb-1">Discover Something New</h3><p className="text-white/70 text-sm mb-0">Explore the latest fantasy additions to your library.</p></div><div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12" /></div>
        </div>
        {continueReadingList.length > 0 && (<section className="mb-10"><div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-lg text-gray-900">Continue Reading</h2><button className="text-sm text-primary hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3"/></button></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{continueReadingList.map(manga => (<div key={manga.id} className="bg-white p-3 rounded-xl border border-border-subtle shadow-sm hover:shadow-fluent transition-all cursor-default group flex items-center gap-3" onClick={() => handleMangaClick(manga)} onContextMenu={(e) => handleContextMenu(e, manga)}><div className="w-12 h-16 shrink-0 rounded-md overflow-hidden bg-gray-200"><img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div><div className="flex-1 min-w-0"><h3 className="font-semibold text-sm text-gray-900 truncate">{manga.title}</h3><div className="text-xs text-gray-500 mt-1">Chapter 5</div><div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary w-[65%]" /></div></div></div>))}</div></section>)}
        <section><h2 className="font-semibold text-lg text-gray-900 mb-4">Recently Added</h2><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">{filteredLibraryData.slice(0, 6).map(manga => (<MangaGridItem key={manga.id} manga={manga} onClick={handleMangaClick} onStartReading={handleStartReading} onContextMenu={handleContextMenu} viewMode="grid" />))}</div></section>
      </div>
    );
  };

  const LibraryView = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [sortRules, setSortRules] = useState<SortRule[]>([{ field: 'dateAdded', direction: 'desc' }, { field: 'title', direction: 'asc' }]);
    
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
            setMergeCandidates(itemsToMerge);
            setIsMergeModalOpen(true);
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
           <div className="flex items-center gap-3"><h1 className="text-3xl font-semibold text-gray-900">Library</h1><span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">{filteredLibraryData.length} items</span></div>
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
                        <button onClick={handleRefresh} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors" title="Refresh"><RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button><button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900" title="Filter"><Filter className="w-4 h-4" /></button>
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
                        onClick={handleMangaClick} 
                        onStartReading={handleStartReading} 
                        onContextMenu={handleContextMenu} 
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

  const HistoryView = () => (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500"><h1 className="text-2xl font-semibold text-gray-900 mb-6">History</h1><div className="space-y-6"><div className="space-y-2"><h3 className="text-sm font-semibold text-gray-500">Today</h3>{filteredLibraryData.slice(0, 2).map(manga => (<div key={manga.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-border-subtle shadow-sm"><img src={manga.coverUrl} className="w-10 h-14 object-cover rounded" /><div><div className="text-sm font-semibold">{manga.title}</div><div className="text-xs text-gray-500">Chapter 12 • 2:30 PM</div></div></div>))}</div></div></div>
  );

  const DetailView = () => (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">{selectedManga && (<><MangaCard data={selectedManga} onBack={handleBackToLibrary} onStartReading={() => handleStartReading(selectedManga)} onEdit={() => setIsEditModalOpen(true)} onAddChapter={() => setIsAddChapterModalOpen(true)} /><ChapterList chapters={selectedManga.chapters} onChapterSelect={(ch) => { setCurrentChapter(ch); setCurrentView('reader'); }} /></>)}</div>
  );

  if (currentView === 'reader' && selectedManga && currentChapter) return <Reader manga={selectedManga} chapter={currentChapter} onBack={() => { setCurrentView('detail'); setCurrentChapter(null); }} onNextChapter={() => console.log("Next")} onPrevChapter={() => console.log("Prev")} />;

  return (
    <div className="flex h-screen w-screen bg-surface-alt overflow-hidden select-none font-sans text-gray-900 transition-colors duration-300">
      <MergeModal isOpen={isMergeModalOpen} onClose={() => setIsMergeModalOpen(false)} items={mergeCandidates} onConfirm={handleMergeConfirm} />
      <AddChapterSourceModal isOpen={isAddChapterModalOpen} onClose={() => setIsAddChapterModalOpen(false)} currentManga={selectedManga} library={library} onConfirm={handleAddChapterConfirm} />
      <EditMetadataModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} manga={selectedManga} />
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} manga={contextMenu.manga} onClose={() => setContextMenu(null)} onAction={handleContextAction} />}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} isR18Mode={isR18Mode} onToggleR18={setIsR18Mode} />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative custom-scrollbar">
        <div className="p-6 md:p-8 pb-24 md:pb-10 max-w-full mx-auto h-full">
            {currentView === 'home' && <HomeView />}
            {currentView === 'library' && <LibraryView />}
            {currentView === 'browse' && <FileSystemView />}
            {currentView === 'read' && <HistoryView />}
            {currentView === 'detail' && <DetailView />}
            {currentView === 'settings' && <SettingsPage isR18Mode={isR18Mode} onToggleR18={setIsR18Mode} theme={theme} onThemeChange={setTheme} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />}
        </div>
      </main>
    </div>
  );
};

export default App;