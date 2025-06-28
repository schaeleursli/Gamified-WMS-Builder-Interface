import React, { useState } from 'react';
import { XIcon, SaveIcon, TagIcon } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { WMS } from '../../types';
interface SaveAsTemplateProps {
  wms: WMS;
  onClose: () => void;
}
export const SaveAsTemplate: React.FC<SaveAsTemplateProps> = ({
  wms,
  onClose
}) => {
  const {
    saveAsTemplate
  } = useProject();
  const [title, setTitle] = useState(`${wms.title} Template`);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState(wms.tags.join(', '));
  const [success, setSuccess] = useState(false);
  const handleSave = () => {
    if (!title.trim()) return;
    const templateTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const template = saveAsTemplate({
      ...wms,
      title: title,
      tags: templateTags
    });
    setSuccess(true);
    // Close modal after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };
  return <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold">Save as Template</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-4">
          {success ? <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Template Saved!</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Your template has been saved successfully
              </p>
            </div> : <>
              <div className="mb-4">
                <label htmlFor="template-title" className="block text-sm font-medium mb-1">
                  Template Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SaveIcon size={16} className="text-slate-400" />
                  </div>
                  <input type="text" id="template-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="Template name" />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="template-description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea id="template-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="Optional description for this template..." />
              </div>
              <div className="mb-4">
                <label htmlFor="template-category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select id="template-category" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
                  <option value="">Select category (optional)</option>
                  <option value="lifting">Lifting</option>
                  <option value="transport">Transport</option>
                  <option value="installation">Installation</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="construction">Construction</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="template-tags" className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon size={16} className="text-slate-400" />
                  </div>
                  <input type="text" id="template-tags" value={tags} onChange={e => setTags(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="e.g., lifting, crane, transformer" />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!title.trim()} className={`px-4 py-2 text-sm rounded-lg transition-colors ${title.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
                  Save Template
                </button>
              </div>
            </>}
        </div>
      </div>
    </div>;
};