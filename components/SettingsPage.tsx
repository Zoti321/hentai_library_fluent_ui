import React from 'react';
import { Moon, Smartphone, Trash2, ChevronRight, Globe, Info, Monitor, Palette, HardDrive, RefreshCw, FolderSearch, ShieldAlert, Lock, Database, Layout, PaintBucket } from 'lucide-react';

const SettingsGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{title}</h3>
    <div className="bg-white rounded-lg border border-border-subtle shadow-fluent divide-y divide-gray-100 overflow-hidden">
      {children}
    </div>
  </div>
);

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  isDestructive?: boolean;
}> = ({ icon, label, description, action, onClick, isDestructive }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer`}>
    <div className="flex items-center gap-4 overflow-hidden">
      <div className={`shrink-0 text-gray-500 ${isDestructive ? 'text-red-500' : ''}`}>{icon}</div>
      <div className="flex flex-col min-w-0"><span className={`text-sm font-medium truncate ${isDestructive ? 'text-red-600' : 'text-gray-900'}`}>{label}</span>{description && <span className="text-xs text-gray-500 truncate">{description}</span>}</div>
    </div>
    <div className="shrink-0 ml-4 flex items-center gap-2">{action}</div>
  </div>
);

const Toggle: React.FC<{ checked?: boolean; onChange?: () => void }> = ({ checked, onChange }) => (
  <div onClick={(e) => { e.stopPropagation(); onChange?.(); }} className={`w-10 h-5 rounded-full relative transition-colors duration-200 cursor-pointer border ${checked ? 'bg-primary border-primary' : 'bg-gray-200 border-gray-300'}`}>
    <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </div>
);

interface SettingsPageProps {
  isR18Mode: boolean;
  onToggleR18: (enabled: boolean) => void;
  theme?: 'fluent' | 'pink';
  onThemeChange?: (theme: 'fluent' | 'pink') => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ isR18Mode, onToggleR18, theme, onThemeChange, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 py-4">
      <header className="mb-8"><h1 className="text-2xl font-semibold text-gray-900">Settings</h1></header>
      <SettingsGroup title="Personalization">
         <SettingsRow icon={<PaintBucket className="w-5 h-5" />} label="Theme Style" description={theme === 'pink' ? 'Material Pink' : 'Fluent Blue'} action={<button onClick={() => onThemeChange?.(theme === 'pink' ? 'fluent' : 'pink')} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-xs font-medium text-gray-700 transition-colors">Switch to {theme === 'pink' ? 'Fluent' : 'Material'}</button>} />
         <SettingsRow icon={<Moon className="w-5 h-5" />} label="Dark Mode" description={isDarkMode ? "Enabled" : "Disabled"} action={<Toggle checked={isDarkMode} onChange={onToggleDarkMode} />} />
         <SettingsRow icon={<Palette className="w-5 h-5" />} label="App Theme" description="System Default" action={<div className="flex items-center gap-2 text-sm text-gray-500">Light <ChevronRight className="w-4 h-4"/></div>} />
         <SettingsRow icon={<Layout className="w-5 h-5" />} label="Layout Density" description="Compact" action={<ChevronRight className="w-4 h-4 text-gray-400"/>} />
      </SettingsGroup>
      <SettingsGroup title="Library">
         <SettingsRow icon={<FolderSearch className="w-5 h-5" />} label="Library Locations" description="Manage folders to scan" action={<ChevronRight className="w-4 h-4 text-gray-400"/>} />
         <SettingsRow icon={<RefreshCw className="w-5 h-5" />} label="Auto-Scan" description="Scan for new chapters on startup" action={<Toggle checked />} />
         <SettingsRow icon={isR18Mode ? <ShieldAlert className="w-5 h-5" /> : <Lock className="w-5 h-5" />} label="R18 Content" description={isR18Mode ? "Adult content is visible" : "Adult content is hidden"} action={<Toggle checked={isR18Mode} onChange={() => onToggleR18(!isR18Mode)} />} isDestructive={isR18Mode} />
      </SettingsGroup>
      <SettingsGroup title="Storage">
         <SettingsRow icon={<Database className="w-5 h-5" />} label="Cache" description="4.2 GB used" action={<button className="text-xs font-medium px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">Clear</button>} />
         <SettingsRow icon={<Trash2 className="w-5 h-5" />} label="Cleanup" description="Remove thumbnails for deleted files" action={<ChevronRight className="w-4 h-4 text-gray-400"/>} />
      </SettingsGroup>
      <SettingsGroup title="About">
         <SettingsRow icon={<Info className="w-5 h-5" />} label="Version" description="v2.1.0 (Dynamic Theme)" action={<span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono">Check Updates</span>} />
      </SettingsGroup>
    </div>
  );
};