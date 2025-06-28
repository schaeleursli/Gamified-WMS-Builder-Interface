import React, { useState } from 'react';
import { BrainIcon, LightbulbIcon, LoaderIcon, CheckIcon, AlertTriangleIcon, PlusIcon, XIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { WMS, Risk, RiskCategory, RiskSeverity, RiskLikelihood } from '../types';
interface AIAssistantProps {
  wms: WMS;
  onRisksAdded: (risks: Risk[]) => void;
}
export const AIAssistant: React.FC<AIAssistantProps> = ({
  wms,
  onRisksAdded
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedRisks, setSuggestedRisks] = useState<Risk[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<number[]>([]);
  const [analysisType, setAnalysisType] = useState<'lifting' | 'transport' | 'ocean' | 'general'>('general');
  const getRiskLevel = (severity: number, likelihood: number) => {
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
  const handleGenerateRisks = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your AI service
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      let mockAIRisks: Risk[] = [];
      if (analysisType === 'lifting') {
        mockAIRisks = [{
          id: uuidv4(),
          wmsId: wms.id,
          type: 'Lifting',
          description: 'Crane tipping due to soft ground',
          severity: 5,
          likelihood: 3,
          mitigation: 'Conduct soil bearing analysis and use mats if necessary',
          source: 'ai',
          associatedStepIds: wms.steps.length > 0 ? [wms.steps[0].id] : []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'Lifting',
          description: 'Overhead obstruction during lift',
          severity: 3,
          likelihood: 2,
          mitigation: 'Use spotter and check clearances prior to lift',
          source: 'ai',
          associatedStepIds: wms.steps.length > 1 ? [wms.steps[1].id] : []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'Lifting',
          description: 'Sling failure',
          severity: 4,
          likelihood: 2,
          mitigation: 'Use certified rigging and double-check load limits',
          source: 'ai',
          associatedStepIds: wms.steps.length > 0 ? [wms.steps[0].id] : []
        }];
      } else if (analysisType === 'transport') {
        mockAIRisks = [{
          id: uuidv4(),
          wmsId: wms.id,
          type: 'Transport',
          description: 'Load shifting during transport',
          severity: 4,
          likelihood: 3,
          mitigation: 'Secure load with appropriate restraints and check regularly',
          source: 'ai',
          associatedStepIds: wms.steps.length > 0 ? [wms.steps[0].id] : []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'Transport',
          description: 'Collision with other vehicles',
          severity: 5,
          likelihood: 2,
          mitigation: 'Use escort vehicles and maintain safe speed',
          source: 'ai',
          associatedStepIds: wms.steps.length > 1 ? [wms.steps[1].id] : []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'Transport',
          description: 'Route restrictions (bridges, tunnels)',
          severity: 3,
          likelihood: 3,
          mitigation: 'Pre-plan route and obtain necessary permits',
          source: 'ai',
          associatedStepIds: []
        }];
      } else if (analysisType === 'ocean') {
        mockAIRisks = [{
          id: uuidv4(),
          wmsId: wms.id,
          type: 'OceanFreight',
          description: 'Cargo shifting in rough seas',
          severity: 4,
          likelihood: 3,
          mitigation: 'Proper lashing and securing according to maritime standards',
          source: 'ai',
          associatedStepIds: wms.steps.length > 0 ? [wms.steps[0].id] : []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'OceanFreight',
          description: 'Corrosion damage from sea water',
          severity: 3,
          likelihood: 4,
          mitigation: 'Apply protective coatings and use proper packaging',
          source: 'ai',
          associatedStepIds: []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'OceanFreight',
          description: 'Delays due to port congestion',
          severity: 2,
          likelihood: 4,
          mitigation: 'Plan for buffer time and have contingency plans',
          source: 'ai',
          associatedStepIds: []
        }];
      } else {
        // Generate step-specific risks based on the WMS steps
        if (wms.steps.length > 0) {
          wms.steps.forEach((step, index) => {
            if (index < 2) {
              // Limit to first 2 steps to avoid too many suggestions
              mockAIRisks.push({
                id: uuidv4(),
                wmsId: wms.id,
                type: 'General',
                description: `Risk for step ${index + 1}: ${step.title}`,
                severity: 3,
                likelihood: 3,
                mitigation: `Ensure proper safety procedures for ${step.title.toLowerCase()}`,
                source: 'ai',
                associatedStepIds: [step.id]
              });
            }
          });
        }
        // Add some general risks
        mockAIRisks.push({
          id: uuidv4(),
          wmsId: wms.id,
          type: 'General',
          description: 'Personnel injury from manual handling',
          severity: 3,
          likelihood: 3,
          mitigation: 'Provide training on proper lifting techniques and PPE',
          source: 'ai',
          associatedStepIds: []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'General',
          description: 'Slips, trips and falls',
          severity: 3,
          likelihood: 3,
          mitigation: 'Keep work area clean and free of obstacles',
          source: 'ai',
          associatedStepIds: []
        }, {
          id: uuidv4(),
          wmsId: wms.id,
          type: 'General',
          description: 'Adverse weather conditions',
          severity: 4,
          likelihood: 2,
          mitigation: 'Monitor weather forecasts and have stop-work criteria',
          source: 'ai',
          associatedStepIds: []
        });
      }
      setSuggestedRisks(mockAIRisks);
    } catch (error) {
      console.error('Error generating AI risks:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectRisk = (index: number) => {
    setSelectedRisks(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  const handleAddRisks = () => {
    const risksToAdd = selectedRisks.map(index => suggestedRisks[index]);
    onRisksAdded(risksToAdd);
    setSuggestedRisks([]);
    setSelectedRisks([]);
  };
  const handleClearSelections = () => {
    setSelectedRisks([]);
  };
  return <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mr-4">
          <BrainIcon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">AI Risk Assistant</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Let AI analyze your WMS and suggest potential risks
          </p>
        </div>
      </div>
      {/* Risk analysis type selection */}
      <div className="bg-pastel-blue-50 dark:bg-pastel-blue-900/20 p-4 rounded-xl">
        <h3 className="font-medium mb-3">Select analysis type:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className={`p-3 rounded-lg transition-all flex flex-col items-center ${analysisType === 'lifting' ? 'bg-pastel-blue-100 dark:bg-pastel-blue-800/30 text-pastel-blue-600 dark:text-pastel-blue-400 border-2 border-pastel-blue-300 dark:border-pastel-blue-700' : 'bg-white dark:bg-slate-800 hover:bg-pastel-blue-100 dark:hover:bg-pastel-blue-900/30'}`} onClick={() => setAnalysisType('lifting')}>
            <div className="w-10 h-10 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6v2m10-2v2M9 22v-2m10 2v-2M8 8h8m-8 4h8m-8 4h8"></path>
                <path d="M12 2v2m0 18v-2"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Lifting</span>
          </button>
          <button className={`p-3 rounded-lg transition-all flex flex-col items-center ${analysisType === 'transport' ? 'bg-pastel-blue-100 dark:bg-pastel-blue-800/30 text-pastel-blue-600 dark:text-pastel-blue-400 border-2 border-pastel-blue-300 dark:border-pastel-blue-700' : 'bg-white dark:bg-slate-800 hover:bg-pastel-blue-100 dark:hover:bg-pastel-blue-900/30'}`} onClick={() => setAnalysisType('transport')}>
            <div className="w-10 h-10 rounded-full bg-pastel-green-100 dark:bg-pastel-green-900/30 flex items-center justify-center text-pastel-green-600 dark:text-pastel-green-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17h1m16 0h1M5 17a2 2 0 1 0 4 0m10 0a2 2 0 1 0 4 0"></path>
                <path d="M7 17h10V5H7zm0 0v-6h10"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Transport</span>
          </button>
          <button className={`p-3 rounded-lg transition-all flex flex-col items-center ${analysisType === 'ocean' ? 'bg-pastel-blue-100 dark:bg-pastel-blue-800/30 text-pastel-blue-600 dark:text-pastel-blue-400 border-2 border-pastel-blue-300 dark:border-pastel-blue-700' : 'bg-white dark:bg-slate-800 hover:bg-pastel-blue-100 dark:hover:bg-pastel-blue-900/30'}`} onClick={() => setAnalysisType('ocean')}>
            <div className="w-10 h-10 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17h18M3 17l2-7h12l2 7M3 17l1 3h16l1-3"></path>
                <path d="M9 10V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Ocean Freight</span>
          </button>
          <button className={`p-3 rounded-lg transition-all flex flex-col items-center ${analysisType === 'general' ? 'bg-pastel-blue-100 dark:bg-pastel-blue-800/30 text-pastel-blue-600 dark:text-pastel-blue-400 border-2 border-pastel-blue-300 dark:border-pastel-blue-700' : 'bg-white dark:bg-slate-800 hover:bg-pastel-blue-100 dark:hover:bg-pastel-blue-900/30'}`} onClick={() => setAnalysisType('general')}>
            <div className="w-10 h-10 rounded-full bg-pastel-peach-100 dark:bg-pastel-peach-900/30 flex items-center justify-center text-pastel-peach-600 dark:text-pastel-peach-400 mb-2">
              <AlertTriangleIcon size={20} />
            </div>
            <span className="text-sm font-medium">General</span>
          </button>
        </div>
      </div>
      {/* AI risk suggestions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">AI Risk Suggestions</h3>
          <button onClick={handleGenerateRisks} disabled={isLoading} className={`px-4 py-2 rounded-lg transition-colors flex items-center ${isLoading ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-pastel-blue-500 hover:bg-pastel-blue-600 text-white'}`}>
            {isLoading ? <>
                <LoaderIcon size={18} className="animate-spin mr-2" />
                Analyzing...
              </> : <>
                <LightbulbIcon size={18} className="mr-2" />
                Generate Risks
              </>}
          </button>
        </div>
        {isLoading ? <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mb-4 animate-pulse">
              <BrainIcon size={32} />
            </div>
            <h3 className="text-lg font-medium mb-2">Analyzing your WMS...</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Our AI is reviewing your work methods and identifying potential
              risks based on industry standards and best practices.
            </p>
          </div> : <>
            {suggestedRisks.length > 0 ? <>
                <div className="mb-4">
                  <p className="text-sm text-pastel-blue-600 dark:text-pastel-blue-400 bg-pastel-blue-50 dark:bg-pastel-blue-900/20 p-3 rounded-lg">
                    <LightbulbIcon size={16} className="inline-block mr-2" />
                    Based on your WMS, we've identified {suggestedRisks.length}{' '}
                    potential risks. Select the ones you'd like to add.
                  </p>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                  {suggestedRisks.map((risk, i) => {
              const {
                level,
                color
              } = getRiskLevel(risk.severity, risk.likelihood);
              const isSelected = selectedRisks.includes(i);
              // Get step names for associated steps
              const stepNames = risk.associatedStepIds?.map(stepId => {
                const step = wms.steps.find(s => s.id === stepId);
                return step ? step.title : '';
              }).filter(Boolean) || [];
              return <div key={i} className={`border rounded-lg p-4 transition-all cursor-pointer
                          ${isSelected ? 'border-pastel-blue-300 dark:border-pastel-blue-700 bg-pastel-blue-50 dark:bg-pastel-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pastel-blue-200 dark:hover:border-pastel-blue-800'}`} onClick={() => handleSelectRisk(i)}>
                        <div className="flex items-start">
                          <div className={`mt-1 w-5 h-5 rounded-full flex-shrink-0 ${isSelected ? 'bg-pastel-blue-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600'} flex items-center justify-center mr-3`}>
                            {isSelected && <CheckIcon size={12} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <h4 className="font-medium">
                                {risk.description}
                              </h4>
                              <div className={`${color} text-white text-xs px-2 py-0.5 rounded-full`}>
                                {level} Risk
                              </div>
                              <span className="bg-pastel-blue-100 dark:bg-pastel-blue-900/30 text-pastel-blue-600 dark:text-pastel-blue-400 text-xs px-2 py-0.5 rounded-full">
                                AI Suggested
                              </span>
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                              <span className="inline-block mr-4">
                                Severity: {risk.severity}
                              </span>
                              <span>Likelihood: {risk.likelihood}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                              <div className="text-sm">
                                <span className="font-medium">
                                  Mitigation:{' '}
                                </span>
                                {risk.mitigation}
                              </div>
                            </div>
                            {stepNames.length > 0 && <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  Associated with step(s):
                                </span>
                                {stepNames.map((name, idx) => <span key={idx} className="text-xs px-2 py-0.5 bg-pastel-green-100 dark:bg-pastel-green-900/30 text-pastel-green-600 dark:text-pastel-green-400 rounded-full">
                                    {name}
                                  </span>)}
                              </div>}
                          </div>
                        </div>
                      </div>;
            })}
                </div>
                <div className="flex justify-between">
                  <button onClick={handleClearSelections} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    Clear Selection
                  </button>
                  <button onClick={handleAddRisks} disabled={selectedRisks.length === 0} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${selectedRisks.length > 0 ? 'bg-pastel-green-500 text-white hover:bg-pastel-green-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
                    <PlusIcon size={18} className="mr-2" />
                    Add {selectedRisks.length} Selected Risk
                    {selectedRisks.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </> : <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-pastel-blue-100 dark:bg-pastel-blue-900/30 rounded-full flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mb-4">
                  <LightbulbIcon size={32} />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Get AI Risk Suggestions
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Let our AI analyze your work method statement and suggest
                  potential risks based on industry standards.
                </p>
                <button onClick={handleGenerateRisks} className="px-6 py-3 bg-pastel-blue-500 text-white rounded-lg hover:bg-pastel-blue-600 transition-colors shadow-soft">
                  <LightbulbIcon size={18} className="inline-block mr-2" />
                  Generate Risk Suggestions
                </button>
              </div>}
          </>}
      </div>
    </div>;
};