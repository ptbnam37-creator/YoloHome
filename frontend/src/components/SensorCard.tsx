import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  progress: number;
  isDarkMode: boolean;
  children?: React.ReactNode;
}

export const SensorCard: React.FC<SensorCardProps> = ({ 
  title, value, unit, icon: Icon, colorClass, bgClass, progress, isDarkMode, children 
}) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${bgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${colorClass} ${bgClass}`}>LIVE</span>
        {children}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <div className="flex items-baseline gap-1 mt-1">
      <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
      <span className="text-slate-400 font-semibold">{unit}</span>
    </div>
    <div className={`mt-4 h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full ${colorClass.replace('text-', 'bg-')}`}
      />
    </div>
  </motion.div>
);
