import React, { useEffect, createElement } from 'react';
import { CheckCircleIcon, FileTextIcon, ShareIcon } from 'lucide-react';
interface MissionCompleteProps {
  xpPoints: number;
}
export const MissionComplete: React.FC<MissionCompleteProps> = ({
  xpPoints
}) => {
  useEffect(() => {
    // Simple confetti effect
    const createConfetti = () => {
      const colors = ['#4299e1', '#48bb78', '#ed8936', '#ed64a6', '#9f7aea'];
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'absolute w-3 h-3 rounded-full opacity-70';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.zIndex = '50';
        document.body.appendChild(confetti);
        const animation = confetti.animate([{
          transform: `translate(0, 0) rotate(0deg)`,
          opacity: 1
        }, {
          transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 1000 + 500}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0
        }], {
          duration: Math.random() * 3000 + 2000,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        animation.onfinish = () => confetti.remove();
      }
    };
    createConfetti();
    // Cleanup
    return () => {
      const confetti = document.querySelectorAll('div.absolute.w-3.h-3');
      confetti.forEach(el => el.remove());
    };
  }, []);
  return <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
        <CheckCircleIcon size={40} />
      </div>
      <h1 className="text-3xl font-bold mb-2">Mission Complete!</h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
        Your Work Method Statement is ready to go
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-6 py-4 mb-8">
        <div className="text-lg font-medium text-blue-700 dark:text-blue-400">
          You earned {xpPoints} XP!
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          +50 XP for completing all sections
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <FileTextIcon size={24} />
            </div>
            <h3 className="font-medium mb-3">Export PDF</h3>
            <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Download
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
              <ShareIcon size={24} />
            </div>
            <h3 className="font-medium mb-3">Share WMS</h3>
            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <div className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Safety Expert
        </div>
        <div className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
          </svg>
          Risk Assessor
        </div>
        <div className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
          First WMS
        </div>
      </div>
      <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
        Create Another WMS
      </button>
    </div>;
};