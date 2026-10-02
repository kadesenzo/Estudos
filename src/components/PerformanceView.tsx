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

export const PerformanceView: React.FC = () => {
  const {
    profile,
    courses,
    questionAttempts,
    quizAttempts,
    studySessions
  } = useStudy();

  const [period, setPeriod] = useState<'7' | '30' | '90' | 'all'>('30');

  const totalQuestions = questionAttempts.length;
  const correctQuestions = questionAttempts.filter(q => q.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  const inProgressCourses = courses.filter(c => c.progressPercent > 0 && c.progressPercent < 100).length;
  const completedCourses = courses.filter(c => c.progressPercent === 100).length;

  // Breakdown by subject based on studySessions and questions
  const subjectHours: Record<string, number> = {};
  studySessions.forEach(s => {
    subjectHours[s.subject] = (subjectHours[s.subject] || 0) + s.durationMinutes;
  });

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Meu Desempenho & Evolução Acadêmica</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Estatísticas reais calculadas a partir das suas sessões de estudo, videoaulas e banco de questões.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tempo Total Acumulado</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{formatHours(profile.totalStudyMinutes)}</p>
          <p className="text-[11px] text-slate-500">Média diária: ~{Math.floor(profile.dailyGoalMinutes / 60)}h</p>
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
            <span>Questões Respondidas</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{totalQuestions}</p>
          <p className="text-[11px] text-slate-500">{correctQuestions} acertos registrados</p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Índice de Precisão</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{accuracy}%</p>
          <p className="text-[11px] text-slate-500">Taxa em simulados e banco</p>
        </div>
      </div>

      {/* Subject Distribution Bars */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white">Horas Líquidas por Matéria</h3>
          <p className="text-xs text-slate-400">Distribuição do tempo registrado em cada frente de estudos.</p>
        </div>

        <div className="space-y-4">
          {Object.entries(subjectHours).length > 0 ? (
            Object.entries(subjectHours).map(([subject, minutes]) => {
              const maxMinutes = Math.max(...Object.values(subjectHours), 1);
              const barWidth = Math.round((minutes / maxMinutes) * 100);

              return (
                <div key={subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{subject}</span>
                    <span className="font-mono text-slate-400">{formatHours(minutes)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">
              Nenhuma sessão de estudo com tempo cronometrado registrada ainda.
            </p>
          )}
        </div>
      </div>

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
