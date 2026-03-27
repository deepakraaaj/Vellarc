import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProjectView } from './components/ProjectView';
import { ProjectEditor } from './components/ProjectEditor';
import { Sidebar } from './components/Sidebar';
import { AIWizard } from './components/AIWizard';
import { initialProject } from './mockData';
import { Project, ViewMode } from './types';
import { Menu } from 'lucide-react';

function App() {
  const [projects, setProjects] = useState<Project[]>([initialProject]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIOverlayOpen, setIsAIOverlayOpen] = useState(false);
  
  // Track which step to open in the editor
  const [editorInitialStep, setEditorInitialStep] = useState<string>('basic');

  useEffect(() => {
    if (isDarkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!isAIOverlayOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAIOverlayOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAIOverlayOpen]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const transitionTo = (mode: ViewMode, project?: Project) => {
    if (project) setActiveProject(project);
    setViewMode(mode);
    setIsMobileMenuOpen(false);
  };

  const handleEditRequest = (project: Project, step: string = 'basic') => {
      setEditorInitialStep(step);
      transitionTo('edit', project);
  };

  const handleSaveProject = (updatedProject: Project) => {
    const exists = projects.find(p => p.id === updatedProject.id);
    if (exists) {
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    } else {
        setProjects([...projects, updatedProject]);
    }
    transitionTo('view', updatedProject);
  };

  const handleAIProjectGenerated = (partialProject: Omit<Project, 'id' | 'lastUpdated'>) => {
    const newProject: Project = {
        ...partialProject,
        id: Date.now().toString(),
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setIsAIOverlayOpen(false);
    handleSaveProject(newProject);
  };

  const openAIOverlay = () => {
    setIsMobileMenuOpen(false);
    setIsAIOverlayOpen(true);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Mobile Header - Visible only on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 border-b border-gray-200 dark:border-white/10 flex items-center px-4 justify-between shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2">
            <img
              src="/specarc-mark.svg"
              alt="SpecArc logo"
              className="w-10 h-10 rounded-xl shadow-[0_12px_28px_-12px_rgba(99,102,241,0.8)]"
            />
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">SpecArc</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg active:scale-95 transition-all"
          >
            <Menu size={24} />
          </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container - Now floating and transparent background */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-500 ease-out md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          activeView={viewMode}
          onDashboardClick={() => transitionTo('dashboard')}
          onNewProjectClick={() => {
               const newProject: Project = { 
                 ...initialProject, 
                 id: Date.now().toString(), 
                 title: 'Untitled Project', 
                 status: 'Draft',
                 lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
               };
               handleEditRequest(newProject, 'basic');
          }}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      </aside>
      
      {/* Main Content - Offset by sidebar width on desktop */}
      <main className="md:ml-80 min-h-screen transition-all duration-300 pt-20 md:pt-4 pr-4 md:pr-8 pb-8">
        <div className="max-w-[1800px] mx-auto">
            {viewMode === 'dashboard' && (
                <Dashboard 
                    projects={projects} 
                    onNewProject={() => {
                        const newProject: Project = { 
                          ...initialProject, 
                          id: Date.now().toString(), 
                          title: 'Untitled Project', 
                          status: 'Draft',
                          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        };
                        handleEditRequest(newProject, 'basic');
                    }}
                    onSelectProject={(p) => transitionTo('view', p)}
                />
            )}

            {viewMode === 'view' && activeProject && (
                <ProjectView 
                    project={activeProject} 
                    onEdit={(step) => handleEditRequest(activeProject, step)}
                    onBack={() => transitionTo('dashboard')}
                />
            )}

            {viewMode === 'edit' && activeProject && (
                <ProjectEditor 
                    project={activeProject} 
                    initialStep={editorInitialStep}
                    onSave={handleSaveProject}
                    onCancel={() => transitionTo(activeProject.id === initialProject.id ? 'view' : 'dashboard', activeProject)}
                />
            )}

        </div>
      </main>

      {isAIOverlayOpen && (
        <div
          className="fixed inset-0 z-[70] bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_26%),linear-gradient(rgba(15,23,42,0.08),rgba(15,23,42,0.08))] p-3 sm:p-4 md:p-6 flex items-end justify-end"
          onClick={() => setIsAIOverlayOpen(false)}
        >
          <div
            className="w-full max-w-[460px] h-[min(720px,calc(100vh-1.5rem))] sm:h-[min(760px,calc(100vh-2rem))]"
            onClick={(event) => event.stopPropagation()}
          >
            <AIWizard
              onCancel={() => setIsAIOverlayOpen(false)}
              onProjectGenerated={handleAIProjectGenerated}
            />
          </div>
        </div>
      )}

      <button
        onClick={openAIOverlay}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 group"
        aria-label="Open SpecArc AI chat assistant"
      >
        <div className="absolute -top-8 right-0 rounded-full bg-white/90 dark:bg-slate-950/90 border border-white/60 dark:border-white/10 px-3 py-1 backdrop-blur-md shadow-sm opacity-100 md:opacity-0 md:translate-y-1 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 whitespace-nowrap">Chat Assistant</span>
        </div>
        <div className="relative w-14 h-14 md:w-[3.75rem] md:h-[3.75rem] rounded-full bg-white/92 dark:bg-slate-950/92 border border-white/70 dark:border-white/10 shadow-[0_20px_45px_-18px_rgba(15,23,42,0.5)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_25px_60px_-16px_rgba(99,102,241,0.5)]">
          <img
            src="/specarc-mark.svg"
            alt="SpecArc AI"
            className="w-10 h-10 rounded-2xl"
          />
          <span className="absolute right-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-[0_0_14px_rgba(74,222,128,0.7)]" />
        </div>
      </button>
    </div>
  );
}

export default App;
