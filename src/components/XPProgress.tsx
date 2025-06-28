import React from 'react';
import { TrophyIcon, AwardIcon, StarIcon } from 'lucide-react';
interface XPProgressProps {
  xpPoints: number;
  completionPercentage: number;
  level: number;
}
export const XPProgress: React.FC<XPProgressProps> = ({
  xpPoints,
  completionPercentage,
  level
}) => {
  // Determine badges based on XP
  const badges = [{
    threshold: 50,
    name: 'Beginner',
    icon: <StarIcon size={14} className="mr-1" />,
    color: 'bg-pastel-blue-100 text-pastel-blue-600 dark:bg-pastel-blue-900/30 dark:text-pastel-blue-400'
  }, {
    threshold: 100,
    name: 'Intermediate',
    icon: <AwardIcon size={14} className="mr-1" />,
    color: 'bg-pastel-green-100 text-pastel-green-600 dark:bg-pastel-green-900/30 dark:text-pastel-green-400'
  }, {
    threshold: 200,
    name: 'Expert',
    icon: <TrophyIcon size={14} className="mr-1" />,
    color: 'bg-pastel-peach-100 text-pastel-peach-600 dark:bg-pastel-peach-900/30 dark:text-pastel-peach-400'
  }];
  const earnedBadges = badges.filter(badge => xpPoints >= badge.threshold);
  return <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-card">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-pastel-blue-100 dark:bg-pastel-blue-900/30 flex items-center justify-center text-pastel-blue-600 dark:text-pastel-blue-400 mr-3">
            <TrophyIcon size={18} />
          </div>
          <div>
            <h3 className="font-medium">Safety Expert Level {level}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {xpPoints} XP earned
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {earnedBadges.map((badge, index) => <div key={index} className={`flex items-center text-xs px-2 py-1 rounded-full ${badge.color}`}>
              {badge.icon}
              {badge.name}
            </div>)}
        </div>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-pastel-blue-400 to-pastel-green-400 transition-all duration-1000 ease-out" style={{
        width: `${completionPercentage}%`
      }}></div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
        <span>Progress: {completionPercentage}%</span>
        <span>Next level: {level * 50 - xpPoints} XP needed</span>
      </div>
    </div>;
};