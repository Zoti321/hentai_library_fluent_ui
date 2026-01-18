import React from 'react';
import { RotateCw, Plus, FileText, ChevronRight } from 'lucide-react';
import { MangaData } from '../types';
import { MangaGridItem } from '../components/MangaGridItem';

interface HomeViewProps {
    library: MangaData[];
    onMangaClick: (manga: MangaData) => void;
    onStartReading: (manga: MangaData) => void;
    onContextMenu: (e: React.MouseEvent, manga: MangaData) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ library, onMangaClick, onStartReading, onContextMenu, onRefresh, isRefreshing }) => {
    const continueReadingList = library.filter(m => m.status === 'Reading').slice(0, 4);
    
    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
        <header className="mb-8 flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">首页</h1>
                <p className="text-gray-500 text-sm mt-1">下午好，读者</p>
            </div>
            <div className="flex gap-2">
                <button onClick={onRefresh} className="p-2 bg-white text-gray-600 border border-border-subtle rounded-md hover:bg-gray-50 hover:text-primary transition-all shadow-sm active:scale-95" title="刷新">
                    <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-hover shadow-sm transition-all active:scale-95">
                    <Plus className="w-4 h-4" /><span>扫描书库</span>
                </button>
            </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-fluent flex flex-col justify-between h-40">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">收藏总量</div>
                        <div className="text-3xl font-semibold text-gray-900 mt-1">{library.length}</div>
                    </div>
                    <div className="p-2 bg-primary/10 text-primary rounded-md"><FileText className="w-5 h-5" /></div>
                </div>
                <div className="text-xs text-gray-500"><span className="text-green-600 font-medium">本周新增 +3</span></div>
            </div>
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-primary-hover text-white p-6 rounded-xl shadow-fluent relative overflow-hidden h-40 flex items-center">
                <div className="relative z-10 w-full">
                    <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">精选推荐</div>
                    <h3 className="text-2xl font-semibold mb-1">发现新世界</h3>
                    <p className="text-white/70 text-sm mb-0">探索最新的奇幻漫画。</p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12" />
            </div>
        </div>

        {continueReadingList.length > 0 && (
            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg text-gray-900">继续阅读</h2>
                    <button className="text-sm text-primary hover:underline flex items-center gap-1">查看全部 <ChevronRight className="w-3 h-3"/></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {continueReadingList.map(manga => (
                        <div key={manga.id} className="bg-white p-3 rounded-xl border border-border-subtle shadow-sm hover:shadow-fluent transition-all cursor-default group flex items-center gap-3" onClick={() => onMangaClick(manga)} onContextMenu={(e) => onContextMenu(e, manga)}>
                            <div className="w-12 h-16 shrink-0 rounded-md overflow-hidden bg-gray-200">
                                <img src={manga.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">{manga.title}</h3>
                                <div className="text-xs text-gray-500 mt-1">第 5 章</div>
                                <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}
        
        <section>
            <h2 className="font-semibold text-lg text-gray-900 mb-4">最近添加</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {library.slice(0, 6).map(manga => (
                    <MangaGridItem key={manga.id} manga={manga} onClick={onMangaClick} onStartReading={onStartReading} onContextMenu={onContextMenu} viewMode="grid" />
                ))}
            </div>
        </section>
      </div>
    );
};