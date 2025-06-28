import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainPanel } from './components/MainPanel';
import { MobileNavigation } from './components/MobileNavigation';
import { ThemeProvider } from './components/ThemeContext';
import { UserProvider, useUser } from './components/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { Login } from './components/Login';
import { ProgressBar } from './components/ProgressBar';
import { Mascot } from './components/Mascot';
import { ProjectDashboard } from './components/project/ProjectDashboard';
const AppContent = () => {
  const {
    isAuthenticated,
    isLoading
  } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [showMascot, setShowMascot] = useState(true);
  const totalSteps = 5;
  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }
  // Show main app content if authenticated
  return <div className="flex flex-col md:flex-row w-full h-screen bg-blue-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0 h-full overflow-y-auto">
        <Sidebar currentStep={currentStep} />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        {/* Main scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Use ProjectDashboard for the new project-based structure */}
          <ProjectDashboard />
        </div>
      </div>
      {/* Mobile Navigation - visible only on mobile */}
      <div className="md:hidden">
        <MobileNavigation currentStep={currentStep} setCurrentStep={setCurrentStep} />
      </div>
      {/* Mascot helper */}
      {showMascot && <Mascot step={currentStep} onDismiss={() => setShowMascot(false)} />}
    </div>;
};
export function App() {
  return <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <ProjectProvider>
            <AppContent />
          </ProjectProvider>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>;
}