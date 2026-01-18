import React from 'react';
import { Chapter } from '../types';
import { Check, Clock, Eye, FileText } from 'lucide-react';

interface ChapterListProps {
  chapters?: Chapter[];
  onChapterSelect: (chapter: Chapter) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, onChapterSelect }) => {
  if (!chapters || chapters.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-lg font-semibold text-gray-900">章节列表</h3>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">共 {chapters.length} 章</span>
      </div>
      
      <div className="bg-white border border-border-subtle rounded-lg shadow-fluent divide-y divide-gray-100 overflow-hidden">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter)}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left group"
          >
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                chapter.read 
                ? 'bg-gray-100 border-gray-200 text-gray-400' 
                : 'bg-primary/10 border-primary/20 text-primary'
            }`}>
               {chapter.read ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${chapter.read ? 'text-gray-500' : 'text-gray-900'}`}>
                {chapter.title}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 font-mono">
                {chapter.date} • {chapter.size}
              </div>
            </div>

            {!chapter.read && (
                <div className="px-3 py-1 rounded text-xs font-medium text-primary bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    已读
                </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};