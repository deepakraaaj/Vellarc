import { supabase } from '../lib/supabaseClient';
import { Project } from '../types';

// The `projects` table stores one row per project, scoped to the owning user
// via `user_id` + RLS (see supabase/schema.sql). The full nested Project
// shape (personas, features, testing cases, etc.) is stored as `data` jsonb
// so the app's rich, evolving document model doesn't need a matching
// relational schema.
interface ProjectRow {
  id: string;
  user_id: string;
  data: Omit<Project, 'id'>;
  created_at: string;
  updated_at: string;
}

function rowToProject(row: ProjectRow): Project {
  return { ...row.data, id: row.id };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, user_id, data, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data as ProjectRow[]).map(rowToProject);
}

export async function upsertProject(project: Project, userId: string): Promise<Project> {
  const { id, ...rest } = project;
  const isTempId = /^\d+$/.test(id) || id === 'new'; // client-generated placeholder IDs

  if (isTempId) {
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: userId, data: rest })
      .select('id, user_id, data, created_at, updated_at')
      .single();
    if (error) throw error;
    return rowToProject(data as ProjectRow);
  }

  const { data, error } = await supabase
    .from('projects')
    .update({ data: rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, user_id, data, created_at, updated_at')
    .single();
  if (error) throw error;
  return rowToProject(data as ProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}
