import React from 'react';
import { MangaData } from '../types';

export const HistoryView: React.FC<{ history: MangaData[] }> = ({ history }) => (
    <div className="w-full max-w-4xl mx-auto pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <header className="mb-6">
             <h1 className="text-2xl font-semibold text-gray-900">历史记录</h1>
        </header>

        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500">今天</h3>
                {history.slice(0, 2).map(manga => (
                    <div key={manga.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-border-subtle shadow-sm">
                        <img src={manga.coverUrl} className="w-10 h-14 object-cover rounded" />
                        <div>
                            <div className="text-sm font-semibold">{manga.title}</div>
                            <div className="text-xs text-gray-500">第 12 章 • 下午 2:30</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);