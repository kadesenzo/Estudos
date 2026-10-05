import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Clock,
  Download,
  Upload,
  Cloud,
  LogOut,
  Save,
  CheckCircle2,
  Trash2,
  Sparkles,
  Info,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Layers,
  Target,
  FileCheck2,
  Send,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getPushPermissionState, playNotificationChime } from '../lib/notifications';
import { NotificationCategory } from '../types';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    user,
    signIn,
    signOutUser,
    exportAllData,
    importAllData,
    setOnboardingOpen,
    resetAllToZero,
    notificationPreferences,
    updateNotificationPreferences,
    testNotification,
    requestBrowserPushPermission,
    setAuthModalOpen
  } = useStudy();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [targetExam, setTargetExam] = useState(profile.targetExam);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(profile.dailyGoalMinutes);
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(profile.weeklyGoalHours);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notifSavedSuccess, setNotifSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [testCategory, setTestCategory] = useState<NotificationCategory>('spaced_review');
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      displayName,
      targetExam,
      dailyGoalMinutes,
      weeklyGoalHours
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_aethon_estudos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllData(content);
        if (success) {
          setImportStatus('Dados restaurados com sucesso!');
        } else {
          setImportStatus('Falha ao restaurar: arquivo JSON inválido.');
        }
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          <span>Configurações & Perfil do Cadete</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ajuste suas metas diárias, seu concurso alvo, backup de segurança e sincronização em nuvem.
        </p>
      </div>

      {/* Cloud Sync Status & Account Control */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            user ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
          }`}>
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {user ? 'Conta de Cadete Sincronizada' : 'Conta Não Conectada (Modo Offline / Local)'}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                user
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {user ? 'Nuvem Ativa' : 'Local'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {user
                ? `Logado como ${user.email || profile.displayName}. Seu histórico de estudos, anotações e progresso estão salvos no Google Firestore.`
                : 'Conecte ou crie sua conta com e-mail e senha ou Google para sincronizar suas anotações, flashcards e cronograma entre computador e celular.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="Trocar de conta ou vincular novo e-mail"
              >
                Trocar de Conta
              </button>

              <button
                type="button"
                onClick={signOutUser}
                className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/40 transition-colors cursor-pointer"
              >
                Desconectar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Entrar / Criar Conta</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Dados Pessoais e Metas</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome / Como prefere ser chamado</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Concurso Militar Alvo Principal</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="EsPCEx">EsPCEx (Exército - AMAN)</option>
                <option value="ESA">ESA (Exército - Sargentos)</option>
                <option value="EEAR">EEAR (Aeronáutica - Especialistas)</option>
                <option value="AFA">AFA (Aeronáutica - Oficiais)</option>
                <option value="Escola Naval">Escola Naval (Marinha)</option>
                <option value="EFOMM">EFOMM (Marinha Mercante)</option>
                <option value="ENEM / Vestibulares">ENEM / Medicina / Vestibulares</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Diária de Estudo (Minutos)</label>
              <input
                type="number"
                min="30"
                step="30"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value) || 180)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Equivalente a {(dailyGoalMinutes / 60).toFixed(1)} horas diárias</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Semanal (Horas Líquidas)</label>
              <input
                type="number"
                min="5"
                value={weeklyGoalHours}
                onChange={(e) => setWeeklyGoalHours(parseInt(e.target.value) || 20)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Configurações salvas com sucesso!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notifications & Reminders Preferences by Category */}
      <div id="notifications-settings" className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <span>Preferências de Notificações & Lembretes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure lembretes para revisões programadas, sessões de estudo pendentes e metas, priorizando alertas internos caso as notificações push não estejam disponíveis.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={notificationPreferences.enabled}
              onChange={(e) => updateNotificationPreferences({ enabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
            />
            <span className="text-xs font-bold text-white">
              {notificationPreferences.enabled ? 'Sistema Ativo' : 'Sistema Pausado'}
            </span>
          </label>
        </div>

        {/* Priority & Channel Architecture Notice */}
        <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900 border border-blue-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Priorização de Notificações Internas</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed max-w-xl">
                Caso as notificações push do navegador estejam bloqueadas, desativadas ou não suportadas no ambiente atual, a plataforma prioriza automaticamente as <strong>notificações internas</strong> (toast flutuante interativo e central de lembretes na campainha) para garantir que você nunca perca uma revisão ou horário de estudo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Internas: Prioritárias
            </span>
          </div>
        </div>

        {/* Delivery Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Internal Notifications */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-400" />
                <span>Notificações Internas</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Sempre Ativo
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Toasts flutuantes com ação direta (&quot;Revisar Agora&quot;, &quot;Ver Cronograma&quot;), botão de adiar e contador na campainha.
            </p>
          </div>

          {/* Native Browser Push Notifications */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span>Push no Navegador</span>
                </span>
                {(() => {
                  const state = getPushPermissionState();
                  if (state === 'granted') {
                    return (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Permitido
                      </span>
                    );
                  }
                  if (state === 'denied') {
                    return (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        Bloqueado
                      </span>
                    );
                  }
                  return (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Não Solicitado
                    </span>
                  );
                })()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Receba alertas nativos no computador ou celular mesmo com a aba em segundo plano.
              </p>
            </div>

            <div className="pt-2">
              {getPushPermissionState() !== 'granted' ? (
                <button
                  type="button"
                  onClick={async () => {
                    const result = await requestBrowserPushPermission();
                    if (result === 'granted') {
                      setPushStatusMessage('Permissão concedida com sucesso!');
                    } else if (result === 'denied') {
                      setPushStatusMessage('Permissão negada no navegador. As notificações internas continuam ativas!');
                    } else {
                      setPushStatusMessage('Push não suportado neste dispositivo. As notificações internas estão ativas.');
                    }
                    setTimeout(() => setPushStatusMessage(null), 4000);
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Solicitar Permissão Push
                </button>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={notificationPreferences.pushEnabled}
                    onChange={(e) => updateNotificationPreferences({ pushEnabled: e.target.checked })}
                    className="w-3.5 h-3.5 text-cyan-600 bg-slate-800 border-slate-700 rounded"
                  />
                  <span>Enviar também via Push Nativo</span>
                </label>
              )}
              {pushStatusMessage && (
                <p className="text-[10px] text-cyan-300 mt-1">{pushStatusMessage}</p>
              )}
            </div>
          </div>

          {/* Sound Alert via Web Audio */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {notificationPreferences.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-blue-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <span>Alerta Sonoro (Chime)</span>
                </span>
                <input
                  type="checkbox"
                  checked={notificationPreferences.soundEnabled}
                  onChange={(e) => updateNotificationPreferences({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-700 rounded"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Toque suave sintetizado em tempo real para avisar a chegada de novos lembretes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => playNotificationChime()}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Testar Som de Alerta</span>
            </button>
          </div>
        </div>

        {/* Gerenciamento de Preferências por Categoria */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Categorias de Notificação & Lembretes</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Ative ou desative lembretes de acordo com seu estilo de estudo
            </span>
          </div>

          <div className="space-y-3">
            {/* Category 1: Spaced Reviews */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">Revisões Espaçadas (Ciclos 1d, 7d, 30d)</h5>
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.2 rounded border border-purple-500/20">
                      Curva de Ebbinghaus
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Lembretes automáticos das aulas e matérias prontas para revisão programada no dia, consolidando o aprendizado na memória de longo prazo.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.spacedReviews}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        spacedReviews: e.target.checked
                      }
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>

            {/* Category 2: Routine Tasks & Scheduled Study Sessions */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">Sessões de Estudo & Tarefas da Rotina</h5>
                    <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.2 rounded border border-blue-500/20">
                      Cronograma
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Lembretes pontuais antes e durante o horário agendado de cada sessão de estudos, leitura ou resolução de questões do seu cronograma.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.routineTasks}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        routineTasks: e.target.checked
                      }
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {/* Category 3: Flashcards */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">Flashcards Diários de Memorização</h5>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.2 rounded border border-cyan-500/20">
                      Fixação Rápida
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Notificações quando houver cartões com revisão pendente hoje para manter seu ritmo de memorização ativo.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.flashcards}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        flashcards: e.target.checked
                      }
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600" />
              </label>
            </div>

            {/* Category 4: Daily Goal */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">Acompanhamento da Meta Diária</h5>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.2 rounded border border-amber-500/20">
                      Metas & Disciplina
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Aviso motivacional no final do dia caso sua meta diária de horas líquidas de estudo ainda não tenha sido atingida.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.dailyGoal}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        dailyGoal: e.target.checked
                      }
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
              </label>
            </div>

            {/* Category 5: Quiz & Past Exams */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">Simulados & Listas de Exercícios</h5>
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.2 rounded border border-rose-500/20">
                      Simulações Reais
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Lembretes sobre provas anteriores para realizar e listas de exercícios que você salvou para treino.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notificationPreferences.categories.quizExams}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      categories: {
                        ...notificationPreferences.categories,
                        quizExams: e.target.checked
                      }
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Schedule & Timing Adjustments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Antecedência para Tarefas do Cronograma
            </label>
            <select
              value={notificationPreferences.advanceMinutesForRoutine}
              onChange={(e) => updateNotificationPreferences({ advanceMinutesForRoutine: parseInt(e.target.value) || 10 })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="0">No horário exato de início</option>
              <option value="5">5 minutos antes da sessão</option>
              <option value="10">10 minutos antes da sessão</option>
              <option value="15">15 minutos antes da sessão</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Tempo para organizar seu ambiente de estudos antes de começar.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Horário do Alerta da Meta Diária
            </label>
            <input
              type="time"
              value={notificationPreferences.eveningGoalReminderTime}
              onChange={(e) => updateNotificationPreferences({ eveningGoalReminderTime: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Horário em que o sistema confere se a meta de estudo foi alcançada.
            </span>
          </div>
        </div>

        {/* Test Notification Simulator */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulador & Teste em Tempo Real</span>
            </h5>
            <p className="text-[11px] text-slate-400">
              Escolha uma categoria e teste o disparo imediato da notificação interna e push na tela.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={testCategory}
              onChange={(e) => setTestCategory(e.target.value as NotificationCategory)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="spaced_review">Revisão Espaçada</option>
              <option value="routine_session">Sessão da Rotina</option>
              <option value="flashcard">Flashcard</option>
              <option value="daily_goal">Meta Diária</option>
              <option value="quiz_exam">Simulado</option>
              <option value="system">Sistema</option>
            </select>

            <button
              type="button"
              onClick={() => {
                testNotification(testCategory);
                setNotifSavedSuccess(true);
                setTimeout(() => setNotifSavedSuccess(false), 2500);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Testar Agora</span>
            </button>
          </div>
        </div>

        {notifSavedSuccess && (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Lembrete disparado! Verifique a campainha e o banner na tela.
          </p>
        )}
      </div>

      {/* Backup & Data Export Section */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-400" />
          <span>Exportação e Backup dos Seus Dados</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Você tem total controle sobre seus dados. Exporte todo o histórico de aulas concluídas, anotações do caderno, flashcards e rotinas para um arquivo JSON ou importe um backup anterior.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Baixar Backup Completo (JSON)</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restaurar Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <p className="text-xs font-semibold text-blue-400 mt-2">{importStatus}</p>
        )}
      </div>

      {/* Reset & Diagnostic Section */}
      <div className="bg-[#0B1120] border border-red-900/30 rounded-2xl p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>Reinício Limpo & Quiz de Diagnóstico</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Deseja reiniciar todas as horas, aulas assistidas e rotinas para começar do zero absoluto (0h00)? Você também pode refazer o questionário de nivelamento e definir onde parou em cada matéria do ITA.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setOnboardingOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Refazer Quiz de Nivelamento (ITA)</span>
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Tem certeza de que deseja zerar todos os contadores de estudo, aulas concluídas e rotinas?')) {
                await resetAllToZero();
                alert('Plataforma reiniciada com sucesso! Todas as métricas estão em 0h00.');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 hover:text-rose-100 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Zerar Todas as Métricas (0h00)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
