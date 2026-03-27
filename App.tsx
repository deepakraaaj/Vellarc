import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProjectView } from './components/ProjectView';
import { ProjectEditor } from './components/ProjectEditor';
import { Sidebar } from './components/Sidebar';
import { AIWizard } from './components/AIWizard';
import { initialProject } from './mockData';
import { Project, ViewMode } from './types';
import { Menu, Hexagon } from 'lucide-react';

function App() {
  const [projects, setProjects] = useState<Project[]>([initialProject]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Track which step to open in the editor
  const [editorInitialStep, setEditorInitialStep] = useState<string>('basic');

  useEffect(() => {
    if (isDarkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    handleSaveProject(newProject);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Mobile Header - Visible only on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 border-b border-gray-200 dark:border-white/10 flex items-center px-4 justify-between shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Hexagon size={20} className="text-white fill-white/20" strokeWidth={1.5} />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">DocuMaster</span>
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
                    onStartAI={() => transitionTo('ai-wizard')}
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

            {viewMode === 'ai-wizard' && (
                <AIWizard 
                    onCancel={() => transitionTo('dashboard')}
                    onProjectGenerated={handleAIProjectGenerated}
                />
            )}
        </div>
      </main>
    </div>
  );
}

export default App;