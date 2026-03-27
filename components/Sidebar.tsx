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
      <div className="flex-1 rounded-3xl glass-panel flex flex-col overflow-hidden relative transition-colors duration-300">
        <div className="p-7 flex items-center gap-4 z-10 border-b border-slate-200/70 dark:border-slate-800">
          <img
            src="/specarc-mark.svg"
            alt="SpecArc logo"
            className="w-12 h-12 shrink-0 drop-shadow-[0_16px_28px_rgba(99,102,241,0.22)]"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-extrabold text-[1.6rem] leading-none tracking-[-0.04em] text-gray-900 dark:text-white transition-colors">SpecArc</h1>
            <p className="mono-ui text-[10px] mt-2 uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 whitespace-nowrap">Product Architecture</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3 py-6 z-10">
          <p className="px-4 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.18em] mb-4">Main Menu</p>
          
          <button
            onClick={onDashboardClick}
            className={`group w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 relative ${
              activeView === 'dashboard'
                ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-4">
               <LayoutDashboard size={20} className={`transition-transform duration-300 ${activeView === 'dashboard' ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-110 group-hover:-translate-y-0.5'}`} />
               Dashboard
            </span>
            {activeView === 'dashboard' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>}
          </button>

          <button
            onClick={onNewProjectClick}
            className={`group w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 relative ${
              activeView === 'edit'
                ? 'text-violet-700 dark:text-violet-300 bg-violet-50/90 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-4">
                <PlusCircle size={20} className={`transition-transform duration-300 ${activeView === 'edit' ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-110 group-hover:-translate-y-0.5'}`} />
                New Project
            </span>
            {activeView === 'edit' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"></div>}
          </button>
          
          <div className="pt-8 mt-4">
               <p className="px-4 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.18em] mb-4">System</p>
               
               <button 
                onClick={onToggleTheme}
                className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 rounded-2xl transition-all group"
               >
                  {isDarkMode ? (
                      <Sun size={20} className="text-amber-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6" />
                  ) : (
                      <Moon size={20} className="text-indigo-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-6" />
                  )}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
               </button>

               <button className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 rounded-2xl transition-all group">
                  <Settings size={20} className="transition-transform duration-300 group-hover:rotate-12" />
                  Preferences
              </button>
          </div>
        </nav>

        <div className="p-4 z-10">
          <div className="p-3 bg-white/70 dark:bg-slate-900/75 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between group cursor-pointer transition-all duration-300">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Designer&background=random" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">Workspace Owner</span>
                    <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Sparkles size={8} /> ACTIVE
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
