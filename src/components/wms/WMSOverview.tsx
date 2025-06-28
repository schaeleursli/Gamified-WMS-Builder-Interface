import React, { useState } from 'react';
import { ClipboardIcon, ArrowLeftIcon, CheckCircleIcon, SaveIcon, TagIcon, PlusIcon, LayoutIcon, FileTextIcon, TrophyIcon, DownloadIcon } from 'lucide-react';
import { WMS } from '../../types';
import { StepList } from './StepList';
import { RiskPanel } from './RiskPanel';
import { EquipmentSummary } from './EquipmentSummary';
import { SaveAsTemplate } from './SaveAsTemplate';
import { useProject } from '../../contexts/ProjectContext';
import { XPProgress } from '../XPProgress';
import { MissionComplete } from '../MissionComplete';
import { AIAssistant } from '../AIAssistant';
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
  const [activeTab, setActiveTab] = useState<'steps' | 'risks' | 'equipment' | 'ai'>('steps');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [xpPoints, setXpPoints] = useState(wms.steps.length * 10 + wms.risks.length * 15);
  // Function to update the WMS when steps, risks, or equipment changes
  const handleWMSUpdate = (updatedWMS: WMS) => {
    updateWMS(updatedWMS);
  };
  // Calculate completion percentage for XP bar
  const totalPossiblePoints = 100; // Example: 100 points for a complete WMS
  const completionPercentage = Math.min(100, Math.round(xpPoints / totalPossiblePoints * 100));
  // Mark WMS as complete
  const handleCompleteWMS = () => {
    setIsComplete(true);
    // Add bonus XP for completion
    setXpPoints(prev => prev + 50);
  };
  if (isComplete) {
    return <MissionComplete xpPoints={xpPoints} onBack={onBack} wms={wms} />;
  }
  return <div className="p-6 h-full overflow-y-auto">
      {showSaveTemplate && <SaveAsTemplate wms={wms} onClose={() => setShowSaveTemplate(false)} />}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {wms.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{wms.scope}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setShowSaveTemplate(true)} className="flex items-center px-3 py-1.5 text-sm bg-pastel-blue-100 dark:bg-pastel-blue-900/30 text-pastel-blue-600 dark:text-pastel-blue-400 rounded-lg hover:bg-pastel-blue-200 dark:hover:bg-pastel-blue-800/30 transition-all shadow-soft">
            <SaveIcon size={16} className="mr-1.5" />
            Save as Template
          </button>
          <button onClick={handleCompleteWMS} className="flex items-center px-3 py-1.5 text-sm bg-pastel-green-100 dark:bg-pastel-green-900/30 text-pastel-green-600 dark:text-pastel-green-400 rounded-lg hover:bg-pastel-green-200 dark:hover:bg-pastel-green-800/30 transition-all shadow-soft">
            <CheckCircleIcon size={16} className="mr-1.5" />
            Complete
          </button>
        </div>
      </div>
      {/* XP Progress Bar */}
      <div className="mb-6">
        <XPProgress xpPoints={xpPoints} completionPercentage={completionPercentage} level={Math.floor(xpPoints / 50) + 1} />
      </div>
      {wms.tags.length > 0 && <div className="flex flex-wrap gap-2 mb-6">
          {wms.tags.map((tag, index) => <div key={index} className="flex items-center px-3 py-1 bg-pastel-peach-100 dark:bg-pastel-peach-900/30 text-pastel-peach-600 dark:text-pastel-peach-400 rounded-full text-sm">
              <TagIcon size={14} className="mr-1.5" />
              {tag}
            </div>)}
        </div>}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card overflow-hidden mb-6 flex flex-col">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'steps' ? 'bg-pastel-blue-50 dark:bg-pastel-blue-900/20 text-pastel-blue-600 dark:text-pastel-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setActiveTab('steps')}>
            <div className="flex items-center justify-center">
              <ClipboardIcon size={18} className="mr-2" />
              Work Steps ({wms.steps.length})
            </div>
          </button>
          <button className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'risks' ? 'bg-pastel-blue-50 dark:bg-pastel-blue-900/20 text-pastel-blue-600 dark:text-pastel-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setActiveTab('risks')}>
            <div className="flex items-center justify-center">
              <LayoutIcon size={18} className="mr-2" />
              Risk Assessment ({wms.risks.length})
            </div>
          </button>
          <button className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'equipment' ? 'bg-pastel-blue-50 dark:bg-pastel-blue-900/20 text-pastel-blue-600 dark:text-pastel-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setActiveTab('equipment')}>
            <div className="flex items-center justify-center">
              <FileTextIcon size={18} className="mr-2" />
              Equipment Summary
            </div>
          </button>
          <button className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'ai' ? 'bg-pastel-blue-50 dark:bg-pastel-blue-900/20 text-pastel-blue-600 dark:text-pastel-blue-400 font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`} onClick={() => setActiveTab('ai')}>
            <div className="flex items-center justify-center">
              <TrophyIcon size={18} className="mr-2" />
              AI Assistant
            </div>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {activeTab === 'steps' && <StepList wms={wms} onUpdate={handleWMSUpdate} onXPChange={points => setXpPoints(prev => prev + points)} />}
          {activeTab === 'risks' && <RiskPanel wms={wms} onUpdate={handleWMSUpdate} onXPChange={points => setXpPoints(prev => prev + points)} />}
          {activeTab === 'equipment' && <EquipmentSummary wms={wms} onUpdate={handleWMSUpdate} onXPChange={points => setXpPoints(prev => prev + points)} />}
          {activeTab === 'ai' && <AIAssistant wms={wms} onRisksAdded={risks => {
          const updatedWMS = {
            ...wms,
            risks: [...wms.risks, ...risks]
          };
          updateWMS(updatedWMS);
          setXpPoints(prev => prev + risks.length * 15);
        }} />}
        </div>
      </div>
      {/* Export options */}
      <div className="flex justify-end">
        <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shadow-soft hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <DownloadIcon size={18} className="mr-2" />
          Export as PDF
        </button>
      </div>
    </div>;
};