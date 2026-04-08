import React from 'react';
import { LayoutDashboard, History, Settings, Sun, Moon, Bell, User } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, onToggleDarkMode }) => (
  <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-3 flex justify-between items-center md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
    <div className="flex items-center gap-2">
      <div className="bg-blue-600 p-2 rounded-lg">
        <LayoutDashboard className="text-white" size={20} />
      </div>
      <span className="font-bold text-xl hidden sm:block">YoloHome</span>
    </div>
    <div className="flex gap-8">
      <button className="text-blue-600 flex flex-col items-center md:flex-row md:gap-2">
        <LayoutDashboard size={20} />
        <span className="text-[10px] md:text-sm font-medium">Dashboard</span>
      </button>
      <button className="text-slate-400 hover:text-slate-600 flex flex-col items-center md:flex-row md:gap-2">
        <History size={20} />
        <span className="text-[10px] md:text-sm font-medium">Lịch sử</span>
      </button>
      <button className="text-slate-400 hover:text-slate-600 flex flex-col items-center md:flex-row md:gap-2">
        <Settings size={20} />
        <span className="text-[10px] md:text-sm font-medium">Cài đặt</span>
      </button>
    </div>
    <div className="flex items-center gap-4">
      <button 
        onClick={onToggleDarkMode}
        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <button className="relative text-slate-400 hover:text-slate-600">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
        <User size={18} />
      </div>
    </div>
  </nav>
);
