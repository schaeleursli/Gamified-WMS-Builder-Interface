import React from 'react';
import { LayoutDashboardIcon, FolderIcon, HardHatIcon, AlertTriangleIcon, MoonIcon, SunIcon, GlobeIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useUser } from './UserContext';
import { useLanguage } from '../contexts/LanguageContext';
interface SidebarProps {
  currentStep: number;
}
export const Sidebar: React.FC<SidebarProps> = ({
  currentStep
}) => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    user,
    logout
  } = useUser();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const navItems = [{
    icon: <LayoutDashboardIcon size={20} />,
    label: 'Dashboard',
    active: true
  }, {
    icon: <FolderIcon size={20} />,
    label: 'Projects',
    active: false
  }, {
    icon: <div size={20} />,
    label: 'Templates',
    active: false
  }, {
    icon: <HardHatIcon size={20} />,
    label: 'Equipment',
    active: false
  }, {
    icon: <AlertTriangleIcon size={20} />,
    label: 'Risk Library',
    active: false
  }];
  return <div className="h-full bg-white dark:bg-slate-800 shadow-md p-4 flex flex-col">
      {/* User Profile Section */}
      {user && <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full bg-blue-400 dark:bg-blue-500 flex items-center justify-center">
                <UserIcon size={20} className="text-white" />
              </div>}
            <div className="ml-3 flex-1">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user.role}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Level {user.xpLevel}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Safety Expert
              </div>
            </div>
            <div className="mt-1 h-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{
            width: '65%'
          }}></div>
            </div>
          </div>
        </div>}
      <div className="flex items-center mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-blue-400 dark:bg-blue-500 flex items-center justify-center">
          <HardHatIcon size={24} className="text-white" />
        </div>
        <h1 className="ml-3 font-semibold text-lg">{t('app.title')}</h1>
      </div>
      <nav className="flex-1" aria-label="Main Navigation">
        <ul>
          {navItems.map((item, index) => <li key={index} className="mb-2">
              <a href="#" className={`flex items-center p-3 rounded-lg transition-colors duration-200 
                  ${item.active ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-blue-50 dark:hover:bg-slate-700'}`} aria-current={item.active ? 'page' : undefined}>
                <span className={`${item.active ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.label}</span>
              </a>
            </li>)}
        </ul>
      </nav>
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3 px-3 py-2">
          <div className="flex items-center">
            <GlobeIcon size={18} className="text-slate-500 dark:text-slate-400" />
            <span className="ml-3 text-sm">Language</span>
          </div>
          <select className="bg-transparent text-sm border border-slate-300 dark:border-slate-600 rounded px-1" value={language} onChange={e => setLanguage(e.target.value as any)} aria-label="Select language">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <button onClick={toggleTheme} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700" aria-pressed={theme === 'dark'}>
          {theme === 'light' ? <>
              <MoonIcon size={18} className="text-slate-500 dark:text-slate-400" />
              <span className="ml-3 text-sm">Dark Mode</span>
            </> : <>
              <SunIcon size={18} className="text-slate-500 dark:text-slate-400" />
              <span className="ml-3 text-sm">Light Mode</span>
            </>}
        </button>
        {user && <button onClick={logout} className="w-full flex items-center px-3 py-2 mt-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOutIcon size={18} className="text-red-500" />
            <span className="ml-3 text-sm">Logout</span>
          </button>}
      </div>
    </div>;
};