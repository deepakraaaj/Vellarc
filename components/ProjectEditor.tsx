import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Check, ChevronRight, Save, AlertCircle, User, Palette, Flag, Zap, PenTool, TestTube, Server, Book, Plus, X, Trash2, ExternalLink, Target, Swords, Database, Globe, Cpu } from 'lucide-react';

interface ProjectEditorProps {
  project: Project;
  initialStep?: string;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const steps = [
  { id: 'basic', label: 'Basic Info', icon: <Flag size={20} /> },
  { id: 'problem', label: 'Problem Space', icon: <AlertCircle size={20} /> },
  { id: 'personas', label: 'Audience & KPIs', icon: <User size={20} /> },
  { id: 'colors', label: 'Branding', icon: <Palette size={20} /> },
  { id: 'stories', label: 'User Stories', icon: <Book size={20} /> },
  { id: 'features', label: 'Features', icon: <Zap size={20} /> },
  { id: 'design', label: 'Design System', icon: <PenTool size={20} /> },
  { id: 'testing', label: 'Testing', icon: <TestTube size={20} /> },
  { id: 'deployment', label: 'Technology Stack', icon: <Server size={20} /> },
];

// Helper for auto-resizing textarea
const AutoTextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    return (
        <textarea
            {...props}
            rows={props.rows || 1}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
                props.onInput && props.onInput(e);
            }}
            className={`w-full p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none overflow-hidden text-base md:text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed shadow-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-md ${props.className || ''}`}
        />
    );
};

// Helper for inputs to match style
const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
        {...props}
        className={`w-full p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-base md:text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:bg-white dark:hover:bg-slate-800 hover:shadow-md ${props.className || ''}`}
    />
);

