import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, ClipboardIcon, ArrowRightIcon } from 'lucide-react';
import { WMS, Risk, WorkStep } from '../../types';
interface StepRiskListProps {
  wms: WMS;
  onAddStep?: () => void;
}
export const StepRiskList: React.FC<StepRiskListProps> = ({
  wms,
  onAddStep
}) => {
  // Helper function to get risks associated with a specific step
  const getRisksForStep = (stepId: string): Risk[] => {
    return wms.risks.filter(risk => risk.associatedStepIds && risk.associatedStepIds.includes(stepId));
  };
  // Calculate risk level
  const getRiskLevel = (severity: number, likelihood: number) => {
    const score = severity * likelihood;
    if (score >= 15) return {
      level: 'High',
      color: 'text-red-500 bg-red-100 dark:bg-red-900/20'
    };
    if (score >= 8) return {
      level: 'Medium',
      color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
    };
    return {
      level: 'Low',
      color: 'text-green-500 bg-green-100 dark:bg-green-900/20'
    };
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Work Steps & Risk Assessment</h2>
        <button onClick={onAddStep} className="flex items-center px-3 py-1.5 text-sm bg-pastel-blue-100 dark:bg-pastel-blue-900/30 text-pastel-blue-600 dark:text-pastel-blue-400 rounded-lg hover:bg-pastel-blue-200 dark:hover:bg-pastel-blue-800/30 transition-all">
          <ClipboardIcon size={16} className="mr-1.5" />
          Add Step
        </button>
      </div>
      {wms.steps.length === 0 ? <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 mx-auto bg-pastel-blue-100 dark:bg-pastel-blue-900/30 rounded-full flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mb-4">
            <ClipboardIcon size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">No Work Steps Added Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Add work steps to your method statement and identify potential risks
            for each step.
          </p>
          <button onClick={onAddStep} className="px-6 py-3 bg-pastel-blue-500 text-white rounded-lg hover:bg-pastel-blue-600 transition-colors">
            Add First Step
          </button>
        </div> : <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {wms.steps.map((step, index) => {
        const stepRisks = getRisksForStep(step.id);
        return <div key={step.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{step.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  {stepRisks.length > 0 ? <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <AlertTriangleIcon size={16} className="mr-1.5 text-slate-400" />
                        Risk Assessment
                      </h4>
                      {stepRisks.map(risk => {
                const {
                  level,
                  color
                } = getRiskLevel(risk.severity, risk.likelihood);
                return <div key={risk.id} className="flex items-start">
                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${color} mr-2 mt-0.5 flex-shrink-0`}>
                              {level}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {risk.description}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                                <span>Severity: {risk.severity}</span>
                                <span className="mx-2">•</span>
                                <span>Likelihood: {risk.likelihood}</span>
                              </div>
                              <div className="mt-1 flex items-start">
                                <ArrowRightIcon size={12} className="mr-1 mt-0.5 text-slate-400 flex-shrink-0" />
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                  {risk.mitigation}
                                </p>
                              </div>
                            </div>
                          </div>;
              })}
                    </div> : <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                      <CheckCircleIcon size={16} className="mr-1.5 text-green-500" />
                      No risks identified for this step
                    </div>}
                  {step.equipment.length > 0 && <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <h4 className="text-sm font-medium mb-2">Equipment:</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.equipment.map((item, i) => <div key={i} className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">
                            {item.name}{' '}
                            {item.quantity > 1 && `(${item.quantity})`}
                          </div>)}
                      </div>
                    </div>}
                </div>
              </div>;
      })}
        </div>}
      {wms.steps.length > 0 && <div className="bg-pastel-blue-50 dark:bg-pastel-blue-900/10 rounded-lg p-4 border border-pastel-blue-100 dark:border-pastel-blue-900/20">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mr-3">
              <AlertTriangleIcon size={20} />
            </div>
            <div>
              <h3 className="font-medium">Risk Assessment Summary</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {wms.risks.length} risks identified across {wms.steps.length}{' '}
                steps
              </p>
            </div>
          </div>
        </div>}
    </div>;
};