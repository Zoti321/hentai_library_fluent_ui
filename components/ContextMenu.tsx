import React from 'react';
import { BookOpen, Info, Edit, Layers, ExternalLink, Trash2 } from 'lucide-react';
import { MangaData } from '../types';

export const MenuItem: React.FC<{ 
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

export const MenuDivider: React.FC = () => <div className="h-px bg-gray-100 my-1 mx-1" />;

export const ContextMenu: React.FC<{ x: number; y: number; manga: MangaData | null; onClose: () => void; onAction: (action: string) => void; }> = ({ x, y, manga, onClose, onAction }) => {
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
            <MenuItem icon={BookOpen} label="阅读" onClick={() => onAction('read')} shortcut="Enter" />
            <MenuItem icon={Info} label="查看详情" onClick={() => onAction('detail')} />
            
            <MenuDivider />
            
            {/* Management */}
            <MenuItem icon={Edit} label="编辑元数据" onClick={() => onAction('edit')} />
            <MenuItem icon={Layers} label="合并" onClick={() => onAction('merge')} />
            
            <MenuDivider />

            <MenuItem icon={ExternalLink} label="在文件夹中打开" onClick={() => onAction('open_folder')} />
            
            <MenuDivider />
            
            {/* Destructive */}
            <MenuItem icon={Trash2} label="删除" variant="destructive" onClick={() => onAction('delete')} shortcut="Del" />
        </div>
    </div>
  );
};