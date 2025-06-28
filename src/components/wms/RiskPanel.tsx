import React, { useState, Fragment } from 'react';
import { AlertTriangleIcon, PlusIcon, XIcon, BrainIcon, LightbulbIcon, LoaderIcon, CheckIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { WMS, Risk, RiskCategory, RiskSeverity, RiskLikelihood, RiskLevel, WorkStep } from '../../types';
interface RiskPanelProps {
  wms: WMS;
  onUpdate: (wms: WMS) => void;
}
export const RiskPanel: React.FC<RiskPanelProps> = ({
  wms,
  onUpdate
}) => {
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    type: 'General',
    description: '',
    severity: 3,
    likelihood: 3,
    mitigation: '',
    associatedStepIds: [],
    source: 'manual'
  });
  // AI Risk Suggestion
  const [isAILoading, setIsAILoading] = useState(false);
  const [suggestedRisks, setSuggestedRisks] = useState<Risk[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<number[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const handleAddRisk = () => {
    if (!newRisk.description || !newRisk.mitigation) return;
    const timestamp = new Date().toISOString();
    const risk: Risk = {
      id: uuidv4(),
      wmsId: wms.id,
      type: newRisk.type as RiskCategory,
      description: newRisk.description,
      severity: newRisk.severity as RiskSeverity,
      likelihood: newRisk.likelihood as RiskLikelihood,
      mitigation: newRisk.mitigation,
      associatedStepIds: newRisk.associatedStepIds,
      source: 'manual'
    };
    const updatedWMS: WMS = {
      ...wms,
      risks: [...wms.risks, risk],
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
    setNewRisk({
      type: 'General',
      description: '',
      severity: 3,
      likelihood: 3,
      mitigation: '',
      associatedStepIds: [],
      source: 'manual'
    });
    setIsAddingRisk(false);
  };
  const handleUpdateRisk = (riskId: string) => {
    if (!newRisk.description || !newRisk.mitigation) return;
    const timestamp = new Date().toISOString();
    const updatedWMS: WMS = {
      ...wms,
      risks: wms.risks.map(risk => risk.id === riskId ? {
        ...risk,
        type: newRisk.type as RiskCategory,
        description: newRisk.description || risk.description,
        severity: newRisk.severity as RiskSeverity,
        likelihood: newRisk.likelihood as RiskLikelihood,
        mitigation: newRisk.mitigation || risk.mitigation,
        associatedStepIds: newRisk.associatedStepIds
      } : risk),
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
    setNewRisk({
      type: 'General',
      description: '',
      severity: 3,
      likelihood: 3,
      mitigation: '',
      associatedStepIds: [],
      source: 'manual'
    });
    setEditingRiskId(null);
  };
  const handleDeleteRisk = (riskId: string) => {
    const timestamp = new Date().toISOString();
    const updatedWMS: WMS = {
      ...wms,
      risks: wms.risks.filter(risk => risk.id !== riskId),
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
  };
  const handleEditClick = (risk: Risk) => {
    setNewRisk({
      type: risk.type,
      description: risk.description,
      severity: risk.severity,
      likelihood: risk.likelihood,
      mitigation: risk.mitigation,
      associatedStepIds: risk.associatedStepIds || [],
      source: risk.source
    });
    setEditingRiskId(risk.id);
  };
  const getRiskLevel = (severity: number, likelihood: number): {
    level: RiskLevel;
    color: string;
  } => {
    const score = severity * likelihood;
    if (score >= 15) {
      return {
        level: 'High',
        color: 'bg-red-500'
      };
    }
    if (score >= 8) {
      return {
        level: 'Medium',
        color: 'bg-yellow-500'
      };
    }
    return {
      level: 'Low',
      color: 'bg-green-500'
    };
  };
  const handleGenerateAIRisks = async () => {
    setIsAILoading(true);
    setShowAIPanel(true);
    try {
      // In a real app, this would be an API call to your AI service
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAIRisks: Risk[] = [{
        id: 'ai-1',
        wmsId: wms.id,
        type: 'Lifting',
        description: 'Crane tipping due to soft ground',
        severity: 5,
        likelihood: 3,
        mitigation: 'Conduct soil bearing analysis and use mats if necessary',
        source: 'ai'
      }, {
        id: 'ai-2',
        wmsId: wms.id,
        type: 'Lifting',
        description: 'Overhead obstruction during lift',
        severity: 3,
        likelihood: 2,
        mitigation: 'Use spotter and check clearances prior to lift',
        source: 'ai'
      }, {
        id: 'ai-3',
        wmsId: wms.id,
        type: 'Lifting',
        description: 'Sling failure',
        severity: 4,
        likelihood: 2,
        mitigation: 'Use certified rigging and double-check load limits',
        source: 'ai'
      }];
      setSuggestedRisks(mockAIRisks);
    } catch (error) {
      console.error('Error generating AI risks:', error);
    } finally {
      setIsAILoading(false);
    }
  };
  const handleSelectAIRisk = (index: number) => {
    setSelectedRisks(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  const handleAddAIRisks = () => {
    const timestamp = new Date().toISOString();
    const risksToAdd = selectedRisks.map(index => {
      const risk = suggestedRisks[index];
      return {
        ...risk,
        id: uuidv4()
      };
    });
    const updatedWMS: WMS = {
      ...wms,
      risks: [...wms.risks, ...risksToAdd],
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
    setSuggestedRisks([]);
    setSelectedRisks([]);
    setShowAIPanel(false);
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Risk Assessment</h2>
        <div className="flex space-x-2">
          <button onClick={handleGenerateAIRisks} className="flex items-center px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all">
            <BrainIcon size={16} className="mr-1.5" />
            AI Suggestions
          </button>
          <button onClick={() => setIsAddingRisk(true)} className="flex items-center px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all">
            <PlusIcon size={16} className="mr-1.5" />
            Add Risk
          </button>
        </div>
      </div>
      {/* 5x5 Risk Matrix */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">5x5 Risk Matrix</h3>
        <div className="grid grid-cols-6 gap-1 text-center text-sm">
          <div className="bg-slate-100 dark:bg-slate-700 p-2 font-medium">
            Severity ↓<br />
            Likelihood →
          </div>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-slate-100 dark:bg-slate-700 p-2 font-medium">
              {i}
            </div>)}
          {[1, 2, 3, 4, 5].map(severity => <Fragment key={severity}>
              <div className="bg-slate-100 dark:bg-slate-700 p-2 font-medium">
                {severity}
              </div>
              {[1, 2, 3, 4, 5].map(likelihood => {
            const score = severity * likelihood;
            let bgColor = 'bg-green-200 dark:bg-green-900/30';
            if (score >= 15) bgColor = 'bg-red-200 dark:bg-red-900/30';else if (score >= 8) bgColor = 'bg-yellow-200 dark:bg-yellow-900/30';
            return <div key={`${severity}-${likelihood}`} className={`${bgColor} p-2 font-medium transition-all hover:opacity-80`}>
                    {score}
                  </div>;
          })}
            </Fragment>)}
        </div>
      </div>
      {/* AI Risk Suggestions Panel */}
      {showAIPanel && <div className="border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                <BrainIcon size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Risk Suggestions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Based on your WMS scope and steps
                </p>
              </div>
            </div>
            {!isAILoading && suggestedRisks.length === 0 && <button onClick={handleGenerateAIRisks} className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all flex items-center">
                <LightbulbIcon size={16} className="mr-1.5" />
                Generate Suggestions
              </button>}
          </div>
          <div className="mt-4">
            {isAILoading ? <div className="flex flex-col items-center justify-center py-8">
                <LoaderIcon size={24} className="text-blue-500 animate-spin mb-3" />
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Analyzing your WMS and generating risks...
                </p>
              </div> : <>
                {suggestedRisks.length > 0 ? <div className="space-y-3">
                    {suggestedRisks.map((risk, i) => {
              const {
                level,
                color
              } = getRiskLevel(risk.severity, risk.likelihood);
              return <div key={i} className={`border rounded-lg p-3 transition-all
                            ${selectedRisks.includes(i) ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" checked={selectedRisks.includes(i)} onChange={() => handleSelectAIRisk(i)} className="mt-1.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500" />
                            <div className="flex-1">
                              <div className="flex items-center">
                                <AlertTriangleIcon size={16} className="text-yellow-500 mr-1.5" />
                                <p className="font-medium">
                                  {risk.description}
                                </p>
                                <div className={`ml-3 ${color} text-white text-xs px-2 py-0.5 rounded-full`}>
                                  {level} Risk
                                </div>
                              </div>
                              <div className="flex items-center mt-1.5 text-xs">
                                <span className="mr-4">
                                  Severity: {risk.severity}
                                </span>
                                <span>Likelihood: {risk.likelihood}</span>
                                <span className="ml-3 text-slate-500 dark:text-slate-400">
                                  Risk Score: {risk.severity * risk.likelihood}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-700/50 p-2 rounded">
                                <span className="font-medium">
                                  Mitigation:{' '}
                                </span>
                                {risk.mitigation}
                              </p>
                            </div>
                          </label>
                        </div>;
            })}
                    <div className="flex justify-between mt-4">
                      <button onClick={() => {
                setSuggestedRisks([]);
                setSelectedRisks([]);
                setShowAIPanel(false);
              }} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleAddAIRisks} disabled={selectedRisks.length === 0} className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${selectedRisks.length > 0 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
                        <PlusIcon size={16} className="mr-1.5" />
                        Add {selectedRisks.length} Selected Risk
                        {selectedRisks.length !== 1 ? 's' : ''}
                      </button>
                    </div>
                  </div> : <div className="flex flex-col items-center justify-center py-6">
                    <button onClick={handleGenerateAIRisks} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center">
                      <LightbulbIcon size={18} className="mr-2" />
                      Generate Risk Suggestions
                    </button>
                  </div>}
              </>}
          </div>
        </div>}
      {wms.risks.length === 0 && !isAddingRisk && !showAIPanel ? <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No risks identified yet
          </p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => setIsAddingRisk(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Add Risk Manually
            </button>
            <button onClick={handleGenerateAIRisks} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              Generate with AI
            </button>
          </div>
        </div> : <div className="space-y-4">
          {wms.risks.map(risk => {
        const {
          level,
          color
        } = getRiskLevel(risk.severity, risk.likelihood);
        return <div key={risk.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{risk.description}</h4>
                      <div className={`ml-3 ${color} text-white text-xs px-2 py-0.5 rounded-full`}>
                        {level} Risk
                      </div>
                      {risk.source === 'ai' && <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
                          AI Suggested
                        </span>}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="inline-block mr-4">
                        Severity: {risk.severity}
                      </span>
                      <span>Likelihood: {risk.likelihood}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEditClick(risk)} className="text-slate-400 hover:text-blue-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteRisk(risk.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <XIcon size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-sm">
                    <span className="font-medium">Mitigation: </span>
                    {risk.mitigation}
                  </div>
                </div>
                {risk.associatedStepIds && risk.associatedStepIds.length > 0 && <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-sm">
                        <span className="font-medium">Associated Steps: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {risk.associatedStepIds.map(stepId => {
                  const step = wms.steps.find(s => s.id === stepId);
                  return step ? <span key={stepId} className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">
                                {step.title}
                              </span> : null;
                })}
                        </div>
                      </div>
                    </div>}
              </div>;
      })}
          {isAddingRisk && <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <h3 className="font-medium mb-3">Add New Risk</h3>
              <RiskForm risk={newRisk} steps={wms.steps} onChange={setNewRisk} onSubmit={handleAddRisk} onCancel={() => {
          setIsAddingRisk(false);
          setNewRisk({
            type: 'General',
            description: '',
            severity: 3,
            likelihood: 3,
            mitigation: '',
            associatedStepIds: [],
            source: 'manual'
          });
        }} />
            </div>}
          {editingRiskId && <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <h3 className="font-medium mb-3">Edit Risk</h3>
              <RiskForm risk={newRisk} steps={wms.steps} onChange={setNewRisk} onSubmit={() => handleUpdateRisk(editingRiskId)} onCancel={() => {
          setEditingRiskId(null);
          setNewRisk({
            type: 'General',
            description: '',
            severity: 3,
            likelihood: 3,
            mitigation: '',
            associatedStepIds: [],
            source: 'manual'
          });
        }} />
            </div>}
        </div>}
    </div>;
};
interface RiskFormProps {
  risk: Partial<Risk>;
  steps: WorkStep[];
  onChange: (risk: Partial<Risk>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}
const RiskForm: React.FC<RiskFormProps> = ({
  risk,
  steps,
  onChange,
  onSubmit,
  onCancel
}) => {
  return <div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Risk Description <span className="text-red-500">*</span>
        </label>
        <input type="text" value={risk.description || ''} onChange={e => onChange({
        ...risk,
        description: e.target.value
      })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="Describe the risk..." />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Risk Category
          </label>
          <select value={risk.type} onChange={e => onChange({
          ...risk,
          type: e.target.value as RiskCategory
        })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
            <option value="General">General</option>
            <option value="Lifting">Lifting</option>
            <option value="Transport">Transport</option>
            <option value="OceanFreight">Ocean Freight</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Associated Steps
          </label>
          <select multiple value={risk.associatedStepIds || []} onChange={e => {
          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
          onChange({
            ...risk,
            associatedStepIds: selectedOptions
          });
        }} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" size={3}>
            {steps.map(step => <option key={step.id} value={step.id}>
                {step.title}
              </option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Severity (1-5)
          </label>
          <select value={risk.severity} onChange={e => onChange({
          ...risk,
          severity: Number(e.target.value) as RiskSeverity
        })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
            <option value={1}>1 - Negligible</option>
            <option value={2}>2 - Minor</option>
            <option value={3}>3 - Moderate</option>
            <option value={4}>4 - Major</option>
            <option value={5}>5 - Catastrophic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Likelihood (1-5)
          </label>
          <select value={risk.likelihood} onChange={e => onChange({
          ...risk,
          likelihood: Number(e.target.value) as RiskLikelihood
        })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all">
            <option value={1}>1 - Rare</option>
            <option value={2}>2 - Unlikely</option>
            <option value={3}>3 - Possible</option>
            <option value={4}>4 - Likely</option>
            <option value={5}>5 - Almost Certain</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Mitigation Measures <span className="text-red-500">*</span>
        </label>
        <textarea value={risk.mitigation || ''} onChange={e => onChange({
        ...risk,
        mitigation: e.target.value
      })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="How will you mitigate this risk?" rows={3} />
      </div>
      <div className="flex justify-end space-x-3">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          Cancel
        </button>
        <button onClick={onSubmit} disabled={!risk.description || !risk.mitigation} className={`px-4 py-2 text-sm rounded-lg transition-colors ${risk.description && risk.mitigation ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
          {risk.id ? 'Update Risk' : 'Add Risk'}
        </button>
      </div>
    </div>;
};