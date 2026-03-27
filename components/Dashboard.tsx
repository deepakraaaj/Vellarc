import React from 'react';
import { Project } from '../types';
import { Plus, Search, FileText, Clock, Layers, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
}

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string; trend: string }> = ({ label, value, icon, color, trend }) => (
  <div className="glass-panel rounded-[1.75rem] p-6 min-h-[10.5rem] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30">
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 rounded-2xl ${color} text-white shadow-sm flex items-center justify-center`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: 2.2 })}
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
        <TrendingUp size={11} className="text-emerald-600 dark:text-emerald-400" />
        <span className="mono-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">{trend}</span>
      </div>
    </div>
    <div>
      <h3 className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.22em] mb-3">{label}</h3>
      <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ projects, onNewProject, onSelectProject }) => {
  return (
    <div className="fade-in w-full pb-12 pt-4 px-2">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 uppercase tracking-[0.16em]">
              Product Workspace
            </span>
            <span className="mono-ui text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.16em]">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[0.98]">
            Welcome back,{' '}
            <span className="relative inline-block text-indigo-700 dark:text-indigo-300">
              Creator
              <span className="absolute inset-x-0 bottom-1 h-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-sm -z-10"></span>
            </span>
            .
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mt-4 max-w-2xl">
            Shape product ideas into clearer plans, cleaner briefs, and build-ready direction without the noise.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
          <button
            onClick={onNewProject}
            className="w-full sm:w-auto bg-gray-950 dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-7 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-bold shadow-[0_22px_45px_-24px_rgba(15,23,42,0.65)] hover:-translate-y-0.5"
          >
            <Plus size={20} className="text-white dark:text-gray-900" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <StatCard label="Total Projects" value={projects.length} icon={<Layers />} color="bg-indigo-500" trend="+12%" />
        <StatCard label="In Progress" value={projects.filter(p => p.status === 'Draft').length} icon={<Clock />} color="bg-amber-500" trend="+5%" />
        <StatCard label="Under Review" value={projects.filter(p => p.status === 'In Review').length} icon={<FileText />} color="bg-purple-500" trend="+2%" />
        <StatCard label="Ready to Ship" value={projects.filter(p => p.status === 'Approved').length} icon={<Zap />} color="bg-emerald-500" trend="On Track" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Recent Projects
          <span className="bg-white/85 dark:bg-slate-900/85 text-gray-500 dark:text-gray-400 text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            {projects.length}
          </span>
        </h2>
        <div className="relative w-full md:w-96 group">
          <div className="relative bg-white/88 dark:bg-slate-900/88 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700 transition-colors shadow-sm group-focus-within:border-indigo-300 dark:group-focus-within:border-indigo-500/40">
            <Search className="ml-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
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
            className="group glass-panel rounded-[2rem] p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-1">
                  <span className="mono-ui text-[10px] font-semibold text-gray-400 uppercase tracking-[0.16em]">Last updated</span>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{project.lastUpdated}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors group-hover:bg-indigo-50 group-hover:border-indigo-100 dark:group-hover:bg-indigo-500/10 dark:group-hover:border-indigo-500/30">
                  <ArrowUpRight size={18} className="text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[1.7rem] font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{project.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">{project.tagline}</p>
              </div>

              <div className="mt-auto pt-5 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    {project.features.length} features
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    {project.userStories.length} stories
                  </span>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase border ${
                  project.status === 'In Review'
                    ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/30'
                    : project.status === 'Approved'
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-slate-200 dark:border-slate-700'
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
