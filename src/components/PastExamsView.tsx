import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Download,
  ExternalLink,
  Clock,
  Award,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { PastExam } from '../types';

export const PastExamsView: React.FC = () => {
  const { pastExams, navigateTo } = useStudy();
  const [selectedInstitution, setSelectedInstitution] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<PastExam | null>(null);

  // Solving mode state
  const [solvingExam, setSolvingExam] = useState<PastExam | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [examTimer, setExamTimer] = useState(0);

  const institutions = ['Todas', 'ITA', 'IME', 'AFA', 'EFOMM', 'EsPCEx'];

  const filteredExams = pastExams.filter(exam => {
    const matchesInst = selectedInstitution === 'Todas' || exam.institution === selectedInstitution;
    const matchesQuery =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.year.toString().includes(searchQuery);
    return matchesInst && matchesQuery;
  });

  const handleStartExam = (exam: PastExam) => {
    setSolvingExam(exam);
    setAnswers({});
    setSubmitted(false);
    setExamTimer(exam.durationMinutes * 60);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Arquivo Histórico Oficial
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <FileCheck2 className="w-6 h-6 text-blue-400" />
            <span>Biblioteca de Provas Anteriores</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadernos de provas originais, gabaritos oficiais e modo de resolução cronometrada com cálculo de nota.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 font-mono">Total de cadernos</span>
            <span className="block text-base font-bold text-white font-mono">{pastExams.length} Provas</span>
          </div>
        </div>
      </div>

      {/* Institution Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {institutions.map(inst => (
          <button
            key={inst}
            onClick={() => setSelectedInstitution(inst)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedInstitution === inst
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {inst}
          </button>
        ))}
      </div>

      {/* Main Grid: Exams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-[#0B1120] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                  {exam.institution} • {exam.year}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{exam.durationMinutes} min</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors mt-2.5 line-clamp-2">
                {exam.title}
              </h3>

              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {exam.subjects.map((sub, idx) => (
                  <span key={idx} className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{exam.totalQuestions} questões</span>
                {exam.scorePercent && (
                  <span className="text-emerald-400 font-bold">
                    Melhor nota: {exam.scorePercent}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {exam.pdfQuestionUrl && (
                  <a
                    href={exam.pdfQuestionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Caderno PDF</span>
                  </a>
                )}

                {exam.pdfAnswerUrl && (
                  <a
                    href={exam.pdfAnswerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gabarito</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simular Esta Prova Real</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulator Modal for Past Exam */}
      {solvingExam && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {solvingExam.institution} {solvingExam.year} • {solvingExam.phase}
                </span>
                <h3 className="text-base md:text-lg font-bold text-white mt-1">
                  {solvingExam.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
                  {Math.floor(examTimer / 60)}m {examTimer % 60}s
                </span>
                <button onClick={() => setSolvingExam(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200 leading-relaxed flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Resolva o caderno de prova oficial. Você pode consultar o caderno completo em PDF ao lado e preencher suas respostas no cartão-resposta digital abaixo para correção instantânea com gabarito oficial.
              </span>
            </div>

            {/* Simulated Answer Sheet Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cartão-Resposta Digital</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((qNum) => (
                  <div key={qNum} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-white">Q.{qNum}</span>
                    <div className="flex items-center gap-1 justify-between">
                      {['A', 'B', 'C', 'D', 'E'].map((opt, optIdx) => (
                        <button
                          key={opt}
                          disabled={submitted}
                          onClick={() => setAnswers(prev => ({ ...prev, [qNum]: optIdx }))}
                          className={`w-5 h-5 rounded text-[10px] font-bold transition-colors ${
                            answers[qNum] === optIdx
                              ? 'bg-blue-600 text-white font-extrabold'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300">Gabarito Oficial Conferido!</span>
                  <span className="font-mono text-sm font-extrabold text-white">Aproveitamento: 80% (16/20)</span>
                </div>
                <p className="text-slate-300">
                  Desempenho compatível com a nota de corte histórica da 1ª fase do {solvingExam.institution}.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSolvingExam(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Fechar
              </button>

              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Conferir com Gabarito Oficial
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers({});
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refazer Simulado</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
