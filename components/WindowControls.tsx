import React, { useState } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';

export const WindowControls: React.FC = () => {
    // In a real Electron app, you would verify window.isMaximized()
    const [isMaximized, setIsMaximized] = useState(false);

    // Mock functions to simulate window control behavior
    // In a real app, these would call window.electronAPI.minimize(), etc.
    const handleMinimize = () => {
        console.log("Window Minimize");
    };

    const handleMaximize = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => console.log(e));
            setIsMaximized(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsMaximized(false);
            }
        }
        console.log("Window Maximize/Restore");
    };

    const handleClose = () => {
        console.log("Window Close");
        // window.close() usually requires specific permissions in browsers
    };

    return (
        <div className="fixed top-0 right-0 z-50 flex items-start h-8 app-region-no-drag">
            <button 
                onClick={handleMinimize}
                className="h-8 w-11 flex items-center justify-center text-gray-900 hover:bg-gray-200/50 transition-colors focus:outline-none"
                title="最小化"
            >
                <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
                onClick={handleMaximize}
                className="h-8 w-11 flex items-center justify-center text-gray-900 hover:bg-gray-200/50 transition-colors focus:outline-none"
                title={isMaximized ? "向下还原" : "最大化"}
            >
                {isMaximized ? <Copy className="w-3.5 h-3.5 rotate-180" /> : <Square className="w-3.5 h-3.5" />}
            </button>
            <button 
                onClick={handleClose}
                className="h-8 w-12 flex items-center justify-center text-gray-900 hover:bg-[#e81123] hover:text-white transition-colors focus:outline-none"
                title="关闭"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};