import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MangaData } from '../../types';

export const MergeModal: React.FC<{
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
                        <h3 className="font-semibold text-lg text-gray-900">合并资源</h3>
                        <p className="text-xs text-gray-500">选择主条目。其他将被合并为章节。</p>
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
                                <div className="text-xs text-gray-500">{item.chapters?.length || 0} 章</div>
                            </div>
                            {targetId === item.id && <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">主条目</span>}
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-border-subtle flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">取消</button>
                    <button onClick={() => onConfirm(targetId)} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm">合并 {items.length} 项</button>
                </div>
             </div>
        </div>
    );
};