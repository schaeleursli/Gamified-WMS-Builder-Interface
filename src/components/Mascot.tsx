import React, { useEffect, useState } from 'react';
import { HardHatIcon, LightbulbIcon, XIcon } from 'lucide-react';
interface MascotProps {
  step: number;
  onDismiss?: () => void;
}
export const Mascot: React.FC<MascotProps> = ({
  step,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [tip, setTip] = useState('');
  const [animation, setAnimation] = useState('');
  useEffect(() => {
    // Reset animation when step changes
    setAnimation('animate-bounce');
    const timer = setTimeout(() => setAnimation(''), 1000);
    // Set tip based on current step
    switch (step) {
      case 1:
        setTip('Start by giving your work method a clear, descriptive title!');
        break;
      case 2:
        setTip('Planning your timeline helps everyone understand when work will happen.');
        break;
      case 3:
        setTip('Be specific about how the work will be performed - this is the core of your WMS.');
        break;
      case 4:
        setTip("Don't forget any safety equipment! Better to list more than miss something important.");
        break;
      case 5:
        setTip("Think carefully about all potential risks. What's the worst that could happen?");
        break;
      default:
        setTip("I'm here to help! Complete each section to build your WMS.");
    }
    return () => clearTimeout(timer);
  }, [step]);
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };
  if (!isVisible) return null;
  return <div className="fixed bottom-20 right-4 md:bottom-24 md:right-8 z-40 max-w-xs">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-blue-100 dark:border-blue-900/30">
        <button onClick={handleDismiss} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label="Dismiss tip">
          <XIcon size={16} />
        </button>
        <div className="flex items-start mb-3">
          <div className={`w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3 ${animation}`}>
            <HardHatIcon size={20} />
          </div>
          <div className="flex-1 pt-1">
            <p className="font-medium text-sm text-slate-700 dark:text-slate-300">
              Safety Buddy
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="w-4 h-4 mt-1 flex-shrink-0 text-blue-500">
            <LightbulbIcon size={16} />
          </div>
          <p className="ml-2 text-sm text-slate-600 dark:text-slate-400">
            {tip}
          </p>
        </div>
      </div>
    </div>;
};