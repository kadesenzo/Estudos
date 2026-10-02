import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CoursesView } from './components/CoursesView';
import { CourseDetailView } from './components/CourseDetailView';
import { LessonPlayerView } from './components/LessonPlayerView';
import { MilitaryExamsView } from './components/MilitaryExamsView';
import { RoutinePlannerView } from './components/RoutinePlannerView';
import { CalendarView } from './components/CalendarView';
import { QuestionBankView } from './components/QuestionBankView';
import { SimuladosView } from './components/SimuladosView';
import { ReviewsView } from './components/ReviewsView';
import { FlashcardsView } from './components/FlashcardsView';
import { NotebookView } from './components/NotebookView';
import { MaterialsView } from './components/MaterialsView';
import { PerformanceView } from './components/PerformanceView';
import { AIAssistantView } from './components/AIAssistantView';
import { SettingsView } from './components/SettingsView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { InAppNotificationToast } from './components/InAppNotificationToast';
import {
  LayoutDashboard,
  BookOpen,
  Shield,
  Clock,
  Menu,
  HelpCircle,
  FileCheck2,
  BookMarked
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, navigateTo, onboardingOpen, setOnboardingOpen } = useStudy();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060911] text-[#E2E8F0] font-sans flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen overflow-x-hidden pb-16 md:pb-0">
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 md:p-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'courses' && <CoursesView />}
          {currentView === 'course-detail' && <CourseDetailView />}
          {currentView === 'lesson-player' && <LessonPlayerView />}
          {currentView === 'military' && <MilitaryExamsView />}
          {currentView === 'routine' && <RoutinePlannerView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'questions' && <QuestionBankView />}
          {currentView === 'simulados' && <SimuladosView />}
          {currentView === 'reviews' && <ReviewsView />}
          {currentView === 'flashcards' && <FlashcardsView />}
          {currentView === 'notebook' && <NotebookView />}
          {currentView === 'materials' && <MaterialsView />}
          {currentView === 'performance' && <PerformanceView />}
          {currentView === 'ai-assistant' && <AIAssistantView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070B14]/95 backdrop-blur-md border-t border-slate-800 md:hidden flex items-center justify-around py-2 px-2">
        <button
          onClick={() => navigateTo('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'dashboard' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Início</span>
        </button>

        <button
          onClick={() => navigateTo('courses')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'courses' || currentView === 'course-detail' || currentView === 'lesson-player'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cursos</span>
        </button>

        <button
          onClick={() => navigateTo('military')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'military' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Militar</span>
        </button>

        <button
          onClick={() => navigateTo('routine')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentView === 'routine' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Rotina</span>
        </button>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium text-slate-400"
        >
          <Menu className="w-4 h-4" />
          <span>Mais</span>
        </button>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal />

      {/* Onboarding & Diagnostic Quiz Modal */}
      <OnboardingModal isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />

      {/* Floating In-App Interactive Notification Toast */}
      <InAppNotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainLayout />
    </StudyProvider>
  );
}
