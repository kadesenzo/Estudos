import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Play,
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { SpacedReview } from '../types';

export const ReviewsView: React.FC = () => {
  const { reviews, navigateTo } = useStudy();
  const todayStr = new Date().toISOString().split('T')[0];

  // Simulated default review queue if empty
  const defaultSampleReviews: SpacedReview[] = [
    {
      id: 'rev-sample-1',
      userId: 'local',
      title: 'Funções de 1º e 2º Grau: Estudo do Vértice',
      subject: 'Matemática',
      courseId: 'course-mat-01',
      lessonId: 'les-m-22',
      intervalStage: 1, // 1 day
      nextReviewDate: todayStr,
      status: 'pending'
    },
    {
      id: 'rev-sample-2',
      userId: 'local',
      title: 'Casos Especiais de Crase & Regência Nominal',
      subject: 'Português',
      courseId: 'course-port-01',
      lessonId: 'les-p-5',
      intervalStage: 2, // 7 days
      nextReviewDate: todayStr,
      status: 'pending'
    },
    {
      id: 'rev-sample-3',
      userId: 'local',
      title: 'Leis de Newton & Plano Inclinado com Atrito',
      subject: 'Física',
      courseId: 'course-fis-01',
      lessonId: 'les-f-11',
      intervalStage: 3, // 30 days
      nextReviewDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'pending'
    }
  ];

  const allReviews = reviews.length > 0 ? reviews : defaultSampleReviews;

  const todayReviews = allReviews.filter(r => r.nextReviewDate === todayStr && r.status === 'pending');
  const delayedReviews = allReviews.filter(r => r.nextReviewDate < todayStr && r.status === 'pending');
  const upcomingReviews = allReviews.filter(r => r.nextReviewDate > todayStr && r.status === 'pending');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-blue-400" />
          <span>Revisões Inteligentes (Repetição Espaçada)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Metodologia comprovada de fixação de memória em ciclos de 1 dia, 7 dias e 30 dias após cada aula assistida.
        </p>
      </div>

      {/* Explanatory Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-slate-900 border border-blue-800/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Curva de Esquecimento Ebbinghaus Aplicada</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Revisar tópicos no momento exato em que a curva de retenção decai consolida o conhecimento na memória de longo prazo, essencial para gabaritar provas concorridas.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 block font-sans">Ciclo 1</span>
            <span className="text-xs font-bold text-blue-400">24 horas</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 block font-sans">Ciclo 2</span>
            <span className="text-xs font-bold text-purple-400">7 dias</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 block font-sans">Ciclo 3</span>
            <span className="text-xs font-bold text-emerald-400">30 dias</span>
          </div>
        </div>
      </div>

      {/* Today's Reviews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Revisões Programadas para Hoje ({todayReviews.length})</span>
          </h3>
        </div>

        {todayReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#0B1120] border border-blue-900/40 hover:border-blue-500/50 shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                    {rev.subject}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    Etapa {rev.intervalStage} ({rev.intervalStage === 1 ? '1 dia' : rev.intervalStage === 2 ? '7 dias' : '30 dias'})
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{rev.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Revisão prioritária para consolidar a fixação.</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    onClick={() => rev.courseId && rev.lessonId && navigateTo('lesson-player', rev.courseId, rev.lessonId)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Revisar Aula</span>
                  </button>

                  <span className="text-[11px] text-slate-500">Agendada para hoje</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 bg-[#0B1120] border border-slate-800 rounded-2xl text-xs">
            Parabéns! Todas as revisões de hoje foram concluídas.
          </div>
        )}
      </div>

      {/* Delayed Reviews */}
      {delayedReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Revisões Atrasadas ({delayedReviews.length})</span>
          </h3>

          <div className="space-y-3">
            {delayedReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{rev.title}</h4>
                  <p className="text-slate-400 text-[11px]">{rev.subject} • Data prevista: {rev.nextReviewDate}</p>
                </div>

                <button
                  onClick={() => rev.courseId && rev.lessonId && navigateTo('lesson-player', rev.courseId, rev.lessonId)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors"
                >
                  Colocar em Dia
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Reviews */}
      {upcomingReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Próximas Revisões no Calendário</span>
          </h3>

          <div className="space-y-2">
            {upcomingReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200">{rev.title}</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">{rev.subject} • Etapa {rev.intervalStage}</p>
                </div>
                <span className="font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  {rev.nextReviewDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
