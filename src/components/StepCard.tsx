import React, { useState } from 'react';
import { InfoIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { XPToast } from './XPToast';
import { useLanguage } from '../contexts/LanguageContext';
interface StepProps {
  id?: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  content: string;
}
interface StepCardProps {
  step: StepProps;
  onComplete: () => void;
  xpPoints: number;
  setXpPoints: (points: number) => void;
}
export const StepCard: React.FC<StepCardProps> = ({
  step,
  onComplete,
  xpPoints,
  setXpPoints
}) => {
  const {
    t
  } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  // Schedule specific fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('days');
  const handleComplete = () => {
    // Validate required fields
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }
    // For schedule step, validate date fields
    if (step.content === 'schedule') {
      if (!startDate) {
        alert('Please select a start date');
        return;
      }
      if (!endDate) {
        alert('Please select an end date');
        return;
      }
      if (!duration) {
        alert('Please enter duration');
        return;
      }
    }
    // Award XP points for completing this step
    setXpPoints(xpPoints + 20);
    // Move to next step
    onComplete();
  };
  return <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center">
          {step.icon}
          <span className="ml-2">{step.title}</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {step.description}
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 font-medium flex items-center">
            Title <span className="text-red-500 ml-1">*</span>
            <div className="relative group ml-2">
              <InfoIcon size={16} className="text-slate-400" />
              <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                Give your{' '}
                {step.content === 'project-details' ? 'project' : step.content === 'schedule' ? 'schedule' : 'work method'}{' '}
                a clear, descriptive title
              </div>
            </div>
          </label>
          <input type="text" id="title" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" placeholder={`e.g., ${step.content === 'project-details' ? 'Warehouse Construction Project' : step.content === 'schedule' ? 'Installation of Roof Trusses' : 'Concrete Pouring Procedure'}`} value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        {step.content === 'schedule' && <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block mb-2 font-medium flex items-center">
                  Start Date <span className="text-red-500 ml-1">*</span>
                  <CalendarIcon size={16} className="ml-2 text-slate-400" />
                </label>
                <input type="date" id="startDate" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label htmlFor="endDate" className="block mb-2 font-medium flex items-center">
                  End Date <span className="text-red-500 ml-1">*</span>
                  <CalendarIcon size={16} className="ml-2 text-slate-400" />
                </label>
                <input type="date" id="endDate" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label htmlFor="duration" className="block mb-2 font-medium flex items-center">
                  Duration <span className="text-red-500 ml-1">*</span>
                  <ClockIcon size={16} className="ml-2 text-slate-400" />
                </label>
                <input type="number" id="duration" min="1" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" placeholder="e.g., 5" value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
              <div>
                <label htmlFor="durationUnit" className="block mb-2 font-medium">
                  Unit
                </label>
                <select id="durationUnit" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" value={durationUnit} onChange={e => setDurationUnit(e.target.value)}>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </>}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium flex items-center">
            Description <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea id="description" rows={4} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" placeholder={`Describe the purpose and scope of this ${step.content === 'project-details' ? 'project' : step.content === 'schedule' ? 'work method' : 'work method'}...`} value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
        <div>
          <label htmlFor="notes" className="block mb-2 font-medium">
            Additional Notes
          </label>
          <textarea id="notes" rows={3} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-pastel-blue-400 focus:border-transparent transition-all" placeholder="Any additional information that might be helpful..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={handleComplete} className="px-6 py-2 bg-pastel-blue-500 text-white rounded-lg hover:bg-pastel-blue-600 transition-colors shadow-soft">
            Continue
          </button>
        </div>
      </div>
    </div>;
};