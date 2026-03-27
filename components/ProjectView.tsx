import React, { useState } from 'react';
import { Project } from '../types';
import { Edit3, Download, ArrowLeft, Check, AlertCircle, User, Palette, Zap, Server, Book, ExternalLink, TestTube, Target, Swords, ChevronRight, Fingerprint, Terminal, Clock, ArrowUpRight, Flame } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  onEdit: (step?: string) => void;
  onBack: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, onEdit, onBack }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = () => {
    setShowExportModal(true);
    setIsExporting(true);
    setTimeout(() => {
        setIsExporting(false);
        setExportComplete(true);
    }, 2000);
  };

  const closeExport = () => {
    setShowExportModal(false);
    setExportComplete(false);
  }

  return (
    <div className="fade-in w-full pb-20 relative">
      {/* Background Decor */}
      <div className="fixed top-32 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      {/* Header - Floating Glass Dock */}
      <div className="sticky top-4 z-40 mb-8">
          <div className="glass-panel mx-auto max-w-[98%] rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl shadow-indigo-500/5 border-white/40 dark:border-white/10">
            <div className="flex items-center gap-6">
                <button onClick={onBack} className="p-2.5 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:shadow-md">
                    <ArrowLeft size={20} />
                </button>
                <div className="h-6 w-[1px] bg-gray-200/50 dark:bg-white/10 hidden md:block"></div>
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-none">{project.title}</h2>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SpecArc Blueprint</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={handleExport} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all font-bold text-sm shadow-sm hover:shadow-md">
                    <Download size={18} />
                    <span>Export</span>
                </button>
                <button onClick={() => onEdit('basic')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-all font-bold text-sm shadow-lg shadow-slate-500/20 hover:shadow-slate-500/40 hover:-translate-y-0.5">
                    <Edit3 size={18} />
                    <span>Edit Mode</span>
                </button>
            </div>
          </div>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-8 px-4">
        {/* Hero Section - Holographic Card */}
        <div className="relative rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/20 dark:border-white/5 group">
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 opacity-90 dark:opacity-70"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-white/20 to-transparent rounded-full blur-3xl -mr-40 -mt-40 mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/30 rounded-full blur-3xl -ml-20 -mb-20 mix-blend-overlay"></div>
            
            {/* Glass Overlay Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest backdrop-blur-md border border-white/20 text-white shadow-lg ${
                            project.status === 'Draft' ? 'bg-black/20' :
                            project.status === 'In Review' ? 'bg-indigo-500/40' :
                            'bg-emerald-500/40'
                        }`}>
                            {project.status}
                        </span>
                        <span className="text-indigo-100 text-xs font-bold tracking-wide flex items-center gap-1">
                            <Clock size={12} /> Last updated: {project.lastUpdated}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-none drop-shadow-sm">
                        {project.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-indigo-50 font-medium leading-relaxed max-w-2xl border-l-4 border-white/30 pl-6">
                        {project.tagline}
                    </p>
                </div>
                
                {/* Stats Pill */}
                <div className="hidden lg:flex flex-col gap-2 bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-xl">
                    <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-8">
                         <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Features</span>
                         <span className="text-white text-xl font-black">{project.features.length}</span>
                    </div>
                     <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-8">
                         <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Stories</span>
                         <span className="text-white text-xl font-black">{project.userStories.length}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Problem Space - Dark Glass Card (Span 8) */}
            <div className="md:col-span-8 glass-dark rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-xl border-white/5">
                <div className="absolute top-0 right-0 p-8 opacity-20 text-white/50">
                    <AlertCircle size={120} strokeWidth={0.5} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                    <div className="w-2 h-8 bg-rose-500 rounded-full"></div> Problem Statement
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line mb-8 relative z-10">
                    {project.problemStatement.overview}
                </p>
                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                    {project.problemStatement.painPoints.map((point, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3 hover:bg-white/10 transition-colors">
                            <span className="text-rose-400 mt-1">
                                <AlertCircle size={16} />
                            </span>
                            <span className="text-gray-200 text-sm font-medium">{point}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Impact - Highlight Card (Span 4) */}
            <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-500/10 dark:bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-colors"></div>
                <div>
                     <div className="flex items-center gap-2 mb-4">
                        <Target size={20} className="text-rose-600" />
                        <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">Business Impact</span>
                     </div>
                     <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        {project.problemStatement.impact}
                     </p>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase">Success Metric</span>
                        <ArrowUpRight className="text-gray-400" size={18} />
                    </div>
                     <div className="mt-2 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        {project.successMetrics?.[0]?.target || "N/A"}
                     </div>
                     <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {project.successMetrics?.[0]?.metric}
                     </div>
                </div>
            </div>

            {/* Personas - ID Cards (Span 12) */}
            <div className="md:col-span-12">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Target Audience</h3>
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">{project.personas.length} Profiles</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.personas.map((persona, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[2px]">
                                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                        {persona.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-none mb-1">{persona.name}</h4>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{persona.role}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl">
                                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">Goal</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">{persona.goals}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl">
                                    <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-1">Frustration</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">{persona.frustrations}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Empty state filler if needed, styled as a dashed border card */}
                     <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2rem] p-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-2 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer group" onClick={() => onEdit('personas')}>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                            <User size={24} className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        </div>
                        <span className="text-sm font-bold">Add Persona</span>
                     </div>
                </div>
            </div>

            {/* Features - Split Grid */}
            <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Features List */}
                <div className="glass-panel p-8 rounded-[2rem]">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Zap className="text-amber-500" /> Key Features
                    </h3>
                    <div className="space-y-4">
                        {project.features.map((feature, i) => (
                            <div key={i} className="group bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm hover:border-amber-200 dark:hover:border-amber-500/30 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white">{feature.name}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                                        feature.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                        feature.status === 'In Progress' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                        'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {feature.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{feature.description}</p>
                                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    <Fingerprint size={12} /> Benefit: {feature.benefit}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech & Design Stack */}
                <div className="space-y-6">
                     {/* Branding Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Palette className="text-pink-500" /> Visual Identity
                        </h3>
                        <div className="flex gap-4 mb-8">
                             {Object.entries(project.colorPalette).map(([key, value]) => (
                                <div key={key} className="group relative">
                                    <div className="w-14 h-14 rounded-2xl shadow-sm border border-black/5 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: value }}></div>
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{key}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-pink-50/50 dark:bg-pink-900/10 rounded-xl p-4 border border-pink-100 dark:border-pink-900/30">
                             <span className="text-[10px] font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-widest block mb-2">Philosophy</span>
                             <p className="text-gray-700 dark:text-gray-300 italic font-medium">"{project.design.philosophy}"</p>
                        </div>
                    </div>

                    {/* Tech Stack Terminal */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Terminal size={100} />
                        </div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                            <Server className="text-emerald-400" /> Tech Stack
                        </h3>
                        <div className="space-y-4 font-mono text-sm relative z-10">
                             <div className="flex items-start gap-3">
                                <ChevronRight className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                                <div>
                                    <span className="text-gray-400 block text-xs uppercase tracking-wide mb-1">Environment</span>
                                    <span className="text-emerald-300">{project.deployment.environment}</span>
                                </div>
                             </div>
                             <div className="flex items-start gap-3">
                                <ChevronRight className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                                <div>
                                    <span className="text-gray-400 block text-xs uppercase tracking-wide mb-1">Infrastructure</span>
                                    <span className="text-emerald-300">{project.deployment.platform}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Stories Section */}
            <div className="md:col-span-12">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Book className="text-orange-500" /> User Stories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.userStories.map(story => (
                        <div key={story.id} className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100/50 dark:border-orange-500/10 relative overflow-hidden group hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                                <User size={60} className="text-orange-500" />
                            </div>
                            <div className="relative z-10">
                                <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-md mb-3 inline-block border ${
                                    story.priority === 'Must Have' ? 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' : 
                                    story.priority === 'Should Have' ? 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                }`}>
                                    {story.priority}
                                </span>
                                <p className="font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                                    <span className="font-bold text-gray-500 dark:text-gray-400">As a</span> {story.role}, <span className="font-bold text-gray-500 dark:text-gray-400">I want to</span> {story.goal} <span className="font-bold text-gray-500 dark:text-gray-400">so that</span> {story.benefit}.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Challenges Section */}
            <div className="md:col-span-12 bg-slate-900 dark:bg-black rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                 {/* Decorative Glow */}
                 <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>

                 <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <div className="p-2 bg-rose-500 rounded-lg"><Flame size={20} className="text-white" /></div>
                        Technical Challenges & Solutions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.challenges?.map(challenge => (
                             <div key={challenge.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                                 <h4 className="font-bold text-lg text-rose-300 mb-2">{challenge.title}</h4>
                                 <p className="text-gray-300 mb-6 leading-relaxed text-sm">{challenge.description}</p>
                                 <div className="flex items-start gap-3 bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/20">
                                    <Check className="text-emerald-400 mt-1 shrink-0" size={16} />
                                    <div>
                                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-1">Solution</span>
                                        <p className="text-emerald-100 text-sm">{challenge.solution}</p>
                                    </div>
                                 </div>
                             </div>
                        ))}
                        {(!project.challenges || project.challenges.length === 0) && (
                            <div className="text-gray-500 italic">No specific challenges logged for this project yet.</div>
                        )}
                    </div>
                 </div>
            </div>

             {/* Competitors & Testing - Bottom Row */}
             <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Swords className="text-slate-500" /> Competitors
                    </h3>
                    <div className="space-y-4">
                        {project.competitors?.map(comp => (
                            <div key={comp.id} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-900 dark:text-white text-lg">{comp.name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
                                        <span className="font-bold block text-xs uppercase mb-0.5">Strength</span>
                                        {comp.strengths}
                                    </div>
                                    <div className="text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-800">
                                        <span className="font-bold block text-xs uppercase mb-0.5">Weakness</span>
                                        {comp.weaknesses}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-800 shadow-lg shadow-cyan-500/10 dark:shadow-none">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TestTube className="text-cyan-500" /> QA Strategy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 bg-cyan-50/50 dark:bg-cyan-900/10 p-4 rounded-xl border border-cyan-100 dark:border-cyan-900/30 italic">{project.testing.strategy}</p>
                    <div className="flex flex-col gap-3">
                        {project.testing.cases.map(c => (
                            <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                                <div className="mt-1 w-5 h-5 rounded-full border-2 border-cyan-200 dark:border-cyan-800 flex items-center justify-center shrink-0">
                                    <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-800 dark:text-gray-200 block text-sm">{c.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{c.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
        </div>
      </div>

        {/* Export Modal */}
        {showExportModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center fade-in px-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 border border-white/20 dark:border-white/10">
                    {!exportComplete ? (
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Exporting...</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-base">Generating your premium documentation PDF.</p>
                            <div className="flex justify-center mb-8">
                                <div className="loader"></div>
                            </div>
                            <div className="text-xs text-indigo-500 dark:text-indigo-400 font-bold tracking-widest uppercase animate-pulse">Processing Assets</div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100 dark:shadow-none">
                                <Check size={32} strokeWidth={4} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready!</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-base">Your documentation has been successfully exported.</p>
                            <button onClick={closeExport} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-bold text-base hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xl hover:shadow-2xl">
                                Download File
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
