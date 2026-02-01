import React, { useState, useMemo, useEffect } from 'react';
import { MangaCard } from './components/MangaCard';
import { ChapterList } from './components/ChapterList';
import { Navigation } from './components/Navigation';
import { Reader } from './components/Reader';
import { SettingsPage } from './components/SettingsPage';
import { ContextMenu } from './components/ContextMenu';
import { EditMetadataModal } from './components/modals/EditMetadataModal';
import { MergeModal } from './components/modals/MergeModal';
import { AddChapterSourceModal } from './components/modals/AddChapterSourceModal';
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { FileSystemView } from './views/FileSystemView';
import { HistoryView } from './views/HistoryView';
import { MangaData, Chapter } from './types';
import { libraryData } from './mockData';

type ViewState = 'home' | 'library' | 'detail' | 'reader' | 'settings' | 'browse' | 'read';
type Theme = 'fluent' | 'pink';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedManga, setSelectedManga] = useState<MangaData | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState('home');
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
  const handleMangaClick = (manga: MangaData) => { setSelectedManga(manga); setCurrentView('detail'); window.scrollTo(0,0); };
  const handleTabChange = (tab: string) => { setActiveTab(tab); if (['settings', 'home', 'library', 'browse', 'read'].includes(tab)) { setCurrentView(tab as ViewState); setSelectedManga(null); } else { setCurrentView('home'); } window.scrollTo(0,0); };
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

  const handleMergeRequest = (items: MangaData[]) => {
      setMergeCandidates(items);
      setIsMergeModalOpen(true);
  };

  const DetailView = () => (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">{selectedManga && (<><MangaCard data={selectedManga} onBack={handleBackToLibrary} onStartReading={() => handleStartReading(selectedManga)} onEdit={() => setIsEditModalOpen(true)} onAddChapter={() => setIsAddChapterModalOpen(true)} /><ChapterList chapters={selectedManga.chapters} onChapterSelect={(ch) => { setCurrentChapter(ch); setCurrentView('reader'); }} /></>)}</div>
  );

  if (currentView === 'reader' && selectedManga && currentChapter) return <Reader manga={selectedManga} chapter={currentChapter} onBack={() => { setCurrentView('detail'); setCurrentChapter(null); }} onNextChapter={() => console.log("Next")} onPrevChapter={() => console.log("Prev")} />;

  return (
    <div className="flex min-h-screen bg-surface-alt font-sans text-gray-900 transition-colors duration-300">
      <MergeModal isOpen={isMergeModalOpen} onClose={() => setIsMergeModalOpen(false)} items={mergeCandidates} onConfirm={handleMergeConfirm} />
      <AddChapterSourceModal isOpen={isAddChapterModalOpen} onClose={() => setIsAddChapterModalOpen(false)} currentManga={selectedManga} library={library} onConfirm={handleAddChapterConfirm} />
      <EditMetadataModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} manga={selectedManga} />
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} manga={contextMenu.manga} onClose={() => setContextMenu(null)} onAction={handleContextAction} />}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} isR18Mode={isR18Mode} onToggleR18={setIsR18Mode} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8 max-w-full overflow-x-hidden">
        {currentView === 'home' && <HomeView library={filteredLibraryData} onMangaClick={handleMangaClick} onStartReading={handleStartReading} onContextMenu={handleContextMenu} onRefresh={handleRefresh} isRefreshing={isRefreshing} />}
        {currentView === 'library' && <LibraryView library={library} isR18Mode={isR18Mode} onMangaClick={handleMangaClick} onStartReading={handleStartReading} onContextMenu={handleContextMenu} onRefresh={handleRefresh} isRefreshing={isRefreshing} onMergeRequest={handleMergeRequest} />}
        {currentView === 'browse' && <FileSystemView />}
        {currentView === 'read' && <HistoryView history={filteredLibraryData} />}
        {currentView === 'detail' && <DetailView />}
        {currentView === 'settings' && <SettingsPage isR18Mode={isR18Mode} onToggleR18={setIsR18Mode} theme={theme} onThemeChange={setTheme} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />}
      </main>
    </div>
  );
};

export default App;