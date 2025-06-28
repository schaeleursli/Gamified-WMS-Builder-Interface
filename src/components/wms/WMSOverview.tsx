import React, { useState } from 'react';
import { ClipboardIcon, ArrowLeftIcon, CheckCircleIcon, SaveIcon, TagIcon, PlusIcon, LayoutIcon, FileTextIcon } from 'lucide-react';
import { WMS } from '../../types';
import { StepList } from './StepList';
import { RiskPanel } from './RiskPanel';
import { EquipmentSummary } from './EquipmentSummary';
import { SaveAsTemplate } from './SaveAsTemplate';
import { useProject } from '../../contexts/ProjectContext';
interface WMSOverviewProps {
  wms: WMS;
  onBack: () => void;
}
export const WMSOverview: React.FC<WMSOverviewProps> = ({
  wms,
  onBack
}) => {
  const {
    updateWMS
  } = useProject();
  const [activeTab, setActiveTab] = useState<'steps' | 'risks' | 'equipment'>('steps');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  // Function to update the WMS when steps, risks, or equipment changes
  const handleWMSUpdate = (updatedWMS: WMS) => {
    updateWMS(updatedWMS);
  };
  return <div className="p-6 h-full overflow-y-auto">
      {showSaveTemplate && <SaveAsTemplate wms={wms} onClose={() => setShowSaveTemplate(false)} />}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{wms.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{wms.scope}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setShowSaveTemplate(true)} className="flex items-center px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all">
            <SaveIcon size={16} className="mr-1.5" />
            Save as Template
          </button>
          <button className="flex items-center px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/30 transition-all">
            <CheckCircleIcon size={16} className="mr-1.5" />
            Complete
          </button>
        </div>
      </div>
      {wms.tags.length > 0 && <div className="flex flex-wrap gap-2 mb-6">
          {wms.tags.map((tag, index) => <div key={index} className="flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm">
              <TagIcon size={14} className="mr-1.5" />
              {tag}
            </div>)}
        </div>}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mb-6 flex flex-col">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'steps' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setActiveTab('steps')}>
            <div className="flex items-center justify-center">
              <ClipboardIcon size={18} className="mr-2" />
              Work Steps ({wms.steps.length})
            </div>
          </button>
          <button className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'risks' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setActiveTab('risks')}>
            <div className="flex items-center justify-center">
              <LayoutIcon size={18} className="mr-2" />
              Risk Assessment ({wms.risks.length})
            </div>
          </button>
          <button className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'equipment' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setActiveTab('equipment')}>
            <div className="flex items-center justify-center">
              <FileTextIcon size={18} className="mr-2" />
              Equipment Summary
            </div>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {activeTab === 'steps' && <StepList wms={wms} onUpdate={handleWMSUpdate} />}
          {activeTab === 'risks' && <RiskPanel wms={wms} onUpdate={handleWMSUpdate} />}
          {activeTab === 'equipment' && <EquipmentSummary wms={wms} onUpdate={handleWMSUpdate} />}
        </div>
      </div>
    </div>;
};