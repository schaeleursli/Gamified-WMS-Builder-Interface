import React, { useState } from 'react';
import { CheckCircleIcon, HelpCircleIcon } from 'lucide-react';
import { XPToast } from './XPToast';
import { useLanguage } from '../contexts/LanguageContext';
interface StepProps {
  step: {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
  };
  onComplete: () => void;
  xpPoints: number;
  setXpPoints: (points: number) => void;
}
export const StepCard: React.FC<StepProps> = ({
  step,
  onComplete,
  xpPoints,
  setXpPoints
}) => {
  const {
    t
  } = useLanguage();
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    notes: ''
  });
  const [isValid, setIsValid] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    const newFormState = {
      ...formState,
      [name]: value
    };
    setFormState(newFormState);
    // Simple validation - check if required fields have values
    setIsValid(!!newFormState.title && !!newFormState.description);
  };
  const handleSubmit = () => {
    if (isValid) {
      const earnedPoints = 20;
      setXpEarned(earnedPoints);
      setShowToast(true);
      setXpPoints(prev => prev + earnedPoints);
      onComplete();
    }
  };
  return <div>
      {showToast && <XPToast xpAmount={xpEarned} message={`${step.title} completed!`} onClose={() => setShowToast(false)} />}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {step.icon}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{step.title}</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {step.description}
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <button className="ml-2 text-slate-400 hover:text-blue-500" onClick={() => setShowTip(!showTip)} aria-label={showTip ? 'Hide tip' : 'Show tip'}>
              <HelpCircleIcon size={16} />
            </button>
          </div>
          {showTip && <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-slate-600 dark:text-slate-300">
              <p>
                Give your work method a clear, descriptive title that explains
                what work is being done.
              </p>
            </div>}
          <input type="text" id="title" name="title" value={formState.title} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="e.g., Installation of Roof Trusses" aria-required="true" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea id="description" name="description" value={formState.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="Describe the purpose and scope of this work method..." aria-required="true" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Additional Notes
          </label>
          <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" placeholder="Any additional information that might be helpful..." />
        </div>
        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={!isValid} className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all
              ${isValid ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`} aria-disabled={!isValid}>
            {isValid && <CheckCircleIcon size={18} className="mr-2" />}
            {t('step.continue')}
          </button>
        </div>
      </div>
    </div>;
};