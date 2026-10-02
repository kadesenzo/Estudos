import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  Award,
  ChevronRight,
  Shield,
  Star,
  Clock,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { LearningPath, LearningPathMilestone } from '../types';

export const LearningPathsView: React.FC = () => {
  const { learningPaths, toggleLearningPathMilestone, enrollLearningPath, navigateTo } = useStudy();
  const [selectedPath, setSelectedPath] = useState<LearningPath>(learningPaths[0] || null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Roteiro Pedagógico Guiado
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <Compass className="w-6 h-6 text-blue-400" />
            <span>Trilhas de Aprendizagem Militar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sequência pedagógica estruturada de cursos, módulos, exercícios e simulados para cada concurso.
          </p>
        </div>
      </div>

      {/* Path Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {learningPaths.map(path => {
          const isSelected = selectedPath?.id === path.id;
          return (
            <div
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-950/40 ring-2 ring-blue-500'
                  : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    {path.category}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {path.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2.5">
                  {path.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {path.subtitle}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Conclusão</span>
                  <span className="text-white font-bold">{path.progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full"
                    style={{ width: `${path.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono block text-right">
                  {path.milestones.filter(m => m.isCompleted).length}/{path.milestones.length} etapas
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Path Timeline */}
      {selectedPath && (
        <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                {selectedPath.category}
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1.5">{selectedPath.title}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{selectedPath.description}</p>
            </div>

            <button
              onClick={() => enrollLearningPath(selectedPath.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPath.isEnrolled
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
              }`}
            >
              {selectedPath.isEnrolled ? '✓ Trilha Ativa no Painel' : 'Iniciar Esta Trilha'}
            </button>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Etapas & Marcos do Aprendizado</h3>
            <div className="space-y-3">
              {selectedPath.milestones.map((m, idx) => {
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      m.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <button
                        onClick={() => toggleLearningPathMilestone(selectedPath.id, m.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors mt-0.5 ${
                          m.isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white'
                        }`}
                      >
                        {m.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-mono">{idx + 1}</span>}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {m.subject}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            ~{m.durationHours}h de estudo
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold mt-1 ${m.isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                          {m.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {m.targetType === 'course' && (
                        <button
                          onClick={() => navigateTo('courses')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>Acessar Aulas</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {m.targetType === 'quiz' && (
                        <button
                          onClick={() => navigateTo('simulados')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>Abrir Simulado</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
