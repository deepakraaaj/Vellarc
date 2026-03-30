import { initialProject } from '../mockData';
import type { Project } from '../types';

const projectDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export const formatProjectDate = (date = new Date()) => projectDateFormatter.format(date);

export const createProjectId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}`;
};

export const cloneProject = (project: Project): Project => structuredClone(project);

export const normalizeProject = (project: Project): Project => {
  const clonedProject = cloneProject(project);

  return {
    ...clonedProject,
    id: clonedProject.id || createProjectId(),
    title: clonedProject.title?.trim() || 'Untitled Project',
    tagline: clonedProject.tagline ?? '',
    status: clonedProject.status || 'Draft',
    lastUpdated: clonedProject.lastUpdated || formatProjectDate(),
  };
};

export const prepareProjectForSave = (project: Project): Project => ({
  ...normalizeProject(project),
  lastUpdated: formatProjectDate(),
});

export const createDraftProject = (): Project => {
  const project = cloneProject(initialProject);

  return {
    ...project,
    id: createProjectId(),
    title: 'Untitled Project',
    status: 'Draft',
    lastUpdated: formatProjectDate(),
  };
};

export const createLocalSeedProjects = (): Project[] => [cloneProject(initialProject)];
