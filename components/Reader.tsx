import React, { useState, useEffect, useRef } from 'react';
import { Chapter, MangaData } from '../types';
import { ReaderTopBar } from './ReaderTopBar';
import { ReaderBottomBar } from './ReaderBottomBar';

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
          if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              toggleControls();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readMode, currentPage, controlsVisible]);

  const toggleControls = () => setControlsVisible(!controlsVisible);

  const handlePageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // In vertical mode, simple tap toggles controls
    if (readMode === 'vertical') { toggleControls(); return; }

    // In horizontal mode, zones
    const width = window.innerWidth;
    const x = e.clientX;
    // Middle 30% toggles controls
    if (x > width * 0.35 && x < width * 0.65) {
        toggleControls();
    } else if (x <= width * 0.35) {
        handlePrevPage();
    } else {
        handleNextPage();
    }
  };

  const handleNextPage = () => { if (currentPage < images.length - 1) setCurrentPage(p => p + 1); else onNextChapter(); };
  const handlePrevPage = () => { if (currentPage > 0) setCurrentPage(p => p - 1); else onPrevChapter(); };

  const handleSliderChange = (value: number) => {
      if (readMode === 'horizontal') {
          setCurrentPage(Math.round(value));
      } else {
          setScrollProgress(value);
          if (containerRef.current) {
              const { scrollHeight, clientHeight } = containerRef.current;
              const newScrollTop = (value / 100) * (scrollHeight - clientHeight);
              containerRef.current.scrollTop = newScrollTop;
          }
      }
  };

  return (
    <div className="fixed inset-0 bg-[#09090b] z-50 flex flex-col items-center justify-center overflow-hidden font-sans select-none text-white animate-in fade-in duration-300">
        
        {/* Main Content Area */}
        <div 
            ref={containerRef} 
            className={`w-full h-full outline-none touch-pan-y ${readMode === 'vertical' ? 'overflow-y-auto overflow-x-hidden scroll-smooth' : 'flex items-center justify-center relative'}`} 
            onClick={handlePageTap}
        >
            {readMode === 'vertical' ? (
                <div className="max-w-4xl mx-auto min-h-screen bg-[#09090b] pb-32">
                    {images.map((src, idx) => (
                        <img key={idx} src={src} alt={`Page ${idx + 1}`} className="w-full h-auto block mb-1" loading="lazy"/>
                    ))}
                    
                    {/* End of Chapter Marker */}
                    <div className="py-20 flex flex-col items-center gap-6 text-center text-zinc-500">
                        <div className="w-12 h-1 bg-zinc-800 rounded-full mb-2" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">本章结束</p>
                            <h3 className="text-lg font-medium text-white">{chapter.title}</h3>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNextChapter(); }} 
                            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/10"
                        >
                            下一章
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                     <img 
                        src={images[currentPage]} 
                        alt={`Page ${currentPage + 1}`} 
                        className="max-w-full max-h-full object-contain pointer-events-none shadow-2xl transition-opacity duration-200"
                     />
                </div>
            )}
        </div>

        <ReaderTopBar 
            manga={manga}
            chapter={chapter}
            isVisible={controlsVisible}
            readMode={readMode}
            onBack={onBack}
            onModeChange={setReadMode}
        />

        <ReaderBottomBar
            chapter={chapter}
            currentProgress={readMode === 'horizontal' ? currentPage : scrollProgress}
            total={readMode === 'horizontal' ? images.length : 100}
            readMode={readMode}
            isVisible={controlsVisible}
            onPrevChapter={onPrevChapter}
            onNextChapter={onNextChapter}
            onSliderChange={handleSliderChange}
        />
    </div>
  );
};