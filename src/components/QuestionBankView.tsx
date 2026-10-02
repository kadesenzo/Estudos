import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  Check,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  ChevronDown
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Question, QuestionDifficulty, SubjectCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

export const QuestionBankView: React.FC = () => {
  const {
    questions,
    addQuestion,
    recordQuestionAnswer,
    toggleQuestionFavorite,
    questionAttempts
  } = useStudy();

  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unanswered' | 'wrong' | 'favorites'>('all');

  // Active question answers state
  const [userSelections, setUserSelections] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  // New Question modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatement, setNewStatement] = useState('');
  const [newSubject, setNewSubject] = useState<string>('Matemática');
  const [newTopic, setNewTopic] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>('dificil');
  const [newOrigin, setNewOrigin] = useState('ITA 1ª Fase');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');

  // Attempts map
  const attemptsByQuestion = questionAttempts.reduce((acc, a) => {
    acc[a.questionId] = a;
    return acc;
  }, {} as Record<string, typeof questionAttempts[0]>);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.origin && q.origin.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === 'Todas' || q.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === 'todas' || q.difficulty === selectedDifficulty;

    const attempt = attemptsByQuestion[q.id];
    let matchesMode = true;
    if (filterMode === 'unanswered') matchesMode = !attempt;
    if (filterMode === 'wrong') matchesMode = !!attempt && !attempt.isCorrect;
    if (filterMode === 'favorites') matchesMode = !!q.isFavorite;

    return matchesSearch && matchesSubject && matchesDiff && matchesMode;
  });

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submittedQuestions[questionId]) return;
    setUserSelections(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitAnswer = (q: Question) => {
    const selected = userSelections[q.id];
    if (selected === undefined) return;

    const isCorrect = selected === q.correctIndex;
    setSubmittedQuestions(prev => ({ ...prev, [q.id]: true }));
    recordQuestionAnswer(q.id, selected, isCorrect, 45);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim() || newOptions.some(o => !o.trim())) return;

    addQuestion({
      statement: newStatement,
      options: newOptions,
      correctIndex: newCorrectIndex,
      explanation: newExplanation,
      subject: newSubject,
      topic: newTopic || 'Geral',
      difficulty: newDifficulty,
      origin: newOrigin,
      isFavorite: false
    });

    setModalOpen(false);
    setNewStatement('');
    setNewTopic('');
    setNewOptions(['', '', '', '', '']);
    setNewExplanation('');
  };

  const totalAnswered = Object.keys(attemptsByQuestion).length;
  const totalCorrect = Object.values(attemptsByQuestion).filter(a => a.isCorrect).length;
  const generalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-400" />
            <span>Banco Pessoal de Questões</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Treine com questões comentadas, resoluções passo a passo e registre seu desempenho real.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Questão</span>
        </button>
      </div>

      {/* Accuracy Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Total no Banco</span>
          <span className="text-xl font-bold text-white font-mono">{questions.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Resolvidas</span>
          <span className="text-xl font-bold text-blue-400 font-mono">{totalAnswered}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Acertos</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{totalCorrect}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Aproveitamento</span>
          <span className="text-xl font-bold text-purple-400 font-mono">{generalAccuracy}%</span>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-[#0B1120] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por enunciado, assunto ou banca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
          >
            <option value="Todas">Todas as Matérias</option>
            {INITIAL_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
          >
            <option value="todas">Dificuldade: Todas</option>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>

          {/* Mode Pill Filter */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-1 rounded transition-colors ${filterMode === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`px-2 py-1 rounded transition-colors ${filterMode === 'wrong' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Erros
            </button>
            <button
              onClick={() => setFilterMode('favorites')}
              className={`px-2 py-1 rounded transition-colors ${filterMode === 'favorites' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Favoritas
            </button>
          </div>
        </div>
      </div>

      {/* Quick ITA Subject Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-semibold mr-1">Filtro Rápido ITA:</span>
        {[
          { label: 'Todas as Questões', subject: 'Todas', query: '' },
          { label: '⚡ Foco ITA (Geral)', subject: 'Todas', query: 'ITA' },
          { label: '📐 Matemática ITA', subject: 'Matemática', query: 'ITA' },
          { label: '⚛️ Física ITA', subject: 'Física', query: 'ITA' },
          { label: '🧪 Química ITA', subject: 'Química', query: 'ITA' },
          { label: '📚 Português ITA', subject: 'Português', query: 'ITA' },
        ].map((chip) => {
          const isSelected = selectedSubject === chip.subject && searchQuery === chip.query;
          return (
            <button
              key={chip.label}
              onClick={() => {
                setSelectedSubject(chip.subject);
                setSearchQuery(chip.query);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => {
            const isSubmitted = !!submittedQuestions[q.id];
            const selected = userSelections[q.id];
            const attempt = attemptsByQuestion[q.id];

            return (
              <div
                key={q.id}
                className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md hover:border-slate-700 transition-colors"
              >
                {/* Meta header */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      Questão #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {q.subject}
                    </span>
                    {q.topic && (
                      <span className="text-xs text-slate-400">
                        • {q.topic}
                      </span>
                    )}
                    {q.origin && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase">
                        {q.origin}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      q.difficulty === 'facil'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : q.difficulty === 'medio'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {q.difficulty}
                    </span>

                    <button
                      onClick={() => toggleQuestionFavorite(q.id)}
                      className={`p-1 rounded transition-colors ${q.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                      title="Salvar nos favoritos"
                    >
                      <Star className={`w-4 h-4 ${q.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Statement */}
                <p className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {q.statement}
                </p>

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isChosen = selected === optIdx;
                    const isCorrect = optIdx === q.correctIndex;

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs md:text-sm transition-all flex items-center justify-between ${
                          isSubmitted
                            ? isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                              : isChosen
                              ? 'bg-red-950/40 border-red-500 text-red-300'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500'
                            : isChosen
                            ? 'bg-blue-950/40 border-blue-500 text-blue-300 font-medium'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="leading-snug">
                          <strong className="font-mono text-slate-400 mr-2">{String.fromCharCode(65 + optIdx)})</strong>
                          {opt}
                        </span>
                        {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {isSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Action & Explanation */}
                <div className="pt-2">
                  {!isSubmitted ? (
                    <button
                      disabled={selected === undefined}
                      onClick={() => handleSubmitAnswer(q)}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md disabled:opacity-40 transition-all"
                    >
                      Confirmar Gabarito
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2">
                        {selected === q.correctIndex ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Resposta Correta!
                          </span>
                        ) : (
                          <span className="text-red-400 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Resposta Incorreta.
                          </span>
                        )}
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">Alternativa correta: <strong>{String.fromCharCode(65 + q.correctIndex)}</strong></span>
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                          Resolução Passo a Passo:
                        </span>
                        <p className="leading-relaxed whitespace-pre-line text-slate-300">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-slate-400 bg-[#0B1120] border border-dashed border-slate-800 rounded-2xl">
            <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm">Nenhuma questão encontrada com os filtros atuais.</p>
          </div>
        )}
      </div>

      {/* Manual Question Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Cadastrar Nova Questão</h3>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enunciado da Questão *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Cole ou digite o texto do enunciado..."
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Matéria</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                  >
                    {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assunto / Tópico</label>
                  <input
                    type="text"
                    placeholder="Ex.: Leis de Newton"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dificuldade</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as QuestionDifficulty)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="facil">Fácil</option>
                    <option value="medio">Médio</option>
                    <option value="dificil">Difícil</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Alternativas (A a E) e Gabarito:</label>
                {newOptions.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={newCorrectIndex === optIdx}
                      onChange={() => setNewCorrectIndex(optIdx)}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span className="font-mono text-xs text-slate-400 w-5">{String.fromCharCode(65 + optIdx)})</span>
                    <input
                      type="text"
                      required
                      placeholder={`Texto da alternativa ${String.fromCharCode(65 + optIdx)}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newOptions];
                        copy[optIdx] = e.target.value;
                        setNewOptions(copy);
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resolução & Gabarito Comentado</label>
                <textarea
                  rows={3}
                  placeholder="Passo a passo detalhado da resolução..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
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
                  Salvar Questão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
