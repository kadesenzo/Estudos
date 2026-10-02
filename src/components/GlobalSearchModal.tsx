import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Video,
  FileText,
  BookMarked,
  HelpCircle,
  Layers,
  Shield,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { RAW_DATABASE, RAW_MATERIAS, TELEGRAM_CHANNEL_BASE } from '../data/rawTelegramData';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    courses,
    notes,
    questions,
    militaryExams,
    navigateTo
  } = useStudy();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const qLower = query.toLowerCase().trim();

  // Search Results aggregation
  const matchedCourses = qLower ? courses.filter(c => c.title.toLowerCase().includes(qLower) || c.category.toLowerCase().includes(qLower)).slice(0, 3) : [];

  const matchedRawLessons = qLower ? RAW_DATABASE.filter(r => r.title.toLowerCase().includes(qLower)).slice(0, 8) : [];

  const matchedNotes = qLower ? notes.filter(n => n.title.toLowerCase().includes(qLower) || n.content.toLowerCase().includes(qLower)).slice(0, 3) : [];

  const matchedQuestions = qLower ? questions.filter(q => q.statement.toLowerCase().includes(qLower) || q.topic.toLowerCase().includes(qLower)).slice(0, 3) : [];

  const matchedMilitary = qLower ? militaryExams.filter(m => m.name.toLowerCase().includes(qLower) || m.fullName.toLowerCase().includes(qLower)).slice(0, 2) : [];

  const hasAnyResults = matchedCourses.length > 0 || matchedRawLessons.length > 0 || matchedNotes.length > 0 || matchedQuestions.length > 0 || matchedMilitary.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar entre mais de 600 aulas, PDFs, anotações e simulados..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 border border-slate-800 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Results Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!qLower ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <Search className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p>Digite para buscar em mais de 600 aulas, apostilas e exercícios.</p>
            </div>
          ) : !hasAnyResults ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <p>Nenhum resultado encontrado para "{query}".</p>
            </div>
          ) : (
            <>
              {/* Raw Telegram Lessons & PDFs */}
              {matchedRawLessons.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Aulas & Arquivos da Biblioteca ({matchedRawLessons.length})
                  </span>
                  <div className="space-y-1">
                    {matchedRawLessons.map(item => {
                      const subjectName = RAW_MATERIAS[item.subjectIdx]?.[0] || 'Geral';
                      const url = `${TELEGRAM_CHANNEL_BASE}${item.telegramMsgId}`;

                      return (
                        <a
                          key={item.telegramMsgId}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-blue-600/10 border border-slate-800/80 hover:border-blue-500/30 flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.type === 'p' ? (
                              <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <Video className="w-4 h-4 text-blue-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-white group-hover:text-blue-300 truncate block">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {subjectName} • {item.sizeMb >= 1000 ? `${(item.sizeMb/1000).toFixed(1)} GB` : `${item.sizeMb} MB`}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Courses */}
              {matchedCourses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cursos Estruturados</span>
                  <div className="space-y-1">
                    {matchedCourses.map(c => (
                      <div
                        key={c.id}
                        onClick={() => { navigateTo('course-detail', c.id); setSearchOpen(false); }}
                        className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-blue-600/10 border border-slate-800/80 hover:border-blue-500/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-xs font-semibold text-white truncate">{c.title}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">{c.category}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {matchedNotes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meu Caderno</span>
                  <div className="space-y-1">
                    {matchedNotes.map(n => (
                      <div
                        key={n.id}
                        onClick={() => { navigateTo('notebook'); setSearchOpen(false); }}
                        className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-blue-600/10 border border-slate-800/80 hover:border-blue-500/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <BookMarked className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-white truncate block">{n.title}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1">{n.content}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Military */}
              {matchedMilitary.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Concursos Militares</span>
                  <div className="space-y-1">
                    {matchedMilitary.map(m => (
                      <div
                        key={m.id}
                        onClick={() => { navigateTo('military'); setSearchOpen(false); }}
                        className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-blue-600/10 border border-slate-800/80 hover:border-blue-500/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-xs font-bold text-white font-mono">{m.name}</span>
                          <span className="text-xs text-slate-400">{m.fullName}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
