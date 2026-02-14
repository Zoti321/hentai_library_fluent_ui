import React, { useState } from 'react';
import { Home, FolderOpen, Settings, Folder, History, Library, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavButton: React.FC<{ 
    id: string; 
    label: string; 
    icon: React.ElementType; 
    onClick: () => void; 
    isActive: boolean; 
    isToggle?: boolean;
    isDestructive?: boolean;
    isCollapsed?: boolean;
  }> = ({ id, label, icon: Icon, onClick, isActive, isToggle = false, isDestructive = false, isCollapsed = false }) => (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`
        relative w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-md text-sm group select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200
        ${isActive 
          ? 'bg-white shadow-sm ring-1 ring-border-subtle text-gray-900 font-medium' 
          : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
        }
        ${isDestructive && !isActive ? 'hover:text-red-600 hover:bg-red-50' : ''}
        ${isDestructive && isActive ? 'text-red-600' : ''}
      `}
    >
      {isActive && !isCollapsed && !isToggle && <div className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-primary rounded-full animate-in fade-in zoom-in-75 duration-200" />}
      <div className={`transition-colors duration-200 ${isActive && !isDestructive ? 'text-primary' : (isDestructive ? 'text-current' : 'text-gray-500 group-hover:text-gray-900')}`}>
         <Icon className="w-5 h-5" />
      </div>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  );

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'library', label: '书库', icon: Library },
    { id: 'browse', label: '文件夹', icon: Folder }, 
    { id: 'read', label: '历史', icon: History }, 
  ];
  const bottomItems = [
    { id: 'import', label: '导入', icon: FolderOpen },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  return (
    <>
      <nav className={`hidden md:flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} shrink-0 bg-gray-50 border-r border-border-subtle pt-6 pb-4 px-2 z-30 transition-all duration-300 ease-in-out sticky top-0 h-screen overflow-y-auto custom-scrollbar`}>
        <div className={`mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'px-4 gap-3'} select-none shrink-0 min-h-[40px] transition-all`}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-transform duration-300 shrink-0">M</div>
            {!isCollapsed && <span className="font-semibold text-lg tracking-tight text-gray-900 whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">MangaLibrary</span>}
        </div>
        
        <div className="flex-1 flex flex-col gap-1 w-full min-h-0">
          {!isCollapsed && <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0 whitespace-nowrap animate-in fade-in duration-300">菜单</div>}
          {navItems.map((item) => <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} isActive={activeTab === item.id} onClick={() => onTabChange(item.id)} isCollapsed={isCollapsed} />)}
        </div>
        
        <div className="mt-auto flex flex-col gap-1 shrink-0 pt-4 border-t border-border-subtle/50">
             {!isCollapsed && <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap animate-in fade-in duration-300">系统</div>}
             {bottomItems.map((item) => <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} isActive={activeTab === item.id} onClick={() => onTabChange(item.id)} isCollapsed={isCollapsed} />)}
             
             <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`mt-2 relative w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-md text-sm text-gray-500 hover:bg-black/5 hover:text-gray-900 transition-all outline-none`}
                title={isCollapsed ? "展开" : "收起"}
             >
                <div className="transition-colors duration-200">
                    {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </div>
                {!isCollapsed && <span className="truncate">收起侧边栏</span>}
             </button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-border-subtle py-1 px-2 flex justify-around items-center z-50 pb-safe transition-colors duration-300 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        {[...navItems, bottomItems[1]].map((item) => {
            const Icon = item.icon;
            return (
                <button key={item.id} onClick={() => onTabChange(item.id)} className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg flex-1 transition-all active:scale-90 ${activeTab === item.id ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`p-1 rounded-md transition-colors ${activeTab === item.id ? 'bg-primary/10' : ''}`}><Icon className="w-5 h-5" /></div>
                <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            );
        })}
      </nav>
    </>
  );
};