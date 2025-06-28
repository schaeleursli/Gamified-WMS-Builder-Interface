import React, { useEffect, useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, WMS, Template, WorkStep, Risk, Equipment } from '../types';
interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  templates: Template[];
  // Project operations
  createProject: (name: string, location: string, description?: string) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setCurrentProject: (projectId: string) => void;
  // WMS operations
  createWMS: (projectId: string, title: string, scope: string) => WMS;
  updateWMS: (wms: WMS) => void;
  deleteWMS: (projectId: string, wmsId: string) => void;
  // Template operations
  saveAsTemplate: (wms: WMS, title?: string) => Template;
  applyTemplate: (projectId: string, templateId: string) => WMS;
}
// Create context with default values
const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  currentProject: null,
  templates: [],
  createProject: () => ({
    id: '',
    name: '',
    location: '',
    wmsList: [],
    createdAt: '',
    updatedAt: ''
  }),
  updateProject: () => {},
  deleteProject: () => {},
  setCurrentProject: () => {},
  createWMS: () => ({
    id: '',
    projectId: '',
    title: '',
    scope: '',
    tags: [],
    steps: [],
    risks: [],
    createdAt: '',
    updatedAt: ''
  }),
  updateWMS: () => {},
  deleteWMS: () => {},
  saveAsTemplate: () => ({
    id: '',
    title: '',
    wms: {
      title: '',
      scope: '',
      tags: [],
      steps: [],
      risks: []
    },
    createdAt: '',
    updatedAt: ''
  }),
  applyTemplate: () => ({
    id: '',
    projectId: '',
    title: '',
    scope: '',
    tags: [],
    steps: [],
    risks: [],
    createdAt: '',
    updatedAt: ''
  })
});
// Helper function to deep clone objects
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));
export const ProjectProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedProjects = localStorage.getItem('wms_projects');
    const savedTemplates = localStorage.getItem('wms_templates');
    const savedCurrentProject = localStorage.getItem('wms_current_project');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
    if (savedCurrentProject) {
      const projectId = JSON.parse(savedCurrentProject);
      const project = JSON.parse(savedProjects || '[]').find((p: Project) => p.id === projectId);
      if (project) {
        setCurrentProjectState(project);
      }
    }
  }, []);
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wms_projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('wms_templates', JSON.stringify(templates));
  }, [templates]);
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('wms_current_project', JSON.stringify(currentProject.id));
    }
  }, [currentProject]);
  // Project operations
  const createProject = (name: string, location: string, description?: string): Project => {
    const timestamp = new Date().toISOString();
    const newProject: Project = {
      id: uuidv4(),
      name,
      location,
      description,
      wmsList: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectState(newProject);
    return newProject;
  };
  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(project => project.id === updatedProject.id ? {
      ...updatedProject,
      updatedAt: new Date().toISOString()
    } : project));
    if (currentProject?.id === updatedProject.id) {
      setCurrentProjectState({
        ...updatedProject,
        updatedAt: new Date().toISOString()
      });
    }
  };
  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProjectState(null);
    }
  };
  const setCurrentProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectState(project);
    }
  };
  // WMS operations
  const createWMS = (projectId: string, title: string, scope: string): WMS => {
    const timestamp = new Date().toISOString();
    const newWMS: WMS = {
      id: uuidv4(),
      projectId,
      title,
      scope,
      tags: [],
      steps: [],
      risks: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          wmsList: [...project.wmsList, newWMS],
          updatedAt: timestamp
        };
      }
      return project;
    }));
    if (currentProject?.id === projectId) {
      setCurrentProjectState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wmsList: [...prev.wmsList, newWMS],
          updatedAt: timestamp
        };
      });
    }
    return newWMS;
  };
  const updateWMS = (updatedWMS: WMS) => {
    const timestamp = new Date().toISOString();
    setProjects(prev => prev.map(project => {
      if (project.id === updatedWMS.projectId) {
        return {
          ...project,
          wmsList: project.wmsList.map(wms => wms.id === updatedWMS.id ? {
            ...updatedWMS,
            updatedAt: timestamp
          } : wms),
          updatedAt: timestamp
        };
      }
      return project;
    }));
    if (currentProject?.id === updatedWMS.projectId) {
      setCurrentProjectState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wmsList: prev.wmsList.map(wms => wms.id === updatedWMS.id ? {
            ...updatedWMS,
            updatedAt: timestamp
          } : wms),
          updatedAt: timestamp
        };
      });
    }
  };
  const deleteWMS = (projectId: string, wmsId: string) => {
    const timestamp = new Date().toISOString();
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          wmsList: project.wmsList.filter(wms => wms.id !== wmsId),
          updatedAt: timestamp
        };
      }
      return project;
    }));
    if (currentProject?.id === projectId) {
      setCurrentProjectState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wmsList: prev.wmsList.filter(wms => wms.id !== wmsId),
          updatedAt: timestamp
        };
      });
    }
  };
  // Template operations
  const saveAsTemplate = (wms: WMS, title?: string): Template => {
    const timestamp = new Date().toISOString();
    // Remove project-specific IDs from the WMS
    const {
      projectId,
      id,
      createdAt,
      updatedAt,
      ...wmsData
    } = wms;
    const newTemplate: Template = {
      id: uuidv4(),
      title: title || `${wms.title} Template`,
      wms: deepClone(wmsData),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };
  const applyTemplate = (projectId: string, templateId: string): WMS => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    const timestamp = new Date().toISOString();
    // Create a new WMS from the template
    const newWMS: WMS = {
      id: uuidv4(),
      projectId,
      title: template.wms.title,
      scope: template.wms.scope,
      tags: [...template.wms.tags],
      steps: template.wms.steps.map(step => ({
        ...deepClone(step),
        id: uuidv4(),
        wmsId: '' // Will be updated after WMS is created
      })),
      risks: template.wms.risks.map(risk => ({
        ...deepClone(risk),
        id: uuidv4(),
        wmsId: '' // Will be updated after WMS is created
      })),
      templateId: template.id,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    // Update the step and risk WMS IDs
    newWMS.steps.forEach(step => {
      step.wmsId = newWMS.id;
    });
    newWMS.risks.forEach(risk => {
      risk.wmsId = newWMS.id;
    });
    // Add the new WMS to the project
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          wmsList: [...project.wmsList, newWMS],
          updatedAt: timestamp
        };
      }
      return project;
    }));
    if (currentProject?.id === projectId) {
      setCurrentProjectState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wmsList: [...prev.wmsList, newWMS],
          updatedAt: timestamp
        };
      });
    }
    return newWMS;
  };
  const contextValue: ProjectContextType = {
    projects,
    currentProject,
    templates,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    createWMS,
    updateWMS,
    deleteWMS,
    saveAsTemplate,
    applyTemplate
  };
  return <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>;
};
export const useProject = () => useContext(ProjectContext);