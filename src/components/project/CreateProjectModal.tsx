import React, { useState } from 'react';
import { XIcon, FolderIcon, MapPinIcon, FileTextIcon } from 'lucide-react';
interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (name: string, location: string, description?: string) => void;
}
export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
  }>({});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      location?: string;
    } = {};
    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onCreate(name, location, description);
  };
  return <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="project-name" className="block text-sm font-medium mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FolderIcon size={16} className="text-slate-400" />
              </div>
              <input type="text" id="project-name" value={name} onChange={e => {
              setName(e.target.value);
              if (e.target.value.trim()) {
                setErrors({
                  ...errors,
                  name: undefined
                });
              }
            }} className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.name ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'} focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all`} placeholder="Solar Farm Phase 1" />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="project-location" className="block text-sm font-medium mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon size={16} className="text-slate-400" />
              </div>
              <input type="text" id="project-location" value={location} onChange={e => {
              setLocation(e.target.value);
              if (e.target.value.trim()) {
                setErrors({
                  ...errors,
                  location: undefined
                });
              }
            }} className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.location ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'} focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all`} placeholder="Houston, TX" />
            </div>
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="project-description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
                <FileTextIcon size={16} className="text-slate-400" />
              </div>
              <textarea id="project-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="Brief description of the project..." />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>;
};