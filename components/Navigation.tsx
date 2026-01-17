import React from 'react';
import { Home, FolderOpen, Settings, Folder, History, Library, Lock, ShieldAlert } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isR18Mode?: boolean;
  onToggleR18?: (enabled: boolean) => void;
}

const NavButton: React.FC<{ 
    id: string; 
    label: string; 
    icon: React.ElementType; 
    onClick: () => void; 
    isActive: boolean; 
    isToggle?: boolean;
    isDestructive?: boolean;
  }> = ({ id, label, icon: Icon, onClick, isActive, isToggle = false, isDestructive = false }) => (
    <button
      onClick={onClick}
      className={`
        relative w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm group select-none
        ${isActive 
          ? 'bg-white shadow-fluent text-gray-900 font-medium transition-all duration-200 ease-out' 
          : 'text-gray-600 hover:bg-black/5 hover:text-gray-900 transition-none'
        }
        ${isDestructive && !isActive ? 'hover:text-red-600 hover:bg-red-50' : ''}
        ${isDestructive && isActive ? 'text-red-600' : ''}
      `}
    >
      {isActive && !isToggle && <div className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-primary rounded-full animate-in fade-in zoom-in-75 duration-200" />}
      <div className={`transition-colors duration-200 ${isActive && !isDestructive ? 'text-primary' : (isDestructive ? 'text-current' : 'text-gray-500 group-hover:text-gray-900')}`}>
         <Icon className="w-5 h-5" />
      </div>
      <span>{label}</span>
    </button>
  );

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isR18Mode, onToggleR18 }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'browse', label: 'Folders', icon: Folder }, 
    { id: 'read', label: 'History', icon: History }, 
  ];
  const bottomItems = [
    { id: 'import', label: 'Import', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <nav className="hidden md:flex flex-col w-64 shrink-0 bg-surface-alt h-full border-r border-border-subtle pt-8 pb-4 px-2 z-20 transition-colors duration-300">
        <div className="px-4 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-colors duration-300">M</div>
            <span className="font-semibold text-lg tracking-tight text-gray-900">MangaLibrary</span>
        </div>
        <div className="flex-1 flex flex-col gap-1 w-full">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} isActive={activeTab === item.id} onClick={() => onTabChange(item.id)} />)}
        </div>
        <div className="mt-auto flex flex-col gap-1">
             <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</div>
             {onToggleR18 && <NavButton id="r18" label={isR18Mode ? "R18 Visible" : "R18 Hidden"} icon={isR18Mode ? ShieldAlert : Lock} isActive={!!isR18Mode} isToggle={true} isDestructive={!!isR18Mode} onClick={() => onToggleR18(!isR18Mode)} />}
             {bottomItems.map((item) => <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} isActive={activeTab === item.id} onClick={() => onTabChange(item.id)} />)}
        </div>
      </nav>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-border-subtle py-1 px-2 flex justify-around items-center z-50 pb-safe transition-colors duration-300">
        {[...navItems, bottomItems[1]].map((item) => {
            const Icon = item.icon;
            return (
                <button key={item.id} onClick={() => onTabChange(item.id)} className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg flex-1 transition-all ${activeTab === item.id ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`p-1 rounded-md transition-colors ${activeTab === item.id ? 'bg-primary/10' : ''}`}><Icon className="w-5 h-5" /></div>
                <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            );
        })}
      </nav>
    </>
  );
};