import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DeviceControlProps {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  isActive: boolean;
  onToggle: (id: string) => void;
  isDarkMode: boolean;
}

export const DeviceControl: React.FC<DeviceControlProps> = ({
  id, name, icon: Icon, color, bg, isActive, onToggle, isDarkMode
}) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${isDarkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-50 hover:border-slate-100'}`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${isActive ? bg + ' ' + color : (isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-400')}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{name}</p>
        <p className="text-xs text-slate-500">{isActive ? 'Đang bật' : 'Đã tắt'}</p>
      </div>
    </div>
    <button 
      onClick={() => onToggle(id)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        isActive ? 'bg-blue-600' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-200')
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);
