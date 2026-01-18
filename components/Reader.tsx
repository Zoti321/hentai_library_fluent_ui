import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings2, AlignJustify, BookOpen, X, Image as ImageIcon } from 'lucide-react';
import { Chapter, MangaData } from '../types';

interface ReaderProps {
  manga: MangaData;
  chapter: Chapter;
  onBack: () => void;
  onNextChapter: () => void;
  onPrevChapter: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ manga, chapter, onBack, onNextChapter, onPrevChapter }) => {
  const [readMode, setReadMode] = useState<'vertical' | 'horizontal'>('horizontal');
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mock images - 16 pages
  const images = Array.from({ length: 16 }, (_, i) => `https://picsum.photos/800/1200?random=${i + 100 + chapter.number * 50}`);

  // Reset state on chapter change
  useEffect(() => {
    setCurrentPage(0);
    setScrollProgress(0);
    if (containerRef.current) containerRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [chapter]);

  // Handle Vertical Scroll Progress Tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container || readMode !== 'vertical') return;

    const handleScroll = () => {
       const { scrollTop, scrollHeight, clientHeight } = container;
       if (scrollHeight <= clientHeight) return;
       const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
       setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [readMode]);

  // Handle Horizontal Keyboard Nav
  useEffect(() => {
      if (readMode !== 'horizontal') return;
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft') handlePrevPage();
          if (e.key === 'ArrowRight') handleNextPage();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readMode, currentPage]);

  const toggleControls = () => setControlsVisible(!controlsVisible);

  const handlePageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (settingsOpen) { setSettingsOpen(false); return; }
    
    // In vertical mode, simple tap toggles controls
    if (readMode === 'vertical') { toggleControls(); return; }

    // In horizontal mode, zones
    const width = window.innerWidth;
    const x = e.clientX;
    // Middle 40% toggles controls
    if (x > width * 0.3 && x < width * 0.7) {
        toggleControls();
    } else if (x <= width * 0.3) {
        handlePrevPage();
    } else {
        handleNextPage();
    }
  };

  const handleNextPage = () => { if (currentPage < images.length - 1) setCurrentPage(p => p + 1); else onNextChapter(); };
  const handlePrevPage = () => { if (currentPage > 0) setCurrentPage(p => p - 1); else onPrevChapter(); };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (readMode === 'horizontal') {
          setCurrentPage(Math.round(val));
      } else {
          setScrollProgress(val);
          if (containerRef.current) {
              const { scrollHeight, clientHeight } = containerRef.current;
              const newScrollTop = (val / 100) * (scrollHeight - clientHeight);
              containerRef.current.scrollTop = newScrollTop;
          }
      }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden font-sans select-none text-white">
        
        {/* Main Content Area */}
        <div 
            ref={containerRef} 
            className={`w-full h-full outline-none touch-pan-y ${readMode === 'vertical' ? 'overflow-y-auto overflow-x-hidden scroll-smooth' : 'flex items-center justify-center relative'}`} 
            onClick={handlePageTap}
        >
            {readMode === 'vertical' ? (
                <div className="max-w-3xl mx-auto min-h-screen bg-[#111]">
                    {images.map((src, idx) => (
                        <img key={idx} src={src} alt={`Page ${idx + 1}`} className="w-full h-auto block" loading="lazy"/>
                    ))}
                    
                    {/* End of Chapter Marker in Vertical Mode */}
                    <div className="p-12 pb-32 flex flex-col items-center gap-6 text-center text-gray-500">
                        <div className="w-16 h-1 bg-gray-800 rounded-full mb-4" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">本章结束</p>
                            <h3 className="text-xl font-semibold text-white">{chapter.title}</h3>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNextChapter(); }} 
                            className="mt-4 px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform active:scale-95"
                        >
                            下一章
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-[#000]">
                     <img 
                        src={images[currentPage]} 
                        alt={`Page ${currentPage + 1}`} 
                        className="max-w-full max-h-full object-contain pointer-events-none shadow-2xl transition-opacity duration-200"
                     />
                     {/* Page Number Indicator (Horizontal) */}
                     {/* Only show if controls are hidden to avoid clutter */}
                     {!controlsVisible && (
                        <div className="absolute bottom-6 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white/80 border border-white/10 pointer-events-none">
                            {currentPage + 1} / {images.length}
                        </div>
                     )}
                </div>
            )}
        </div>

        {/* --- Top Bar (Floating) --- */}
        <div className={`fixed top-0 inset-x-0 p-4 transition-transform duration-300 z-30 flex justify-center pointer-events-none ${controlsVisible ? 'translate-y-0' : '-translate-y-24'}`}>
             <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-2 pl-3 pr-3 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto max-w-[90vw]">
                <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/90">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-white/10 mx-1"></div>
                <div className="flex flex-col min-w-0 max-w-[160px] md:max-w-[240px]">
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider truncate">{manga.title}</span>
                    <span className="text-sm font-semibold text-white/90 truncate">{chapter.title}</span>
                </div>
                <div className="h-6 w-px bg-white/10 mx-1"></div>
                <button 
                    onClick={() => setSettingsOpen(!settingsOpen)} 
                    className={`p-2 rounded-xl transition-colors ${settingsOpen ? 'bg-white text-black' : 'hover:bg-white/10 text-white/90'}`}
                >
                    <Settings2 className="w-5 h-5" />
                </button>
             </div>
        </div>

        {/* --- Settings Popover --- */}
        {settingsOpen && (
            <div 
                className="absolute top-20 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 md:translate-y-2 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl shadow-flyout w-72 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">阅读设置</span>
                    <button onClick={() => setSettingsOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X className="w-4 h-4 text-white/60"/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-white/80 font-medium mb-2 block">方向</label>
                        <div className="grid grid-cols-2 gap-2">
                             <button 
                                onClick={() => setReadMode('horizontal')} 
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${readMode === 'horizontal' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-white/40 hover:bg-white/5'}`}
                             >
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-xs font-medium">分页</span>
                             </button>
                             <button 
                                onClick={() => setReadMode('vertical')} 
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${readMode === 'vertical' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-white/40 hover:bg-white/5'}`}
                             >
                                <AlignJustify className="w-6 h-6 rotate-90" />
                                <span className="text-xs font-medium">条漫</span>
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- Bottom Bar (Floating) --- */}
        <div className={`fixed bottom-0 inset-x-0 p-6 md:p-8 transition-transform duration-300 z-30 flex flex-col items-center gap-4 pointer-events-none ${controlsVisible ? 'translate-y-0' : 'translate-y-32'}`}>
            
            {/* Slider Island */}
            <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto flex items-center gap-4">
                 <span className="text-xs font-mono text-white/50 w-8 text-right">
                    {readMode === 'horizontal' ? currentPage + 1 : `${Math.round(scrollProgress)}%`}
                 </span>
                 
                 <div className="flex-1 relative h-6 flex items-center">
                    <input 
                        type="range" 
                        min="0" 
                        max={readMode === 'horizontal' ? images.length - 1 : 100} 
                        step={readMode === 'horizontal' ? 1 : 0.1}
                        value={readMode === 'horizontal' ? currentPage : scrollProgress} 
                        onChange={handleSliderChange}
                        className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer focus:outline-none 
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    />
                 </div>
                 
                 <span className="text-xs font-mono text-white/50 w-8">
                    {readMode === 'horizontal' ? images.length : '100%'}
                 </span>
            </div>

            {/* Navigation Buttons Island */}
            <div className="flex items-center gap-3 pointer-events-auto">
                 <button onClick={onPrevChapter} className="p-3 pl-4 pr-5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2 text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" /> 上一页
                 </button>
                 <div className="h-1 w-1 rounded-full bg-white/20"></div>
                 <button onClick={onNextChapter} className="p-3 pl-5 pr-4 rounded-full bg-white text-black border border-white hover:bg-gray-200 active:scale-95 transition-all flex items-center gap-2 text-sm font-semibold shadow-lg shadow-white/10">
                    下一页 <ChevronRight className="w-4 h-4" />
                 </button>
            </div>
        </div>
    </div>
  );
};