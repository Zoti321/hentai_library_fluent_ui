import React from 'react';
import { ArrowLeft, Settings2, MoveVertical, Columns } from 'lucide-react';
import { MangaData, Chapter } from '../types';

interface ReaderTopBarProps {
  manga: MangaData;
  chapter: Chapter;
  isVisible: boolean;
  readMode: 'vertical' | 'horizontal';
  onBack: () => void;
  onModeChange: (mode: 'vertical' | 'horizontal') => void;
}

export const ReaderTopBar: React.FC<ReaderTopBarProps> = ({
  manga,
  chapter,
  isVisible,
  readMode,
  onBack,
  onModeChange,
}) => {
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 transition-all duration-300 z-50 pointer-events-none ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
       <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-1.5 pl-2 pr-1.5 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto max-w-[90vw]">
          
          {/* Back Button */}
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/90">
              <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Title Info */}
          <div className="flex flex-col min-w-[100px] max-w-[200px] md:max-w-[300px] text-center px-2 border-l border-white/10 border-r mx-1">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider truncate leading-tight">{manga.title}</span>
              <span className="text-xs font-semibold text-white/90 truncate leading-tight">{chapter.title}</span>
          </div>

          {/* Mode Switcher - Segmented Control */}
          <div className="flex bg-black/40 rounded-full p-1 border border-white/5">
              <button 
                  onClick={() => onModeChange('horizontal')}
                  className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${readMode === 'horizontal' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
              >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">分页</span>
              </button>
              <button 
                  onClick={() => onModeChange('vertical')}
                  className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${readMode === 'vertical' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
              >
                  <MoveVertical className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">条漫</span>
              </button>
          </div>
          
          {/* Settings (Placeholder for future) */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/90 ml-1">
              <Settings2 className="w-4 h-4" />
          </button>
       </div>
    </div>
  );
};