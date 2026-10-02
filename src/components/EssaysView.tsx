import React, { useState } from 'react';
import {
  PenTool,
  Plus,
  Sparkles,
  Award,
  CheckCircle2,
  Trash2,
  Edit3,
  Clock,
  BookOpen,
  Send,
  RotateCcw,
  Shield,
  FileText,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Essay } from '../types';

export const EssaysView: React.FC = () => {
  const { essays, addEssay, updateEssay, deleteEssay, gradeEssayWithAI } = useStudy();
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(essays[0] || null);

  // New essay modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newExam, setNewExam] = useState('ITA');
  const [newContent, setNewContent] = useState('');
  const [isGrading, setIsGrading] = useState(false);

  const calculateCounts = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    return { words, lines };
  };

  const handleCreateEssay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const { words, lines } = calculateCounts(newContent);
    addEssay({
      title: newTitle,
      theme: newTheme || 'Tema Livre',
      subjectOrExam: newExam,
      content: newContent,
      wordCount: words,
      lineCount: lines,
      status: 'draft'
    });

    setModalOpen(false);
    setNewTitle('');
    setNewTheme('');
    setNewContent('');
  };

  const handleGrade = async (essayId: string) => {
    setIsGrading(true);
    await gradeEssayWithAI(essayId);
    setIsGrading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Laboratório Textual & Discursivo
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
            <PenTool className="w-6 h-6 text-blue-400" />
            <span>Redação & Produção Textual Militar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Produção dissertativo-argumentativa com contagem de linhas e palavras, temas de bancas e correção por competências.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Escrever Nova Redação</span>
        </button>
      </div>

      {/* 2-Column Split: Essay List & Editor/Corrections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Minhas Redações</h3>
          <div className="space-y-2.5">
            {essays.map((essay) => {
              const isSelected = selectedEssay?.id === essay.id;
              return (
                <div
                  key={essay.id}
                  onClick={() => setSelectedEssay(essay)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/30 ring-1 ring-blue-500'
                      : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      {essay.subjectOrExam}
                    </span>
                    {essay.aiFeedback ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Nota: {essay.aiFeedback.overallScore.toFixed(1)}/10
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">Rascunho</span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-1">{essay.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {essay.theme}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800 font-mono">
                    <span>{essay.wordCount} palavras • ~{essay.lineCount} linhas</span>
                    <span className="text-blue-400">Ver texto →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Reader & Evaluation (8 cols) */}
        <div className="lg:col-span-8">
          {selectedEssay ? (
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Banca {selectedEssay.subjectOrExam}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedEssay.wordCount} palavras • {selectedEssay.lineCount} linhas
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-2 leading-snug">{selectedEssay.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Tema: <strong className="text-slate-300">{selectedEssay.theme}</strong></p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleGrade(selectedEssay.id)}
                    disabled={isGrading}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGrading ? 'Avaliando...' : 'Avaliar com IA'}</span>
                  </button>

                  <button
                    onClick={() => deleteEssay(selectedEssay.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Body */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Texto Redigido</h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                  {selectedEssay.content}
                </div>
              </div>

              {/* Evaluation Feedback Panel */}
              {selectedEssay.aiFeedback && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl">
                    <div>
                      <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Avaliação da Banca</span>
                      <p className="text-xs text-slate-300 mt-1">{selectedEssay.aiFeedback.summary}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-emerald-400">
                        {selectedEssay.aiFeedback.overallScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500 font-mono"> / 10.0</span>
                    </div>
                  </div>

                  {/* Competency Breakdown */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Critérios de Avaliação</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEssay.aiFeedback.competencies.map((comp, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-white truncate max-w-[200px]">{comp.name}</span>
                            <span className="text-emerald-400 font-mono">{comp.score?.toFixed(1)} / {comp.maxScore.toFixed(1)}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{comp.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
              Nenhuma redação selecionada.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Escrever Redação */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Escrever Nova Redação</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEssay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Redação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: A soberania territorial e o papel do domínio tecnológico"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Banca / Concurso</label>
                  <select
                    value={newExam}
                    onChange={(e) => setNewExam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ITA">ITA (Aeronáutica)</option>
                    <option value="IME">IME (Exército)</option>
                    <option value="EsPCEx">EsPCEx</option>
                    <option value="AFA">AFA</option>
                    <option value="EFOMM">EFOMM</option>
                    <option value="Geral">Dissertação Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tema Proposto</label>
                  <input
                    type="text"
                    placeholder="Ex.: O avanço da inteligência artificial na soberania nacional"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <label className="font-semibold text-slate-300">Texto Dissertativo-Argumentativo *</label>
                  <span className="text-slate-400 font-mono">
                    {calculateCounts(newContent).words} palavras • ~{calculateCounts(newContent).lines} linhas
                  </span>
                </div>
                <textarea
                  required
                  rows={10}
                  placeholder="Comece sua introdução apresentando a tese..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-serif leading-relaxed"
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
                  Salvar Rascunho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
