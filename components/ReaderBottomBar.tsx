import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Chapter } from '../types';

interface ReaderBottomBarProps {
  chapter: Chapter;
  currentProgress: number; // Page number or Percentage
  total: number; // Total pages or 100
  readMode: 'vertical' | 'horizontal';
  isVisible: boolean;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onSliderChange: (value: number) => void;
}

export const ReaderBottomBar: React.FC<ReaderBottomBarProps> = ({
  chapter,
  currentProgress,
  total,
  readMode,
  isVisible,
  onPrevChapter,
  onNextChapter,
  onSliderChange,
}) => {
  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 transition-all duration-300 z-50 pointer-events-none ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto flex flex-col gap-4">
             
             {/* Progress Info */}
             <div className="flex items-center justify-between text-xs font-medium text-white/60 px-1">
                <span>{chapter.title}</span>
                <span className="font-mono text-white/90">
                    {readMode === 'horizontal' ? `${currentProgress + 1} / ${total}` : `${Math.round(currentProgress)}%`}
                </span>
             </div>

             {/* Slider & Nav Row */}
             <div className="flex items-center gap-4">
                 <button onClick={onPrevChapter} className="p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors" title="上一章">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
                 
                 <div className="flex-1 relative h-8 flex items-center group">
                    <input 
                        type="range" 
                        min="0" 
                        max={readMode === 'horizontal' ? total - 1 : 100} 
                        step={readMode === 'horizontal' ? 1 : 0.1}
                        value={currentProgress} 
                        onChange={(e) => onSliderChange(parseFloat(e.target.value))}
                        className="absolute w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer focus:outline-none z-10
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform
                        active:[&::-webkit-slider-thumb]:scale-125 group-hover:[&::-webkit-slider-thumb]:scale-110"
                    />
                    {/* Buffered/Track Visual */}
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white/80 rounded-full pointer-events-none" 
                        style={{ width: `${readMode === 'horizontal' ? (currentProgress / (total - 1)) * 100 : currentProgress}%` }}
                    />
                 </div>
                 
                 <button onClick={onNextChapter} className="p-2 rounded-full hover:bg-white/10 text-white/70 transition-colors" title="下一章">
                    <ChevronRight className="w-5 h-5" />
                 </button>
             </div>
        </div>
    </div>
  );
};