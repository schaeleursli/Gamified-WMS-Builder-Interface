import React, { useState } from 'react';
import { XIcon, ClipboardIcon, FileTextIcon, TagIcon } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
interface CreateWMSModalProps {
  projectId: string;
  onClose: () => void;
}
export const CreateWMSModal: React.FC<CreateWMSModalProps> = ({
  projectId,
  onClose
}) => {
  const {
    createWMS,
    templates,
    applyTemplate
  } = useProject();
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    scope?: string;
  }>({});
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useTemplate && selectedTemplateId) {
      applyTemplate(projectId, selectedTemplateId);
      onClose();
      return;
    }
    const newErrors: {
      title?: string;
      scope?: string;
    } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!scope.trim()) {
      newErrors.scope = 'Scope is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const newWMS = createWMS(projectId, title, scope);
    // Add tags if provided
    if (tags.trim()) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      newWMS.tags = tagArray;
      // Update the WMS with tags
      // In a real app, you'd update the WMS here
    }
    onClose();
  };
  return <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold">
            Create Work Method Statement
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="flex space-x-4">
              <button className={`flex-1 py-2 rounded-lg transition-colors ${!useTemplate ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`} onClick={() => setUseTemplate(false)}>
                Create New
              </button>
              <button className={`flex-1 py-2 rounded-lg transition-colors ${useTemplate ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`} onClick={() => setUseTemplate(true)}>
                Use Template
              </button>
            </div>
          </div>
          {useTemplate ? <div>
              <label className="block text-sm font-medium mb-2">
                Select Template
              </label>
              {templates.length === 0 ? <div className="text-center py-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-slate-500 dark:text-slate-400 mb-2">
                    No templates available
                  </p>
                  <button onClick={() => setUseTemplate(false)} className="text-sm text-blue-500 hover:text-blue-600">
                    Create a new WMS instead
                  </button>
                </div> : <div className="space-y-2 max-h-60 overflow-y-auto">
                  {templates.map(template => <div key={template.id} className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedTemplateId === template.id ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800'}`} onClick={() => setSelectedTemplateId(template.id)}>
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {template.wms.steps.length} steps,{' '}
                        {template.wms.risks.length} risks
                      </div>
                    </div>)}
                </div>}
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={!selectedTemplateId} className={`px-4 py-2 text-sm rounded-lg transition-colors ${selectedTemplateId ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
                  Use Template
                </button>
              </div>
            </div> : <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="wms-title" className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClipboardIcon size={16} className="text-slate-400" />
                  </div>
                  <input type="text" id="wms-title" value={title} onChange={e => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({
                    ...errors,
                    title: undefined
                  });
                }
              }} className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.title ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'} focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all`} placeholder="Lifting 120t Transformer with Crawler Crane" />
                </div>
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="wms-scope" className="block text-sm font-medium mb-1">
                  Scope <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
                    <FileTextIcon size={16} className="text-slate-400" />
                  </div>
                  <textarea id="wms-scope" value={scope} onChange={e => {
                setScope(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({
                    ...errors,
                    scope: undefined
                  });
                }
              }} rows={3} className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.scope ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'} focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all`} placeholder="Describe the scope of this work method..." />
                </div>
                {errors.scope && <p className="mt-1 text-sm text-red-500">{errors.scope}</p>}
              </div>
              <div className="mb-6">
                <label htmlFor="wms-tags" className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon size={16} className="text-slate-400" />
                  </div>
                  <input type="text" id="wms-tags" value={tags} onChange={e => setTags(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="lifting, crane, heavy, transformer" />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Create WMS
                </button>
              </div>
            </form>}
        </div>
      </div>
    </div>;
};