import React, { useEffect, createElement } from 'react';
import { CheckCircleIcon, FileTextIcon, ShareIcon, ArrowLeftIcon, DownloadIcon, TrophyIcon, AwardIcon, StarIcon } from 'lucide-react';
import { WMS } from '../types';
interface MissionCompleteProps {
  xpPoints: number;
  onBack: () => void;
  wms: WMS;
}
export const MissionComplete: React.FC<MissionCompleteProps> = ({
  xpPoints,
  onBack,
  wms
}) => {
  useEffect(() => {
    // Simple confetti effect
    const createConfetti = () => {
      const colors = ['#0076ff', '#00ff66', '#ff6600', '#ed64a6', '#9f7aea'];
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'absolute w-3 h-3 rounded-full opacity-70 animate-confetti-fall';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.zIndex = '50';
        document.body.appendChild(confetti);
        setTimeout(() => {
          confetti.remove();
        }, 3000);
      }
    };
    createConfetti();
    // Cleanup
    return () => {
      const confetti = document.querySelectorAll('div.absolute.w-3.h-3');
      confetti.forEach(el => el.remove());
    };
  }, []);
  // Calculate the badges earned
  const badges = [{
    name: 'Safety Expert',
    icon: <StarIcon className="h-5 w-5 mr-2" />,
    color: 'bg-pastel-blue-100 dark:bg-pastel-blue-900/30 text-pastel-blue-600 dark:text-pastel-blue-400'
  }, {
    name: 'Risk Assessor',
    icon: <AwardIcon className="h-5 w-5 mr-2" />,
    color: 'bg-pastel-green-100 dark:bg-pastel-green-900/30 text-pastel-green-600 dark:text-pastel-green-400'
  }, {
    name: wms.steps.length > 5 ? 'Master Planner' : 'WMS Creator',
    icon: <TrophyIcon className="h-5 w-5 mr-2" />,
    color: 'bg-pastel-peach-100 dark:bg-pastel-peach-900/30 text-pastel-peach-600 dark:text-pastel-peach-400'
  }];
  return <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-pastel-green-100 dark:bg-pastel-green-900/30 flex items-center justify-center text-pastel-green-600 dark:text-pastel-green-400 mb-6 animate-bounce-slow">
        <CheckCircleIcon size={40} />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">
        Mission Complete!
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
        Your Work Method Statement is ready to go
      </p>
      <div className="bg-pastel-blue-50 dark:bg-pastel-blue-900/20 rounded-lg px-6 py-4 mb-8 animate-pulse-slow">
        <div className="text-lg font-medium text-pastel-blue-700 dark:text-pastel-blue-400">
          You earned {xpPoints} XP!
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          +50 XP for completing all sections
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-card p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mb-3">
              <FileTextIcon size={24} />
            </div>
            <h3 className="font-medium mb-3">Export PDF</h3>
            <button className="w-full py-2 bg-pastel-blue-500 hover:bg-pastel-blue-600 text-white rounded-lg transition-colors shadow-soft">
              <DownloadIcon size={16} className="inline-block mr-2" />
              Download
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-card p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-pastel-green-100 dark:bg-pastel-green-900/30 flex items-center justify-center text-pastel-green-600 dark:text-pastel-green-400 mb-3">
              <ShareIcon size={24} />
            </div>
            <h3 className="font-medium mb-3">Share WMS</h3>
            <button className="w-full py-2 bg-pastel-green-500 hover:bg-pastel-green-600 text-white rounded-lg transition-colors shadow-soft">
              <ShareIcon size={16} className="inline-block mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {badges.map((badge, index) => <div key={index} className={`flex items-center px-4 py-2 rounded-full ${badge.color}`}>
            {badge.icon}
            {badge.name}
          </div>)}
      </div>
      <div className="flex space-x-4">
        <button onClick={onBack} className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors shadow-soft flex items-center">
          <ArrowLeftIcon size={18} className="mr-2" />
          Back to Projects
        </button>
        <button className="px-6 py-3 bg-pastel-blue-500 hover:bg-pastel-blue-600 text-white rounded-lg transition-colors shadow-soft">
          Create Another WMS
        </button>
      </div>
    </div>;
};