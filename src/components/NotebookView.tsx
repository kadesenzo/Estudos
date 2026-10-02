import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  Search,
  Star,
  Trash2,
  Edit3,
  Tag,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { StudyNote, NoteStatus } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialContent';

export const NotebookView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, toggleNoteFavorite } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState<'all' | NoteStatus>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // New Note Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSubject, setNoteSubject] = useState('Matemática');
  const [noteStatus, setNoteStatus] = useState<NoteStatus>('aprendi');
  const [noteTags, setNoteTags] = useState('');

  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === 'Todas' || n.subject === selectedSubject;
    const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
    const matchesFav = !onlyFavorites || !!n.isFavorite;

    return matchesSearch && matchesSubject && matchesStatus && matchesFav;
  });

  const handleOpenModal = (note?: StudyNote) => {
    if (note) {
      setEditNoteId(note.id);
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setNoteSubject(note.subject);
      setNoteStatus(note.status);
      setNoteTags(note.tags.join(', '));
    } else {
      setEditNoteId(null);
      setNoteTitle('');
      setNoteContent('');
      setNoteSubject('Matemática');
      setNoteStatus('aprendi');
      setNoteTags('');
    }
    setModalOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const tagsArray = noteTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editNoteId) {
      await updateNote(editNoteId, {
        title: noteTitle,
        content: noteContent,
        subject: noteSubject,
        status: noteStatus,
        tags: tagsArray
      });
    } else {
      await addNote({
        title: noteTitle,
        content: noteContent,
        subject: noteSubject,
        status: noteStatus,
        tags: tagsArray
      });
    }

    setModalOpen(false);
  };

  const exportNote = (n: StudyNote) => {
    const text = `# ${n.title}\nMatéria: ${n.subject}\nStatus: ${n.status}\nData: ${new Date(n.updatedAt).toLocaleDateString()}\n\n${n.content}`;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${n.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-blue-400" />
            <span>Meu Caderno de Estudos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Consulte todas as suas anotações, fórmulas, mnemônicos e dificuldades em um único caderno digital.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Anotação</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1120] border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar anotações por palavras-chave, fórmulas ou tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="Todas">Todas as Matérias</option>
              {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`p-2 rounded-lg border transition-colors ${
                onlyFavorites ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Filtrar Favoritas"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todos os Status ({notes.length})
          </button>
          <button
            onClick={() => setStatusFilter('aprendi')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              statusFilter === 'aprendi' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aprendi</span>
          </button>
          <button
            onClick={() => setStatusFilter('revisar')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              statusFilter === 'revisar' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>Preciso Revisar</span>
          </button>
          <button
            onClick={() => setStatusFilter('dificuldade')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              statusFilter === 'dificuldade' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Tenho Dificuldade</span>
          </button>
          <button
            onClick={() => setStatusFilter('importante')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              statusFilter === 'importante' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-purple-400" />
            <span>Conteúdo Importante</span>
          </button>
        </div>
      </div>

      {/* Notes Masonry / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => {
            const statusColor =
              note.status === 'aprendi'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : note.status === 'revisar'
                ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                : note.status === 'dificuldade'
                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                : 'text-purple-400 bg-purple-500/10 border-purple-500/20';

            return (
              <div
                key={note.id}
                className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 shadow-md transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {note.subject}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusColor}`}>
                        {note.status}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleNoteFavorite(note.id)}
                      className={`p-1 transition-colors ${note.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {note.title}
                  </h3>

                  {note.courseTitle && (
                    <p className="text-[11px] text-slate-500">Curso: {note.courseTitle}</p>
                  )}

                  <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    {note.content}
                  </p>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {note.tags.map((t) => (
                        <span key={t} className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-500">
                  <span>Atualizado em {new Date(note.updatedAt).toLocaleDateString()}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportNote(note)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Baixar Nota em Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(note)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800 transition-colors"
                      title="Editar Nota"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                      title="Excluir Nota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-[#0B1120] border border-dashed border-slate-800 rounded-2xl">
            <BookMarked className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm">Nenhuma anotação encontrada com os filtros atuais.</p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editNoteId ? 'Editar Anotação' : 'Criar Nova Anotação'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Nota *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Resumo de Dinâmica e Leis de Newton"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Matéria</label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                  >
                    {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Classificação</label>
                  <select
                    value={noteStatus}
                    onChange={(e) => setNoteStatus(e.target.value as NoteStatus)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="aprendi">✓ Aprendi</option>
                    <option value="revisar">⟲ Preciso revisar</option>
                    <option value="dificuldade">⚠ Tenho dificuldade</option>
                    <option value="importante">★ Conteúdo importante</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Conteúdo da Anotação *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Fórmulas, conceitos, anotações da aula..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="ex.: atrito, blocos, espcex, fórmula"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
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
                  Salvar no Caderno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
