import React, { useEffect, useState } from 'react';
import {
  Bell,
  X,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  Target,
  FileCheck2,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { NOTIFICATION_CATEGORY_INFO } from '../lib/notifications';
import { NotificationCategory } from '../types';

export const InAppNotificationToast: React.FC = () => {
  const { activeToast, dismissToast, snoozeNotification, markNotificationAsRead, navigateTo } = useStudy();
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const durationMs = 8000;

  useEffect(() => {
    if (!activeToast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const intervalMs = 100;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            dismissToast();
            return 0;
          }
          return Math.max(0, prev - step);
        });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeToast, isPaused, dismissToast]);

  if (!activeToast) return null;

  const categoryInfo = NOTIFICATION_CATEGORY_INFO[activeToast.category] || NOTIFICATION_CATEGORY_INFO.system;

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'spaced_review':
        return <RotateCcw className="w-5 h-5 text-purple-400" />;
      case 'routine_session':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'flashcard':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'daily_goal':
        return <Target className="w-5 h-5 text-amber-400" />;
      case 'quiz_exam':
        return <FileCheck2 className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-300" />;
    }
  };

  const handleActionClick = () => {
    markNotificationAsRead(activeToast.id);
    dismissToast();
    if (activeToast.actionView) {
      navigateTo(
        activeToast.actionView as any,
        activeToast.actionCourseId,
        activeToast.actionLessonId
      );
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] bg-[#0C1222] border border-blue-500/40 rounded-2xl shadow-2xl shadow-blue-950/60 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-md"
    >
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500" />

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl ${categoryInfo.iconBg} flex items-center justify-center shrink-0 border border-slate-700/60`}>
              {getCategoryIcon(activeToast.category)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${categoryInfo.badgeClass}`}>
                  {categoryInfo.label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Volume2 className="w-2.5 h-2.5 text-blue-400" />
                  Lembrete Interno
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                {activeToast.title}
              </h4>
            </div>
          </div>

          <button
            onClick={dismissToast}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Fechar Notificação"
            aria-label="Fechar Notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pl-13">
          {activeToast.message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => snoozeNotification(activeToast.id, 15)}
            className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-[11px] font-medium"
          >
            Adiar 15 min
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleActionClick}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>{activeToast.actionLabel || 'Acessar'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="h-1 bg-slate-800/50 w-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
