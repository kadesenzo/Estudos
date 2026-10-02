import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Clock,
  CheckCircle2,
  Cloud,
  CloudOff,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Award
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const { profile, user, signIn, setSearchOpen, routineTasks, reviews, navigateTo, setOnboardingOpen } = useStudy();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pendingRoutineCount = routineTasks.filter(t => t.status === 'pendente' || t.status === 'em_andamento').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;
  const totalNotifications = pendingRoutineCount + (pendingReviewsCount > 0 ? 1 : 0);

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070B14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 md:gap-6 flex-1">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-800"
          aria-label="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-3 w-full max-w-md bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700 rounded-xl px-3.5 py-2 text-xs transition-all text-left shadow-xs"
        >
          <Search className="w-4 h-4 text-blue-400" />
          <span className="flex-1 truncate">Buscar aula, módulo, apostila, PDF ou questão...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Study Stats, Cloud Status, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Time Counter */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Total:</span>
          <span className="font-semibold text-white font-mono">{formatHours(profile.totalStudyMinutes)}</span>
        </div>

        {/* Completed Lessons Counter */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Aulas:</span>
          <span className="font-semibold text-white font-mono">{profile.completedLessonsCount}</span>
        </div>

        {/* Cloud Sync Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
          {user ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-medium">Nuvem Ativa</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-slate-400">Armazenamento Local</span>
            </>
          )}
        </div>

        {/* Quiz ITA Trigger Button */}
        <button
          onClick={() => setOnboardingOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
          title="Abrir Quiz de Nivelamento & Onde Parei"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Quiz ITA</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Lembretes e Notificações"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            )}
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0E1526] border border-slate-800 rounded-xl shadow-2xl py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-bold text-xs text-white">Central de Lembretes</span>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono">
                  {totalNotifications} pendências
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {pendingRoutineCount > 0 ? (
                  <div
                    onClick={() => { navigateTo('routine'); setNotificationsOpen(false); }}
                    className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/40 hover:bg-blue-900/30 cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-blue-300">Rotina de Estudos de Hoje</p>
                    <p className="text-slate-400 text-[11px]">Você tem {pendingRoutineCount} tarefas agendadas para cumprir.</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px]">Todas as tarefas de hoje foram concluídas!</p>
                )}

                {pendingReviewsCount > 0 && (
                  <div
                    onClick={() => { navigateTo('reviews'); setNotificationsOpen(false); }}
                    className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 hover:bg-purple-900/30 cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-purple-300">Revisões Espaçadas</p>
                    <p className="text-slate-400 text-[11px]">{pendingReviewsCount} conteúdos aguardando revisão programada.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button */}
        {user ? (
          <button
            onClick={() => navigateTo('settings')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.displayName.charAt(0)
              )}
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden md:inline truncate max-w-[100px]">
              {profile.displayName.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={signIn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs shadow-blue-600/30 transition-all"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Login Google</span>
          </button>
        )}
      </div>
    </header>
  );
};
