import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Play, Star, User, Users, Tag, BookOpen, Share2, ArrowLeft, Clock, CheckCircle2, BookMarked, HardDrive, FolderOpen, Pencil, MoreHorizontal, Sparkles, Loader2, Bot, PenTool, Library, FilePlus } from 'lucide-react';
import { MangaData } from '../types';
import { Chip } from './Chip';

interface MangaCardProps {
  data: MangaData;
  onStartReading?: () => void;
  onBack?: () => void;
  onEdit?: () => void;
  onAddChapter?: () => void;
}

const InfoSection: React.FC<{ icon?: React.ElementType; title: string; children: React.ReactNode; className?: string }> = ({ icon: Icon, title, children, className = "" }) => {
    if (React.Children.count(children) === 0 && !children) return null;
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider select-none border-b border-border-subtle pb-2">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{title}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {children}
            </div>
        </div>
    );
};

export const MangaCard: React.FC<MangaCardProps> = ({ data, onStartReading, onBack, onEdit, onAddChapter }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!data) return null;

  const handleAnalyze = async () => {
      setIsAnalyzing(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `分析漫画 "${data.title}"。简要解释其关键主题、类型吸引力以及读者可能喜欢它的原因。限制在 100 字以内。请使用中文回答。`,
          });
          setAiAnalysis(response.text || "无法生成分析。");
      } catch (e) {
          console.error(e);
      } finally {
          setIsAnalyzing(false);
      }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Reading':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-md">阅读中</span>;
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-700 border border-green-500/20 shadow-sm backdrop-blur-md">已完成</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100/90 text-gray-600 border border-gray-200 shadow-sm backdrop-blur-md">{status === 'Plan to Read' ? '想读' : (status || '未知')}</span>;
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {onBack && (
        <div className="mb-4 md:mb-6 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-primary hover:bg-primary/10 px-2 py-1.5 md:px-3 md:py-2 rounded-md transition-all group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">返回书库</span>
            </button>
            <div className="flex gap-1 md:gap-2">
                 {onEdit && (
                   <button onClick={onEdit} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors border border-transparent hover:border-gray-200" title="编辑元数据"><Pencil className="w-4 h-4"/></button>
                 )}
                 <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors border border-transparent hover:border-gray-200"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 lg:gap-10 items-start">
        {/* Left Column: Cover & Actions - Sticky on Desktop */}
        <div className="shrink-0 flex flex-col gap-5 w-full sm:w-1/2 md:w-64 lg:w-72 mx-auto md:mx-0 md:sticky md:top-6 md:self-start transition-all duration-300">
           <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border-subtle shadow-fluent-hover bg-white group transition-all duration-500">
              <img src={data.coverUrl} alt={data.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-95"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute top-3 left-3">{getStatusBadge(data.status)}</div>
              <div className="absolute bottom-3 right-3">
                  {data.rating > 0 && (
                     <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{data.rating}</span>
                     </div>
                  )}
              </div>
           </div>
           
           <div className="flex flex-col gap-2.5">
               <button onClick={onStartReading} className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold shadow-md transition-all active:scale-[0.98]">
                 <Play className="w-5 h-5 fill-current" /> 开始阅读
               </button>
               <div className="flex gap-2">
                    <button onClick={handleAnalyze} disabled={isAnalyzing || aiAnalysis !== null} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-purple-50 text-purple-600 border border-purple-200 rounded-lg font-medium shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                        {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI 分析
                    </button>
                    {onAddChapter && (
                        <button onClick={onAddChapter} className="px-3 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-medium shadow-sm transition-all active:scale-[0.98]" title="从书库添加章节">
                            <FilePlus className="w-4 h-4" />
                        </button>
                    )}
               </div>
           </div>
           
           {/* Tech Stats */}
            <div className="bg-gray-50 rounded-lg p-3 border border-border-subtle flex flex-col gap-2 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> 大小</span>
                    <span className="font-medium text-gray-700">{data.fileSize}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5" /> 路径</span>
                    <span className="font-medium text-gray-700 truncate max-w-[120px]" title={data.path}>.../{data.path.split('/').pop()}</span>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><BookMarked className="w-3.5 h-3.5" /> 格式</span>
                    <span className="font-medium text-gray-700">{data.format}</span>
                </div>
            </div>
        </div>

        {/* Right Column: Metadata & Details */}
        <div className="flex-1 min-w-0 flex flex-col">
           
           {/* 1. Header Section */}
           <div className="mb-6 md:mb-8 border-b border-border-subtle pb-6">
              <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 添加于 {data.dateAdded || '最近'}
                  </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                {data.title}
              </h1>
           </div>

           {/* 2. AI Analysis Block (if active) */}
           {aiAnalysis && (
                <div className="mb-8 bg-gradient-to-r from-purple-50 via-white to-white rounded-xl p-5 border border-purple-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex items-center gap-2 mb-3 text-purple-700 font-bold text-sm uppercase tracking-wide">
                        <Bot className="w-4 h-4" /> Gemini 分析
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed font-medium">{aiAnalysis}</p>
                </div>
           )}

           {/* 3. Unified Metadata Grid - Authors, Series, Characters, Tags on same level */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-8">
                {/* Authors */}
                <InfoSection icon={PenTool} title="作者">
                    {data.tags.authors?.map(author => (
                        <Chip key={author} label={author} variant="default" />
                    ))}
                </InfoSection>

                {/* Series */}
                <InfoSection icon={Library} title="系列">
                    {data.series && (
                        <Chip label={data.series} variant="primary" />
                    )}
                    {data.tags.series?.map(tag => (
                         <Chip key={tag} label={tag} variant="default" />
                    ))}
                </InfoSection>

                {/* Characters */}
                <InfoSection icon={Users} title="角色">
                    {data.tags.characters?.map(c => (
                        <Chip key={c} label={c} variant="outline" />
                    ))}
                </InfoSection>

                {/* Tags */}
                <InfoSection icon={Tag} title="标签">
                    {data.tags.general?.map(t => (
                        <Chip key={t} label={t} variant="default" />
                    ))}
                </InfoSection>
           </div>
           
           {/* 4. Secondary Description (Muted) */}
           <div className="prose prose-sm max-w-none pt-6 border-t border-border-subtle">
              <div className="flex items-center gap-2 mb-2">
                 <BookOpen className="w-4 h-4 text-gray-400" />
                 <h3 className="text-sm font-bold text-gray-900">简介</h3>
              </div>
              <div className="relative">
                  <p className={`text-gray-600 text-[15px] leading-relaxed transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-3 md:line-clamp-4 mask-fade-bottom' : ''}`}>
                    {data.description}
                  </p>
                  {!isDescriptionExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-alt to-transparent pointer-events-none" />
                  )}
              </div>
              <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} 
                className="mt-2 text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wide flex items-center gap-1 group focus:outline-none"
              >
                {isDescriptionExpanded ? '收起' : '阅读完整简介'}
                <span className={`transition-transform duration-200 ${isDescriptionExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};