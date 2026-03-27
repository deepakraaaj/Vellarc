import React from 'react';
import { Project } from '../types';
import { Plus, Search, FileText, Clock, Layers, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
}

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string; trend: string }> = ({ label, value, icon, color, trend }) => (
  <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-40 transition-all hover:translate-y-[-5px] hover:shadow-xl duration-500 group relative overflow-hidden dark:bg-slate-800/40">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500`}></div>
    
    <div className="flex justify-between items-start relative z-10">
        <div className={`p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 ${color.replace('bg-', 'text-')}`}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
        </div>
        <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/50 dark:border-slate-600">
             <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />
             <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{trend}</span>
        </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wide uppercase mb-1">{label}</h3>
      <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ projects, onNewProject, onSelectProject }) => {
  return (
    <div className="fade-in w-full pb-12 pt-4 px-2">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="px-3 py-1 rounded-full bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/50 dark:border-indigo-500/30">Workspace</span>
             <span className="text-gray-400 text-xs font-bold">•</span>
             <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Creator.</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mt-3 max-w-xl">Your SpecArc workspace is ready. What will you architect today?</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
            <button
            onClick={onNewProject}
            className="w-full sm:w-auto bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-white px-8 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-bold shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:-translate-y-1 border border-white dark:border-white/10"
            >
            <Plus size={22} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span>Manual Project</span>
            </button>
        </div>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <StatCard label="Total Projects" value={projects.length} icon={<Layers />} color="bg-indigo-500" trend="+12%" />
        <StatCard label="In Progress" value={projects.filter(p => p.status === 'Draft').length} icon={<Clock />} color="bg-amber-500" trend="+5%" />
        <StatCard label="Under Review" value={projects.filter(p => p.status === 'In Review').length} icon={<FileText />} color="bg-purple-500" trend="+2%" />
        <StatCard label="Ready to Ship" value={projects.filter(p => p.status === 'Approved').length} icon={<Zap />} color="bg-emerald-500" trend="On Track" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Recent Projects
            <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs px-2.5 py-1 rounded-full">{projects.length}</span>
        </h2>
        <div className="relative w-full md:w-96 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500 -z-10"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl flex items-center border border-gray-200 dark:border-slate-700 group-focus-within:border-transparent transition-colors shadow-sm">
                <Search className="ml-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                type="text"
                placeholder="Search your library..."
                className="w-full px-4 py-3.5 bg-transparent focus:outline-none text-base font-medium text-gray-800 dark:text-white placeholder-gray-400 rounded-2xl"
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group glass-panel rounded-[2rem] p-8 cursor-pointer relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30"
          >
            {/* Background Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/50 dark:group-hover:from-indigo-900/20 group-hover:to-purple-50/50 dark:group-hover:to-purple-900/20 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last edit: {project.lastUpdated}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowUpRight size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 dark:group-hover:from-indigo-400 dark:group-hover:to-violet-400 transition-all duration-300">
                        {project.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                        {project.tagline}
                    </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-100/50 dark:border-white/10 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-300">
                                {String.fromCharCode(64+i)}
                            </div>
                        ))}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border backdrop-blur-md ${
                        project.status === 'In Review' ? 'bg-indigo-50/80 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/30' : 
                        project.status === 'Approved' ? 'bg-emerald-50/80 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/30' :
                        'bg-gray-100/80 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600'
                    }`}>
                        {project.status}
                    </span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
