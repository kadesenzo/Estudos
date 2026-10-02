import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Play,
  Clock,
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flag,
  X,
  BookOpen
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Question, Quiz, QuizAttempt } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';
import confetti from 'canvas-confetti';

export const SimuladosView: React.FC = () => {
  const {
    questions,
    quizzes,
    addQuiz,
    quizAttempts,
    recordQuizAttempt,
    navigateTo
  } = useStudy();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [examActive, setExamActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(60 * 60);
  const [examCompletedReport, setExamCompletedReport] = useState<QuizAttempt | null>(null);

  // Custom Quiz Creator Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('Geral');
  const [quizCount, setQuizCount] = useState(10);
  const [quizMinutes, setQuizMinutes] = useState(40);
  const [quizDifficulty, setQuizDifficulty] = useState('Misto');

  // Exam timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (examActive && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => prev - 1);
      }, 1000);
    } else if (examActive && timeRemainingSeconds === 0) {
      handleFinishExam();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examActive, timeRemainingSeconds]);

  const handleStartExam = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeRemainingSeconds(quiz.timeMinutes * 60);
    setExamActive(true);
    setExamCompletedReport(null);
  };

  const handleFinishExam = () => {
    if (!activeQuiz) return;
    setExamActive(false);

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    const answersList: { questionId: string; selectedIndex: number; isCorrect: boolean }[] = [];
    const subjectBreakdown: Record<string, { correct: number; total: number }> = {};

    activeQuiz.questions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      const isAnswered = selected !== undefined;
      const isCorrect = isAnswered && selected === q.correctIndex;

      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { correct: 0, total: 0 };
      }
      subjectBreakdown[q.subject].total++;

      if (!isAnswered) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
        subjectBreakdown[q.subject].correct++;
      } else {
        wrongCount++;
      }

      answersList.push({
        questionId: q.id,
        selectedIndex: isAnswered ? selected : -1,
        isCorrect
      });
    });

    const scorePercent = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const timeSpent = (activeQuiz.timeMinutes * 60) - timeRemainingSeconds;

    const report: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      userId: 'local',
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      scorePercent,
      correctCount,
      wrongCount,
      unattemptedCount,
      totalQuestions: activeQuiz.questions.length,
      timeSpentSeconds: Math.max(0, timeSpent),
      answers: answersList,
      subjectBreakdown,
      completedAt: new Date().toISOString()
    };

    recordQuizAttempt(report);
    setExamCompletedReport(report);

    if (scorePercent >= 70) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleCreateCustomQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    let pool = [...questions];
    if (quizSubject !== 'Geral') {
      pool = pool.filter(q => q.subject === quizSubject);
    }
    // Shuffle
    pool = pool.sort(() => 0.5 - Math.random());
    const selectedQuestions = pool.slice(0, Math.min(quizCount, pool.length));

    // If pool is small, take whatever is available
    const finalQuestions = selectedQuestions.length > 0 ? selectedQuestions : questions.slice(0, 5);

    const newQuizId = await addQuiz({
      title: quizTitle,
      subject: quizSubject,
      questionCount: finalQuestions.length,
      timeMinutes: quizMinutes,
      difficulty: quizDifficulty,
      questions: finalQuestions
    });

    setModalOpen(false);
    setQuizTitle('');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Pre-configured default military simulados if none created
  const defaultSimulados: Quiz[] = [
    {
      id: 'default-sim-ita-1',
      userId: 'public',
      title: 'Simulado Oficial ITA — 1ª Fase (Matemática, Física & Química)',
      subject: 'Exatas ITA',
      questionCount: Math.min(questions.length, 10),
      timeMinutes: 60,
      difficulty: 'Alto Rigor (ITA)',
      questions: questions.slice(0, 10),
      createdAt: '2025-01-10T10:00:00Z'
    },
    {
      id: 'default-sim-ita-2',
      userId: 'public',
      title: 'Simulado ITA Específico — Matemática Pura & Física Teórica',
      subject: 'Matemática e Física',
      questionCount: Math.min(questions.filter(q => q.subject === 'Matemática' || q.subject === 'Física').length, 8),
      timeMinutes: 50,
      difficulty: 'Difícil (ITA)',
      questions: questions.filter(q => q.subject === 'Matemática' || q.subject === 'Física').slice(0, 8),
      createdAt: '2025-01-12T10:00:00Z'
    },
    {
      id: 'default-sim-ita-3',
      userId: 'public',
      title: 'Simulado ITA — Físico-Química, Termodinâmica & Redação',
      subject: 'Química e Redação',
      questionCount: Math.min(questions.filter(q => q.subject === 'Química' || q.subject === 'Português').length, 6),
      timeMinutes: 40,
      difficulty: 'Difícil (ITA)',
      questions: questions.filter(q => q.subject === 'Química' || q.subject === 'Português').slice(0, 6),
      createdAt: '2025-01-14T10:00:00Z'
    }
  ];

  const allQuizzes = [...quizzes, ...defaultSimulados];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-400" />
            <span>Simulados & Provas Cronometradas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Treine em condições reais de prova com cronômetro regressivo, navegador de questões e relatório de desempenho.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Montar Simulado Personalizado</span>
        </button>
      </div>

      {/* Telegram Library Simulados Autorais Fast Link */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-[#0A1020] border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                Acervo da Biblioteca
              </span>
              <span className="text-[10px] font-mono text-emerald-400">12 Provas Completas</span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-white mt-0.5">
              Simulados Autorais da Biblioteca Oficial (1º e 2º Dias)
            </h3>
            <p className="text-xs text-slate-400">
              Cadernos de prova em PDF, cartões de resposta e resoluções comentadas passo a passo.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('course-detail', 'course-sim-telegram')}
          className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 hover:border-blue-500 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Abrir Caderno de Simulados</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Exam Mode Screen */}
      {examActive && activeQuiz && (
        <div className="fixed inset-0 z-50 bg-[#070B14] flex flex-col overflow-hidden animate-in fade-in">
          {/* Exam Top Bar */}
          <div className="h-16 bg-[#0B1120] border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-sm font-bold text-white truncate max-w-md">{activeQuiz.title}</h2>
              <p className="text-[11px] text-slate-400">Questão {currentQuestionIndex + 1} de {activeQuiz.questions.length}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Countdown Timer */}
              <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm ${
                timeRemainingSeconds < 300
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeRemainingSeconds)}</span>
              </div>

              <button
                onClick={handleFinishExam}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Finalizar e Entregar
              </button>
            </div>
          </div>

          {/* Exam Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full space-y-6">
            {(() => {
              const currentQ = activeQuiz.questions[currentQuestionIndex];
              if (!currentQ) return null;
              const selectedOpt = userAnswers[currentQuestionIndex];
              const isFlagged = !!flaggedQuestions[currentQuestionIndex];

              return (
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                  {/* Question header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                        #{currentQuestionIndex + 1}
                      </span>
                      <span className="font-semibold text-slate-300">{currentQ.subject}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{currentQ.topic}</span>
                    </div>

                    <button
                      onClick={() => setFlaggedQuestions(prev => ({ ...prev, [currentQuestionIndex]: !isFlagged }))}
                      className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                        isFlagged
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{isFlagged ? 'Marcada p/ Revisão' : 'Marcar p/ Revisar'}</span>
                    </button>
                  </div>

                  {/* Statement */}
                  <p className="text-sm md:text-base text-slate-100 leading-relaxed whitespace-pre-line font-sans">
                    {currentQ.statement}
                  </p>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optIdx }))}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-950/50 border-blue-500 text-blue-200 font-semibold shadow-md'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="leading-snug">
                            <strong className="font-mono text-slate-400 mr-2.5">{String.fromCharCode(65 + optIdx)})</strong>
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Navigation Grid of Questions */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-400 block">Navegador de Questões</span>
              <div className="flex flex-wrap gap-2">
                {activeQuiz.questions.map((_, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isFlagged = !!flaggedQuestions[idx];
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-9 h-9 rounded-lg font-mono text-xs font-bold transition-all relative ${
                        isCurrent
                          ? 'ring-2 ring-blue-500 bg-blue-600 text-white'
                          : isAnswered
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                disabled={currentQuestionIndex === activeQuiz.questions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <span>Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Report Modal (When completed) */}
      {examCompletedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Relatório Oficial de Desempenho</h3>
              </div>
              <button onClick={() => setExamCompletedReport(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-mono">
                {examCompletedReport.scorePercent}%
              </div>
              <p className="text-xs text-slate-400">Aproveitamento geral no simulado {examCompletedReport.quizTitle}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[11px] text-emerald-400 block font-semibold">Acertos</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{examCompletedReport.correctCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-[11px] text-red-400 block font-semibold">Erros</span>
                <span className="text-xl font-bold text-red-400 font-mono">{examCompletedReport.wrongCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Tempo Utilizado</span>
                <span className="text-xl font-bold text-white font-mono">
                  {Math.floor(examCompletedReport.timeSpentSeconds / 60)} min
                </span>
              </div>
            </div>

            {/* Performance by Subject */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aproveitamento por Matéria</h4>
              <div className="space-y-2">
                {Object.entries(examCompletedReport.subjectBreakdown).map(([sub, stats]) => {
                  const pct = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={sub} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-200">{sub}</span>
                        <span className="font-mono font-bold text-white">{stats.correct}/{stats.total} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setExamCompletedReport(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Concluir Análise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Simulados Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Simulados Prontos para Execução</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md hover:border-blue-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {quiz.subject || 'Geral'}
                  </span>
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {quiz.timeMinutes} min
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {quiz.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {quiz.questionCount} questões formuladas com gabarito comentado ao término.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500">Dificuldade: {quiz.difficulty || 'Mista'}</span>
                <button
                  onClick={() => handleStartExam(quiz)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Iniciar Prova</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History of Completed Simulados */}
      {quizAttempts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Histórico de Simulados Realizados</span>
          </h3>

          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
            {quizAttempts.map((attempt) => (
              <div key={attempt.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{attempt.quizTitle}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {new Date(attempt.completedAt).toLocaleDateString()} • {attempt.totalQuestions} questões
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-400 font-mono">{attempt.scorePercent}%</span>
                    <span className="text-[10px] text-slate-500 block">{attempt.correctCount} acertos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Custom Quiz Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Montar Simulado Personalizado</h3>

            <form onSubmit={handleCreateCustomQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Simulado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Simulado Semanal de Matemática & Física"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Matéria Focal</label>
                <select
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="Geral">Todas as Matérias (Misto)</option>
                  {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Qtd de Questões</label>
                  <input
                    type="number"
                    min="3"
                    max="50"
                    value={quizCount}
                    onChange={(e) => setQuizCount(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tempo (Minutos)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={quizMinutes}
                    onChange={(e) => setQuizMinutes(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Gerar Simulado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
