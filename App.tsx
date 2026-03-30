import React, { useEffect, useState } from 'react';
import { AlertCircle, CloudOff, Database, LoaderCircle, Menu } from 'lucide-react';
import { AIWizard } from './components/AIWizard';
import { Dashboard } from './components/Dashboard';
import { ProjectEditor } from './components/ProjectEditor';
import { ProjectView } from './components/ProjectView';
import { Sidebar } from './components/Sidebar';
import { fetchProjects, persistProject } from './lib/projectStore';
import {
  createDraftProject,
  createLocalSeedProjects,
  createProjectId,
  prepareProjectForSave,
} from './lib/projectUtils';
import { hasSupabaseCredentials } from './lib/supabase';
import type { Project, ViewMode } from './types';

type StorageMode = 'local' | 'supabase';
type SyncStatus = 'success' | 'warning' | 'error';

const initialStorageMode: StorageMode = hasSupabaseCredentials ? 'supabase' : 'local';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIOverlayOpen, setIsAIOverlayOpen] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>(initialStorageMode);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

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

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      if (initialStorageMode === 'local') {
        setProjects(createLocalSeedProjects());
        setSyncStatus('warning');
        setSyncMessage(
          'Supabase is not configured yet. The workspace is running in local demo mode until you add your project URL and key.',
        );
        setIsLoadingProjects(false);
        return;
      }

      try {
        const loadedProjects = await fetchProjects();
        if (!isMounted) return;

        setProjects(loadedProjects);
        setSyncStatus('success');
        setSyncMessage('Supabase sync is live. Project saves now persist to your database.');
      } catch (error) {
        if (!isMounted) return;

        console.error('Supabase load failed:', error);
        setStorageMode('local');
        setProjects(createLocalSeedProjects());
        setSyncStatus('error');
        setSyncMessage(
          error instanceof Error
            ? `${error.message} Falling back to local demo mode for now.`
            : 'Could not load projects from Supabase. Falling back to local demo mode for now.',
        );
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeProject) return;

    const refreshedProject = projects.find((project) => project.id === activeProject.id);
    if (refreshedProject && refreshedProject !== activeProject) {
      setActiveProject(refreshedProject);
    }
  }, [activeProject, projects]);

  const toggleTheme = () => setIsDarkMode((value) => !value);

  const transitionTo = (mode: ViewMode, project?: Project) => {
    if (project) setActiveProject(project);
    setViewMode(mode);
    setIsMobileMenuOpen(false);
  };

  const handleEditRequest = (project: Project, step: string = 'basic') => {
    setEditorInitialStep(step);
    transitionTo('edit', project);
  };

  const handleSaveProject = async (updatedProject: Project) => {
    setIsSavingProject(true);

    try {
      const projectToSave = prepareProjectForSave(updatedProject);
      const savedProject =
        storageMode === 'supabase' ? await persistProject(projectToSave) : projectToSave;

      setProjects((currentProjects) => [
        savedProject,
        ...currentProjects.filter((project) => project.id !== savedProject.id),
      ]);
      setActiveProject(savedProject);
      setSyncStatus(storageMode === 'supabase' ? 'success' : 'warning');
      setSyncMessage(
        storageMode === 'supabase'
          ? 'Saved to Supabase successfully.'
          : 'Project saved locally. Add Supabase credentials to persist across reloads.',
      );
      transitionTo('view', savedProject);
    } catch (error) {
      console.error('Project save failed:', error);
      setSyncStatus('error');
      setSyncMessage(
        error instanceof Error
          ? error.message
          : 'Could not save this project to Supabase right now.',
      );
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleAIProjectGenerated = async (partialProject: Omit<Project, 'id' | 'lastUpdated'>) => {
    const newProject: Project = {
      ...partialProject,
      id: createProjectId(),
      lastUpdated: '',
    };

    setIsAIOverlayOpen(false);
    await handleSaveProject(newProject);
  };

  const openAIOverlay = () => {
    setIsMobileMenuOpen(false);
    setIsAIOverlayOpen(true);
  };

  const createNewProject = () => {
    handleEditRequest(createDraftProject(), 'basic');
  };

  const SyncIcon =
    syncStatus === 'error' ? AlertCircle : syncStatus === 'success' ? Database : CloudOff;

  const syncBannerClassName =
    syncStatus === 'error'
      ? 'border-rose-200/80 bg-rose-50/90 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200'
      : syncStatus === 'success'
        ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
        : 'border-amber-200/80 bg-amber-50/90 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200';

  return (
    <div
      className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white ${isDarkMode ? 'dark' : ''}`}
    >
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40 border-b border-gray-200 dark:border-white/10 flex items-center px-4 justify-between shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <img
            src="/specarc-mark.svg"
            alt="SpecArc logo"
            className="w-10 h-10 rounded-xl shadow-[0_12px_28px_-12px_rgba(99,102,241,0.8)]"
          />
          <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
            SpecArc
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg active:scale-95 transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-500 ease-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeView={viewMode}
          onDashboardClick={() => transitionTo('dashboard')}
          onNewProjectClick={createNewProject}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      </aside>

      <main className="md:ml-80 min-h-screen transition-all duration-300 pt-20 md:pt-4 pr-4 md:pr-8 pb-8">
        <div className="max-w-[1800px] mx-auto">
          {syncMessage && syncStatus && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm ${syncBannerClassName}`}
            >
              <SyncIcon size={18} className="mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold tracking-tight">
                  {storageMode === 'supabase' ? 'Supabase Connected' : 'Local Demo Mode'}
                </p>
                <p className="text-sm leading-relaxed opacity-90">{syncMessage}</p>
              </div>
            </div>
          )}

          {isLoadingProjects ? (
            <div className="glass-panel flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-slate-200/70 px-6 text-center shadow-sm dark:border-slate-800">
              <LoaderCircle
                size={34}
                className="animate-spin text-indigo-600 dark:text-indigo-300"
              />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Loading your workspace
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Pulling projects from{' '}
                  {storageMode === 'supabase' ? 'Supabase' : 'local demo data'}.
                </p>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'dashboard' && (
                <Dashboard
                  projects={projects}
                  onNewProject={createNewProject}
                  onSelectProject={(project) => transitionTo('view', project)}
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
                  isSaving={isSavingProject}
                  onSave={handleSaveProject}
                  onCancel={() =>
                    transitionTo(
                      projects.some((project) => project.id === activeProject.id)
                        ? 'view'
                        : 'dashboard',
                      activeProject,
                    )
                  }
                />
              )}
            </>
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
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Chat Assistant
          </span>
        </div>
        <div className="relative w-14 h-14 md:w-[3.75rem] md:h-[3.75rem] rounded-full bg-white/92 dark:bg-slate-950/92 border border-white/70 dark:border-white/10 shadow-[0_20px_45px_-18px_rgba(15,23,42,0.5)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_25px_60px_-16px_rgba(99,102,241,0.5)]">
          <img src="/specarc-mark.svg" alt="SpecArc AI" className="w-10 h-10 rounded-2xl" />
          <span className="absolute right-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-[0_0_14px_rgba(74,222,128,0.7)]" />
        </div>
      </button>
    </div>
  );
}

export default App;
