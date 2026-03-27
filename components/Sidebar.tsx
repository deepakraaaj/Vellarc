import React from 'react';
import { LayoutDashboard, PlusCircle, Settings, LogOut, Sparkles, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  onDashboardClick: () => void;
  onNewProjectClick: () => void;
  activeView: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDashboardClick, onNewProjectClick, activeView, isDarkMode, onToggleTheme }) => {
  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* Glass Container */}
      <div className="flex-1 rounded-3xl glass-panel flex flex-col overflow-hidden relative transition-colors duration-300">
        {/* Abstract Deco - Top Left */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* Logo Section */}
        <div className="p-8 flex items-center gap-4 z-10">
          <img
            src="/specarc-mark.svg"
            alt="SpecArc logo"
            className="w-14 h-14 shrink-0 drop-shadow-[0_18px_30px_rgba(99,102,241,0.28)]"
          />
          <div className="min-w-0 flex-1">
              <h1 className="font-extrabold text-[1.75rem] leading-none tracking-[-0.04em] text-gray-900 dark:text-white transition-colors">SpecArc</h1>
              <div className="flex items-center gap-2 mt-2 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                <p className="text-[9px] leading-none font-bold tracking-[0.18em] uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">AI Product Studio</p>
              </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-3 py-6 z-10">
          <p className="px-4 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
          
          <button
            onClick={onDashboardClick}
            className={`group w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 relative overflow-hidden ${
              activeView === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-none'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            {activeView === 'dashboard' && (
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-indigo-900/10 border border-indigo-100 dark:border-indigo-500/30 rounded-2xl"></div>
            )}
            <span className="relative z-10 flex items-center gap-4">
               <LayoutDashboard size={20} className={`transition-transform duration-300 ${activeView === 'dashboard' ? 'scale-110' : 'group-hover:scale-110'}`} />
               Dashboard
            </span>
            {activeView === 'dashboard' && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>}
          </button>

          <button
            onClick={onNewProjectClick}
            className={`group w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 relative overflow-hidden ${
              activeView === 'edit'
                ? 'text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-100 dark:shadow-none'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
             {activeView === 'edit' && (
               <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-white dark:from-violet-900/20 dark:to-violet-900/10 border border-violet-100 dark:border-violet-500/30 rounded-2xl"></div>
            )}
            <span className="relative z-10 flex items-center gap-4">
                <PlusCircle size={20} className={`transition-transform duration-300 ${activeView === 'edit' ? 'scale-110' : 'group-hover:scale-110'}`} />
                New Project
            </span>
          </button>
          
          <div className="pt-8 mt-4">
               <p className="px-4 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">System</p>
               
               <button 
                onClick={onToggleTheme}
                className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 rounded-2xl transition-all group"
               >
                  {isDarkMode ? (
                      <Sun size={20} className="text-amber-500 group-hover:rotate-45 transition-transform" />
                  ) : (
                      <Moon size={20} className="text-indigo-500 group-hover:-rotate-12 transition-transform" />
                  )}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
               </button>

               <button className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 rounded-2xl transition-all group">
                  <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
                  Preferences
              </button>
          </div>
        </nav>

        {/* User Profile - Bottom Glass Card */}
        <div className="p-4 z-10">
          <div className="p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/80 dark:hover:bg-slate-700/80 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Designer&background=random" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">Pro User</span>
                    <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Sparkles size={8} /> PREMIUM
                    </span>
                </div>
            </div>
            <LogOut size={16} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
