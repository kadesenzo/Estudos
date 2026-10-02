import React, { useState } from 'react';
import {
  FolderArchive,
  FileText,
  Download,
  ExternalLink,
  Search,
  BookOpen,
  Filter,
  Layers,
  Sparkles,
  Video,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { RAW_DATABASE, RAW_MATERIAS, TELEGRAM_CHANNEL_BASE, RawItem } from '../data/rawTelegramData';

export const MaterialsView: React.FC = () => {
  const { courses } = useStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<number>(-1);
  const [typeFilter, setTypeFilter] = useState<'all' | 'p' | 'v' | 'livro'>('all');

  const filteredItems = RAW_DATABASE.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === -1 || item.subjectIdx === selectedSubject;

    let matchesType = true;
    if (typeFilter === 'p') matchesType = item.type === 'p';
    if (typeFilter === 'v') matchesType = item.type === 'v';
    if (typeFilter === 'livro') matchesType = item.title.toLowerCase().includes('livro');

    return matchesSearch && matchesSubject && matchesType;
  });

  const totalPdfs = RAW_DATABASE.filter(i => i.type === 'p').length;
  const totalVideos = RAW_DATABASE.filter(i => i.type === 'v').length;
  const totalMb = Math.round(RAW_DATABASE.reduce((acc, i) => acc + i.sizeMb, 0));

  const formatSize = (mb: number) => {
    if (mb >= 1000) return `${(mb / 1000).toFixed(1).replace('.', ',')} GB`;
    return `${mb.toFixed(1).replace('.', ',')} MB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-blue-400" />
            <span>Banco Central de Aulas, Livros e Materiais</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Biblioteca completa com mais de 600 videoaulas, livros didáticos, listas e simulados integrados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800/50 text-xs font-mono text-blue-300">
            <strong>{RAW_DATABASE.length}</strong> itens catalogados
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            <strong>{(totalMb / 1000).toFixed(1)} GB</strong> total
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Documentos & PDFs</span>
          <span className="text-xl font-bold text-amber-400 font-mono">{totalPdfs}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Videoaulas em Alta Definição</span>
          <span className="text-xl font-bold text-blue-400 font-mono">{totalVideos}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Livros & Apostilas</span>
          <span className="text-xl font-bold text-purple-400 font-mono">
            {RAW_DATABASE.filter(i => i.title.toLowerCase().includes('livro')).length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Simulados Oficiais</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">
            {RAW_DATABASE.filter(i => i.subjectIdx === 0).length}
          </span>
        </div>
      </div>

      {/* Subject Chips Slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedSubject(-1)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedSubject === -1
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todas as Matérias ({RAW_DATABASE.length})
        </button>

        {RAW_MATERIAS.map(([name, color], idx) => {
          const count = RAW_DATABASE.filter(i => i.subjectIdx === idx).length;
          if (count === 0) return null;
          return (
            <button
              key={name}
              onClick={() => setSelectedSubject(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === idx
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {name} <span className="opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search & Type Bar */}
      <div className="bg-[#0B1120] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por termo (ex.: eletrostática, razão, crase, funções)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${typeFilter === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Tudo
            </button>
            <button
              onClick={() => setTypeFilter('v')}
              className={`px-2.5 py-1 rounded transition-colors ${typeFilter === 'v' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Vídeos
            </button>
            <button
              onClick={() => setTypeFilter('p')}
              className={`px-2.5 py-1 rounded transition-colors ${typeFilter === 'p' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              PDFs
            </button>
            <button
              onClick={() => setTypeFilter('livro')}
              className={`px-2.5 py-1 rounded transition-colors ${typeFilter === 'livro' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Livros Didáticos
            </button>
          </div>
        </div>
      </div>

      {/* Database Items List */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800/80">
        <div className="p-3 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400 px-4">
          <span>Mostrando {filteredItems.length} de {RAW_DATABASE.length} itens</span>
          <span className="text-[11px] text-slate-500">Links oficiais diretos</span>
        </div>

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const subjectInfo = RAW_MATERIAS[item.subjectIdx] || ['Geral', '#6B7280'];
            const url = `${TELEGRAM_CHANNEL_BASE}${item.telegramMsgId}`;

            return (
              <div
                key={item.telegramMsgId}
                className="p-3.5 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.type === 'p'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}>
                    {item.type === 'p' ? <FileText className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${subjectInfo[1]}20`, color: subjectInfo[1] }}
                      >
                        {subjectInfo[0]}
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-500">
                        {item.type === 'p' ? 'PDF / Apostila' : 'Videoaula'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        • {formatSize(item.sizeMb)}
                      </span>
                    </div>

                    <h3 className="text-xs md:text-sm font-semibold text-slate-200 mt-1 truncate">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir na Fonte</span>
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            Nenhum material encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
};
