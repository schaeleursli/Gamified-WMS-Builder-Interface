import React, { useState } from 'react';
import { StepCard } from './StepCard';
import { RiskMatrix } from './RiskMatrix';
import { EquipmentPanel } from './EquipmentPanel';
import { FloatingActions } from './FloatingActions';
import { MissionComplete } from './MissionComplete';
import { XPToast } from './XPToast';
import { useLanguage } from '../contexts/LanguageContext';
import { UserIcon, CalendarIcon, ClipboardCheckIcon, HardHatIcon, AlertTriangleIcon } from 'lucide-react';
interface MainPanelProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}
export const MainPanel: React.FC<MainPanelProps> = ({
  currentStep,
  setCurrentStep,
  totalSteps
}) => {
  const {
    t
  } = useLanguage();
  const [xpPoints, setXpPoints] = useState(120);
  const [isComplete, setIsComplete] = useState(false);
  const [showLevelUpToast, setShowLevelUpToast] = useState(false);
  const steps = [{
    id: 1,
    title: 'Project Details',
    description: "Let's start with the basics",
    icon: <UserIcon size={24} />,
    content: 'project-details'
  }, {
    id: 2,
    title: 'Schedule & Timeline',
    description: 'When will this work take place?',
    icon: <CalendarIcon size={24} />,
    content: 'schedule'
  }, {
    id: 3,
    title: 'Work Method',
    description: 'Describe how the work will be done',
    icon: <ClipboardCheckIcon size={24} />,
    content: 'work-method'
  }, {
    id: 4,
    title: 'Equipment',
    description: 'What equipment will be used?',
    icon: <HardHatIcon size={24} />,
    content: 'equipment'
  }, {
    id: 5,
    title: 'Risk Assessment',
    description: 'Identify and mitigate risks',
    icon: <AlertTriangleIcon size={24} />,
    content: 'risk'
  }];
  const handleComplete = () => {
    setIsComplete(true);
    setXpPoints(prev => prev + 50);
    // Show level up toast when completing final step
    setShowLevelUpToast(true);
  };
  const renderStepContent = () => {
    switch (steps[currentStep - 1].content) {
      case 'project-details':
        return <StepCard step={steps[currentStep - 1]} onComplete={() => setCurrentStep(currentStep + 1)} xpPoints={xpPoints} setXpPoints={setXpPoints} />;
      case 'schedule':
        return <StepCard step={steps[currentStep - 1]} onComplete={() => setCurrentStep(currentStep + 1)} xpPoints={xpPoints} setXpPoints={setXpPoints} />;
      case 'work-method':
        return <StepCard step={steps[currentStep - 1]} onComplete={() => setCurrentStep(currentStep + 1)} xpPoints={xpPoints} setXpPoints={setXpPoints} />;
      case 'equipment':
        return <EquipmentPanel onComplete={() => setCurrentStep(currentStep + 1)} xpPoints={xpPoints} setXpPoints={setXpPoints} />;
      case 'risk':
        return <RiskMatrix onComplete={handleComplete} xpPoints={xpPoints} setXpPoints={setXpPoints} />;
      default:
        return null;
    }
  };
  return <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      {showLevelUpToast && <XPToast xpAmount={50} message="You've leveled up to Safety Expert!" type="level-up" onClose={() => setShowLevelUpToast(false)} />}
      {!isComplete ? <>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Work Method Statement</h1>
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                <span className="font-medium">{xpPoints} XP</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t('app.mission')}
            </p>
          </div>
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 px-2" role="navigation" aria-label="Progress steps">
            {steps.map(step => <div key={step.id} className="flex flex-col items-center" onClick={() => step.id <= currentStep && setCurrentStep(step.id)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 cursor-pointer
                    ${step.id < currentStep ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : step.id === currentStep ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`} aria-current={step.id === currentStep ? 'step' : undefined} role="button" tabIndex={step.id <= currentStep ? 0 : -1} aria-label={`Step ${step.id}: ${step.title}`}>
                  {step.id < currentStep ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg> : <span>{step.id}</span>}
                </div>
                <span className={`text-xs text-center hidden md:block
                  ${step.id === currentStep ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  {step.title}
                </span>
              </div>)}
          </div>
          {/* Main Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-20">
            {renderStepContent()}
          </div>
          {/* Floating Action Buttons */}
          <FloatingActions currentStep={currentStep} totalSteps={totalSteps} onNext={() => currentStep < totalSteps && setCurrentStep(currentStep + 1)} onPrev={() => currentStep > 1 && setCurrentStep(currentStep - 1)} />
        </> : <MissionComplete xpPoints={xpPoints} />}
    </div>;
};