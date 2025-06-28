import React, { useEffect, useState } from 'react';
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  animate?: boolean;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  animate = true
}) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animate) {
      setWidth(0);
      const timer = setTimeout(() => {
        setWidth(currentStep / totalSteps * 100);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setWidth(currentStep / totalSteps * 100);
    }
  }, [currentStep, totalSteps, animate]);
  const getProgressColor = () => {
    const percentage = currentStep / totalSteps * 100;
    if (percentage <= 33) return 'bg-blue-400 dark:bg-blue-600';
    if (percentage <= 66) return 'bg-green-400 dark:bg-green-600';
    return 'bg-purple-400 dark:bg-purple-600';
  };
  return <div className="h-2 bg-blue-100 dark:bg-slate-800 w-full overflow-hidden" role="progressbar" aria-valuenow={width} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full ${getProgressColor()} transition-all duration-1000 ease-in-out`} style={{
      width: `${width}%`
    }} />
    </div>;
};