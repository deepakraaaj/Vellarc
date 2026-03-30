import type { Project, ProjectStatus } from '../types';
import { getSupabaseClient } from './supabase';
import { normalizeProject, prepareProjectForSave } from './projectUtils';

const PROJECTS_TABLE = 'projects';
const PROJECT_COLUMNS = 'id, title, tagline, status, last_updated, project_data, created_at, updated_at';

type ProjectRow = {
  created_at: string;
  id: string;
  last_updated: string;
  project_data: Project;
  status: ProjectStatus;
  tagline: string;
  title: string;
  updated_at: string;
};

type SupabaseErrorLike = {
  code?: string;
  details?: string;
  hint?: string;
  message: string;
};

const toStoreError = (action: 'load' | 'save', error: SupabaseErrorLike) => {
  if (error.code === '42P01') {
    return new Error(
      'The Supabase `projects` table does not exist yet. Run `supabase/projects.sql` in the Supabase SQL editor, then reload.',
    );
  }

  if (error.code === '42501') {
    return new Error(
      'Supabase rejected access to `projects`. Apply the row-level security policies from `supabase/projects.sql` before using the app.',
    );
  }

  return new Error(`Could not ${action} projects in Supabase: ${error.message}`);
};

const mapRowToProject = (row: ProjectRow): Project =>
  normalizeProject({
    ...row.project_data,
    id: row.id,
    lastUpdated: row.last_updated || row.project_data.lastUpdated,
    status: row.status || row.project_data.status,
    tagline: row.tagline ?? row.project_data.tagline,
    title: row.title ?? row.project_data.title,
  });

const mapProjectToRow = (project: Project) => ({
  id: project.id,
  last_updated: project.lastUpdated,
  project_data: project,
  status: project.status,
  tagline: project.tagline,
  title: project.title,
});

export const fetchProjects = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select(PROJECT_COLUMNS)
    .order('updated_at', { ascending: false });

  if (error) {
    throw toStoreError('load', error);
  }

  return (data ?? []).map((row) => mapRowToProject(row as ProjectRow));
};

export const persistProject = async (project: Project) => {
  const supabase = getSupabaseClient();
  const projectToSave = prepareProjectForSave(project);
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .upsert(mapProjectToRow(projectToSave), { onConflict: 'id' })
    .select(PROJECT_COLUMNS)
    .single();

  if (error) {
    throw toStoreError('save', error);
  }

  return mapRowToProject(data as ProjectRow);
};
