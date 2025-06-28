import React, { useState } from 'react';
import { PlusIcon, GripIcon, XIcon, ChevronDownIcon, ChevronUpIcon, EditIcon, TrashIcon, AlertTriangleIcon, HardHatIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { WMS, WorkStep, Equipment, Risk } from '../../types';
import { XPToast } from '../XPToast';
interface StepListProps {
  wms: WMS;
  onUpdate: (wms: WMS) => void;
  onXPChange?: (points: number) => void;
}
export const StepList: React.FC<StepListProps> = ({
  wms,
  onUpdate,
  onXPChange
}) => {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [newStep, setNewStep] = useState<Partial<WorkStep>>({
    title: '',
    description: '',
    equipment: [],
    notes: ''
  });
  const handleAddStep = () => {
    if (!newStep.title || !newStep.description) return;
    const timestamp = new Date().toISOString();
    const step: WorkStep = {
      id: uuidv4(),
      wmsId: wms.id,
      title: newStep.title || '',
      description: newStep.description || '',
      equipment: newStep.equipment || [],
      notes: newStep.notes || '',
      order: wms.steps.length + 1
    };
    const updatedWMS: WMS = {
      ...wms,
      steps: [...wms.steps, step],
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
    // Award XP for adding a step
    const earnedPoints = 10;
    setXpEarned(earnedPoints);
    setShowToast(true);
    if (onXPChange) onXPChange(earnedPoints);
    setNewStep({
      title: '',
      description: '',
      equipment: [],
      notes: ''
    });
    setIsAddingStep(false);
  };
  const handleUpdateStep = (stepId: string) => {
    if (!newStep.title || !newStep.description) return;
    const timestamp = new Date().toISOString();
    const updatedWMS: WMS = {
      ...wms,
      steps: wms.steps.map(step => step.id === stepId ? {
        ...step,
        title: newStep.title || step.title,
        description: newStep.description || step.description,
        notes: newStep.notes || step.notes,
        equipment: newStep.equipment || step.equipment
      } : step),
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
    setNewStep({
      title: '',
      description: '',
      equipment: [],
      notes: ''
    });
    setEditingStepId(null);
  };
  const handleDeleteStep = (stepId: string) => {
    const timestamp = new Date().toISOString();
    // Also remove any risks associated with this step
    const updatedRisks = wms.risks.filter(risk => !risk.associatedStepIds || !risk.associatedStepIds.includes(stepId));
    const updatedWMS: WMS = {
      ...wms,
      steps: wms.steps.filter(step => step.id !== stepId),
      risks: updatedRisks,
      updatedAt: timestamp
    };
    // Reorder the remaining steps
    updatedWMS.steps = updatedWMS.steps.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    onUpdate(updatedWMS);
  };
  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = wms.steps.findIndex(step => step.id === stepId);
    if (direction === 'up' && stepIndex === 0 || direction === 'down' && stepIndex === wms.steps.length - 1) {
      return;
    }
    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    const steps = [...wms.steps];
    const step = steps[stepIndex];
    steps.splice(stepIndex, 1);
    steps.splice(newIndex, 0, step);
    // Update order values
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    const timestamp = new Date().toISOString();
    const updatedWMS: WMS = {
      ...wms,
      steps: updatedSteps,
      updatedAt: timestamp
    };
    onUpdate(updatedWMS);
  };
  const handleEditClick = (step: WorkStep) => {
    setNewStep({
      title: step.title,
      description: step.description,
      equipment: step.equipment,
      notes: step.notes
    });
    setEditingStepId(step.id);
  };
  // Get risks associated with a specific step
  const getRisksForStep = (stepId: string): Risk[] => {
    return wms.risks.filter(risk => risk.associatedStepIds && risk.associatedStepIds.includes(stepId));
  };
  return <div>
      {showToast && <XPToast xpAmount={xpEarned} message="Step added successfully!" onClose={() => setShowToast(false)} />}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Work Steps</h2>
        <button onClick={() => setIsAddingStep(true)} className="flex items-center px-3 py-1.5 text-sm bg-pastel-blue-100 dark:bg-pastel-blue-900/30 text-pastel-blue-600 dark:text-pastel-blue-400 rounded-lg hover:bg-pastel-blue-200 dark:hover:bg-pastel-blue-800/30 transition-all">
          <PlusIcon size={16} className="mr-1.5" />
          Add Step
        </button>
      </div>
      {wms.steps.length === 0 && !isAddingStep ? <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No work steps added yet
          </p>
          <button onClick={() => setIsAddingStep(true)} className="px-4 py-2 bg-pastel-blue-500 text-white rounded-lg hover:bg-pastel-blue-600 transition-colors">
            Add First Step
          </button>
        </div> : <div className="space-y-4">
          {wms.steps.map((step, index) => {
        const stepRisks = getRisksForStep(step.id);
        return <div key={step.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className={`flex items-center p-4 cursor-pointer ${expandedStepId === step.id || editingStepId === step.id ? 'bg-pastel-blue-50 dark:bg-pastel-blue-900/20 border-b border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-slate-800'}`} onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}>
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{step.title}</h3>
                    {expandedStepId !== step.id && editingStepId !== step.id && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                          {step.description}
                        </p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {stepRisks.length > 0 && <div className="px-2 py-0.5 bg-pastel-peach-100 dark:bg-pastel-peach-900/30 text-pastel-peach-600 dark:text-pastel-peach-400 rounded-full text-xs flex items-center">
                        <AlertTriangleIcon size={12} className="mr-1" />
                        {stepRisks.length}
                      </div>}
                    {step.equipment.length > 0 && <div className="px-2 py-0.5 bg-pastel-green-100 dark:bg-pastel-green-900/30 text-pastel-green-600 dark:text-pastel-green-400 rounded-full text-xs flex items-center">
                        <HardHatIcon size={12} className="mr-1" />
                        {step.equipment.length}
                      </div>}
                    <button onClick={e => {
                e.stopPropagation();
                handleEditClick(step);
              }} className="p-1 text-slate-400 hover:text-pastel-blue-500 dark:hover:text-pastel-blue-400">
                      <EditIcon size={16} />
                    </button>
                    <button onClick={e => {
                e.stopPropagation();
                handleDeleteStep(step.id);
              }} className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                      <TrashIcon size={16} />
                    </button>
                    {expandedStepId === step.id ? <ChevronUpIcon size={20} className="text-slate-400" /> : <ChevronDownIcon size={20} className="text-slate-400" />}
                  </div>
                </div>
                {expandedStepId === step.id && editingStepId !== step.id && <div className="p-4 bg-white dark:bg-slate-800">
                    <p className="mb-3">{step.description}</p>
                    {/* Equipment section */}
                    {step.equipment.length > 0 && <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">Equipment:</h4>
                        <div className="flex flex-wrap gap-2">
                          {step.equipment.map((item, i) => <div key={i} className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-sm">
                              {item.name}{' '}
                              {item.quantity > 1 && `(${item.quantity})`}
                            </div>)}
                        </div>
                      </div>}
                    {/* Associated risks section */}
                    {stepRisks.length > 0 && <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">
                          Associated Risks:
                        </h4>
                        <div className="space-y-2">
                          {stepRisks.map(risk => <div key={risk.id} className="p-2 bg-pastel-peach-50 dark:bg-pastel-peach-900/10 border border-pastel-peach-100 dark:border-pastel-peach-900/20 rounded-lg">
                              <div className="flex items-center">
                                <AlertTriangleIcon size={14} className="text-pastel-peach-500 mr-1.5" />
                                <span className="font-medium text-sm">
                                  {risk.description}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {risk.mitigation}
                              </p>
                            </div>)}
                        </div>
                      </div>}
                    {step.notes && <div>
                        <h4 className="text-sm font-medium mb-1">Notes:</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {step.notes}
                        </p>
                      </div>}
                    <div className="flex justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex space-x-2">
                        <button onClick={() => handleMoveStep(step.id, 'up')} disabled={index === 0} className={`p-2 rounded ${index === 0 ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                          <ChevronUpIcon size={16} />
                        </button>
                        <button onClick={() => handleMoveStep(step.id, 'down')} disabled={index === wms.steps.length - 1} className={`p-2 rounded ${index === wms.steps.length - 1 ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                          <ChevronDownIcon size={16} />
                        </button>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        Step {index + 1} of {wms.steps.length}
                      </div>
                    </div>
                  </div>}
                {editingStepId === step.id && <StepForm step={newStep} onChange={setNewStep} onSubmit={() => handleUpdateStep(step.id)} onCancel={() => {
            setEditingStepId(null);
            setNewStep({
              title: '',
              description: '',
              equipment: [],
              notes: ''
            });
          }} />}
              </div>;
      })}
          {isAddingStep && <div className="border border-pastel-blue-200 dark:border-pastel-blue-800/50 rounded-lg bg-pastel-blue-50 dark:bg-pastel-blue-900/20">
              <div className="p-4 border-b border-pastel-blue-200 dark:border-pastel-blue-800/50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mr-3">
                    {wms.steps.length + 1}
                  </div>
                  <h3 className="font-medium">New Step</h3>
                </div>
              </div>
              <StepForm step={newStep} onChange={setNewStep} onSubmit={handleAddStep} onCancel={() => {
          setIsAddingStep(false);
          setNewStep({
            title: '',
            description: '',
            equipment: [],
            notes: ''
          });
        }} />
            </div>}
        </div>}
    </div>;
};
interface StepFormProps {
  step: Partial<WorkStep>;
  onChange: (step: Partial<WorkStep>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}
const StepForm: React.FC<StepFormProps> = ({
  step,
  onChange,
  onSubmit,
  onCancel
}) => {
  return <div className="p-4 bg-white dark:bg-slate-800">
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Step Title <span className="text-red-500">*</span>
        </label>
        <input type="text" value={step.title || ''} onChange={e => onChange({
        ...step,
        title: e.target.value
      })} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" placeholder="e.g., Prepare lifting area" />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea value={step.description || ''} onChange={e => onChange({
        ...step,
        description: e.target.value
      })} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" placeholder="Describe what needs to be done in this step..." />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Notes (Optional)
        </label>
        <textarea value={step.notes || ''} onChange={e => onChange({
        ...step,
        notes: e.target.value
      })} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" placeholder="Any additional information..." />
      </div>
      <div className="flex justify-end space-x-3 mt-4">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          Cancel
        </button>
        <button onClick={onSubmit} disabled={!step.title || !step.description} className={`px-4 py-2 text-sm rounded-lg transition-colors ${step.title && step.description ? 'bg-pastel-blue-500 text-white hover:bg-pastel-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}>
          {step.id ? 'Update Step' : 'Add Step'}
        </button>
      </div>
    </div>;
};