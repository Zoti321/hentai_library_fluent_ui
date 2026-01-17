import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Loader2, Sparkles, PenTool, Users, Library, Tag } from 'lucide-react';
import { MangaData, MangaTags } from '../../types';

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

export const EditMetadataModal: React.FC<{ isOpen: boolean; onClose: () => void; manga: MangaData | null; }> = ({ isOpen, onClose, manga }) => {
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