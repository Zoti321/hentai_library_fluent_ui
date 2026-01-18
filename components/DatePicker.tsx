import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse initial value or default to today
    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-').map(Number);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                setCurrentMonth(new Date(y, m - 1, 1));
            }
        }
    }, [isOpen]); // Only sync when opening to avoid jumping while browsing months

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const displayDate = value || '选择日期';

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleSelectDate = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onChange(formatDate(newDate));
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const totalDays = daysInMonth(currentMonth);
        const startOffset = firstDayOfMonth(currentMonth);
        const days = [];

        // Empty slots for start offset
        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
        }

        // Actual days
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
            const isSelected = value === dateStr;
            const isToday = formatDate(new Date()) === dateStr;

            days.push(
                <button
                    key={day}
                    onClick={(e) => { e.stopPropagation(); handleSelectDate(day); }}
                    className={`
                        w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all
                        ${isSelected 
                            ? 'bg-primary text-white shadow-sm' 
                            : isToday 
                                ? 'text-primary font-bold hover:bg-primary/10' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }
                    `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Trigger Input */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white cursor-pointer transition-all
                    ${isOpen ? 'border-primary ring-1 ring-primary' : 'border-border-strong hover:border-gray-400'}
                `}
            >
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className={!value ? 'text-gray-400' : ''}>{displayDate}</span>
                </div>
                {value && (
                    <div 
                        onClick={(e) => { e.stopPropagation(); onChange(''); }}
                        className="p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-3.5 h-3.5" />
                    </div>
                )}
            </div>

            {/* Popover Calendar */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-flyout border border-border-subtle p-3 w-[280px] animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 px-1">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="font-semibold text-sm text-gray-900">
                            {currentMonth.toLocaleString('zh-CN', { year: 'numeric', month: 'long' })}
                        </div>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                            <div key={d} className="text-[12px] font-medium text-gray-400 h-6 flex items-center justify-center">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 place-items-center">
                        {renderCalendar()}
                    </div>
                </div>
            )}
        </div>
    );
};