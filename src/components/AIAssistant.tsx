import React, { useState } from 'react';
import { BrainIcon, LightbulbIcon, PlusIcon, LoaderIcon, CheckIcon, AlertTriangleIcon } from 'lucide-react';
interface Risk {
  type: string;
  severity: 1 | 2 | 3 | 4 | 5;
  likelihood: 1 | 2 | 3 | 4 | 5;
  mitigation: string;
  source?: string;
}
interface AIAssistantProps {
  stepDescription: string;
  category?: string;
  onRisksAdded: (risks: Risk[]) => void;
}
const mockAIResponse = async (stepDescription: string, category?: string): Promise<Risk[]> => {
  // Simulated API call – replace with your real GPT API or endpoint
  return new Promise(resolve => {
    // Simulate network delay
    setTimeout(() => {
      resolve([{
        type: 'Crane tipping due to soft ground',
        severity: 5,
        likelihood: 3,
        mitigation: 'Conduct soil bearing analysis and use mats if necessary'
      }, {
        type: 'Overhead obstruction during lift',
        severity: 3,
        likelihood: 2,
        mitigation: 'Use spotter and check clearances prior to lift'
      }, {
        type: 'Sling failure',
        severity: 4,
        likelihood: 2,
        mitigation: 'Use certified rigging and double-check load limits'
      }]);
    }, 1500);
  });
};
export const AIAssistant: React.FC<AIAssistantProps> = ({
  stepDescription,
  category,
  onRisksAdded
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestedRisks, setSuggestedRisks] = useState<Risk[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleFetchSuggestions = async () => {
    setLoading(true);
    setIsExpanded(true);
    try {
      const risks = await mockAIResponse(stepDescription, category);
      setSuggestedRisks(risks);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelect = (index: number) => {
    setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  const handleAddRisks = () => {
    const toAdd = selected.map(i => ({
      ...suggestedRisks[i],
      source: 'AI'
    }));
    onRisksAdded(toAdd);
    setSuggestedRisks([]);
    setSelected([]);
    setIsExpanded(false);
  };
  const getRiskLevelColor = (severity: number, likelihood: number) => {
    const score = severity * likelihood;
    if (score >= 15) return 'text-red-600 dark:text-red-400';
    if (score >= 8) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };
  return <div className="border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm mt-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => !loading && suggestedRisks.length === 0 && setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
            <BrainIcon size={18} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Risk Assistant</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Get AI-powered risk suggestions
            </p>
          </div>
        </div>
        {!isExpanded && suggestedRisks.length === 0 && !loading && <button onClick={handleFetchSuggestions} className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all flex items-center">
            <LightbulbIcon size={16} className="mr-1.5" />
            Suggest Risks
          </button>}
      </div>
      {isExpanded && <div className="mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 pl-2 border-l-2 border-blue-300 dark:border-blue-700">
            Suggesting risks based on:{' '}
            <span className="italic font-medium">{stepDescription}</span>
            {category && <span className="text-xs ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                {category}
              </span>}
          </p>
          {loading ? <div className="flex flex-col items-center justify-center py-8">
              <LoaderIcon size={24} className="text-blue-500 animate-spin mb-3" />
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Analyzing potential risks...
              </p>
            </div> : <>
              {suggestedRisks.length > 0 ? <div className="space-y-3">
                  {suggestedRisks.map((risk, i) => <div key={i} className={`border rounded-lg p-3 transition-all
                        ${selected.includes(i) ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" checked={selected.includes(i)} onChange={() => handleSelect(i)} className="mt-1.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <AlertTriangleIcon size={16} className="text-yellow-500 mr-1.5" />
                            <p className="font-medium">{risk.type}</p>
                          </div>
                          <div className="flex items-center mt-1.5 text-xs">
                            <span className={`${getRiskLevelColor(risk.severity, risk.likelihood)} mr-4`}>
                              Severity: {risk.severity}
                            </span>
                            <span className={`${getRiskLevelColor(risk.severity, risk.likelihood)}`}>
                              Likelihood: {risk.likelihood}
                            </span>
                            <span className="ml-3 text-slate-500 dark:text-slate-400">
                              Risk Score: {risk.severity * risk.likelihood}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-700/50 p-2 rounded">
                            <span className="font-medium">Mitigation: </span>
                            {risk.mitigation}
                          </p>
                        </div>
                      </label>
                    </div>)}
                  <div className="flex justify-between mt-4">
                    <button onClick={() => {
              setSuggestedRisks([]);
              setSelected([]);
              setIsExpanded(false);
            }} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleAddRisks} disabled={selected.length === 0} className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${selected.length > 0 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
                      <PlusIcon size={16} className="mr-1.5" />
                      Add {selected.length} Selected Risk
                      {selected.length !== 1 ? 's' : ''}
                    </button>
                  </div>
                </div> : <div className="flex flex-col items-center justify-center py-6">
                  <button onClick={handleFetchSuggestions} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center">
                    <LightbulbIcon size={18} className="mr-2" />
                    Suggest Risks with AI
                  </button>
                </div>}
            </>}
        </div>}
    </div>;
};