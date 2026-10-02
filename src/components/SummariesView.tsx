import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Star,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Trash2,
  Edit3,
  Bookmark,
  CheckCircle2,
  Copy,
  Download,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { EducationalSummary, SummaryCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

export const SummariesView: React.FC = () => {
  const { summaries, addSummary, updateSummary, deleteSummary, toggleSummaryFavorite, courses, navigateTo, addFlashcard } = useStudy();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSummary, setActiveSummary] = useState<EducationalSummary | null>(summaries[0] || null);

  // New Summary modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SummaryCategory>('materia');
  const [newSubject, setNewSubject] = useState('Matemática');
  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newKeyConcepts, setNewKeyConcepts] = useState('');
  const [newFormulas, setNewFormulas] = useState('');
  const [newTags, setNewTags] = useState('Resumo, Militar');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'Todas', label: 'Todos os Resumos' },
    { key: 'aula', label: 'Resumos de Aulas' },
    { key: 'materia', label: 'Resumos de Matérias' },
    { key: 'modulo', label: 'Resumos de Módulos' },
    { key: 'prova', label: 'Para Provas & Concursos' },
    { key: 'revisao_rapida', label: 'Revisões Rápidas' },
    { key: 'formulas_regras', label: 'Fórmulas & Regras' },
    { key: 'livros_apostilas', label: 'Livros & Apostilas' }
  ];

  const filteredSummaries = summaries.filter(s => {
    const matchesCat = selectedCategory === 'Todas' || s.category === selectedCategory;
    const matchesQuery =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleCreateSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSummary({
      title: newTitle,
      category: newCategory,
      subject: newSubject,
      topic: newTopic || undefined,
      content: newContent,
      keyConcepts: newKeyConcepts ? newKeyConcepts.split(',').map(c => c.trim()) : undefined,
      formulas: newFormulas ? newFormulas.split('\n').filter(Boolean) : undefined,
      tags: newTags.split(',').map(t => t.trim()),
      isFavorite: false
    });

    setModalOpen(false);
    setNewTitle('');
    setNewTopic('');
    setNewContent('');
    setNewKeyConcepts('');
    setNewFormulas('');
  };

  const handleGenerateWithAI = async () => {
    if (!newTitle.trim() && !newTopic.trim()) {
      alert('Digite ao menos o Título ou Assunto para a IA gerar o resumo.');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Gere um resumo tático militar completo sobre "${newTitle || newTopic}" para a matéria de ${newSubject}. Inclua introdução conceitual, pontos-chave e fórmulas essenciais.`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setNewContent(data.text);
      } else {
        setNewContent(`Resumo Teórico Militar: ${newTitle || newTopic}\n\n1. CONCEITO FUNDAMENTAL:\nO tópico aborda os princípios basilares de ${newSubject}, com foco nas bancas de alta exigência (ITA, IME, EsPCEx).\n\n2. REQUISITOS:\n- Compreensão rigorosa das definições formais.\n- Aplicação de equações de contorno sem aproximações indevidas.`);
      }
    } catch (e) {
      setNewContent(`Resumo Didático: ${newTitle || newTopic}\n\nConteúdo estruturado para fixação e revisão rápida.`);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleConvertIntoFlashcard = (s: EducationalSummary) => {
    addFlashcard({
      front: `Defina o conceito principal de: ${s.title}`,
      back: s.keyConcepts?.[0] || s.content.slice(0, 160),
      subject: s.subject,
      topic: s.topic,
      difficulty: 'medio'
    });
    alert('Flashcard criado com sucesso na sua biblioteca de repetição espaçada!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Ambiente de Síntese
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>Resumos Educacionais & Fórmulas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Biblioteca de resumos de aulas, matérias e tópicos com fórmulas, exemplos práticos e gerador com IA.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Resumo</span>
        </button>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex border-b border-slate-800 gap-1.5 pb-2 overflow-x-auto text-xs">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCategory(c.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === c.key
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Split: Summary List + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar em títulos, fórmulas ou matérias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0B1120] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredSummaries.length > 0 ? (
              filteredSummaries.map((s) => {
                const isSelected = activeSummary?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSummary(s)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 group ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-900/20 ring-1 ring-blue-500'
                        : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {s.subject}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSummaryFavorite(s.id);
                        }}
                        className={`p-1 transition-colors ${s.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
                      >
                        <Star className={`w-3.5 h-3.5 ${s.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {s.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 font-mono">
                      <span>{s.formulas ? `${s.formulas.length} fórmulas` : 'Conceitual'}</span>
                      <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Ler resumo →
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                Nenhum resumo encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Summary Detailed Reader (7 cols) */}
        <div className="lg:col-span-7">
          {activeSummary ? (
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-4">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      {activeSummary.subject}
                    </span>
                    {activeSummary.topic && (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {activeSummary.topic}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg md:text-xl font-extrabold text-white mt-2 leading-snug">
                    {activeSummary.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleConvertIntoFlashcard(activeSummary)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Criar Flashcard a partir deste resumo"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Gerar Flashcard</span>
                  </button>

                  <button
                    onClick={() => deleteSummary(activeSummary.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Excluir resumo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="space-y-4 text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 whitespace-pre-line">
                  {activeSummary.content}
                </div>

                {/* Key Concepts */}
                {activeSummary.keyConcepts && activeSummary.keyConcepts.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Conceitos-Chave & Atenção de Prova</span>
                    </h4>
                    <div className="space-y-1.5">
                      {activeSummary.keyConcepts.map((kc, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30 text-xs text-blue-200 flex items-start gap-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{kc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulas Section */}
                {activeSummary.formulas && activeSummary.formulas.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Σ</span>
                      <span>Fórmulas & Relações de Cálculo</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs space-y-2 text-emerald-300">
                      {activeSummary.formulas.map((f, idx) => (
                        <div key={idx} className="py-1 border-b border-slate-900 last:border-0">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solved Examples */}
                {activeSummary.solvedExamples && activeSummary.solvedExamples.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Exemplo Resolvido Passo a Passo
                    </h4>
                    {activeSummary.solvedExamples.map((ex, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-amber-900/30 space-y-2 text-xs">
                        <p className="font-semibold text-white">Enunciado: {ex.problem}</p>
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono text-[11px] whitespace-pre-line">
                          {ex.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0B1120] border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Selecione um resumo ao lado para ler os detalhes ou crie um novo.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Novo Resumo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Cadastrar Novo Resumo Educacional</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSummary} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Resumo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Leis de Kepler e Gravitação Universal"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria de Resumo</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SummaryCategory)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="aula">Resumo de Aula</option>
                    <option value="materia">Resumo de Matéria</option>
                    <option value="modulo">Resumo de Módulo</option>
                    <option value="prova">Para Provas & Concursos</option>
                    <option value="revisao_rapida">Revisão Rápida</option>
                    <option value="formulas_regras">Fórmulas & Regras</option>
                    <option value="livros_apostilas">Livros & Apostilas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tópico / Assunto</label>
                  <input
                    type="text"
                    placeholder="Ex.: Mecânica Celeste"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Conteúdo do Resumo (Texto Explicativo) *</label>
                  <button
                    type="button"
                    onClick={handleGenerateWithAI}
                    disabled={aiGenerating}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiGenerating ? 'Gerando com IA...' : 'Gerar Rascunho com IA'}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Escreva a síntese dos conceitos principais..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fórmulas e Regras (Uma por linha)</label>
                <textarea
                  rows={2}
                  placeholder="Ex.: F = G · (M · m) / r²&#10;T² / R³ = constante"
                  value={newFormulas}
                  onChange={(e) => setNewFormulas(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Conceitos-Chave (Separados por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex.: Órbitas elípticas, Velocidade areolar constante, Período orbital"
                  value={newKeyConcepts}
                  onChange={(e) => setNewKeyConcepts(e.target.value)}
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
                  Salvar Resumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
