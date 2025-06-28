import React, { useEffect, useState } from 'react';
import { AwardIcon, TrophyIcon, StarIcon } from 'lucide-react';
interface XPToastProps {
  xpAmount: number;
  message?: string;
  type?: 'achievement' | 'level-up' | 'completion';
  onClose?: () => void;
}
export const XPToast: React.FC<XPToastProps> = ({
  xpAmount,
  message = 'Great job!',
  type = 'completion',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  if (!isVisible) return null;
  const getIcon = () => {
    switch (type) {
      case 'achievement':
        return <TrophyIcon className="text-yellow-500" size={24} />;
      case 'level-up':
        return <StarIcon className="text-purple-500" size={24} />;
      default:
        return <AwardIcon className="text-blue-500" size={24} />;
    }
  };
  return <div className={`fixed top-4 right-4 z-50 flex items-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border-l-4 border-blue-500 transform transition-all duration-500 ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`} role="alert" aria-live="polite">
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200">
          {message}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          +{xpAmount} XP
        </p>
      </div>
    </div>;
};