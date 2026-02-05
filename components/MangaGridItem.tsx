import React from 'react';
import { Play, Check } from 'lucide-react';
import { MangaData, LayoutDensity } from '../types';

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
  layoutDensity?: LayoutDensity;
}

export const MangaGridItem: React.FC<MangaGridItemProps> = ({ manga, onClick, onStartReading, onContextMenu, viewMode, isSelectionMode, isSelected, onToggleSelect, layoutDensity = 'comfortable' }) => {
  const isCompact = layoutDensity === 'compact';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect(manga);
    } else {
      onClick(manga);
    }
  };

  const getStatusLabel = (status?: string) => {
    if (status === 'Reading') return '阅读中';
    if (status === 'Completed') return '已完成';
    if (status === 'Plan to Read') return '想读';
    return status;
  };

  // --- List View Implementation ---
  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleClick} 
        onContextMenu={(e) => onContextMenu(e, manga)} 
        className={`
            group relative flex items-center gap-4 rounded-xl border transition-all duration-200 select-none cursor-default overflow-hidden
            ${isCompact ? 'p-1.5 pr-3' : 'p-2 pr-4'}
            ${isSelected 
                ? 'bg-primary/5 border-primary shadow-sm' 
                : 'bg-white border-border-subtle hover:bg-gray-50 hover:border-gray-300'
            }
        `}
      >
        {/* Selection Checkbox (List) */}
        <div className={`
            flex items-center justify-center transition-all duration-300 ease-out
            ${isSelectionMode ? 'w-8 opacity-100 ml-1' : 'w-0 opacity-0 -ml-2 pointer-events-none'}
        `}>
             <div className={`
                rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}
                ${isSelected 
                    ? 'bg-primary border-primary scale-100' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }
             `}>
                <Check className={`text-white transition-transform duration-200 ${isCompact ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${isSelected ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
             </div>
        </div>

        <div className={`relative shrink-0 rounded-md overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow ${isCompact ? 'w-10 h-14' : 'w-12 h-16'}`}>
            <img src={manga.coverUrl} alt={manga.title} className="w-full h-full object-cover" />
             {/* Read Indicator Dot */}
             {manga.status === 'Reading' && !isSelectionMode && (
                <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-primary ring-1 ring-white" />
             )}
        </div>

        <div className="flex-1 min-w-0 py-1">
            <h3 className={`font-semibold truncate transition-colors ${isCompact ? 'text-xs' : 'text-sm'} ${isSelected ? 'text-primary' : 'text-gray-900'}`}>{manga.title}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-medium text-[10px]">{manga.format}</span>
                <span>{manga.fileSize}</span>
                {!isCompact && manga.chapters?.length ? <span>• {manga.chapters.length} 章</span> : null}
            </div>
        </div>
        
        {manga.status === 'Reading' && !isCompact && (
            <div className={`text-xs font-medium px-2 py-1 rounded transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>阅读中</div>
        )}
      </div>
    );
  }

  // --- Grid View Implementation ---
  return (
    <div 
        onClick={handleClick} 
        onContextMenu={(e) => onContextMenu(e, manga)} 
        className={`
            group relative flex flex-col rounded-2xl transition-all duration-300 ease-out select-none cursor-pointer
            ${isCompact ? 'gap-2 p-2' : 'gap-3 p-3'}
            ${isSelected 
                ? 'bg-primary/5 ring-2 ring-primary shadow-sm scale-[0.97]' 
                : 'hover:bg-white hover:shadow-fluent hover:-translate-y-1'
            }
        `}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border-subtle bg-gray-100 shadow-sm">
        {/* Cover Image */}
        <img 
            src={manga.coverUrl} 
            alt={manga.title} 
            className={`w-full h-full object-cover transition-transform duration-500 will-change-transform ${isSelectionMode ? 'scale-100' : 'group-hover:scale-105'}`} 
        />
        
        {/* Selection Mode Overlay & Checkbox */}
        {isSelectionMode ? (
           <>
              {/* Selected Overlay - Dims image slightly to make check pop */}
              <div className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
              
              <div className="absolute inset-0 p-2 transition-all duration-200">
                  <div className="w-full h-full flex justify-end items-start">
                     {/* Floating Checkbox */}
                     <div className={`
                        rounded-full border-2 flex items-center justify-center shadow-sm transition-all duration-300
                        ${isCompact ? 'w-5 h-5' : 'w-6 h-6'}
                        ${isSelected 
                            ? 'bg-primary border-primary scale-110 shadow-primary/30' 
                            : 'bg-white/40 border-white/60 backdrop-blur-md hover:bg-white hover:border-white hover:scale-110'
                        }
                     `}>
                        <Check className={`text-white transition-transform duration-200 ${isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isSelected ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
                     </div>
                  </div>
              </div>
           </>
        ) : (
          /* Normal Mode Overlays */
          <>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <button 
                    onClick={(e) => { e.stopPropagation(); onStartReading(manga); }} 
                    className="bg-white/90 text-gray-900 p-3 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
                >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
            </div>
            {!isCompact && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded-md text-[10px] text-white font-medium border border-white/10 shadow-sm">
                    {manga.format}
                </div>
            )}
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="px-1">
        <h3 className={`font-semibold leading-tight line-clamp-2 transition-colors duration-200 ${isCompact ? 'text-xs' : 'text-sm'} ${isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
            {manga.title}
        </h3>
        {!isCompact && (
            <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-medium ${isSelected ? 'text-primary/70' : 'text-gray-400'}`}>
                    {manga.chapters?.length || 0} 章
                </span>
                {manga.status && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                        manga.status === 'Reading' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                        {getStatusLabel(manga.status)}
                    </span>
                )}
            </div>
        )}
      </div>
    </div>
  );
};