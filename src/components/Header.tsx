import React, { useState, useRef, useEffect } from 'react';
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
  Award,
  RotateCcw,
  Layers,
  Settings,
  CheckCheck,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Volume2
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatRelativeTime, NOTIFICATION_CATEGORY_INFO, getPushPermissionState } from '../lib/notifications';
import { NotificationCategory } from '../types';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const {
    profile,
    user,
    signIn,
    setSearchOpen,
    routineTasks,
    reviews,
    navigateTo,
    setOnboardingOpen,
    notifications,
    notificationPreferences,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearReadNotifications,
    setAuthModalOpen,
    signOutUser
  } = useStudy();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'reviews' | 'routine'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'reviews') return notif.category === 'spaced_review' || notif.category === 'flashcard';
    if (activeTab === 'routine') return notif.category === 'routine_session' || notif.category === 'daily_goal';
    return true;
  });

  const pushState = getPushPermissionState();
  const pushActive = notificationPreferences.pushEnabled && pushState === 'granted';

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    setNotificationsOpen(false);
    if (notif.actionView) {
      navigateTo(notif.actionView as any, notif.actionCourseId, notif.actionLessonId);
    }
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

        {/* Full Notification Center Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-2 rounded-lg transition-colors ${
              notificationsOpen
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Central de Lembretes & Notificações"
            aria-label="Central de Lembretes & Notificações"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center font-mono shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl py-3 px-3 z-50 animate-in fade-in slide-in-from-top-2 flex flex-col max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white">Central de Lembretes</h3>
                    <p className="text-[10px] text-slate-400">Revisões programadas e sessões de estudo</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded font-mono font-semibold">
                    {unreadCount} nova{unreadCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              {/* Status and quick channel indicator */}
              <div className="flex items-center justify-between px-2 py-1.5 mt-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-medium">Internas: Ativas (Prioritárias)</span>
                </div>

                <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
                  pushActive 
                    ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/40' 
                    : 'text-slate-400 bg-slate-800 border border-slate-700'
                }`}>
                  Push: {pushActive ? 'Ativo' : 'Em Segundo Plano'}
                </span>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 mt-2.5 p-1 bg-slate-900 rounded-xl border border-slate-800/80 text-[11px]">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                    activeTab === 'unread'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Não Lidas ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Revisões
                </button>
                <button
                  onClick={() => setActiveTab('routine')}
                  className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                    activeTab === 'routine'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sessões
                </button>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center justify-between px-1 py-2 text-[10px] text-slate-400">
                <button
                  onClick={markAllNotificationsAsRead}
                  disabled={unreadCount === 0}
                  className="hover:text-blue-400 flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Marcar todas como lidas</span>
                </button>

                <button
                  onClick={clearReadNotifications}
                  className="hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar lidas</span>
                </button>
              </div>

              {/* Notification Items List */}
              <div className="space-y-2 overflow-y-auto max-h-72 pr-1 custom-scrollbar">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => {
                    const catInfo = NOTIFICATION_CATEGORY_INFO[notif.category] || NOTIFICATION_CATEGORY_INFO.system;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                          !notif.isRead
                            ? 'bg-slate-900/90 border-blue-500/40 hover:border-blue-400 shadow-xs'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${catInfo.badgeClass}`}>
                              {catInfo.label}
                            </span>
                            {notif.priority === 'urgent' && (
                              <span className="text-[9px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
                                Urgente
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {formatRelativeTime(notif.createdAt)}
                            </span>
                            {!notif.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Não lida" />
                            )}
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/60 text-[10px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Volume2 className="w-2.5 h-2.5 text-blue-400" />
                            Lembrete Interno
                          </span>

                          <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            {notif.actionLabel || 'Acessar'}
                            <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs">
                    <Bell className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    <span>Nenhum lembrete nesta categoria no momento.</span>
                  </div>
                )}
              </div>

              {/* Footer with settings link */}
              <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between px-1">
                <button
                  onClick={() => {
                    navigateTo('settings');
                    setNotificationsOpen(false);
                  }}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-400" />
                  <span>Gerenciar Preferências por Categoria</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Login Button */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-[11px] font-bold shadow-xs overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  profile.displayName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden md:inline truncate max-w-[100px]">
                {profile.displayName.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl py-3 px-3 z-50 animate-in fade-in slide-in-from-top-2 space-y-2">
                <div className="px-2 pb-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{profile.displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email || 'Conta local/convidado'}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Alvo: {profile.targetExam}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      navigateTo('settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-blue-400" />
                    <span>Perfil & Metas de Estudo</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Cloud className="w-4 h-4 text-emerald-400" />
                    <span>Status de Nuvem & Backup</span>
                  </button>

                  <button
                    onClick={async () => {
                      setProfileMenuOpen(false);
                      await signOutUser();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-rose-500/15 text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-2 border-t border-slate-800/80 pt-2"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Entrar / Cadastrar</span>
          </button>
        )}
      </div>
    </header>
  );
};

