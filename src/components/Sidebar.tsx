import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Shield,
  Calendar,
  Clock,
  HelpCircle,
  FileCheck2,
  RotateCcw,
  Layers,
  BookMarked,
  FolderArchive,
  BarChart3,
  Bot,
  Settings,
  Flame,
  Award,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useStudy, AppView } from '../context/StudyContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentView, navigateTo, profile, user, signIn, signOutUser, setOnboardingOpen, setAuthModalOpen } = useStudy();

  const navItems: { view: AppView; label: string; icon: React.ElementType; badge?: string }[] = [
    { view: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { view: 'courses', label: 'Meus Cursos', icon: BookOpen },
    { view: 'military', label: 'Concursos Militares', icon: Shield, badge: 'Oficial' },
    { view: 'routine', label: 'Rotina & Rota ITA', icon: Clock, badge: '2031' },
    { view: 'calendar', label: 'Calendário', icon: Calendar },
    { view: 'questions', label: 'Banco de Questões', icon: HelpCircle },
    { view: 'simulados', label: 'Simulados', icon: FileCheck2 },
    { view: 'reviews', label: 'Revisões Inteligentes', icon: RotateCcw },
    { view: 'flashcards', label: 'Flashcards (SRS)', icon: Layers },
    { view: 'notebook', label: 'Meu Caderno', icon: BookMarked },
    { view: 'materials', label: 'Materiais & PDFs', icon: FolderArchive },
    { view: 'performance', label: 'Meu Desempenho', icon: BarChart3 },
    { view: 'ai-assistant', label: 'Assistente IA', icon: Bot, badge: 'Aethon' },
    { view: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col bg-[#070B14] border-r border-slate-800/80 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/70 flex items-center justify-between">
          <button
            onClick={() => { navigateTo('dashboard'); setMobileOpen(false); }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center shadow-lg shadow-blue-900/30 border border-blue-500/30 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-lg text-white font-mono">AETHON</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  MILITAR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Plataforma Pessoal de Estudos</p>
            </div>
          </button>
        </div>

        {/* Tactical Status Ribbon */}
        <div className="px-4 py-3 bg-slate-900/40 border-b border-slate-800/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block leading-tight">Sequência</span>
              <span className="font-bold text-amber-400">{profile.streakDays} dias seguidos</span>
            </div>
          </div>

          <button
            onClick={() => {
              setOnboardingOpen(true);
              setMobileOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/50 hover:border-blue-500/50 text-blue-300 transition-colors cursor-pointer"
            title="Refazer Quiz de Nivelamento & Onde Parei"
          >
            <Award className="w-3 h-3 text-blue-400" />
            <span className="font-semibold text-[11px]">{profile.targetExam}</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {navItems.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'courses' && currentView === 'course-detail') ||
              (item.view === 'courses' && currentView === 'lesson-player');
            const Icon = item.icon;

            return (
              <button
                key={item.view}
                onClick={() => {
                  navigateTo(item.view);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    item.badge === 'Aethon'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Quiz & Reset CTA */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => {
              setOnboardingOpen(true);
              setMobileOpen(false);
            }}
            className="w-full py-2 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Quiz ITA & Onde Parei</span>
          </button>
        </div>

        {/* User Card & Cloud Sync */}
        <div className="p-3.5 border-t border-slate-800/70 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                if (user) {
                  navigateTo('settings');
                  setMobileOpen(false);
                } else {
                  setAuthModalOpen(true);
                  setMobileOpen(false);
                }
              }}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 group-hover:border-blue-500/50 transition-colors overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.displayName.substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                  {user ? profile.displayName : 'Cadete Visitante'}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  {user ? 'Nuvem Conectada' : 'Modo Offline'}
                </p>
              </div>
            </div>

            {user ? (
              <button
                onClick={signOutUser}
                title="Sair da conta"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileOpen(false);
                }}
                title="Acessar ou Criar Conta"
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
