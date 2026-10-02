import { InAppNotification, NotificationCategory, NotificationPreferences } from '../types';

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  pushEnabled: true,
  internalEnabled: true, // Always prioritized when push is unavailable
  soundEnabled: true,
  categories: {
    spacedReviews: true,
    flashcards: true,
    routineTasks: true,
    dailyGoal: true,
    quizExams: true
  },
  advanceMinutesForRoutine: 10,
  morningReviewReminderTime: '08:00',
  eveningGoalReminderTime: '19:30'
};

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-sample-1',
    userId: 'local',
    category: 'spaced_review',
    title: 'Revisão Espaçada de Hoje: Funções & Vértice',
    message: 'Ciclo de 24h pronto para fixar a aula de Matemática na memória de longo prazo.',
    actionLabel: 'Revisar Aula',
    actionView: 'reviews',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    priority: 'high'
  },
  {
    id: 'notif-sample-2',
    userId: 'local',
    category: 'routine_session',
    title: 'Sessão de Estudo Programada no Cronograma',
    message: 'Resolução de 15 Questões de Cinemática e Dinâmica agendada para hoje.',
    actionLabel: 'Ver Cronograma',
    actionView: 'routine',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    priority: 'medium'
  },
  {
    id: 'notif-sample-3',
    userId: 'local',
    category: 'flashcard',
    title: 'Flashcards de Fixação Rápida',
    message: 'Você tem cartões de Física e Português disponíveis para revisão rápida de 5 minutos.',
    actionLabel: 'Praticar Agora',
    actionView: 'flashcards',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    priority: 'low'
  }
];

export const checkPushSupport = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getPushPermissionState = (): 'default' | 'granted' | 'denied' | 'unsupported' => {
  if (!checkPushSupport()) return 'unsupported';
  return Notification.permission;
};

export const requestPushPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!checkPushSupport()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Erro ao solicitar permissão de push notifications:', err);
    return 'denied';
  }
};

/**
 * Play a delicate synth notification chime using Web Audio API without any external dependencies.
 */
export const playNotificationChime = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Note 2: B5 (987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.1);
    gain2.gain.setValueAtTime(0, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.18, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Autoplay policy or unsupported audio context
  }
};

export const NOTIFICATION_CATEGORY_INFO: Record<
  NotificationCategory,
  { label: string; badgeClass: string; iconBg: string; textClass: string }
> = {
  spaced_review: {
    label: 'Revisão Espaçada',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    iconBg: 'bg-purple-600/20 text-purple-400',
    textClass: 'text-purple-300'
  },
  flashcard: {
    label: 'Flashcard',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    iconBg: 'bg-cyan-600/20 text-cyan-400',
    textClass: 'text-cyan-300'
  },
  routine_session: {
    label: 'Sessão de Estudo',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    iconBg: 'bg-blue-600/20 text-blue-400',
    textClass: 'text-blue-300'
  },
  daily_goal: {
    label: 'Meta Diária',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-600/20 text-amber-400',
    textClass: 'text-amber-300'
  },
  quiz_exam: {
    label: 'Simulado & Prova',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    iconBg: 'bg-rose-600/20 text-rose-400',
    textClass: 'text-rose-300'
  },
  system: {
    label: 'Sistema',
    badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    iconBg: 'bg-slate-700/40 text-slate-300',
    textClass: 'text-slate-300'
  }
};

export const formatRelativeTime = (isoString: string): string => {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Agora mesmo';
    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffHour < 24) return `Há ${diffHour}h`;
    if (diffDay === 1) return 'Ontem';
    return `Há ${diffDay} dias`;
  } catch (e) {
    return 'Recente';
  }
};
