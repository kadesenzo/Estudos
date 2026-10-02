import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  Plus,
  Clock,
  ExternalLink,
  BookOpen,
  Share2,
  Layers,
  X,
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Lesson } from '../types';

export const CourseDetailView: React.FC = () => {
  const { activeCourse, navigateTo, toggleLessonComplete, updateCourse, setCourseCheckpoint, profile } = useStudy();
  const [openModuleIds, setOpenModuleIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    activeCourse?.modules?.forEach((m, idx) => {
      // Open all modules containing video lessons or first 2 modules by default
      if (m.lessons.some(l => l.type === 'video') || idx < 2) {
        init[m.id] = true;
      }
    });
    return init;
  });
  const [addLessonModalOpen, setAddLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'pdf'>('all');

  const allLessons = activeCourse?.modules?.flatMap(m => m.lessons) || [];
  const completedLessons = allLessons.filter(l => l.isCompleted);
  const totalCompleted = completedLessons.length;
  const totalLessons = allLessons.length;
  const coursePercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const videoLessons = allLessons.filter(l => l.type === 'video');
  const completedVideos = videoLessons.filter(l => l.isCompleted).length;
  const videoLessonsCount = videoLessons.length;
  const videoPercent = videoLessonsCount > 0 ? Math.round((completedVideos / videoLessonsCount) * 100) : 0;

  const pdfLessons = allLessons.filter(l => l.type === 'pdf');
  const completedPdfs = pdfLessons.filter(l => l.isCompleted).length;
  const pdfLessonsCount = pdfLessons.length;
  const pdfPercent = pdfLessonsCount > 0 ? Math.round((completedPdfs / pdfLessonsCount) * 100) : 0;

  // New lesson form state
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'video' | 'pdf'>('video');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [newLessonSize, setNewLessonSize] = useState<number>(0);

  if (!activeCourse) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Nenhum curso selecionado.</p>
        <button
          onClick={() => navigateTo('courses')}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
        >
          Voltar para Meus Cursos
        </button>
      </div>
    );
  }

  const toggleModule = (modId: string) => {
    setOpenModuleIds(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !selectedModuleId) return;

    const newLesson: Lesson = {
      id: `les-custom-${Date.now()}`,
      userId: 'local',
      courseId: activeCourse.id,
      moduleId: selectedModuleId,
      title: newLessonTitle,
      type: newLessonType,
      mediaUrl: newLessonUrl || '#',
      sizeMb: newLessonSize || undefined,
      order: 99,
      isCompleted: false
    };

    const updatedModules = activeCourse.modules?.map(m => {
      if (m.id === selectedModuleId) {
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });

    const totalLessons = updatedModules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
    updateCourse(activeCourse.id, {
      modules: updatedModules,
      lessonsCount: totalLessons
    });

    setAddLessonModalOpen(false);
    setNewLessonTitle('');
    setNewLessonUrl('');
    setNewLessonSize(0);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Back button */}
      <button
        onClick={() => navigateTo('courses')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Meus Cursos</span>
      </button>

      {/* Course Main Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B1120] border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cover image */}
          <div className="w-full lg:w-72 h-44 lg:h-52 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0 relative group">
            <img
              src={activeCourse.coverUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop'}
              alt={activeCourse.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  const firstLesson = activeCourse.modules?.[0]?.lessons?.[0];
                  if (firstLesson) navigateTo('lesson-player', activeCourse.id, firstLesson.id);
                }}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              >
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                {activeCourse.category}
              </span>
              {activeCourse.platform && (
                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                  {activeCourse.platform}
                </span>
              )}
              {/* Onde Parei Checkpoint Badge */}
              <div className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-medium flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Ponto onde parei: <strong className="text-white font-semibold">{activeCourse.stoppedAtLessonTitle || profile.stoppedCheckpoints?.[activeCourse.id] || 'Início do curso'}</strong></span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {activeCourse.title}
            </h1>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl">
              {activeCourse.description}
            </p>

            {activeCourse.instructor && (
              <p className="text-xs text-slate-400">
                Instrutor: <strong className="text-slate-200">{activeCourse.instructor}</strong> {activeCourse.institution && `(${activeCourse.institution})`}
              </p>
            )}

            {/* Progress bar and resume action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-2 flex-1 max-w-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Barra de Progresso Individual do Curso</span>
                  </span>
                  <span className="font-extrabold text-white font-mono text-sm bg-blue-500/20 px-2.5 py-0.5 rounded-md border border-blue-500/30">
                    {coursePercent}%
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${coursePercent}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                  <span>
                    Aulas assistidas no cronograma: <strong className="text-white">{totalCompleted}</strong> de <strong className="text-white">{totalLessons}</strong> ({coursePercent}%)
                  </span>
                  <span>
                    🎬 Vídeos: <strong className="text-blue-300">{completedVideos}/{videoLessonsCount}</strong> ({videoPercent}%)
                  </span>
                  {pdfLessonsCount > 0 && (
                    <span>
                      📄 Livros/PDFs: <strong className="text-amber-300">{completedPdfs}/{pdfLessonsCount}</strong> ({pdfPercent}%)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => {
                    // Find the very first video lesson in the first module (Semana 1 / Aula 1)
                    const firstVideo = activeCourse.modules?.[0]?.lessons?.find(l => l.type === 'video') || activeCourse.modules?.[0]?.lessons?.[0];
                    if (firstVideo) navigateTo('lesson-player', activeCourse.id, firstVideo.id);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  title="Começar a assistir o curso diretamente da Aula 1 do Módulo 1"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                  <span>Começar do Início (Aula 1)</span>
                </button>

                <button
                  onClick={() => {
                    let targetLesson: Lesson | undefined;
                    if (activeCourse.stoppedAtLessonId) {
                      for (const m of activeCourse.modules || []) {
                        const found = m.lessons.find(l => l.id === activeCourse.stoppedAtLessonId);
                        if (found) { targetLesson = found; break; }
                      }
                    }
                    // Prioritize the first uncompleted video lesson from the beginning!
                    if (!targetLesson) {
                      for (const m of activeCourse.modules || []) {
                        const found = m.lessons.find(l => l.type === 'video' && !l.isCompleted);
                        if (found) { targetLesson = found; break; }
                      }
                    }
                    // Fallback: first video lesson
                    if (!targetLesson) {
                      for (const m of activeCourse.modules || []) {
                        const found = m.lessons.find(l => l.type === 'video');
                        if (found) { targetLesson = found; break; }
                      }
                    }
                    // Fallback: first lesson
                    if (!targetLesson) {
                      targetLesson = activeCourse.modules?.[0]?.lessons?.[0];
                    }
                    if (targetLesson) navigateTo('lesson-player', activeCourse.id, targetLesson.id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Continuar de Onde Parou</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules & Lessons Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Estrutura de Conteúdo e Aulas</h2>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {activeCourse.modules?.length || 0} módulos • {videoLessonsCount} videoaulas • {pdfLessonsCount} livros/PDFs
          </span>
        </div>

        {/* Media Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <button
            onClick={() => setMediaFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mediaFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todas as Aulas ({allLessons.length})
          </button>
          <button
            onClick={() => setMediaFilter('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mediaFilter === 'video'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                : 'bg-slate-900 border border-slate-800 text-blue-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>🎬 Apenas Videoaulas ({videoLessonsCount})</span>
          </button>
          <button
            onClick={() => setMediaFilter('pdf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mediaFilter === 'pdf'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                : 'bg-slate-900 border border-slate-800 text-amber-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>📄 Livros, Apostilas & PDFs ({pdfLessonsCount})</span>
          </button>
        </div>

        {/* Modules Accordion */}
        <div className="space-y-3">
          {activeCourse.modules?.map((mod, index) => {
            const filteredLessons = mod.lessons.filter(l => {
              if (mediaFilter === 'video') return l.type === 'video';
              if (mediaFilter === 'pdf') return l.type === 'pdf';
              return true;
            });

            if (mediaFilter !== 'all' && filteredLessons.length === 0) return null;

            const isOpen = !!openModuleIds[mod.id];
            const modTotal = mod.lessons.length;
            const completedCount = mod.lessons.filter(l => l.isCompleted).length;
            const modPercent = modTotal > 0 ? Math.round((completedCount / modTotal) * 100) : 0;
            const isAllCompleted = modTotal > 0 && completedCount === modTotal;
            const modVideos = mod.lessons.filter(l => l.type === 'video');
            const modVideosCompleted = modVideos.filter(l => l.isCompleted).length;
            const modPdfs = mod.lessons.filter(l => l.type === 'pdf');

            return (
              <div
                key={mod.id}
                className="bg-[#0B1120] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm transition-colors"
              >
                {/* Module Bar */}
                <div
                  onClick={() => toggleModule(mod.id)}
                  className="p-4 cursor-pointer hover:bg-slate-900/60 transition-colors select-none space-y-3"
                >
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <button className="text-slate-400 hover:text-white">
                        {isOpen ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{mod.title}</span>
                          {modVideos.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {modVideos.length} vídeos
                            </span>
                          )}
                          {modPdfs.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {modPdfs.length} PDFs
                            </span>
                          )}
                          {isAllCompleted ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <span>✓</span> Módulo Concluído
                            </span>
                          ) : completedCount > 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Em Andamento ({modPercent}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                              Não Iniciado
                            </span>
                          )}
                        </div>
                        {mod.description && (
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{mod.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="font-extrabold text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {modPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso Individual do Módulo */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <span>Progresso do Módulo: <strong className="text-white font-mono">{completedCount}</strong> de <strong className="text-white font-mono">{modTotal}</strong> aulas assistidas no cronograma (<strong className="text-cyan-300 font-mono">{modPercent}%</strong>)</span>
                      </span>
                      {modVideos.length > 0 && (
                        <span className="text-blue-300 font-mono text-[10px]">
                          🎬 {modVideosCompleted} de {modVideos.length} videoaulas assistidas
                        </span>
                      )}
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAllCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30'
                            : modPercent > 0
                            ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${modPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lessons List inside Module */}
                {isOpen && (
                  <div className="border-t border-slate-800/80 divide-y divide-slate-800/50 bg-slate-950/40">
                    {filteredLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Completion Toggle */}
                          <button
                            onClick={() => toggleLessonComplete(activeCourse.id, lesson.id)}
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                              lesson.isCompleted
                                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                                : 'border-slate-700 hover:border-slate-500 text-transparent'
                            }`}
                            title={lesson.isCompleted ? 'Marcar como não concluída' : 'Marcar como concluída'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Media Type Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0 ${
                            lesson.type === 'pdf'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {lesson.type === 'pdf' ? (
                              <>
                                <FileText className="w-3 h-3" />
                                <span>PDF</span>
                              </>
                            ) : (
                              <>
                                <Video className="w-3 h-3" />
                                <span>Vídeo</span>
                              </>
                            )}
                          </span>

                          {/* Lesson Title */}
                          <button
                            onClick={() => navigateTo('lesson-player', activeCourse.id, lesson.id)}
                            className={`text-xs text-left truncate transition-colors font-medium ${
                              lesson.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200 group-hover:text-blue-400'
                            }`}
                          >
                            {lesson.title}
                          </button>
                        </div>

                        {/* Right: Size/Duration & Play Link & Bookmark */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          {lesson.sizeMb && (
                            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                              {lesson.sizeMb >= 1000
                                ? `${(lesson.sizeMb / 1000).toFixed(1)} GB`
                                : `${lesson.sizeMb} MB`}
                            </span>
                          )}

                          {/* Set Checkpoint (Onde Parei) */}
                          <button
                            onClick={() => setCourseCheckpoint(activeCourse.id, lesson.id, lesson.title)}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                              activeCourse.stoppedAtLessonId === lesson.id
                                ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                                : 'text-slate-400 hover:text-blue-300 hover:bg-slate-800'
                            }`}
                            title="Marcar esta aula como o ponto exato onde você parou"
                          >
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span className="hidden md:inline text-[11px]">
                              {activeCourse.stoppedAtLessonId === lesson.id ? 'Onde parei' : 'Marcar parada'}
                            </span>
                          </button>

                          <button
                            onClick={() => navigateTo('lesson-player', activeCourse.id, lesson.id)}
                            className="px-3 py-1 rounded-md bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Abrir</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Lesson to this module button */}
                    <div className="p-3 bg-slate-900/30">
                      <button
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setAddLessonModalOpen(true);
                        }}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar aula ou material a este módulo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {addLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Adicionar Aula ou Material</h3>
              <button onClick={() => setAddLessonModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Aula *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Aula 4 — Potenciação e Radiciação"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Material</label>
                  <select
                    value={newLessonType}
                    onChange={(e) => setNewLessonType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="video">Videoaula</option>
                    <option value="pdf">Documento PDF / Apostila</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tamanho aproximado (MB)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ex.: 150"
                    value={newLessonSize || ''}
                    onChange={(e) => setNewLessonSize(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link de Acesso (URL, Telegram, Drive ou YouTube)</label>
                <input
                  type="url"
                  placeholder="https://t.me/... ou https://youtube.com/..."
                  value={newLessonUrl}
                  onChange={(e) => setNewLessonUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddLessonModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Salvar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
