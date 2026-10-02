import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Star,
  Plus,
  BookOpen,
  Filter,
  Check,
  Copy,
  ChevronDown,
  Layers,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { FormulaItem } from '../types';

export const FormulasCatalogView: React.FC = () => {
  const { formulas, addFormula, toggleFormulaFavorite } = useStudy();
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New formula modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Matemática');
  const [newTopic, setNewTopic] = useState('');
  const [newExpression, setNewExpression] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newExample, setNewExample] = useState('');

  const subjects = ['Todas', 'Matemática', 'Física', 'Química', 'Português'];

  const filteredFormulas = formulas.filter(f => {
    const matchesSubject = selectedSubject === 'Todas' || f.category === selectedSubject;
    const matchesQuery =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.expression.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesQuery;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExpression.trim()) return;

    addFormula({
      title: newTitle,
      subject: newSubject,
      category: newSubject as any,
      topic: newTopic || 'Geral',
      expression: newExpression,
      explanation: newExplanation,
      example: newExample || undefined,
      tags: [newSubject, 'Fórmula', 'Militar'],
      isFavorite: false
    });

    setModalOpen(false);
    setNewTitle('');
    setNewExpression('');
    setNewExplanation('');
    setNewExample('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Pronto Atendimento de Consulta
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <span className="text-blue-400 font-mono text-xl">Σ</span>
            <span>Fórmulas, Regras e Conceitos Cruciais</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Formulário tático oficial com demonstrações, propriedades, regras gramaticais e atalhos de cálculo.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Fórmula</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedSubject === s
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar fórmula ou termo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0B1120] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((f) => (
          <div
            key={f.id}
            className="bg-[#0B1120] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-lg space-y-3.5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  {f.category} • {f.topic}
                </span>

                <button
                  onClick={() => toggleFormulaFavorite(f.id)}
                  className={`p-1 transition-colors ${f.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
                >
                  <Star className={`w-3.5 h-3.5 ${f.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white mt-2 group-hover:text-blue-300 transition-colors">
                {f.title}
              </h3>

              {/* Formula Display Box */}
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs md:text-sm text-cyan-300 flex items-center justify-between gap-3 shadow-inner">
                <span className="break-all">{f.expression}</span>
                <button
                  onClick={() => handleCopy(f.id, f.expression)}
                  className="p-1 text-slate-500 hover:text-white transition-colors shrink-0"
                  title="Copiar fórmula"
                >
                  {copiedId === f.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                {f.explanation}
              </p>

              {f.example && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  <strong className="text-slate-300">Ex.:</strong> {f.example}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/70">
              {f.tags.map((t, idx) => (
                <span key={idx} className="text-[9px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Nova Formula */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Cadastrar Nova Fórmula ou Regra</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFormula} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Conceito / Teorema *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Lei dos Cossenos ou Regra de L'Hôpital"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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
                    <option value="Matemática">Matemática</option>
                    <option value="Física">Física</option>
                    <option value="Química">Química</option>
                    <option value="Português">Português</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tópico</label>
                  <input
                    type="text"
                    placeholder="Ex.: Trigonometria"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expressão Matemática / Regra *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: a² = b² + c² - 2bc · cos(A)"
                  value={newExpression}
                  onChange={(e) => setNewExpression(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500 text-cyan-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Explicação & Aplicação</label>
                <textarea
                  rows={3}
                  placeholder="Quando aplicar e quais as condições de contorno..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
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
                  Salvar Fórmula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
