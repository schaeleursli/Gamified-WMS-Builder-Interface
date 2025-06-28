import React from 'react';
import { LayoutDashboardIcon, FolderIcon, BookmarkIcon, HardHatIcon, AlertTriangleIcon, UserIcon } from 'lucide-react';
import { useUser } from './UserContext';
interface MobileNavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentStep,
  setCurrentStep
}) => {
  const {
    user
  } = useUser();
  const navItems = [{
    icon: <LayoutDashboardIcon size={20} />,
    label: 'Home',
    action: () => setCurrentStep(1)
  }, {
    icon: <FolderIcon size={20} />,
    label: 'Projects',
    action: () => setCurrentStep(2)
  }, {
    icon: <BookmarkIcon size={20} />,
    label: 'Templates',
    action: () => setCurrentStep(3)
  }, {
    icon: <HardHatIcon size={20} />,
    label: 'Equipment',
    action: () => setCurrentStep(4)
  }, {
    icon: <AlertTriangleIcon size={20} />,
    label: 'Risks',
    action: () => setCurrentStep(5)
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2 z-10">
      <div className="flex justify-between">
        {navItems.map((item, index) => <button key={index} className="flex flex-col items-center px-3 py-2" onClick={item.action}>
            <div className={`mb-1 ${index + 1 === currentStep ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}>
              {item.icon}
            </div>
            <span className={`text-xs ${index + 1 === currentStep ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}>
              {item.label}
            </span>
          </button>)}
        {/* User Profile Icon */}
        <button className="flex flex-col items-center px-3 py-2">
          <div className="mb-1 text-slate-500 dark:text-slate-400">
            {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" /> : <UserIcon size={20} />}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Profile
          </span>
        </button>
      </div>
    </div>;
};