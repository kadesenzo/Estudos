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
  Info
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

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
    resetAllToZero
  } = useStudy();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [targetExam, setTargetExam] = useState(profile.targetExam);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(profile.dailyGoalMinutes);
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(profile.weeklyGoalHours);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

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

      {/* Cloud Sync Status Banner */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Banco de Dados em Nuvem (Google Firestore)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {user ? `Conectado como ${user.email}. Seus dados estão salvos com segurança.` : 'Conecte sua conta Google para sincronizar automaticamente entre computador e celular.'}
            </p>
          </div>
        </div>

        {user ? (
          <button
            onClick={signOutUser}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
          >
            Desconectar
          </button>
        ) : (
          <button
            onClick={signIn}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
          >
            Entrar com Google
          </button>
        )}
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
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
