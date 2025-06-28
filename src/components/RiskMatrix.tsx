import React, { useState, Fragment } from 'react';
import { AlertTriangleIcon, PlusIcon, XIcon, CheckCircleIcon } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { XPToast } from './XPToast';
interface RiskMatrixProps {
  onComplete: () => void;
  xpPoints: number;
  setXpPoints: (points: number) => void;
}
type Severity = 1 | 2 | 3 | 4 | 5;
type Likelihood = 1 | 2 | 3 | 4 | 5;
interface Risk {
  id: string;
  description: string;
  severity: Severity;
  likelihood: Likelihood;
  mitigation: string;
  source?: string;
}
export const RiskMatrix: React.FC<RiskMatrixProps> = ({
  onComplete,
  xpPoints,
  setXpPoints
}) => {
  const [risks, setRisks] = useState<Risk[]>([{
    id: '1',
    description: 'Falling from height',
    severity: 5,
    likelihood: 3,
    mitigation: 'Use of safety harnesses and edge protection'
  }]);
  const [newRisk, setNewRisk] = useState<Risk>({
    id: '',
    description: '',
    severity: 3,
    likelihood: 3,
    mitigation: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const handleAddRisk = () => {
    if (newRisk.description && newRisk.mitigation) {
      const risk = {
        ...newRisk,
        id: Date.now().toString()
      };
      setRisks([...risks, risk]);
      setNewRisk({
        id: '',
        description: '',
        severity: 3,
        likelihood: 3,
        mitigation: ''
      });
      setIsAdding(false);
      const earnedPoints = 15;
      setXpEarned(earnedPoints);
      setShowToast(true);
      setXpPoints(prev => prev + earnedPoints);
    }
  };
  const handleRemoveRisk = (id: string) => {
    setRisks(risks.filter(risk => risk.id !== id));
  };
  const getRiskLevel = (severity: Severity, likelihood: Likelihood) => {
    const score = severity * likelihood;
    if (score >= 15) return {
      level: 'High',
      color: 'bg-red-500'
    };
    if (score >= 8) return {
      level: 'Medium',
      color: 'bg-yellow-500'
    };
    return {
      level: 'Low',
      color: 'bg-green-500'
    };
  };
  const handleAIRisksAdded = (aiRisks: Omit<Risk, 'id'>[]) => {
    const newRisks = aiRisks.map(risk => ({
      ...risk,
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      description: risk.type
    }));
    setRisks([...risks, ...newRisks]);
    // Award XP for using AI assistant
    const earnedPoints = 25;
    setXpEarned(earnedPoints);
    setShowToast(true);
    setXpPoints(prev => prev + earnedPoints);
  };
  return <div>
      {showToast && <XPToast xpAmount={xpEarned} message={`Risk assessment updated!`} type="achievement" onClose={() => setShowToast(false)} />}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <AlertTriangleIcon size={24} />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">Risk Assessment</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Identify and mitigate potential risks
          </p>
        </div>
      </div>
      {/* Risk Matrix */}
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
      {/* Risk List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Identified Risks</h3>
          <button onClick={() => setIsAdding(true)} className="flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all">
            <PlusIcon size={16} className="mr-1" />
            Add Risk
          </button>
        </div>
        {risks.map(risk => {
        const {
          level,
          color
        } = getRiskLevel(risk.severity, risk.likelihood);
        return <div key={risk.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-3 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">{risk.description}</h4>
                    <div className={`ml-3 ${color} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {level} Risk
                    </div>
                    {risk.source === 'AI' && <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">
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
                <button onClick={() => handleRemoveRisk(risk.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <XIcon size={16} />
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm">
                  <span className="font-medium">Mitigation: </span>
                  {risk.mitigation}
                </div>
              </div>
            </div>;
      })}
        {isAdding && <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-3 border border-blue-200 dark:border-blue-800/50">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Risk Description
              </label>
              <input type="text" value={newRisk.description} onChange={e => setNewRisk({
            ...newRisk,
            description: e.target.value
          })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="Describe the risk..." />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Severity (1-5)
                </label>
                <select value={newRisk.severity} onChange={e => setNewRisk({
              ...newRisk,
              severity: Number(e.target.value) as Severity
            })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
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
                <select value={newRisk.likelihood} onChange={e => setNewRisk({
              ...newRisk,
              likelihood: Number(e.target.value) as Likelihood
            })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
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
                Mitigation Measures
              </label>
              <textarea value={newRisk.mitigation} onChange={e => setNewRisk({
            ...newRisk,
            mitigation: e.target.value
          })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="How will you mitigate this risk?" rows={3} />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleAddRisk} disabled={!newRisk.description || !newRisk.mitigation} className={`px-4 py-2 text-sm rounded-lg transition-colors ${newRisk.description && newRisk.mitigation ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
                Add Risk
              </button>
            </div>
          </div>}
      </div>
      {/* AI Risk Assistant */}
      <AIAssistant stepDescription="Lift 120t transformer using crawler crane" category="Lifting" onRisksAdded={handleAIRisksAdded} />
      <div className="flex justify-end mt-6">
        <button onClick={onComplete} className="flex items-center px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-all">
          <CheckCircleIcon size={18} className="mr-2" />
          Complete Risk Assessment
        </button>
      </div>
    </div>;
};