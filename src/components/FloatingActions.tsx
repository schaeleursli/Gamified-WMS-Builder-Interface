import React from 'react';
import { SaveIcon, FileTextIcon, SendIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
interface FloatingActionsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}
export const FloatingActions: React.FC<FloatingActionsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev
}) => {
  return <div className="fixed bottom-4 right-4 left-4 flex justify-between md:justify-end md:space-x-4">
      <div className="flex space-x-2 md:hidden">
        <button onClick={onPrev} disabled={currentStep === 1} className={`p-3 rounded-full shadow-lg transition-all
            ${currentStep === 1 ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <ArrowLeftIcon size={20} />
        </button>
        <button onClick={onNext} disabled={currentStep === totalSteps} className={`p-3 rounded-full shadow-lg transition-all
            ${currentStep === totalSteps ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
          <ArrowRightIcon size={20} />
        </button>
      </div>
      <div className="hidden md:flex md:space-x-3">
        <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
          <SaveIcon size={18} className="mr-2" />
          Save Draft
        </button>
        <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
          <FileTextIcon size={18} className="mr-2" />
          Preview PDF
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all">
          <SendIcon size={18} className="mr-2" />
          Submit
        </button>
      </div>
    </div>;
};