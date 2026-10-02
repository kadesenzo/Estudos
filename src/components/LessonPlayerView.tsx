import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  FileText,
  HelpCircle,
  Sparkles,
  Save,
  Send,
  Video,
  Layers,
  Copy,
  Check,
  Bot,
  BookmarkCheck,
  Play,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { NoteStatus } from '../types';

export const LessonPlayerView: React.FC = () => {
  const {
    activeCourse,
    activeLesson,
    navigateTo,
    toggleLessonComplete,
    saveLessonNotes,
    addNote,
    notes,
    questions,
    recordQuestionAnswer,
    setCourseCheckpoint
  } = useStudy();

  const [activeTab, setActiveTab] = useState<'desc' | 'notes' | 'materials' | 'questions' | 'ai'>('desc');
  const [localNoteText, setLocalNoteText] = useState(activeLesson?.notes || '');
  const [noteStatus, setNoteStatus] = useState<NoteStatus>('aprendi');
  const [noteSaved, setNoteSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // AI doubt state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Question solving state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});

  if (!activeCourse || !activeLesson) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Nenhuma aula ativa selecionada.</p>
        <button
          onClick={() => navigateTo('courses')}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Voltar para Cursos
        </button>
      </div>
    );
  }

  const allLessons = activeCourse.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Video-specific navigation so videoaulas flow seamlessly without being interrupted by PDFs
  const videoLessons = allLessons.filter(l => l.type === 'video');
  const currentVideoIdx = videoLessons.findIndex(l => l.id === activeLesson.id);
  const prevVideo = currentVideoIdx > 0 ? videoLessons[currentVideoIdx - 1] : null;
  const nextVideo = currentVideoIdx >= 0 && currentVideoIdx < videoLessons.length - 1 ? videoLessons[currentVideoIdx + 1] : null;
  const [showPlaylist, setShowPlaylist] = useState(true);

  // Filter questions for this lesson's subject
  const relatedQuestions = questions.filter(
    q => q.subject.toLowerCase() === activeCourse.category.toLowerCase() ||
         activeLesson.title.toLowerCase().includes(q.topic.toLowerCase())
  ).slice(0, 3);

  const handleSaveNotes = async () => {
    await saveLessonNotes(activeCourse.id, activeLesson.id, localNoteText);
    await addNote({
      title: `Anotação: ${activeLesson.title}`,
      content: localNoteText,
      subject: activeCourse.category,
      courseId: activeCourse.id,
      courseTitle: activeCourse.title,
      lessonId: activeLesson.id,
      lessonTitle: activeLesson.title,
      status: noteStatus,
      tags: [activeCourse.category.toLowerCase(), 'aula', 'caderno']
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeLesson.mediaUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiQuestion,
          context: `Curso: ${activeCourse.title}. Aula: ${activeLesson.title}. Matéria: ${activeCourse.category}.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.text);
      } else {
        // Fallback didactic tutor response if server route is offline
        setAiResponse(
          `Aqui está a explicação tática para sua dúvida sobre "${aiQuestion}":\n\nNo contexto militar e de vestibulares de alto rendimento para ${activeCourse.category}, é fundamental estruturar o raciocínio em três passos: 1. Identificar os dados fundamentais fornecidos pela questão; 2. Aplicar a fórmula ou regra gramatical correspondente sem atalhos precipitados; 3. Verificar as condições de contorno e unidades de medida.`
        );
      }
    } catch (err) {
      setAiResponse(
        `Análise do Tutor Aethon: Para a matéria de ${activeCourse.category}, mantenha a fixação resolvendo ao menos 10 questões imediatas após assistir a esta videoaula.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const isEmbeddable = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.endsWith('.mp4');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('course-detail', activeCourse.id)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Módulos ({activeCourse.title})</span>
        </button>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {activeLesson.type === 'video' ? (
            <>
              <button
                disabled={!prevVideo}
                onClick={() => prevVideo && navigateTo('lesson-player', activeCourse.id, prevVideo.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Voltar para a videoaula anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Vídeo Anterior</span>
              </button>

              <button
                disabled={!nextVideo}
                onClick={() => nextVideo && navigateTo('lesson-player', activeCourse.id, nextVideo.id)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white disabled:opacity-40 disabled:bg-slate-900 disabled:text-slate-500 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Avançar diretamente para a próxima videoaula (sem passar pelos livros e PDFs)"
              >
                <span>Próxima Videoaula</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && navigateTo('lesson-player', activeCourse.id, prevLesson.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Aula Anterior</span>
              </button>

              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && navigateTo('lesson-player', activeCourse.id, nextLesson.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Próxima Aula</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Barras de Progresso Individuais do Curso e do Módulo Atual */}
      {(() => {
        const cTotal = allLessons.length;
        const cComp = allLessons.filter(l => l.isCompleted).length;
        const cPct = cTotal > 0 ? Math.round((cComp / cTotal) * 100) : 0;

        const currentMod = activeCourse.modules?.find(m => m.id === activeLesson.moduleId) ||
          activeCourse.modules?.find(m => m.lessons.some(l => l.id === activeLesson.id));
        const mTotal = currentMod?.lessons.length || 0;
        const mComp = currentMod?.lessons.filter(l => l.isCompleted).length || 0;
        const mPct = mTotal > 0 ? Math.round((mComp / mTotal) * 100) : 0;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0B1120] border border-slate-800/90 rounded-xl p-3.5 shadow-md">
            {/* Progresso do Curso */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium truncate max-w-[240px]">
                  Curso: <strong className="text-white">{activeCourse.title}</strong>
                </span>
                <span className="font-extrabold text-white font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 text-[11px]">{cPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${cPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {cComp} de {cTotal} aulas assistidas no cronograma ({cPct}%)
              </div>
            </div>

            {/* Progresso do Módulo Atual */}
            <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2.5 md:pt-0 md:pl-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium truncate max-w-[240px]" title={currentMod?.title}>
                  Módulo: <strong className="text-white">{currentMod?.title || 'Módulo Atual'}</strong>
                </span>
                <span className="font-extrabold text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 text-[11px]">{mPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${mPct}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {mComp} de {mTotal} aulas assistidas neste módulo ({mPct}%)
              </div>
            </div>
          </div>
        );
      })()}

      {/* Video / Content Stage */}
      <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative">
        {isEmbeddable(activeLesson.mediaUrl) ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              src={getEmbedUrl(activeLesson.mediaUrl)}
              title={activeLesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          /* Smart Link & Telegram / PDF Hub Interface */
          <div className="aspect-video w-full bg-gradient-to-b from-[#090E1A] to-[#04060C] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-900/30">
              {activeLesson.type === 'pdf' ? (
                <FileText className="w-8 h-8" />
              ) : (
                <Video className="w-8 h-8" />
              )}
            </div>

            <span className="text-[11px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-3">
              {activeLesson.type === 'pdf' ? 'Material em Documento PDF' : 'Videoaula no Grupo Oficial'}
            </span>

            <h2 className="text-xl md:text-2xl font-extrabold text-white max-w-2xl px-4 leading-snug">
              {activeLesson.title}
            </h2>

            {activeLesson.sizeMb && (
              <p className="text-xs text-slate-400 font-mono mt-1">
                Tamanho do arquivo: {activeLesson.sizeMb >= 1000 ? `${(activeLesson.sizeMb/1000).toFixed(1)} GB` : `${activeLesson.sizeMb} MB`}
              </p>
            )}

            <p className="text-xs text-slate-400 max-w-md mt-3 leading-relaxed">
              Este conteúdo está hospedado na fonte de origem. Clique abaixo para abrir a aula diretamente no Telegram ou no player oficial:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <a
                href={activeLesson.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/40 transition-all hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Aula no Telegram / Fonte Original</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Playbar Controls */}
        <div className="bg-[#0A0F1D] border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-lg">{activeLesson.title}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeCourse.title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCourseCheckpoint(activeCourse.id, activeLesson.id, activeLesson.title)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeCourse.stoppedAtLessonId === activeLesson.id
                  ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="Salvar esta aula como seu ponto de parada"
            >
              <BookmarkCheck className="w-4 h-4 text-blue-400" />
              <span>{activeCourse.stoppedAtLessonId === activeLesson.id ? '📍 Ponto Onde Parei' : '📍 Marcar Onde Parei'}</span>
            </button>

            <button
              onClick={() => toggleLessonComplete(activeCourse.id, activeLesson.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeLesson.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeLesson.isCompleted ? 'Aula Concluída ✓' : 'Marcar como Concluída'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Playlist de Videoaulas do Curso (Sequência do Início ao Fim) */}
      {videoLessons.length > 0 && (
        <div className="bg-[#0B1120] border border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Playlist de Videoaulas do Curso</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {currentVideoIdx >= 0 ? `Aula ${currentVideoIdx + 1} de ${videoLessons.length}` : `${videoLessons.length} aulas`}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Todas as aulas em vídeo organizadas em ordem cronológica (Semana 1, Semana 2, etc.)
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPlaylist(prev => !prev)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>{showPlaylist ? 'Ocultar Playlist' : 'Ver Todas as Videoaulas'}</span>
              {showPlaylist ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showPlaylist && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {videoLessons.map((vl, idx) => {
                const isCurrent = vl.id === activeLesson.id;
                return (
                  <button
                    key={vl.id}
                    onClick={() => navigateTo('lesson-player', activeCourse.id, vl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-400'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold font-mono mt-0.5 ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : vl.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {vl.isCompleted ? '✓' : idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold line-clamp-1 ${isCurrent ? 'text-blue-300 font-bold' : ''}`}>
                        {vl.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                        {vl.sizeMb && <span>{vl.sizeMb >= 1000 ? `${(vl.sizeMb/1000).toFixed(1)} GB` : `${vl.sizeMb} MB`}</span>}
                        {isCurrent && <span className="text-blue-400 font-bold">● Assistindo Agora</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tabs Below Stage */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
          {[
            { id: 'desc', label: '1. Descrição & Ementa' },
            { id: 'notes', label: '2. Minhas Anotações' },
            { id: 'materials', label: '3. Materiais da Aula' },
            { id: 'questions', label: '4. Questões de Fixação' },
            { id: 'ai', label: '5. Dúvidas & IA Aethon' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Descrição */}
        {activeTab === 'desc' && (
          <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Visão Geral da Aula</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Esta aula integra a preparação avançada de <strong>{activeCourse.title}</strong>, focada nas exigências das bancas de concursos militares (ESA, EsPCEx, EEAR, AFA, Naval) e vestibulares de alta competitividade.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Matéria</span>
                <span className="font-semibold text-white">{activeCourse.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tipo</span>
                <span className="font-semibold text-white uppercase">{activeLesson.type}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Status</span>
                <span className={`font-semibold ${activeLesson.isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {activeLesson.isCompleted ? 'Concluída' : 'Pendente'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tamanho Estimado</span>
                <span className="font-semibold text-white font-mono">{activeLesson.sizeMb ? `${activeLesson.sizeMb} MB` : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Minhas Anotações */}
        {activeTab === 'notes' && (
          <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white">Caderno de Notas da Aula</h4>
                <p className="text-xs text-slate-400">Suas anotações são sincronizadas com a página "Meu Caderno".</p>
              </div>

              {/* Status selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Classificar:</span>
                <select
                  value={noteStatus}
                  onChange={(e) => setNoteStatus(e.target.value as NoteStatus)}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="aprendi">✓ Aprendi</option>
                  <option value="revisar">⟲ Preciso revisar</option>
                  <option value="dificuldade">⚠ Tenho dificuldade</option>
                  <option value="importante">★ Conteúdo importante</option>
                </select>
              </div>
            </div>

            <textarea
              rows={8}
              placeholder="Digite suas anotações, fórmulas, dicas do professor ou pontos de atenção..."
              value={localNoteText}
              onChange={(e) => setLocalNoteText(e.target.value)}
              className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                {noteSaved && <span className="text-emerald-400 font-semibold">Salvo no Meu Caderno com sucesso!</span>}
              </span>

              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Anotação</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Materiais */}
        {activeTab === 'materials' && (
          <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-white mb-2">Materiais Complementares da Aula</h4>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs font-semibold text-white">{activeLesson.title} (Link de Download / PDF)</p>
                  <p className="text-[11px] text-slate-400">Material de acompanhamento oficial</p>
                </div>
              </div>
              <a
                href={activeLesson.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Baixar / Abrir</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 4: Questões de Fixação */}
        {activeTab === 'questions' && (
          <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Questões de Fixação desta Matéria</h4>
                <p className="text-xs text-slate-400">Teste sua retenção imediatamente após assistir.</p>
              </div>
              <button
                onClick={() => navigateTo('questions')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Abrir Banco Completo
              </button>
            </div>

            {relatedQuestions.length > 0 ? (
              relatedQuestions.map((q, qIndex) => {
                const isSubmitted = !!submittedAnswers[q.id];
                const selected = selectedAnswers[q.id];

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-white">Questão #{qIndex + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">{q.origin || q.subject}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{q.statement}</p>

                    <div className="space-y-2 pt-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx;
                        const isCorrectOption = optIdx === q.correctIndex;

                        return (
                          <button
                            key={optIdx}
                            disabled={isSubmitted}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                              isSubmitted
                                ? isCorrectOption
                                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                                  : isChosen
                                  ? 'bg-red-950/40 border-red-500 text-red-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                                : isChosen
                                ? 'bg-blue-950/40 border-blue-500 text-blue-300 font-medium'
                                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}) {opt}</span>
                            {isSubmitted && isCorrectOption && <Check className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted ? (
                      <button
                        disabled={selected === undefined}
                        onClick={() => {
                          const isCorrect = selected === q.correctIndex;
                          setSubmittedAnswers(prev => ({ ...prev, [q.id]: true }));
                          recordQuestionAnswer(q.id, selected, isCorrect, 30);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                      >
                        Confirmar Resposta
                      </button>
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <p className="font-bold text-blue-400">Gabarito Comentado:</p>
                        <p className="text-[11px] leading-relaxed whitespace-pre-line text-slate-300">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-slate-500 py-4">Nenhuma questão vinculada diretamente a este tópico.</p>
            )}
          </div>
        )}

        {/* Tab 5: Dúvidas & IA Aethon */}
        {activeTab === 'ai' && (
          <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Assistente Tático de Dúvidas</h4>
                <p className="text-xs text-slate-400">Tire dúvidas imediatas sobre o conteúdo desta aula.</p>
              </div>
            </div>

            <form onSubmit={handleAskAI} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex.: Como deduzir a fórmula do vértice? Ou explique o caso de crase..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-12"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {aiLoading && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
                <span>O Assistente Aethon está estruturando a resolução tática...</span>
              </div>
            )}

            {aiResponse && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-900/40 text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explicação Tática</span>
                </div>
                <p>{aiResponse}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
