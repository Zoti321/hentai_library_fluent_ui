import React from 'react';
import { Play, Check } from 'lucide-react';
import { MangaData } from '../types';

export type ViewMode = 'grid' | 'list';

interface MangaGridItemProps {
  manga: MangaData;
  onClick: (manga: MangaData) => void;
  onStartReading: (manga: MangaData) => void;
  onContextMenu: (e: React.MouseEvent, manga: MangaData) => void;
  viewMode: ViewMode;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (manga: MangaData) => void;
}

export const MangaGridItem: React.FC<MangaGridItemProps> = ({ manga, onClick, onStartReading, onContextMenu, viewMode, isSelectionMode, isSelected, onToggleSelect }) => {
  
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