// Reusable Colored Block for Inputs (Goals, Frustrations, Strengths, Weaknesses)
const ColoredInputBlock = ({ 
    color, 
    icon: Icon, 
    label, 
    value, 
    onChange, 
    placeholder,
    rows = 2
}: { 
    color: 'emerald' | 'rose' | 'sky' | 'amber', 
    icon: any, 
    label: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    placeholder: string,
    rows?: number
}) => {
    const styles = {
        emerald: { bg: 'bg-emerald-50/60 dark:bg-emerald-900/10', border: 'border-emerald-100/50 dark:border-emerald-500/20', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconText: 'text-emerald-600 dark:text-emerald-400', labelText: 'text-emerald-800 dark:text-emerald-300' },
        rose: { bg: 'bg-rose-50/60 dark:bg-rose-900/10', border: 'border-rose-100/50 dark:border-rose-500/20', iconBg: 'bg-rose-100 dark:bg-rose-900/30', iconText: 'text-rose-600 dark:text-rose-400', labelText: 'text-rose-800 dark:text-rose-300' },
        sky: { bg: 'bg-sky-50/60 dark:bg-sky-900/10', border: 'border-sky-100/50 dark:border-sky-500/20', iconBg: 'bg-sky-100 dark:bg-sky-900/30', iconText: 'text-sky-600 dark:text-sky-400', labelText: 'text-sky-800 dark:text-sky-300' },
        amber: { bg: 'bg-amber-50/60 dark:bg-amber-900/10', border: 'border-amber-100/50 dark:border-amber-500/20', iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconText: 'text-amber-600 dark:text-amber-400', labelText: 'text-amber-800 dark:text-amber-300' },
    };
    const s = styles[color];

    return (
        <div className={`${s.bg} p-5 rounded-2xl border ${s.border} flex-1 transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-200 focus-within:bg-white/80 dark:focus-within:bg-slate-800/80 hover:bg-white/60 dark:hover:bg-slate-800/60`}>
             <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 ${s.iconBg} ${s.iconText} rounded-lg`}>
                    <Icon size={14} strokeWidth={3} />
                </div>
                <p className={`text-[10px] md:text-xs font-extrabold ${s.labelText} uppercase tracking-widest`}>{label}</p>
            </div>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400/70 dark:placeholder-gray-500 resize-none outline-none leading-relaxed"
                placeholder={placeholder}
            />
        </div>
    );
};

export const ProjectEditor: React.FC<ProjectEditorProps> = ({ project: initialProject, initialStep = 'basic', onSave, onCancel }) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [activeStep, setActiveStep] = useState(0);

  // Sync active step with prop if provided
  useEffect(() => {
    const idx = steps.findIndex(s => s.id === initialStep);
    if (idx !== -1) setActiveStep(idx);
  }, [initialStep]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1);
  };

  const renderStepContent = () => {
    switch (steps[activeStep].id) {
      case 'basic':
        return (
          <div className="space-y-10 fade-in">
             <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                    <Flag size={32} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Let's Get Started</h2>
                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Tell us about your software project.</p>
                </div>
             </div>
             
             <div className="space-y-8 max-w-4xl">
                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Project Name *</label>
                    <StyledInput 
                        type="text" 
                        value={project.title}
                        onChange={e => setProject({...project, title: e.target.value})}
                        placeholder="e.g. TaskFlow - Modern Task Management"
                        className="font-bold text-xl md:text-2xl p-5 md:p-6"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Project Tagline</label>
                    <AutoTextArea 
                        value={project.tagline}
                        onChange={e => setProject({...project, tagline: e.target.value})}
                        placeholder="A short, catchy description that sells your vision..."
                        rows={2}
                        className="text-lg md:text-xl"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Project Status</label>
                    <div className="relative">
                        <select 
                            value={project.status}
                            onChange={e => setProject({...project, status: e.target.value as any})}
                            className="w-full p-4 md:p-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none cursor-pointer text-base md:text-lg font-medium text-gray-900 dark:text-white shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-all"
                        >
                            <option value="Draft">Draft (Just started)</option>
                            <option value="In Review">In Review (Gathering feedback)</option>
                            <option value="Approved">Approved (Ready to build)</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                            <ChevronRight className="rotate-90" size={20} />
                        </div>
                    </div>
                </div>
             </div>
          </div>
        );
      case 'problem':
        return (
            <div className="space-y-10 fade-in">
                 <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Problem Space</h2>
                        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Define the core problem and analyze the landscape.</p>
                    </div>
                 </div>

                 <div className="space-y-10 max-w-4xl">
                    <div className="grid gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Problem Overview</label>
                            <AutoTextArea 
                                value={project.problemStatement.overview}
                                onChange={e => setProject({...project, problemStatement: {...project.problemStatement, overview: e.target.value}})}
                                placeholder="Describe the context and the specific problem..."
                                rows={3}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Impact Statement</label>
                            <AutoTextArea 
                                value={project.problemStatement.impact}
                                onChange={e => setProject({...project, problemStatement: {...project.problemStatement, impact: e.target.value}})}
                                placeholder="Why does this matter? Quantify the pain if possible (e.g. Teams waste 30% of time...)"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 md:p-8 rounded-3xl border border-rose-100 dark:border-rose-900/20">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={20} className="text-rose-600 dark:text-rose-400"/>
                                <label className="block text-sm font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide">Specific Pain Points</label>
                            </div>
                            <button 
                                onClick={() => setProject({
                                    ...project, 
                                    problemStatement: {
                                        ...project.problemStatement, 
                                        painPoints: [...project.problemStatement.painPoints, '']
                                    }
                                })}
                                className="text-sm bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 transition-colors shadow-sm"
                            >
                                <Plus size={16}/> Add Point
                            </button>
                        </div>
                        <div className="space-y-4">
                            {project.problemStatement.painPoints.map((point, idx) => (
                                <div key={idx} className="flex gap-4 items-start group">
                                    <span className="text-rose-400 font-bold mt-2 text-xl select-none">•</span>
                                    <input 
                                        value={point}
                                        onChange={e => {
                                            const newPoints = [...project.problemStatement.painPoints];
                                            newPoints[idx] = e.target.value;
                                            setProject({...project, problemStatement: {...project.problemStatement, painPoints: newPoints}});
                                        }}
                                        className="w-full p-0 bg-transparent border-none focus:ring-0 text-base md:text-lg text-gray-800 dark:text-gray-200 placeholder-rose-300 dark:placeholder-rose-800 font-medium"
                                        placeholder="Type a pain point..."
                                    />
                                    <button 
                                        onClick={() => {
                                            const newPoints = project.problemStatement.painPoints.filter((_, i) => i !== idx);
                                            setProject({...project, problemStatement: {...project.problemStatement, painPoints: newPoints}});
                                        }}
                                        className="mt-1 text-gray-400 hover:text-rose-600 transition-colors p-2 opacity-100 md:opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                             <div className="flex items-center gap-2">
                                <Swords size={20} className="text-slate-600 dark:text-slate-400"/>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Competitor Analysis</label>
                             </div>
                            <button 
                                onClick={() => setProject({
                                    ...project, 
                                    competitors: [...(project.competitors || []), { id: Date.now().toString(), name: '', strengths: '', weaknesses: '' }]
                                })}
                                className="text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                            >
                                <Plus size={16}/> Add Competitor
                            </button>
                        </div>
                        <div className="space-y-6">
                            {project.competitors?.map((comp, idx) => (
                                <div key={comp.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                                     <button 
                                        onClick={() => {
                                            const newComps = project.competitors.filter(c => c.id !== comp.id);
                                            setProject({...project, competitors: newComps});
                                        }}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 z-10"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <input 
                                        value={comp.name}
                                        onChange={e => {
                                            const newComps = [...project.competitors];
                                            newComps[idx] = { ...comp, name: e.target.value };
                                            setProject({...project, competitors: newComps});
                                        }}
                                        className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-6 w-full border-b border-gray-100 dark:border-slate-700 focus:border-indigo-500 outline-none bg-transparent pr-8 pb-2"
                                        placeholder="Competitor Name"
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <ColoredInputBlock 
                                            color="emerald"
                                            icon={Target}
                                            label="Strengths"
                                            value={comp.strengths}
                                            onChange={e => {
                                                const newComps = [...project.competitors];
                                                newComps[idx] = { ...comp, strengths: e.target.value };
                                                setProject({...project, competitors: newComps});
                                            }}
                                            placeholder="What do they do well?"
                                        />
                                        <ColoredInputBlock 
                                            color="rose"
                                            icon={AlertCircle}
                                            label="Weaknesses"
                                            value={comp.weaknesses}
                                            onChange={e => {
                                                const newComps = [...project.competitors];
                                                newComps[idx] = { ...comp, weaknesses: e.target.value };
                                                setProject({...project, competitors: newComps});
                                            }}
                                            placeholder="Where do they fail?"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        );
      case 'personas':
        return (
            <div className="space-y-10 fade-in">
                 <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-lg shadow-sky-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Audience & Success</h2>
                        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Who is this for and how do we measure success?</p>
                    </div>
                 </div>

                 <div className="space-y-12 max-w-4xl">
                     {/* Personas Section */}
                     <div>
                        <div className="flex justify-between items-center mb-6">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">User Personas</label>
                            <button 
                                onClick={() => setProject({
                                    ...project, 
                                    personas: [...project.personas, { id: Date.now().toString(), name: '', role: '', goals: '', frustrations: '' }]
                                })}
                                className="text-sm bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
                            >
                                <Plus size={18}/> Add Persona
                            </button>
                        </div>
                        <div className="grid gap-8">
                            {project.personas.map((persona, idx) => (
                                <div key={persona.id} className="bg-white/80 dark:bg-slate-800/80 border border-white dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col relative group">
                                     <button 
                                        onClick={() => {
                                            const newPersonas = project.personas.filter(p => p.id !== persona.id);
                                            setProject({...project, personas: newPersonas});
                                        }}
                                        className="absolute top-5 right-5 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2 z-10"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    
                                    {/* Persona Header Inputs */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-5 mb-6 md:mb-8 border-b border-gray-100 dark:border-slate-700 pb-6 pr-10">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-sm shrink-0">
                                            {persona.name ? persona.name.charAt(0) : '?'}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input 
                                                value={persona.name} 
                                                onChange={(e) => {
                                                    const newPersonas = [...project.personas];
                                                    newPersonas[idx] = { ...persona, name: e.target.value };
                                                    setProject({...project, personas: newPersonas});
                                                }}
                                                className="w-full font-bold text-gray-900 dark:text-white text-lg md:text-xl border-none p-0 focus:ring-0 placeholder-gray-300 dark:placeholder-gray-600 bg-transparent"
                                                placeholder="Persona Name (e.g. Sarah)" 
                                            />
                                            <div className="flex items-center">
                                                <input
                                                    value={persona.role} 
                                                    onChange={(e) => {
                                                        const newPersonas = [...project.personas];
                                                        newPersonas[idx] = { ...persona, role: e.target.value };
                                                        setProject({...project, personas: newPersonas});
                                                    }}
                                                    placeholder="Role (e.g. Manager)"
                                                    className="text-xs md:text-sm text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wide bg-sky-50 dark:bg-sky-900/30 px-3 py-1.5 rounded-lg border border-sky-100 dark:border-sky-800 w-full md:w-auto min-w-[200px] placeholder-sky-300 dark:placeholder-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-800"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <ColoredInputBlock 
                                            color="emerald"
                                            icon={Target}
                                            label="Primary Goals"
                                            value={persona.goals}
                                            onChange={(e) => {
                                                const newPersonas = [...project.personas];
                                                newPersonas[idx] = { ...persona, goals: e.target.value };
                                                setProject({...project, personas: newPersonas});
                                            }}
                                            placeholder="What do they want to achieve?"
                                        />
                                        <ColoredInputBlock 
                                            color="rose"
                                            icon={AlertCircle}
                                            label="Key Frustrations"
                                            value={persona.frustrations}
                                            onChange={(e) => {
                                                const newPersonas = [...project.personas];
                                                newPersonas[idx] = { ...persona, frustrations: e.target.value };
                                                setProject({...project, personas: newPersonas});
                                            }}
                                            placeholder="What is blocking them?"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="border-t border-gray-100 dark:border-white/10 pt-10">
                         <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-2">
                                <Target size={22} className="text-emerald-600 dark:text-emerald-400"/>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Key Performance Indicators (KPIs)</label>
                            </div>
                            <button 
                                onClick={() => setProject({
                                    ...project, 
                                    successMetrics: [...(project.successMetrics || []), { id: Date.now().toString(), metric: '', target: '' }]
                                })}
                                className="text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                            >
                                <Plus size={18}/> Add Metric
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.successMetrics?.map((metric, idx) => (
                                <div key={metric.id} className="bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative group hover:shadow-md transition-shadow">
                                     <button 
                                        onClick={() => {
                                            const newMetrics = project.successMetrics.filter(m => m.id !== metric.id);
                                            setProject({...project, successMetrics: newMetrics});
                                        }}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Metric Name</label>
                                            <input 
                                                value={metric.metric}
                                                onChange={e => {
                                                    const newMetrics = [...project.successMetrics];
                                                    newMetrics[idx] = { ...metric, metric: e.target.value };
                                                    setProject({...project, successMetrics: newMetrics});
                                                }}
                                                className="w-full font-bold text-gray-800 dark:text-gray-200 bg-transparent border-b border-gray-200 dark:border-slate-700 focus:border-emerald-500 outline-none pb-2 text-lg"
                                                placeholder="e.g. Monthly Active Users"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Target Goal</label>
                                            <AutoTextArea 
                                                value={metric.target}
                                                onChange={e => {
                                                    const newMetrics = [...project.successMetrics];
                                                    newMetrics[idx] = { ...metric, target: e.target.value };
                                                    setProject({...project, successMetrics: newMetrics});
                                                }}
                                                className="text-base bg-emerald-50/30 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 dark:text-emerald-100"
                                                rows={1}
                                                placeholder="e.g. 10,000 by Q3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        );
      case 'colors':
          return (
              <div className="space-y-10 fade-in">
                  <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 shadow-lg shadow-fuchsia-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                          <Palette size={32} />
                      </div>
                      <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Brand Identity</h2>
                          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Define the visual language of your product.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                      {Object.entries(project.colorPalette).map(([key, value]) => (
                          <div key={key} className="glass-panel p-5 rounded-2xl group hover:scale-[1.02] transition-transform duration-300">
                              <div className="h-32 rounded-xl mb-5 shadow-sm border border-black/5 dark:border-white/5 relative overflow-hidden" style={{ backgroundColor: value }}></div>
                              <div className="flex flex-col gap-3">
                                  <span className="capitalize font-bold text-gray-800 dark:text-gray-200 text-base">{key}</span>
                                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
                                      <input 
                                          type="color" 
                                          value={value}
                                          onChange={(e) => setProject({
                                              ...project, 
                                              colorPalette: { ...project.colorPalette, [key]: e.target.value }
                                          })}
                                          className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer flex-shrink-0"
                                      />
                                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider">{value}</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                   </div>
              </div>
          );
      case 'stories':
        return (
          <div className="space-y-10 fade-in">
            <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-lg shadow-orange-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                <Book size={32} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">User Stories</h2>
                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Requirements from the user's perspective.</p>
              </div>
              <button 
                onClick={() => setProject({
                  ...project, 
                  userStories: [...project.userStories, { id: Date.now().toString(), role: '', goal: '', benefit: '', priority: 'Should Have' }]
                })}
                className="ml-auto text-base bg-orange-600 dark:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 dark:shadow-none"
              >
                <Plus size={20}/> <span className="hidden md:inline">Add Story</span>
              </button>
            </div>
            <div className="space-y-6">
              {project.userStories.map((story, idx) => (
                <div key={story.id} className="glass-panel rounded-3xl p-6 md:p-8 relative group border-l-8 border-l-orange-400 bg-orange-50/10 dark:bg-orange-900/10">
                  <button 
                    onClick={() => {
                        const newStories = project.userStories.filter(s => s.id !== story.id);
                        setProject({...project, userStories: newStories});
                    }}
                    className="absolute top-5 right-5 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2"
                  >
                    <Trash2 size={22} />
                  </button>
                  <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
                       <div className="md:col-span-3">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">As a...</label>
                           <StyledInput 
                                value={story.role}
                                onChange={e => {
                                    const newStories = [...project.userStories];
                                    newStories[idx] = { ...story, role: e.target.value };
                                    setProject({...project, userStories: newStories});
                                }}
                                className="font-bold text-gray-800 dark:text-gray-200"
                                placeholder="user role"
                           />
                       </div>
                       <div className="md:col-span-5">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">I want to...</label>
                           <AutoTextArea 
                                value={story.goal}
                                onChange={e => {
                                    const newStories = [...project.userStories];
                                    newStories[idx] = { ...story, goal: e.target.value };
                                    setProject({...project, userStories: newStories});
                                }}
                                className="bg-white dark:bg-slate-800"
                                placeholder="perform an action"
                                rows={1}
                           />
                       </div>
                       <div className="md:col-span-4">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">So that...</label>
                           <AutoTextArea 
                                value={story.benefit}
                                onChange={e => {
                                    const newStories = [...project.userStories];
                                    newStories[idx] = { ...story, benefit: e.target.value };
                                    setProject({...project, userStories: newStories});
                                }}
                                className="bg-gray-5 dark:bg-slate-700 italic text-gray-600 dark:text-gray-300"
                                placeholder="I achieve value"
                                rows={1}
                           />
                       </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <select
                      value={story.priority}
                      onChange={e => {
                        const newStories = [...project.userStories];
                        newStories[idx] = { ...story, priority: e.target.value as any };
                        setProject({...project, userStories: newStories});
                      }}
                      className="text-sm font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer uppercase tracking-wide text-gray-600 dark:text-gray-300 shadow-sm"
                    >
                      <option value="Must Have">Must Have</option>
                      <option value="Should Have">Should Have</option>
                      <option value="Could Have">Could Have</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-10 fade-in">
             <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg shadow-violet-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                    <Zap size={32} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Core Features</h2>
                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Functionality that drives value.</p>
                </div>
                <button 
                  onClick={() => setProject({
                    ...project, 
                    features: [...project.features, { id: Date.now().toString(), name: '', status: 'Planned', description: '', benefit: '' }]
                  })}
                  className="ml-auto text-base bg-violet-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-violet-700 transition-colors shadow-sm shadow-violet-200"
                >
                  <Plus size={20}/> <span className="hidden md:inline">Add Feature</span>
                </button>
             </div>
             <div className="grid gap-8">
                {project.features.map((feature, idx) => (
                   <div key={feature.id} className="glass-panel rounded-2xl p-6 md:p-8 relative group transition-all hover:border-violet-300 dark:hover:border-violet-600">
                      <button 
                        onClick={() => {
                            const newFeatures = project.features.filter(f => f.id !== feature.id);
                            setProject({...project, features: newFeatures});
                        }}
                        className="absolute top-5 right-5 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        <Trash2 size={22} />
                      </button>
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6">
                          <div className="flex-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Feature Name</label>
                                <AutoTextArea 
                                    value={feature.name}
                                    onChange={e => {
                                    const newFeatures = [...project.features];
                                    newFeatures[idx] = { ...feature, name: e.target.value };
                                    setProject({...project, features: newFeatures});
                                    }}
                                    className="font-bold text-xl text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 focus:border-violet-500 outline-none bg-transparent w-full transition-colors pb-2 placeholder-gray-300 dark:placeholder-gray-600"
                                    placeholder="e.g. Dark Mode"
                                    rows={1}
                                />
                          </div>
                          <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Status</label>
                                <select
                                    value={feature.status}
                                    onChange={e => {
                                    const newFeatures = [...project.features];
                                    newFeatures[idx] = { ...feature, status: e.target.value as any };
                                    setProject({...project, features: newFeatures});
                                    }}
                                    className={`text-sm px-4 py-2 rounded-lg font-bold border-none outline-none cursor-pointer appearance-none ${
                                    feature.status === 'In Progress' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 
                                    feature.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <option value="Planned">Planned</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                          </div>
                      </div>
                      
                      <div className="space-y-6">
                           <div>
                                <AutoTextArea 
                                    value={feature.description}
                                    onChange={e => {
                                    const newFeatures = [...project.features];
                                    newFeatures[idx] = { ...feature, description: e.target.value };
                                    setProject({...project, features: newFeatures});
                                    }}
                                    className="bg-white dark:bg-slate-800"
                                    rows={2}
                                    placeholder="Detailed description of how it works..."
                                />
                           </div>
                           <div className="flex items-start gap-4 bg-violet-50 dark:bg-violet-900/10 p-4 rounded-xl border border-violet-100 dark:border-violet-900/30">
                                <span className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide shrink-0 mt-3">User Benefit:</span>
                                <AutoTextArea 
                                value={feature.benefit}
                                onChange={e => {
                                    const newFeatures = [...project.features];
                                    newFeatures[idx] = { ...feature, benefit: e.target.value };
                                    setProject({...project, features: newFeatures});
                                }}
                                className="flex-1 text-base font-medium text-gray-700 dark:text-gray-300 border-none outline-none bg-transparent placeholder-violet-300 dark:placeholder-violet-700 p-2 shadow-none hover:shadow-none hover:bg-transparent"
                                placeholder="Why should users care?"
                                rows={1}
                                />
                           </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'design':
        return (
          <div className="space-y-10 fade-in">
             <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-lg shadow-pink-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                    <PenTool size={32} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Design System</h2>
                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Guidelines, assets, and principles.</p>
                </div>
             </div>

             <div className="space-y-8 max-w-4xl">
                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Design Philosophy</label>
                    <AutoTextArea 
                        value={project.design.philosophy}
                        onChange={e => setProject({...project, design: {...project.design, philosophy: e.target.value}})}
                        className="text-lg italic text-gray-600 dark:text-gray-300 font-serif bg-pink-50/30 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900/20"
                        placeholder="e.g. 'Clarity over cleverness'..."
                        rows={3}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Wireframes Link</label>
                        <div className="relative">
                            <ExternalLink size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <StyledInput 
                                type="text" 
                                value={project.design.wireframesUrl}
                                onChange={e => setProject({...project, design: {...project.design, wireframesUrl: e.target.value}})}
                                className="pl-12"
                                placeholder="Figma / Sketch URL"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Mockups Link</label>
                        <div className="relative">
                            <ExternalLink size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <StyledInput 
                                type="text" 
                                value={project.design.mockupsUrl}
                                onChange={e => setProject({...project, design: {...project.design, mockupsUrl: e.target.value}})}
                                className="pl-12"
                                placeholder="Figma / Sketch URL"
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 md:p-8 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Design Principles</label>
                        <button 
                            onClick={() => setProject({
                                ...project, 
                                design: {
                                    ...project.design, 
                                    principles: [...project.design.principles, '']
                                }
                            })}
                            className="text-sm text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2 hover:text-indigo-800"
                        >
                            <Plus size={16}/> Add Principle
                        </button>
                    </div>
                    <div className="space-y-4">
                        {project.design.principles.map((principle, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-sm shadow-sm border border-pink-100 dark:border-pink-900/20 shrink-0">{idx + 1}</div>
                                <StyledInput 
                                    value={principle}
                                    onChange={e => {
                                        const newPrinciples = [...project.design.principles];
                                        newPrinciples[idx] = e.target.value;
                                        setProject({...project, design: {...project.design, principles: newPrinciples}});
                                    }}
                                    className="bg-white dark:bg-slate-800"
                                    placeholder="e.g. Accessibility First"
                                />
                                <button 
                                    onClick={() => {
                                        const newPrinciples = project.design.principles.filter((_, i) => i !== idx);
                                        setProject({...project, design: {...project.design, principles: newPrinciples}});
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-2"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>
        );
      case 'testing':
        return (
          <div className="space-y-10 fade-in">
             <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                    <TestTube size={32} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Quality Assurance</h2>
                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Strategy and critical test cases.</p>
                </div>
             </div>

             <div className="space-y-10 max-w-4xl">
                <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Testing Strategy</label>
                    <AutoTextArea 
                        value={project.testing.strategy}
                        onChange={e => setProject({...project, testing: {...project.testing, strategy: e.target.value}})}
                        className="bg-cyan-50/20 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-900/20"
                        placeholder="Describe your approach (Unit, Integration, E2E)..."
                        rows={3}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-6">
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Critical Test Cases</label>
                        <button 
                            onClick={() => setProject({
                                ...project, 
                                testing: {
                                    ...project.testing, 
                                    cases: [...project.testing.cases, { id: Date.now().toString(), name: '', description: '', expected: '' }]
                                }
                            })}
                            className="text-sm bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-700 transition-colors shadow-sm"
                        >
                            <Plus size={16}/> Add Case
                        </button>
                    </div>
                    <div className="grid gap-6">
                        {project.testing.cases.map((testCase, idx) => (
                            <div key={testCase.id} className="glass-panel rounded-2xl p-6 md:p-8 relative group border border-cyan-100 dark:border-cyan-900/30">
                                <button 
                                    onClick={() => {
                                        const newCases = project.testing.cases.filter(c => c.id !== testCase.id);
                                        setProject({...project, testing: {...project.testing, cases: newCases}});
                                    }}
                                    className="absolute top-5 right-5 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <div className="mb-6 pr-12">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Case Name</label>
                                    <input 
                                        value={testCase.name}
                                        onChange={e => {
                                            const newCases = [...project.testing.cases];
                                            newCases[idx] = { ...testCase, name: e.target.value };
                                            setProject({...project, testing: {...project.testing, cases: newCases}});
                                        }}
                                        className="w-full font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 focus:border-cyan-500 outline-none bg-transparent pb-2 text-lg"
                                        placeholder="e.g. Login Flow"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Steps / Action</label>
                                        <AutoTextArea 
                                            value={testCase.description}
                                            onChange={e => {
                                                const newCases = [...project.testing.cases];
                                                newCases[idx] = { ...testCase, description: e.target.value };
                                                setProject({...project, testing: {...project.testing, cases: newCases}});
                                            }}
                                            className="text-base bg-white dark:bg-slate-800"
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Expected Result</label>
                                        <AutoTextArea 
                                            value={testCase.expected}
                                            onChange={e => {
                                                const newCases = [...project.testing.cases];
                                                newCases[idx] = { ...testCase, expected: e.target.value };
                                                setProject({...project, testing: {...project.testing, cases: newCases}});
                                            }}
                                            className="text-base bg-green-50/50 dark:bg-green-900/10 dark:text-gray-300"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
          </div>
        );
      case 'deployment':
        return (
          <div className="space-y-10 fade-in">
             <div className="flex items-center gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-gray-100/50 dark:border-white/10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-100 dark:shadow-none border border-white dark:border-white/10 shrink-0">
                    <Server size={32} />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Technology Stack</h2>
                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2">Languages, frameworks, and infrastructure.</p>
                </div>
             </div>

             <div className="space-y-8 max-w-4xl">
                 <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10">
                         <div className="flex items-center gap-3 mb-4">
                             <Globe className="text-indigo-600 dark:text-indigo-400" size={24} />
                             <h3 className="font-bold text-lg text-gray-900 dark:text-white">Environment & Services</h3>
                         </div>
                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Runtime Stack</label>
                         <AutoTextArea 
                            value={project.deployment.environment}
                            onChange={e => setProject({...project, deployment: {...project.deployment, environment: e.target.value}})}
                            placeholder="e.g. Node.js 20, PostgreSQL, Redis..."
                            className="bg-transparent text-lg font-medium leading-relaxed border-0 border-b border-indigo-200/70 dark:border-indigo-900 focus:ring-0 focus:border-indigo-500 rounded-none px-0 py-3 shadow-none hover:shadow-none hover:bg-transparent"
                            rows={1}
                        />
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10">
                         <div className="flex items-center gap-3 mb-4">
                             <Database className="text-emerald-600 dark:text-emerald-400" size={24} />
                             <h3 className="font-bold text-lg text-gray-900 dark:text-white">Hosting & Infrastructure</h3>
                         </div>
                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Platforms</label>
                         <StyledInput 
                            type="text" 
                            value={project.deployment.platform}
                            onChange={e => setProject({...project, deployment: {...project.deployment, platform: e.target.value}})}
                            placeholder="e.g. Vercel, AWS RDS, Cloudflare..."
                            className="bg-transparent text-lg font-medium border-0 border-b border-emerald-200/70 dark:border-emerald-900 focus:ring-0 focus:border-emerald-500 rounded-none px-0 py-3 shadow-none hover:shadow-none hover:bg-transparent"
                        />
                    </div>
                 </div>

                 <div className="glass-panel p-8 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <Cpu className="text-slate-600 dark:text-slate-400" size={24} />
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">DevOps & Pipeline</h3>
                    </div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">CI/CD Strategy</label>
                    <AutoTextArea 
                        value={project.deployment.strategy}
                        onChange={e => setProject({...project, deployment: {...project.deployment, strategy: e.target.value}})}
                        className="font-mono text-sm text-gray-600 dark:text-gray-300 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        placeholder="e.g. GitHub Actions triggers build on push..."
                        rows={3}
                    />
                 </div>
             </div>
          </div>
        );
      default:
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 fade-in">
                <p>Unknown configuration step.</p>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] rounded-3xl overflow-hidden shadow-[0_28px_70px_-38px_rgba(15,23,42,0.35)] glass-panel relative">
      {/* Header */}
      <div className="bg-white/82 dark:bg-slate-900/82 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-4 md:px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Editing Project</h1>
            <p className="text-sm md:text-base text-indigo-700 dark:text-indigo-300 font-bold truncate max-w-[150px] md:max-w-xs">{project.title || 'Untitled'}</p>
        </div>
        <div className="flex gap-2 md:gap-4">
            <button onClick={onCancel} className="px-3 md:px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-sm md:text-base border border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-sm">
                Discard
            </button>
            <button onClick={() => onSave(project)} className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold text-sm md:text-base shadow-lg shadow-indigo-100 dark:shadow-none hover:-translate-y-0.5 transform duration-200">
                <Save size={18} />
                <span className="hidden md:inline">Save & View</span>
                <span className="md:hidden">Save</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-80 bg-white/62 dark:bg-slate-900/62 backdrop-blur-sm border-r border-slate-200/70 dark:border-slate-800 overflow-y-auto hidden md:block custom-scrollbar">
            <div className="p-6">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 pl-2">Configuration</p>
                <div className="space-y-2 pb-8">
                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveStep(index)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-left transition-all duration-300 ${
                                activeStep === index 
                                ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 translate-x-1' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <span className={`shrink-0 transition-colors duration-300 ${activeStep === index ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                                {step.icon}
                            </span>
                            <span className="min-w-0 flex-1 leading-snug">
                                {step.label}
                            </span>
                            {index < activeStep && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Form Area Wrapper */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white/38 dark:bg-slate-900/38">
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
                <div className="max-w-4xl mx-auto min-h-[500px] flex flex-col pb-32">
                    {/* Steps Progress (Mobile only) */}
                    <div className="md:hidden mb-6 overflow-x-auto flex gap-1 pb-2 no-scrollbar">
                        {steps.map((step, i) => (
                            <div key={i} className={`h-1.5 flex-1 min-w-[2rem] rounded-full flex-shrink-0 transition-colors ${i <= activeStep ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
                        ))}
                    </div>

                    <div className="flex-1">
                        {renderStepContent()}
                    </div>
                </div>
            </div>
            
            {/* Floating Navigation - Fixed to bottom of Wrapper */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-white/96 via-white/88 to-transparent dark:from-slate-900/96 dark:via-slate-900/88 z-10 backdrop-blur-[2px]">
                 <div className="max-w-4xl mx-auto flex justify-between items-center">
                     <button 
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        disabled={activeStep === 0}
                        className="px-6 md:px-8 py-3 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-white/80 dark:hover:bg-slate-800/80 disabled:opacity-0 disabled:pointer-events-none transition-all text-sm md:text-base border border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-sm"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={activeStep === steps.length - 1}
                        className="px-6 md:px-8 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-black dark:hover:bg-gray-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 md:gap-3 disabled:opacity-0 disabled:pointer-events-none text-sm md:text-base"
                    >
                        Next Section
                        <ChevronRight size={18} />
                    </button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
