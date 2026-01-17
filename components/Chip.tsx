import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ChipProps {
  label: string;
  icon?: LucideIcon | React.ElementType;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'primary' | 'ghost';
}

export const Chip: React.FC<ChipProps> = ({ label, icon: Icon, onClick, className = '', variant = 'default' }) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all select-none truncate max-w-[200px]";
  
  const variants = {
    default: "bg-gray-100/80 text-gray-700 border border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm",
    outline: "bg-white text-gray-700 border border-gray-200 hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-sm",
    primary: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/30",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
  };

  return (
    <span 
      onClick={onClick}
      title={label}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5 opacity-70 shrink-0" />}
      <span className="truncate">{label}</span>
    </span>
  );
};