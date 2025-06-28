import React, { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { Project, WMS } from '../../types';
import { FolderIcon, PlusIcon, ClipboardIcon, CalendarIcon, MapPinIcon, SearchIcon, FilterIcon, ArrowRightIcon } from 'lucide-react';
import { CreateProjectModal } from './CreateProjectModal';
import { CreateWMSModal } from '../wms/CreateWMSModal';
export const ProjectDashboard: React.FC = () => {
  const {
    projects,
    currentProject,
    setCurrentProject,
    createProject
  } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateWMS, setShowCreateWMS] = useState(false);
  const filteredProjects = projects.filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.location.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleProjectSelect = (projectId: string) => {
    setCurrentProject(projectId);
  };
  const handleCreateProject = (name: string, location: string, description?: string) => {
    createProject(name, location, description);
    setShowCreateProject(false);
  };
  return <div className="p-6 h-full overflow-y-auto">
      {showCreateProject && <CreateProjectModal onClose={() => setShowCreateProject(false)} onCreate={handleCreateProject} />}
      {showCreateWMS && currentProject && <CreateWMSModal projectId={currentProject.id} onClose={() => setShowCreateWMS(false)} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => setShowCreateProject(true)} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <PlusIcon size={18} className="mr-2" />
          New Project
        </button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <input type="text" placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
          <SearchIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>
      {filteredProjects.length === 0 ? <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <FolderIcon size={32} />
          </div>
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Create your first project to get started
          </p>
          <button onClick={() => setShowCreateProject(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Create Project
          </button>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => <ProjectCard key={project.id} project={project} isActive={currentProject?.id === project.id} onSelect={handleProjectSelect} onCreateWMS={() => {
        setCurrentProject(project.id);
        setShowCreateWMS(true);
      }} />)}
        </div>}
      {currentProject && <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {currentProject.name} - Work Method Statements
            </h2>
            <button onClick={() => setShowCreateWMS(true)} className="flex items-center px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all">
              <PlusIcon size={16} className="mr-1.5" />
              New WMS
            </button>
          </div>
          {currentProject.wmsList.length === 0 ? <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <ClipboardIcon size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">No WMS documents yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Create your first Work Method Statement for this project
              </p>
              <button onClick={() => setShowCreateWMS(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Create WMS
              </button>
            </div> : <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-500 dark:text-slate-400 text-sm">
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Last Updated</div>
                <div className="col-span-2">Steps</div>
                <div className="col-span-2">Risks</div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {currentProject.wmsList.map(wms => <WMSListItem key={wms.id} wms={wms} />)}
              </div>
            </div>}
        </div>}
    </div>;
};
interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onSelect: (projectId: string) => void;
  onCreateWMS: () => void;
}
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isActive,
  onSelect,
  onCreateWMS
}) => {
  return <div className={`border rounded-lg overflow-hidden transition-all cursor-pointer
        ${isActive ? 'border-blue-400 dark:border-blue-600 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`} onClick={() => onSelect(project.id)}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FolderIcon size={20} />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>
        <h3 className="font-semibold text-lg mt-3 mb-1">{project.name}</h3>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
          <MapPinIcon size={14} className="mr-1" />
          {project.location}
        </div>
        {project.description && <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
            {project.description}
          </p>}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {project.wmsList.length} WMS document
            {project.wmsList.length !== 1 ? 's' : ''}
          </div>
          <button onClick={e => {
          e.stopPropagation();
          onCreateWMS();
        }} className="flex items-center text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
            <PlusIcon size={12} className="mr-1" />
            New WMS
          </button>
        </div>
      </div>
    </div>;
};
interface WMSListItemProps {
  wms: WMS;
}
const WMSListItem: React.FC<WMSListItemProps> = ({
  wms
}) => {
  const formattedDate = new Date(wms.updatedAt).toLocaleDateString();
  return <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <div className="col-span-5">
        <div className="font-medium">{wms.title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {wms.scope}
        </div>
      </div>
      <div className="col-span-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
        <CalendarIcon size={14} className="mr-2" />
        {formattedDate}
      </div>
      <div className="col-span-2 flex items-center">
        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
          {wms.steps.length} Steps
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-between">
        <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded text-xs">
          {wms.risks.length} Risks
        </div>
        <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>;
};