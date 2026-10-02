import React, { useState } from 'react';
import {
  Layers,
  Plus,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trash2,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Flashcard, QuestionDifficulty } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

export const FlashcardsView: React.FC = () => {
  const { flashcards, addFlashcard, reviewFlashcard, deleteFlashcard } = useStudy();
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // New card state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newSubject, setNewSubject] = useState('Física');
  const [newTopic, setNewTopic] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>('medio');

  const filteredCards = flashcards.filter(c => selectedSubject === 'Todas' || c.subject === selectedSubject);
  const currentCard: Flashcard | undefined = filteredCards[currentCardIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReview = (rating: 'facil' | 'medio' | 'dificil') => {
    if (!currentCard) return;
    reviewFlashcard(currentCard.id, rating);
    setIsFlipped(false);
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    addFlashcard({
      front: newFront,
      back: newBack,
      subject: newSubject,
      topic: newTopic || 'Conceito',
      difficulty: newDifficulty
    });

    setModalOpen(false);
    setNewFront('');
    setNewBack('');
    setNewTopic('');
  };

  const masteredCount = flashcards.filter(c => c.repetitions >= 3).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            <span>Flashcards & Memorização Ativa</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revisão ativa com repetição espaçada. Classifique sua facilidade para agendar o próximo ciclo.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Flashcard</span>
        </button>
      </div>

      {/* Filter and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1120] border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filtrar Matéria:</span>
          <select
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); setCurrentCardIndex(0); setIsFlipped(false); }}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
          >
            <option value="Todas">Todas as Matérias</option>
            {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">Total: <strong className="text-white">{flashcards.length}</strong></span>
          <span className="text-emerald-400 font-semibold">Dominados: {masteredCount}</span>
        </div>
      </div>

      {/* Main Flashcard Interactive Stage */}
      {currentCard ? (
        <div className="space-y-6">
          {/* Card Box with 3D Flip style */}
          <div
            onClick={handleFlip}
            className={`min-h-[300px] md:min-h-[360px] rounded-3xl p-8 md:p-12 border cursor-pointer select-none transition-all flex flex-col justify-between shadow-2xl relative ${
              isFlipped
                ? 'bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-blue-500/50'
                : 'bg-gradient-to-br from-[#090E1A] to-[#0D1526] border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Card Header info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  {currentCard.subject}
                </span>
                {currentCard.topic && (
                  <span className="text-slate-400 text-xs">• {currentCard.topic}</span>
                )}
              </div>

              <span className="text-xs font-mono text-slate-500">
                Cartão {currentCardIndex + 1} de {filteredCards.length}
              </span>
            </div>

            {/* Front or Back Content */}
            <div className="my-auto py-6 text-center space-y-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-slate-500 block">
                {isFlipped ? 'RESPOSTA / CONCEITO' : 'PERGUNTA / DESAFIO'}
              </span>

              <p className={`font-sans leading-relaxed whitespace-pre-line ${
                isFlipped
                  ? 'text-lg md:text-xl text-blue-200 font-semibold'
                  : 'text-xl md:text-2xl text-white font-extrabold'
              }`}>
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Flip Indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Clique para virar o cartão</span>
              </span>
              <span>Revisões feitas: {currentCard.repetitions}</span>
            </div>
          </div>

          {/* Rating Response Buttons */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-3">
            <span className="text-xs font-bold text-slate-400 block text-center uppercase tracking-wider">
              Como foi sua retenção desta questão?
            </span>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleReview('dificil')}
                className="py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs md:text-sm font-bold transition-all flex flex-col items-center gap-1"
              >
                <span>Difícil / Errei</span>
                <span className="text-[10px] text-red-300 font-normal opacity-80">+1 dia (Revisar logo)</span>
              </button>

              <button
                onClick={() => handleReview('medio')}
                className="py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs md:text-sm font-bold transition-all flex flex-col items-center gap-1"
              >
                <span>Médio / Acertei c/ Dúvida</span>
                <span className="text-[10px] text-amber-300 font-normal opacity-80">+2 dias</span>
              </button>

              <button
                onClick={() => handleReview('facil')}
                className="py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-bold transition-all flex flex-col items-center gap-1"
              >
                <span>Fácil / Dominado</span>
                <span className="text-[10px] text-emerald-300 font-normal opacity-80">+4 dias</span>
              </button>
            </div>
          </div>

          {/* Card Navigator */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <button
              disabled={currentCardIndex === 0}
              onClick={() => { setCurrentCardIndex(prev => prev - 1); setIsFlipped(false); }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={() => deleteFlashcard(currentCard.id)}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Excluir este Flashcard"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              disabled={currentCardIndex === filteredCards.length - 1}
              onClick={() => { setCurrentCardIndex(prev => prev + 1); setIsFlipped(false); }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1.5 transition-colors"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-[#0B1120] border border-dashed border-slate-800 rounded-2xl">
          <p className="text-sm">Nenhum flashcard para a matéria selecionada.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            Cadastrar Primeiro Flashcard
          </button>
        </div>
      )}

      {/* Modal: New Flashcard */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Criar Novo Flashcard</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Frente (Pergunta ou Fórmula)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex.: Qual é a fórmula do Teorema de Stevin?"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Verso (Resposta ou Explicação)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ex.: ΔP = d * g * Δh (Diferença de pressão entre dois pontos em repouso)"
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    placeholder="Ex.: Hidrostática"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
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
                  Salvar Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
