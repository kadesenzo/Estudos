import React, { useState } from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  HelpCircle,
  Award,
  TrendingUp,
  Download,
  Calendar,
  Flame,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ProgressDashboard } from './ProgressDashboard';

export const PerformanceView: React.FC = () => {
  const {
    profile,
    courses,
    questionAttempts,
    quizAttempts,
    studySessions
  } = useStudy();

  const totalQuestions = questionAttempts.length;
  const correctQuestions = questionAttempts.filter(q => q.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  const inProgressCourses = courses.filter(c => c.progressPercent > 0 && c.progressPercent < 100).length;
  const completedCourses = courses.filter(c => c.progressPercent === 100).length;

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
              PAINEL DE EVOLUÇÃO GRÁFICA
            </span>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              Alvo: {profile.targetExam}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <BarChart3 className="w-7 h-7 text-blue-400" />
            <span>Dashboard de Progresso & Evolução</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Acompanhe o tempo de estudo diário acumulado e a evolução percentual nas matérias de cada concurso militar selecionado.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tempo Total Acumulado</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{formatHours(profile.totalStudyMinutes)}</p>
          <p className="text-[11px] text-slate-500">Meta diária: {Math.floor(profile.dailyGoalMinutes / 60)}h/dia</p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Aulas Assistidas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{profile.completedLessonsCount}</p>
          <p className="text-[11px] text-slate-500">{completedCourses} cursos finalizados</p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Questões Resolvidas</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{totalQuestions}</p>
          <p className="text-[11px] text-slate-500">{correctQuestions} acertos registrados</p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Taxa de Acerto Geral</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{accuracy}%</p>
          <p className="text-[11px] text-slate-500">Precisão em simulados e listas</p>
        </div>
      </div>

      {/* Recharts Military Progress Dashboard Core */}
      <ProgressDashboard />

      {/* Simulados History Table */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-blue-400" />
          <span>Histórico de Simulados Realizados</span>
        </h3>

        {quizAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Simulado</th>
                  <th className="pb-3">Data</th>
                  <th className="pb-3 text-center">Questões</th>
                  <th className="pb-3 text-center">Acertos</th>
                  <th className="pb-3 text-right">Aproveitamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {quizAttempts.map((attempt) => (
                  <tr key={attempt.id} className="text-slate-300">
                    <td className="py-3 font-semibold text-white">{attempt.quizTitle}</td>
                    <td className="py-3 text-slate-400">{new Date(attempt.completedAt).toLocaleDateString()}</td>
                    <td className="py-3 text-center font-mono">{attempt.totalQuestions}</td>
                    <td className="py-3 text-center font-mono text-emerald-400">{attempt.correctCount}</td>
                    <td className="py-3 text-right font-mono font-bold text-white">{attempt.scorePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">Nenhum simulado finalizado ainda.</p>
        )}
      </div>
    </div>
  );
};

