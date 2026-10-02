import React, { useState } from 'react';
import {
  ListChecks,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Play,
  Trash2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ExerciseList } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

export const ExerciseListsView: React.FC = () => {
  const { exerciseLists, addExerciseList, deleteExerciseList, questions, navigateTo } = useStudy();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ExerciseList | null>(null);

  // New list form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubject, setNewSubject] = useState('Física');
  const [newTopic, setNewTopic] = useState('');
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addExerciseList({
      name: newName,
      description: newDesc,
      subject: newSubject,
      topic: newTopic,
      questionIds: selectedQIds.length > 0 ? selectedQIds : questions.slice(0, 3).map(q => q.id),
      isCompleted: false,
      solvedCount: 0,
      correctCount: 0
    });

    setModalOpen(false);
    setNewName('');
    setNewDesc('');
    setSelectedQIds([]);
  };

  const toggleSelectQuestion = (qId: string) => {
    setSelectedQIds(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Fixação & Prática Direcionada
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <ListChecks className="w-6 h-6 text-blue-400" />
            <span>Listas de Exercícios Táticos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Crie e resolva baterias de exercícios direcionados por assunto, módulo ou nível de dificuldade.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Lista de Exercícios</span>
        </button>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exerciseLists.map(list => {
          const totalQ = list.questionIds.length;
          const solved = list.solvedCount || 0;
          const pct = totalQ > 0 ? Math.round((solved / totalQ) * 100) : 0;

          return (
            <div
              key={list.id}
              className="bg-[#0B1120] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    {list.subject}
                  </span>
                  <button
                    onClick={() => deleteExerciseList(list.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors mt-2">
                  {list.name}
                </h3>
                {list.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {list.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Progresso da Lista</span>
                    <span className="text-white font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {solved} de {totalQ} questões resolvidas
                  </span>
                </div>

                <button
                  onClick={() => navigateTo('questions')}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Resolver no Banco de Questões</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Nova Lista */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Criar Lista de Exercícios</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Lista *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Bateria de Gravitação Universal e Leis de Kepler"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Matéria</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {INITIAL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assunto</label>
                  <input
                    type="text"
                    placeholder="Ex.: Mecânica"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição & Instruções</label>
                <textarea
                  rows={2}
                  placeholder="Objetivo da lista e orientações de tempo..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Selecionar Questões do Banco</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {questions.map((q) => {
                    const isSelected = selectedQIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => toggleSelectQuestion(q.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate max-w-[320px]">{q.statement}</span>
                        <span className="text-[10px] font-bold font-mono">{isSelected ? '✓ Inclusa' : '+ Adicionar'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Salvar Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
